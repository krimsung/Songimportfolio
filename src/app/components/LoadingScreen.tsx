/**
 * LoadingScreen.tsx
 *
 * Full-screen loading overlay that:
 *  1. Preloads every image (via a persistent live HTMLImageElement pool) so
 *     decoded bitmaps are always warm in the browser's cache.
 *  2. Preloads video metadata (moov atom only) for all 18 gallery videos via
 *     throwaway <video preload="metadata"> elements — fast, ~50 KB per file.
 *     Full frame buffering happens lazily as each video plays; the loading
 *     screen only needs to know dimensions/duration before exit.
 *  3. Reserves a weighted slot for the Three.js terrain, which signals
 *     readiness via the `terrainReady` prop.
 *  4. Tracks per-file progress — the bar reflects actual file completions,
 *     not a fake timer.
 *  5. Runs a three-phase exit sequence:
 *       a. Bar animates to 100 % and holds briefly.
 *       b. Bar collapses inward (scaleX 1 → 0, ease-in).
 *       c. The overlay splits horizontally — top panel slides up,
 *          bottom panel slides down — revealing the site underneath.
 *  6. During loading: a transparent fixed overlay blocks all pointer
 *     events so the user cannot interact with the site behind it.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { imageAssets, videoAssets } from "../assetManifest";

// ─── Weight constants ─────────────────────────────────────────────────────────
// Each unit contributes proportionally to the 0-100 % progress bar.
// Images: 1 unit each.  Videos: 1 unit each (metadata preload).
// Terrain: weighted more heavily — it's the centrepiece and takes ~1-2 s.
const WEIGHT_PER_IMAGE   = 1;
const WEIGHT_PER_VIDEO   = 1;
const WEIGHT_TERRAIN     = Math.round((imageAssets.length + videoAssets.length) * 0.25);

const TOTAL_WEIGHT =
  imageAssets.length * WEIGHT_PER_IMAGE +
  videoAssets.length * WEIGHT_PER_VIDEO +
  WEIGHT_TERRAIN;

// ─── Timing constants ─────────────────────────────────────────────────────────
/** How long (ms) to hold at 100 % before starting the exit animation. */
const HOLD_AT_FULL_MS  = 280;
/** Duration (ms) of the bar-collapse (scaleX 1 → 0) animation. */
const BAR_COLLAPSE_MS  = 380;
/** Duration (ms) of the panel-split slide animation. */
const SPLIT_MS         = 520;
/** Extra buffer (ms) after split starts before we call onComplete.
 *  Slightly longer than SPLIT_MS so panels are fully offscreen first. */
const COMPLETE_DELAY_MS = SPLIT_MS + 80;

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | "loading"     // assets loading, bar filling
  | "finishing"   // at 100 %, brief hold
  | "collapsing"  // bar collapses inward
  | "splitting"   // panels slide open
  | "done";       // component should unmount

interface LoadingScreenProps {
  /** True once the TerrainScene has rendered its first frame. */
  terrainReady: boolean;
  /** Called the instant the split animation begins — use this to reveal the
   *  app shell so the site is visible as the panels slide away. */
  onSplitStart: () => void;
  /** Called when the entire reveal animation completes (panels fully offscreen). */
  onComplete: () => void;
}

// ─── Hidden image pool ────────────────────────────────────────────────────────
// The only mechanism that guarantees zero-flicker for <img> tags is keeping a
// live HTMLImageElement with the same src in the DOM at all times. The browser
// keys its decoded-image cache on live elements; once an element is removed the
// decoded bitmap can be evicted. A hidden off-screen container holds one <img>
// per asset for the entire session so the decode is always warm.
//
// Why NOT createImageBitmap:
//   ImageBitmap is consumed by canvas/drawImage only. A standard <img> tag
//   decodes independently and cannot reuse an ImageBitmap object — it will
//   re-decode from the HTTP cache every time it is first painted, causing the
//   flicker we are trying to eliminate.
//
// Why NOT new Image() alone:
//   Creating an Image() and setting src warms the HTTP cache but does not keep
//   a live DOM element. Under memory pressure the decoded pixels are evicted
//   even though the network bytes are cached, forcing a re-decode on render.

