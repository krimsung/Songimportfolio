import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import { useMemo } from "react";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/Ghost CTRL Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/ghostctrl/HighresScreenshot00008.png";
import g01 from "../../media/projects/ghostctrl/HighresScreenshot00009.png";
import g02 from "../../media/projects/ghostctrl/HighresScreenshot00010.png";
import g03 from "../../media/projects/ghostctrl/HighresScreenshot00019.png";
import g04 from "../../media/projects/ghostctrl/HighresScreenshot00020.png";
import g05 from "../../media/projects/ghostctrl/HighresScreenshot00021.png";
import g06 from "../../media/projects/ghostctrl/HighresScreenshot00022.png";
import g07 from "../../media/projects/ghostctrl/HighresScreenshot00023.png";
import g08 from "../../media/projects/ghostctrl/HighresScreenshot00024.png";
import g09 from "../../media/projects/ghostctrl/HighresScreenshot00025.png";
import g10 from "../../media/projects/ghostctrl/HighresScreenshot00026.png";
import g11 from "../../media/projects/ghostctrl/HighresScreenshot00027.png";
import g12 from "../../media/projects/ghostctrl/HighresScreenshot00028.png";
import g13 from "../../media/projects/ghostctrl/HighresScreenshot00029.png";
import g14 from "../../media/projects/ghostctrl/HighresScreenshot00030.png";
import g15 from "../../media/projects/ghostctrl/HighresScreenshot00031.png";
import g16 from "../../media/projects/ghostctrl/HighresScreenshot00032.png";
import g17 from "../../media/projects/ghostctrl/HighresScreenshot00033.png";
import g18 from "../../media/projects/ghostctrl/HighresScreenshot00034.png";
import g19 from "../../media/projects/ghostctrl/HighresScreenshot00035.png";
import g20 from "../../media/projects/ghostctrl/HighresScreenshot00036.png";
import g21 from "../../media/projects/ghostctrl/song-im-ghostctrl-0 (1).jpg";
import g22 from "../../media/projects/ghostctrl/song-im-ghostctrl-00 (1).jpg";
import g23 from "../../media/projects/ghostctrl/song-im-ghostctrl-001.jpg";
import g24 from "../../media/projects/ghostctrl/song-im-ghostctrl-02.jpg";
import g25 from "../../media/projects/ghostctrl/song-im-ghostctrl-03.jpg";
import g26 from "../../media/projects/ghostctrl/song-im-ghostctrl-04.jpg";
import g27 from "../../media/projects/ghostctrl/song-im-ghostctrl-05.jpg";
import g28 from "../../media/projects/ghostctrl/song-im-ghostctrl-06.jpg";
import g29 from "../../media/projects/ghostctrl/song-im-ghostctrl-1.jpg";
import g30 from "../../media/projects/ghostctrl/song-im-ghostctrl-10 (1).jpg";
import g31 from "../../media/projects/ghostctrl/song-im-ghostctrl-11.jpg";
import g32 from "../../media/projects/ghostctrl/song-im-ghostctrl-12.jpg";
import g33 from "../../media/projects/ghostctrl/song-im-ghostctrl-13.jpg";
import g34 from "../../media/projects/ghostctrl/song-im-ghostctrl-2 (1).jpg";
import g35 from "../../media/projects/ghostctrl/song-im-ghostctrl-3.jpg";
import g36 from "../../media/projects/ghostctrl/song-im-ghostctrl-4.jpg";
import g37 from "../../media/projects/ghostctrl/song-im-ghostctrl-5 (1).jpg";
import g38 from "../../media/projects/ghostctrl/song-im-ghostctrl-6.jpg";
import g39 from "../../media/projects/ghostctrl/song-im-ghostctrl-8.jpg";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE       = "Ghost CTRL";
const YEAR        = "2025";
const STATUS      = "Released";
const PLATFORM    = "PC";
const ENGINE      = "Unreal Engine 5";
const TEAM_SIZE   = "Solo";
const ROLE        = "Solo Developer";
const LANGUAGE    = "Blueprint";
const DURATION    = "6 weeks (~400 hours)";
const LIVE_URL    = "https://www.youtube.com/watch?v=A_26edAmpbU";
const TAGS        = ["UE5", "Level Design", "Tech Art", "Solo"];
const GALLERY     = [
  g00, g01, g02, g03, g04, g05, g06, g07, g08, g09,
  g10, g11, g12, g13, g14, g15, g16, g17, g18, g19,
  g20, g21, g22, g23, g24, g25, g26, g27, g28, g29,
  g30, g31, g32, g33, g34, g35, g36, g37, g38, g39,
];

const DESCRIPTION = `Ghost CTRL is a solo Unreal Engine 5 extraction shooter built as the final project for the Level Design course at the University of Utah (Jennifer Egan). Developed over six weeks at roughly 400 hours, the core loop has the player locate a randomly spawned laptop, hold position through a 30-second download timer, then reach a randomly spawned extraction point and survive the countdown. The project was also scoped as a recruitment-ready demo for Ghost Core, the studio continuation project, which pushed quality expectations well beyond the course baseline.`;

