import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/Ghost Core Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/ghostcore/725234image.png";
import g01 from "../../media/projects/ghostcore/HighresScreenshot00011.png";
import g02 from "../../media/projects/ghostcore/HighresScreenshot00012.png";
import g03 from "../../media/projects/ghostcore/HighresScreenshot00013.png";
import g04 from "../../media/projects/ghostcore/HighresScreenshot00014.png";
import g05 from "../../media/projects/ghostcore/HighresScreenshot00015.png";
import g06 from "../../media/projects/ghostcore/HighresScreenshot00016.png";
import g07 from "../../media/projects/ghostcore/HighresScreenshot00017.png";
import g08 from "../../media/projects/ghostcore/HighresScreenshot00018.png";
import g09 from "../../media/projects/ghostcore/i45674mage.png";
import g10 from "../../media/projects/ghostcore/i72645mage.png";
import g11 from "../../media/projects/ghostcore/im12152age.png";
import g12 from "../../media/projects/ghostcore/im123142age.png";
import g13 from "../../media/projects/ghostcore/im12324age.png";
import g14 from "../../media/projects/ghostcore/im1241age.png";
import g15 from "../../media/projects/ghostcore/im1421age.png";
import g16 from "../../media/projects/ghostcore/im3123age.png";
import g17 from "../../media/projects/ghostcore/im41235age.png";
import g18 from "../../media/projects/ghostcore/im41563age.png";
import g19 from "../../media/projects/ghostcore/im645234age.png";
import g20 from "../../media/projects/ghostcore/im7453age.png";
import g21 from "../../media/projects/ghostcore/im76543age.png";
import g22 from "../../media/projects/ghostcore/im9578768age.png";
import g23 from "../../media/projects/ghostcore/ima1234123ge.png";
import g24 from "../../media/projects/ghostcore/ima123414ge.png";
import g25 from "../../media/projects/ghostcore/ima124ge.png";
import g26 from "../../media/projects/ghostcore/ima31231ge.png";
import g27 from "../../media/projects/ghostcore/ima346345ge.png";
import g28 from "../../media/projects/ghostcore/ima51234ge.png";
import g29 from "../../media/projects/ghostcore/ima93567ge.png";
import g30 from "../../media/projects/ghostcore/imag1231e.png";
import g31 from "../../media/projects/ghostcore/imag142412e.png";
import g32 from "../../media/projects/ghostcore/imag222222e.png";
import g33 from "../../media/projects/ghostcore/imag2222e.png";
import g34 from "../../media/projects/ghostcore/imag312312e.png";
import g35 from "../../media/projects/ghostcore/imag41233e.png";
import g36 from "../../media/projects/ghostcore/imag444e.png";
import g37 from "../../media/projects/ghostcore/imag5123144e.png";
import g38 from "../../media/projects/ghostcore/imag6241e.png";
import g39 from "../../media/projects/ghostcore/imag7245e.png";
import g40 from "../../media/projects/ghostcore/image222.png";
import g41 from "../../media/projects/ghostcore/image333.png";
import g42 from "../../media/projects/ghostcore/image3333.png";
import g43 from "../../media/projects/ghostcore/image3344.png";
import g44 from "../../media/projects/ghostcore/image3453.png";
import g45 from "../../media/projects/ghostcore/image535.png";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Ghost Core";
const YEAR      = "2025";
const STATUS    = "In Development";
const PLATFORM  = "PC, Mac, Linux";
const ENGINE    = "Unreal Engine 5.5";
const TEAM_SIZE = "8";
const ROLE      = "Producer, Level Designer, Programmer, VFX & Shader Artist";
const LANGUAGE  = "Blueprint";
const DURATION  = "In development since Fall 2025";
const LIVE_URL  = "";
const TAGS      = ["UE5", "Producer", "Level Design", "Tech Art"];
const GALLERY   = [
  g00, g01, g02, g03, g04, g05, g06, g07, g08, g09,
  g10, g11, g12, g13, g14, g15, g16, g17, g18, g19,
  g20, g21, g22, g23, g24, g25, g26, g27, g28, g29,
  g30, g31, g32, g33, g34, g35, g36, g37, g38, g39,
  g40, g41, g42, g43, g44, g45,
];

const DESCRIPTION = `Ghost Core is the full studio continuation of Ghost CTRL, the solo course prototype I built at the University of Utah. Seeing the potential to expand the game and world into a proper indie release, I assembled a team of 8 and began development in fall 2025. The game is a dystopian sci-fi first-person extraction shooter set in a much larger city than Ghost CTRL, featuring a player home level for gear prep and storytelling through game progression, a full inventory system, expanded weapons and gear, and brutalist architecture that pushes the creative direction of the setting further.

Development is ongoing and active. Ghost Core represents my first original IP in full production outside of an academic context.`;

const RESPONSIBILITIES = `- **Producer** — leading the project with weekly team meetings, coordinating across disciplines, and maintaining documented vision and production planning
- **Level Design** — building and iterating on the main city level, starting from a full block-out to gameplay-metric-accurate design; mentoring a junior level designer through the process
- **Programmer** — implementing gameplay content and features in Blueprint
- **VFX & Shader Artist** — developing the game's visual identity through custom VFX and a proprietary fog-of-war shader system`;

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

export function GhostCorePage({ onBack, backLabel }: Props) {
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
          <div className="relative h-48 sm:h-64 md:h-96">
            <img src={thumbnail} alt={TITLE} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 md:mb-3">
                <Calendar className="w-4 h-4" />
                {YEAR}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">{TITLE}</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Project Description</h2>
              <ReactMarkdown components={md}>{DESCRIPTION}</ReactMarkdown>
            </div>

            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Responsibilities</h2>
              <ReactMarkdown components={md}>{RESPONSIBILITIES}</ReactMarkdown>
            </div>

            <Gallery images={GALLERY} />
          </div>

          {/* Sidebar */}
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