let imagePoolEl: HTMLDivElement | null = null;

function getImagePool(): HTMLDivElement {
  if (imagePoolEl) return imagePoolEl;

  const div = document.createElement("div");
  div.setAttribute("aria-hidden", "true");
  div.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "width:1px",
    "height:1px",
    "overflow:hidden",
    "opacity:0",
    "pointer-events:none",
    "z-index:-1",
  ].join(";");
  document.body.appendChild(div);
  imagePoolEl = div;
  return div;
}

// Tracks which srcs already have a live element in the image pool.
const pooledImageSrcs = new Set<string>();

// ─── Utility: decode and permanently pin an image in the DOM pool ─────────────
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (pooledImageSrcs.has(src)) { resolve(); return; }
    pooledImageSrcs.add(src);

    const img = document.createElement("img");
    img.decoding = "async";    // non-blocking decode
    img.fetchPriority = "low"; // don't compete with critical resources
    // Resolve as soon as the image is fully decoded and in the browser's cache.
    img.onload  = () => resolve();
    img.onerror = () => resolve(); // never block on a broken asset
    // Append to pool BEFORE setting src so the element is live in the DOM
    // when the browser begins decoding — this is what keeps the decoded
    // bitmap pinned against garbage collection.
    getImagePool().appendChild(img);
    img.src = src;
  });
}

// ─── Utility: preload video metadata only (moov atom) ─────────────────────────
// Creates a throwaway <video preload="metadata"> element, waits for
// `loadedmetadata` (browser has width/height/duration), then discards it.
// This is very fast (~50 KB per file) and ensures the browser knows the video's
// dimensions before the loading screen exits — no black frames on first paint.
// Full frame buffering happens lazily as each video plays in the gallery.
function preloadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const vid = document.createElement("video");
    vid.preload     = "metadata";
    vid.muted       = true;
    vid.playsInline = true;

    const cleanup = () => {
      vid.onloadedmetadata = null;
      vid.onerror          = null;
      // Detach src to release the network request before GC.
      vid.src = "";
      vid.load();
      resolve();
    };

    vid.onloadedmetadata = cleanup;
    vid.onerror          = cleanup; // never block on a broken asset
    vid.src = src;
    vid.load();
  });
}

// ─── Detect reduced-motion preference ────────────────────────────────────────
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// When reduced motion is on, collapse animations to near-zero durations.
const EFFECTIVE_BAR_COLLAPSE_MS  = prefersReducedMotion ? 0  : BAR_COLLAPSE_MS;
const EFFECTIVE_SPLIT_MS         = prefersReducedMotion ? 0  : SPLIT_MS;
const EFFECTIVE_HOLD_MS          = prefersReducedMotion ? 80 : HOLD_AT_FULL_MS;
const EFFECTIVE_COMPLETE_DELAY   = prefersReducedMotion ? 80 : COMPLETE_DELAY_MS;

