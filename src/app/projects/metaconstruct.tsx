import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/METACONSTRUCT Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/metaconstruct/HighresScreenshot00000.png";
import g01 from "../../media/projects/metaconstruct/HighresScreenshot00001.png";
import g02 from "../../media/projects/metaconstruct/HighresScreenshot00002.png";
import g03 from "../../media/projects/metaconstruct/ScreenShot00000.png";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "METACONSTRUCT";
const YEAR      = "2023";
const STATUS    = "Finished";
const PLATFORM  = "PC";
const ENGINE    = "Unreal Engine 5";
const TEAM_SIZE = "5";
const ROLE      = "Producer, Programmer, Tech Artist";
const LANGUAGE  = "Blueprint";
const DURATION  = "~3 months (one semester)";
const LIVE_URL  = "";
const TAGS      = ["UE5", "Producer", "Procedural", "Team"];
const GALLERY   = [g00, g01, g02, g03];

const DESCRIPTION = `METACONSTRUCT is a single-player first-person looter shooter built for the Traditional Game Development course at the University of Utah (Michael Caldwell). Selected from roughly 30 pitched ideas, it was developed over one semester with a team of five. The game is set inside a decaying digital construct — the player scavenges resources, fights hostile entities, and extracts before the corruption overtakes them. I served as producer while also covering level design and technical art to fill roles the small team was missing.`;

const CHALLENGES = `Our team of five was missing several key roles — producer, texture artist, tech/VFX, SFX, and UI/UX. That meant I had to stretch across production, engineering, and technical art simultaneously. With no texture artist, we leaned into flat-color materials and post-processing to build visual identity. Every system I built — PCG, procedural mesh generation, and the fog-of-war — was a first for me, and all of it had to ship inside a single semester.`;

const PROCEDURAL = `I built procedural dust set dressing and a rising ground hazard using Perlin noise in Unreal Engine. Using a free Marketplace Perlin plugin for the noise values, I wrote the mesh generation from scratch: plotting vertices across a grid, triangulating into rectangles, and stitching into a dynamic plane mesh. Frequency, magnitude, size, and UV scale were all exposed for tuning, and a shared seed kept all procedural systems consistent with each other.

For building scatter, I taught myself Unreal's PCG workflow and tied it to the same seed via a level manager blueprint. This ensured PCG building placement, noise-based set dressing, and the hazard all aligned on a consistent procedural state — important for a game where randomized generation drives replayability.`;

const TECH_ART = `The signature system was a fog-of-war for a first-person shooter. I built a 1:10 scale proxy of the level off to the side and created a brush blueprint that mirrored player movement at that scale. A render target and dynamic material painted the brush into a reveal mask (white = seen, black = hidden). The post-process read that mask and blended in a digital grid transition using UV channel splits (R/G/B as axis offsets), smoothstep, and dithering. Custom stencil filtering kept the effect scoped to the right surfaces.

I also implemented a screen-space vertex snapping post-process inspired by PSX-era rendering, applied only to enemy models to make them read as unstable digital artifacts. The main menu was a Matrix-inspired scene I directed and set up — specifying assets for two artists, then handling camera, lighting, and placement myself.`;

// ── Inline gallery ───────────────────────────────────────────────────────────
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
            <button key={i} onClick={() => setSelectedIndex(i)} className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:border-accent transition-all duration-300 cursor-pointer">
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

export function MetaconstructPage({ onBack, backLabel }: Props) {
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

        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative h-96">
            <img src={thumbnail} alt={TITLE} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />{YEAR}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Procedural Generation</h2>
              <ReactMarkdown components={md}>{PROCEDURAL}</ReactMarkdown>
            </div>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Technical Art</h2>
              <ReactMarkdown components={md}>{TECH_ART}</ReactMarkdown>
            </div>
            <Gallery images={GALLERY} />
          </div>

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
                  <ExternalLink className="w-4 h-4" /><span>View Live Project</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
