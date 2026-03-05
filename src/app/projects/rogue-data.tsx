import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/Rogue Data Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/roguedata/HighresScreenshot00000.png";
import g01 from "../../media/projects/roguedata/HighresScreenshot00001.png";
import g02 from "../../media/projects/roguedata/HighresScreenshot00002.png";
import g03 from "../../media/projects/roguedata/HighresScreenshot00003.png";
import g04 from "../../media/projects/roguedata/HighresScreenshot00004.png";
import g05 from "../../media/projects/roguedata/HighresScreenshot00005.png";
import g06 from "../../media/projects/roguedata/HighresScreenshot00006.png";
import g07 from "../../media/projects/roguedata/HighresScreenshot00007.png";
import g08 from "../../media/projects/roguedata/HighresScreenshot00008.png";
import g09 from "../../media/projects/roguedata/HighresScreenshot00009.png";
import g10 from "../../media/projects/roguedata/HighresScreenshot00012.png";
import g11 from "../../media/projects/roguedata/HighresScreenshot00013.png";
import g12 from "../../media/projects/roguedata/HighresScreenshot00014.png";
import g13 from "../../media/projects/roguedata/HighresScreenshot00015.png";
import g14 from "../../media/projects/roguedata/HighresScreenshot00016.png";
import g15 from "../../media/projects/roguedata/HighresScreenshot00017.png";
import g16 from "../../media/projects/roguedata/roguedata starting point.png";
import g17 from "../../media/projects/roguedata/song-im-vlcsnap-2025-03-17-02h20m57s906.jpg";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Rogue Data";
const YEAR      = "2025";
const STATUS    = "Finished";
const PLATFORM  = "PC";
const ENGINE    = "Unreal Engine 5";
const TEAM_SIZE = "Solo";
const ROLE      = "Solo Developer";
const LANGUAGE  = "Blueprint";
const DURATION  = "4 weeks";
const LIVE_URL  = "https://www.youtube.com/watch?v=Mp_us1StwyQ";
const TAGS      = ["UE5", "Level Design", "Tech Art", "Solo"];
const GALLERY   = [g00, g01, g02, g03, g04, g05, g06, g07, g08, g09, g10, g11, g12, g13, g14, g15, g16, g17];

const DESCRIPTION = `Rogue Data is a 2D movement side-scroller built for the second Level Design assignment at the University of Utah (Jennifer Egan), developed over four weeks. The player is a glitched AI fragment that slips into the backend of a system, traversing levels through walljumping, dashing, and cursor-dragging of physics objects. Movement was heavily inspired by N/N++ with a strong emphasis on momentum. The visual direction starts bright and diagnostic, then shifts to a dark glitched world mid-way through.`;

const CHALLENGES = `The assignment required an explicit tutorial with on-screen keybindings, flat colors only, SFX and ambient audio, at least one mechanic beyond jumping, environmental hazards, no premade assets, proper death/reset, and a packaged build with video.

The challenge was making a 2D platformer feel intentional and worth playing rather than generic. I focused early on movement feel, visual identity, and teaching clarity — front-loading mechanics and visuals so level design could be the focus in the back half of development.`;

const LEVEL_DESIGN = `The tutorial opens in a bright white diagnostic space with CMYK accents, teaching momentum, walljumping, and cursor dragging. A locked-room sequence with a broken teleport timer closes it out and shifts the world to a dark RGB/black glitched environment. A buffer climb of collapsing platforms bridges the tutorial into the main hub.

The hub uses color-coded challenge paths (blue puzzle, green accuracy, red speed), each requiring a key returned to a colored pad. The accuracy path uses emissive arrow boosters that knock the player off course, forcing precision dragging to retrieve the key. The speed path uses red dissolving platforms that respawn slowly, forcing players to time a single dash between rest platforms with no energy safety net. The puzzle section was scoped out due to time — its key was placed near the pad to still teach the hub mechanic. The level ends with a bright light and gravity reversal that lifts the player upward.`;

const TECH_ART = `The player character is a Niagara voxel build sampled from the Quinn skeletal mesh, placing evenly spaced emissive cubes across the silhouette. The energy bar shifts green to red as it drains, and the voxel body fades and scales from the bottom up — giving a clear in-world energy read without requiring the player to watch the UI. Playtests confirmed the emissive language improved readability significantly in the darker hub sections.`;

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

export function RogueDataPage({ onBack, backLabel }: Props) {
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Level Design</h2>
              <ReactMarkdown components={md}>{LEVEL_DESIGN}</ReactMarkdown>
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