// ─── Component ────────────────────────────────────────────────────────────────
export function LoadingScreen({ terrainReady, onSplitStart, onComplete }: LoadingScreenProps) {
  // 0–100 displayed progress (animated with CSS transition for smoothness)
  const [displayProgress, setDisplayProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  // Lock page scroll while the loading screen is present.
  useEffect(() => {
    document.documentElement.classList.add("loading-active");
    return () => {
      document.documentElement.classList.remove("loading-active");
    };
  }, []);

  // Accumulated weight of completed assets — mutated from async callbacks.
  const loadedWeightRef = useRef(0);
  // Guards: ensure we only trigger finish logic once.
  const finishTriggeredRef = useRef(false);
  // Track whether terrain weight has been added yet.
  const terrainWeightAddedRef = useRef(false);

  // ── Progress increment helper ─────────────────────────────────────────────
  const addWeight = useCallback((weight: number) => {
    loadedWeightRef.current += weight;
    const pct = Math.min(
      Math.round((loadedWeightRef.current / TOTAL_WEIGHT) * 100),
      // Cap at 99 until terrain also signals ready, so the bar never
      // prematurely reaches 100 % while WebGL is still compiling.
      terrainWeightAddedRef.current ? 100 : 99
    );
    setDisplayProgress(pct);
  }, []);

  // ── Trigger finish sequence when progress hits 100 ───────────────────────
  const triggerFinish = useCallback(() => {
    if (finishTriggeredRef.current) return;
    finishTriggeredRef.current = true;

    setDisplayProgress(100);
    setPhase("finishing");

    setTimeout(() => {
      setPhase("collapsing");
      setTimeout(() => {
        // Reveal the app shell now — it will be visible as the panels slide away.
        onSplitStart();
        setPhase("splitting");
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, EFFECTIVE_COMPLETE_DELAY);
      }, EFFECTIVE_BAR_COLLAPSE_MS);
    }, EFFECTIVE_HOLD_MS);
  }, [onSplitStart, onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Watch for terrain readiness ───────────────────────────────────────────
  useEffect(() => {
    if (!terrainReady || terrainWeightAddedRef.current) return;
    terrainWeightAddedRef.current = true;
    // Add terrain weight — this may push us to 100 % if images/videos are done.
    loadedWeightRef.current += WEIGHT_TERRAIN;
    const pct = Math.min(
      Math.round((loadedWeightRef.current / TOTAL_WEIGHT) * 100),
      100
    );
    setDisplayProgress(pct);
    if (pct >= 100) triggerFinish();
  }, [terrainReady, triggerFinish]);

  // ── Kick off asset preloading on mount ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const checkDone = () => {
      if (cancelled) return;
      if (loadedWeightRef.current >= TOTAL_WEIGHT - WEIGHT_TERRAIN &&
          terrainWeightAddedRef.current) {
        triggerFinish();
      }
    };

    const imageTotal  = imageAssets.length * WEIGHT_PER_IMAGE;
    const videoTotal  = videoAssets.length * WEIGHT_PER_VIDEO;
    const assetTotal  = imageTotal + videoTotal;

    // All image + video promises run concurrently.
    const promises: Promise<void>[] = [];

    for (const asset of imageAssets) {
      promises.push(
        preloadImage(asset.src).then(() => {
          if (cancelled) return;
          addWeight(WEIGHT_PER_IMAGE);
          if (loadedWeightRef.current >= assetTotal && terrainWeightAddedRef.current) {
            triggerFinish();
          }
        })
      );
    }

    // All videos: preload metadata only (moov atom, ~50 KB each).
    // Full buffering happens lazily as videos play in the gallery.
    for (const asset of videoAssets) {
      promises.push(
        preloadVideoMetadata(asset.src).then(() => {
          if (cancelled) return;
          addWeight(WEIGHT_PER_VIDEO);
          if (loadedWeightRef.current >= assetTotal && terrainWeightAddedRef.current) {
            triggerFinish();
          }
        })
      );
    }

    // Safety valve: if all assets resolve but terrain hasn't fired yet
    // after 8 s, we unblock anyway so users on fast connections aren't
    // stuck waiting for a WebGL edge case.
    const safetyTimer = setTimeout(() => {
      if (!terrainWeightAddedRef.current) {
        terrainWeightAddedRef.current = true;
        loadedWeightRef.current += WEIGHT_TERRAIN;
      }
      triggerFinish();
    }, 8000);

    void Promise.all(promises).then(checkDone);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [addWeight, triggerFinish]);

  // ── Don't render anything once fully done ────────────────────────────────
  if (phase === "done") return null;

  const isSplitting  = phase === "splitting";
  const isCollapsing = phase === "collapsing";
  // Show bar until the split starts
  const showBar = phase !== "splitting";

  return (
    <>
      {/* ── Interaction lock ─────────────────────────────────────────────────
          Transparent fixed div that sits above the entire site and swallows
          all pointer/touch events until loading completes.                  */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        9998,
          pointerEvents: "all",
          touchAction:   "none",
          userSelect:    "none",
          cursor:        "default",
        }}
      />

      {/* ── Top panel (slides up on reveal) ──────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:   "fixed",
          inset:      0,
          bottom:     "50%",
          zIndex:     9999,
          background: "#000814",
          transform:  isSplitting ? "translateY(-100%)" : "translateY(0)",
          transition: isSplitting
            ? `transform ${EFFECTIVE_SPLIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : "none",
          willChange: "transform",
        }}
      />

      {/* ── Bottom panel (slides down on reveal) ─────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:   "fixed",
          inset:      0,
          top:        "50%",
          zIndex:     9999,
          background: "#000814",
          transform:  isSplitting ? "translateY(100%)" : "translateY(0)",
          transition: isSplitting
            ? `transform ${EFFECTIVE_SPLIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : "none",
          willChange: "transform",
        }}
      />

      {/* ── Bar content — full-viewport centered, above the panels ───────────
          This layer is independent of the split panels so it can be
          perfectly centred in the viewport without any offset arithmetic.
          It disappears when the split begins (showBar = false).            */}
      {showBar && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         10000,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            pointerEvents:  "none",
          }}
        >
          <div
            style={{
              width:         "min(480px, 80vw)",
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:           "16px",
              opacity:       isCollapsing ? 0 : 1,
              transition:    isCollapsing
                ? `opacity ${EFFECTIVE_BAR_COLLAPSE_MS * 0.4}ms ease-in`
                : "none",
            }}
          >
            {/* Label */}
            <p
              style={{
                fontFamily:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize:      "13px",
                fontWeight:    500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         "#8C8680",
                userSelect:    "none",
                margin:        0,
              }}
            >
              Loading Portfolio
            </p>

            {/* Progress bar track + fill */}
            <div
              role="progressbar"
              aria-valuenow={displayProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Loading portfolio assets"
              style={{
                width:    "100%",
                height:   "2px",
                position: "relative",
              }}
            >
              {/* Track — collapses inward with the fill */}
              <div
                style={{
                  position:        "absolute",
                  inset:           0,
                  borderRadius:    "999px",
                  background:      "#1C1A22",
                  transform:       isCollapsing ? "scaleX(0)" : "scaleX(1)",
                  transformOrigin: "center",
                  transition:      isCollapsing
                    ? `transform ${EFFECTIVE_BAR_COLLAPSE_MS}ms cubic-bezier(0.55, 0, 1, 0.45)`
                    : "none",
                  willChange:      "transform",
                }}
              />
              {/* Fill — grows left-to-right, then collapses inward from centre */}
              <div
                style={{
                  position:        "absolute",
                  inset:           0,
                  right:           "auto",
                  width:           `${displayProgress}%`,
                   background:      "#F5A623",
                   borderRadius:    "999px",
                   boxShadow:       "0 0 8px 1px rgba(245,166,35,0.55), 0 0 2px rgba(245,166,35,0.9)",
                  transform:       isCollapsing ? "scaleX(0)" : "scaleX(1)",
                  transformOrigin: "center",
                  transition:      isCollapsing
                    ? `transform ${EFFECTIVE_BAR_COLLAPSE_MS}ms cubic-bezier(0.55, 0, 1, 0.45)`
                    : "width 180ms ease-out",
                  willChange:      "width, transform",
                }}
              />
            </div>

            {/* Percentage readout */}
            <p
              style={{
                fontFamily:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize:      "11px",
                fontWeight:    400,
                color:         "#3D3947",
                letterSpacing: "0.06em",
                userSelect:    "none",
                margin:        0,
                opacity:       isCollapsing ? 0 : 1,
                transition:    isCollapsing
                  ? `opacity ${EFFECTIVE_BAR_COLLAPSE_MS * 0.25}ms ease-in`
                  : "none",
              }}
            >
              {displayProgress}%
            </p>
          </div>
        </div>
      )}
    </>
  );
}