const CHALLENGES = `The course had a strict checklist: build all mechanics from scratch, use flat colors only, include SFX and ambient audio, hit at least 4–5 minutes of gameplay, avoid geometry issues, and ship a playable package with a video. No premade plugins or asset packs were allowed.

Exceeding the baseline meant self-teaching Unreal's behavior tree, EQS, and a pixel-perfect ASCII UI pipeline — all within the same six-week window. The main tension was prioritizing systems that were both impressive and achievable without letting level polish slip.`;

const LEVEL_DESIGN = `The level is a compact modern city inspired by Counter-Strike layouts, built around readability and varied elevation. A street grid connects accessible building interiors, a sewer route, and a condensed rural edge for vertical variation and overlapping sightlines. To avoid an unfinished "floating in space" feel without spending weeks on unique architecture, I built a procedural building generator in Houdini — constraining X/Y/Z dimensions and randomizing window placement to bake multiple building variants for skyline set dressing.

Objective placement was deliberate: laptop spawners push the player into multiple zones, download locations favor defendability, and extraction points are designed to make the final sprint tense without feeling unfair. Lighting and color were kept intentional throughout to maintain a clear visual language.`;

const SYSTEMS_AND_UI = `Two weapons — pistol and SMG — were built from scratch with custom ammo, reload, damage tuning, locational multipliers (headshots 2x, limbs 0.5x), and knockback. A Spawn Manager blueprint backed all item and enemy spawners, giving designer-facing control over spawn rates and randomization to keep runs replayable.

Enemies are hacked synthetic humans ("synths") driven by behavior trees and EQS, with four states signaled by spotlight color: red (chase), orange (last-seen investigation), yellow (sound investigation), blue (roaming). EQS searches blind spots rather than beelining. The laptop objective requires 30 seconds in-zone to download; breaking the radius cancels the timer, creating a king-of-the-hill defend moment before extraction begins.

The UI is built on a CP437 monospaced ASCII typeface, requiring careful pixel-perfect font setup to prevent artifacting. ASCII borders and bars display health and stamina, and a Blueprint-driven event log tracks loot, damage, and objective state. Multiple difficulty passes after playtests tuned enemy speed, health, and spawn rates, and the AI spotlight indicator was added after playtesters said enemies felt like they were "sneaking up" on them.`;

// ── Inline gallery component ─────────────────────────────────────────────────
function Gallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = () => setSelectedIndex(null);
  const prev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);
  const next = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  }, [selectedIndex, images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="bg-card rounded-lg p-8 border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:border-accent transition-all duration-300 cursor-pointer"
            >
              <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" />
            </button>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={close}>
          <div className="absolute inset-0 bg-black/90" />
          <button onClick={close} className="btn-icon absolute top-4 right-4 z-10" aria-label="Close"><X className="w-6 h-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="btn-icon absolute left-4 top-1/2 -translate-y-1/2 z-10" aria-label="Previous"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="btn-icon absolute right-4 top-1/2 -translate-y-1/2 z-10" aria-label="Next"><ChevronRight className="w-6 h-6" /></button>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={images[selectedIndex]} alt={`Screenshot ${selectedIndex + 1}`} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-sm bg-card/80 px-4 py-2 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

// ── Page component ───────────────────────────────────────────────────────────
interface Props {
  onBack?: () => void;
  backLabel?: string;
}

export function GhostCtrlPage({ onBack, backLabel }: Props) {
  const md: Components = useMemo(() => ({
    p: ({ children }) => <p className="text-muted-foreground leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
  }), []);

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back button */}
        <a
          href="#/"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
            e.preventDefault();
            onBack?.();
          }}
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>{backLabel ?? "Back to Home"}</span>
        </a>

        {/* Banner */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative h-96">
            <img src={thumbnail} alt={TITLE} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                {YEAR}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{TITLE}</h1>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Project Description</h2>
              <ReactMarkdown components={md}>{DESCRIPTION}</ReactMarkdown>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Challenges</h2>
              <ReactMarkdown components={md}>{CHALLENGES}</ReactMarkdown>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Level Design</h2>
              <ReactMarkdown components={md}>{LEVEL_DESIGN}</ReactMarkdown>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Systems & UI</h2>
              <ReactMarkdown components={md}>{SYSTEMS_AND_UI}</ReactMarkdown>
            </div>

            <Gallery images={GALLERY} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Details</h3>
              <div className="space-y-3">
                {[
                  ["Status",    STATUS],
                  ["Platform",  PLATFORM],
                  ["Engine",    ENGINE],
                  ["Team Size", TEAM_SIZE],
                  ["Role",      ROLE],
                  ["Language",  LANGUAGE],
                  ["Duration",  DURATION],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-muted-foreground font-medium">{label}:</span>
                    <span className="text-foreground ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {LIVE_URL && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-4">Project Links</h3>
                <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Live Project</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
