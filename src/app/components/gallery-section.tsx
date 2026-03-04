import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import Hellbound from "../../media/gallery/Hellbound.mp4";
import Island from "../../media/gallery/Island.mp4";
import Snow from "../../media/gallery/Snow.mp4";
import BoulderDestruction from "../../media/gallery/Boulder Destruction.mp4";
import Sparks from "../../media/gallery/Sparks.mp4";
import Campfire from "../../media/gallery/Campfire.mp4";

interface GallerySectionProps {
  onNavigateToGallery?: () => void;
}

const featuredVideos = [
  { src: Hellbound,          title: "Hellbound",           description: "VFX animation" },
  { src: Island,             title: "Island",              description: "VFX animation" },
  { src: Snow,               title: "Snow",                description: "VFX animation" },
  { src: BoulderDestruction, title: "Boulder Destruction", description: "VFX animation" },
  { src: Sparks,             title: "Sparks",              description: "VFX animation" },
  { src: Campfire,           title: "Campfire",            description: "VFX animation" },
];

export function GallerySection({ onNavigateToGallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // One ref per video element — used to drive play/pause and frame capture.
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Canvas-captured poster frames for each thumbnail button.
  const [thumbFrames, setThumbFrames] = useState<(string | null)[]>(
    () => Array(featuredVideos.length).fill(null)
  );

  // ── Play/pause management ─────────────────────────────────────────────────
  // Only the active video plays. All others are paused and their currentTime
  // is reset so they are ready from the beginning when selected again.
  // Using a ref to track the previous index avoids stale-closure issues.
  const prevIndexRef = useRef<number>(-1);

  useEffect(() => {
    const prev = prevIndexRef.current;
    const curr = currentIndex;

    // Pause + rewind the video that just became inactive.
    if (prev !== -1 && prev !== curr) {
      const prevVid = videoRefs.current[prev];
      if (prevVid) {
        prevVid.pause();
        prevVid.currentTime = 0;
      }
    }

    // Play the newly active video.
    const currVid = videoRefs.current[curr];
    if (currVid) {
      void currVid.play().catch(() => {
        // Autoplay was blocked — not fatal; video stays paused until
        // the user interacts with the page (browser policy).
      });
    }

    prevIndexRef.current = curr;
  }, [currentIndex]);

  // ── Poster frame capture ──────────────────────────────────────────────────
  // Draws the first decodable frame of each video onto a canvas and stores
  // it as a JPEG data-URL for use in the thumbnail strip. This avoids keeping
  // 6 simultaneous live decode pipelines just for thumbnails.
  useEffect(() => {
    const captures: (string | null)[] = Array(featuredVideos.length).fill(null);
    let pending = featuredVideos.length;

    featuredVideos.forEach((_, i) => {
      const vid = videoRefs.current[i];
      if (!vid) { pending--; return; }

      const capture = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width  = vid.videoWidth  || 320;
          canvas.height = vid.videoHeight || 180;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
            captures[i] = canvas.toDataURL("image/jpeg", 0.7);
          }
        } catch {
          // Cross-origin or decode not ready — leave null; thumbnail stays dark.
        }
        pending--;
        if (pending === 0) setThumbFrames([...captures]);
      };

      if (vid.readyState >= 2) {
        // Already has enough data — seek and capture.
        vid.currentTime = 0.1;
        vid.addEventListener("seeked", capture, { once: true });
      } else {
        vid.addEventListener("canplay", () => {
          vid.currentTime = 0.1;
          vid.addEventListener("seeked", capture, { once: true });
        }, { once: true });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Gallery
        </h2>

        <div className="relative rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 mb-12">
          {/* ── Main display: 6 videos stacked, only the selected one is visible ── */}
          <div className="relative h-[624px] overflow-hidden bg-black">

            {featuredVideos.map((video, index) => (
              <video
                key={video.src}
                ref={(el) => { videoRefs.current[index] = el; }}
                src={video.src}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity:    index === currentIndex ? 1 : 0,
                  zIndex:     index === currentIndex ? 1 : 0,
                  transition: "opacity 150ms ease",
                }}
                // No autoPlay — play/pause is driven by the useEffect above.
                loop
                muted
                playsInline
                preload="auto"
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />

            <div className="absolute bottom-[132px] left-0 right-0 px-6 z-10">
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {featuredVideos[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-sm font-medium">
                {featuredVideos[currentIndex].description}
              </p>
            </div>

            {/* ── Thumbnail strip: static poster frames, no live video elements ── */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2 overflow-hidden z-10">
              {featuredVideos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-1 min-w-0 h-[104px] rounded-lg overflow-hidden border-2 transition duration-100 bg-black ${
                    index === currentIndex
                      ? "border-accent-amber scale-105"
                      : "border-border/50"
                  }`}
                >
                  {/* Show canvas-captured poster frame; falls back to dark bg */}
                  {thumbFrames[index] ? (
                    <img
                      src={thumbFrames[index]!}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900" />
                  )}
                  {index !== currentIndex && (
                    <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition duration-100 z-10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <a
            href="#/gallery"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                return;
              }
              event.preventDefault();
              onNavigateToGallery?.();
            }}
            className="btn-amber group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}
