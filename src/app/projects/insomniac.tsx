import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/Insomniac Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/insomniac/HighresScreenshot00000.png";
import g01 from "../../media/projects/insomniac/HighresScreenshot00001.png";
import g02 from "../../media/projects/insomniac/HighresScreenshot00002.png";
import g03 from "../../media/projects/insomniac/HighresScreenshot00003.png";
import g04 from "../../media/projects/insomniac/HighresScreenshot00004.png";
import g05 from "../../media/projects/insomniac/HighresScreenshot00006.png";
import g06 from "../../media/projects/insomniac/HighresScreenshot00007.png";
import g07 from "../../media/projects/insomniac/HighresScreenshot00008.png";
import g08 from "../../media/projects/insomniac/HighresScreenshot00009.png";
import g09 from "../../media/projects/insomniac/HighresScreenshot00010.png";
import g10 from "../../media/projects/insomniac/HighresScreenshot00011.png";
import g11 from "../../media/projects/insomniac/HighresScreenshot00012.png";
import g12 from "../../media/projects/insomniac/HighresScreenshot00013.png";
import g13 from "../../media/projects/insomniac/HighresScreenshot00014.png";
import g14 from "../../media/projects/insomniac/HighresScreenshot00015.png";
import g15 from "../../media/projects/insomniac/HighresScreenshot00016.png";
import g16 from "../../media/projects/insomniac/HighresScreenshot00017.png";
import g17 from "../../media/projects/insomniac/HighresScreenshot00018.png";
import g18 from "../../media/projects/insomniac/HighresScreenshot00020.png";
import g19 from "../../media/projects/insomniac/HighresScreenshot00021.png";
import g20 from "../../media/projects/insomniac/HighresScreenshot00022.png";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Insomniac";
const YEAR      = "2025";
const STATUS    = "Finished";
const PLATFORM  = "PC";
const ENGINE    = "Unreal Engine 5";
const TEAM_SIZE = "Solo";
const ROLE      = "Solo Developer";
const LANGUAGE  = "Blueprint";
const DURATION  = "4 weeks";
const LIVE_URL  = "";
const TAGS      = ["UE5", "Level Design", "Solo"];
const GALLERY   = [
  g00, g01, g02, g03, g04, g05, g06, g07, g08, g09,
  g10, g11, g12, g13, g14, g15, g16, g17, g18, g19, g20,
];

const DESCRIPTION = `Insomniac is a walking simulator and the first project from the Level Design course at the University of Utah (Jennifer Egan, Fall 2025). The assignment required visiting a real-world location in person and building a game level inspired by it. I based mine on observations from a South Korea trip the summer prior — specifically the architecture and the work culture. The result is a dystopian underground apartment complex and subway system built in a brutalist concrete megastructure, where the player collects caffeine vitamins while exploring a world shaped by overwork and dependency.`;

const CHALLENGES = `The assignment required flat colors only (no textures, no landscape tool, no premade assets), a lighting pass, functional collectibles, 2–5 minutes of gameplay, and a playable packaged build. The player cannot die or fall, and mechanics beyond walking were discouraged.

The main design problem: tall apartment buildings let the player see too far, breaking immersion and revealing unfinished areas. The solution was to take the buildings underground into a fog-filled vertical megastructure — the infinite pit above and below both constrained sightlines and reinforced the oppressive theme.`;

const LEVEL_DESIGN = `The level moves through three sections. The player spawns at a bridge intersection on the outer wall of the apartment complex — one bridge is broken to guide direction without UI, the other crosses to the center building. Looking down shows the infinite pit fading into fog; looking up shows more floors and bridges stretching into darkness, establishing scale and tone immediately.

Inside the apartment building, most rooms are closed off except for a few floors connected by a central staircase. The upper staircase hits an invisible barrier to signal the wrong direction. Vitamins are placed to reward exploration — tucked around corners, behind walls. On exiting the building, a final bridge crossing offers a last look at the megastructure before the subway entrance.

The subway descends into a main floor with three shop fronts (sparse, with knocked-over shelves, tilted mannequins, and disoriented clothing racks), a ticketing area with a blocked women's bathroom, and large monitors — one flickering and broken. The platform at the bottom is the finish: if 10 vitamins have been collected, the player can board the train. On completion, the level resets and vitamins respawn, suggesting the entire journey is a caffeine-induced loop.`;

const ENV_STORYTELLING = `The theme is South Korean work culture pushed to dystopian extremes — long hours, competitive pressure, widespread dependency on stimulants just to function. The set dressing communicates this without dialogue: run-down interiors, disorganized shelves, broken lights, mannequins left where they fell. The grayscale concrete palette and lack of sunlight create a suffocating, lifeless mood.

The caffeine vitamin bottles are the deliberate contrast — bright emissive glow against the dark world, representing the only artificial energy keeping people moving through an unbearable routine. The looping ending (level resets, vitamins respawn) reinforces the interpretation that the whole experience is a hallucination from overconsumption. Vitamins were built with rotating animation and strong emissive materials to stay readable even in the darkest areas of the level.`;

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

export function InsomniacPage({ onBack, backLabel }: Props) {
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Environmental Storytelling</h2>
              <ReactMarkdown components={md}>{ENV_STORYTELLING}</ReactMarkdown>
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
