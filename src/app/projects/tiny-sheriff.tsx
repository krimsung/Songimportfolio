import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/tinysheriff/Tiny Sheriff Thumbnail.jpg";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Tiny Sheriff";
const YEAR      = "2025";
const STATUS    = "Released";
const PLATFORM  = "PC";
const ENGINE    = "Unity";
const TEAM_SIZE = "~30";
const ROLE      = "Programmer → VFX/Tech Artist";
const LANGUAGE  = "C#";
const DURATION  = "9 months (2 semesters)";
const YOUTUBE_ID = "VCjkm3nRkqE";
const LIVE_URL   = "https://store.steampowered.com/app/3566060/Tiny_Sheriff/";
const TAGS      = ["Unity", "C#", "Tech Art", "Team"];
const GALLERY   = [g00];

const DESCRIPTION = `Tiny Sheriff is a 2D movement platformer where weapons double as traversal tools — each shot propels the player through the air for dashes, double-jumps, and wall-bounces. Enemies and cactus hazards demand precise control, since mistimed shots launch the player into danger. The game is available free on Steam.

Developed over two semesters as part of the University of Utah Division of Games Capstone, I joined the team after a demo was already underway, initially as an engineer and then transitioning into tech art for the second semester.`;

const CHALLENGES = `The prototype I joined used Unity's default functions with significant hard-coded logic, causing timing bugs around weapon swapping and execution order. Movement mixed Translate and velocity-based approaches, breaking momentum consistency — a serious problem for a game where weapon knockback is the core feel.

In Capstone 2, the challenge shifted: I had never used Unity's particle system or Shader Graph before, so both the wind VFX and the heat-wave shader were entirely self-taught during active development. The goal was shipping production-ready effects that level designers could use without any technical setup.`;

const ENGINEERING = `I re-architected the codebase from scattered, hard-coded actions into a unified event-driven system. A shared event handler and event manager tracked execution order, fixing critical timing bugs like weapon swapping and action sequencing. This also unlocked cleaner ammo handling and the ability to lock/unlock weapons as part of game progression (previously all three guns were always accessible).

Player movement was fully reworked to a velocity-only system, replacing the mixed Translate/velocity approach. This preserved knockback momentum from weapon fire, aligned the feel with weapon propulsion, and made the wind mechanic straightforward to layer on top.`;

const TECH_ART = `For the wind VFX, I built a particle system designed with level designers as the primary user. The effect exposes adjustable range controls so designers can match the visual to the wind trigger box without any technical setup. I also contributed on the code side, exposing velocity parameters for designer manipulation.

The heat-wave background shader was built in Unity's Shader Graph using time-based sine waves across multiple channels to produce a shimmering hot-air haze. Both the wind VFX and the heat-wave shader were packaged as prefabs for easy drop-in placement and scaling by environment designers.`;

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
      <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Gallery</h2>
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
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="btn-icon absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10" aria-label="Previous"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="btn-icon absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10" aria-label="Next"><ChevronRight className="w-6 h-6" /></button>
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

export function TinySheriffPage({ onBack, backLabel }: Props) {
  const md: Components = useMemo(() => ({
    p: ({ children }) => <p className="text-muted-foreground leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
  }), []);

  return (
    <div className="min-h-screen bg-background pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

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

        {/* Header bar */}
        <div className="bg-card rounded-lg border border-border mb-4 px-6 py-4 flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">{TITLE}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />{YEAR}
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {TAGS.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>
        </div>

        {/* YouTube embed */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
              title={TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Project Description</h2>
              <ReactMarkdown components={md}>{DESCRIPTION}</ReactMarkdown>
            </div>
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Challenges</h2>
              <ReactMarkdown components={md}>{CHALLENGES}</ReactMarkdown>
            </div>
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Engineering</h2>
              <ReactMarkdown components={md}>{ENGINEERING}</ReactMarkdown>
            </div>
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Technical Art</h2>
              <ReactMarkdown components={md}>{TECH_ART}</ReactMarkdown>
            </div>
            <Gallery images={GALLERY} />
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg p-5 sm:p-6 border border-border">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Details</h3>
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
              <div className="bg-card rounded-lg p-5 sm:p-6 border border-border">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Project Links</h3>
                <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                  <ExternalLink className="w-4 h-4" /><span>View on Steam</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
