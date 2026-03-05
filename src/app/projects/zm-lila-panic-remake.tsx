import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Calendar, Tag, X, ChevronLeft, ChevronRight } from "lucide-react";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/projects/zm_lila_panic remake/Untitled-3.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/zm_lila_panic remake/Untitled-3.png";
import g01 from "../../media/projects/zm_lila_panic remake/240_56.jpg";
import g02 from "../../media/projects/zm_lila_panic remake/240_57.jpg";
import g03 from "../../media/projects/zm_lila_panic remake/240_58.jpg";
import g04 from "../../media/projects/zm_lila_panic remake/240_59.jpg";
import g05 from "../../media/projects/zm_lila_panic remake/240_60.jpg";
import g06 from "../../media/projects/zm_lila_panic remake/240_61.jpg";
import g07 from "../../media/projects/zm_lila_panic remake/240_62.jpg";
import g08 from "../../media/projects/zm_lila_panic remake/240_63.jpg";
import g09 from "../../media/projects/zm_lila_panic remake/240_64.jpg";
import g10 from "../../media/projects/zm_lila_panic remake/240_65.jpg";
import g11 from "../../media/projects/zm_lila_panic remake/240_66.jpg";
import g12 from "../../media/projects/zm_lila_panic remake/240_67.jpg";
import g13 from "../../media/projects/zm_lila_panic remake/240_68.jpg";
import g14 from "../../media/projects/zm_lila_panic remake/240_69.jpg";
import g15 from "../../media/projects/zm_lila_panic remake/240_70.jpg";
import g16 from "../../media/projects/zm_lila_panic remake/240_71.jpg";
import g17 from "../../media/projects/zm_lila_panic remake/240_72.jpg";
import g18 from "../../media/projects/zm_lila_panic remake/240_73.jpg";
import g19 from "../../media/projects/zm_lila_panic remake/240_74.jpg";
import g20 from "../../media/projects/zm_lila_panic remake/240_75.jpg";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE    = "Lila Panic Remake";
const YEAR     = "2024";
const STATUS   = "Finished";
const PLATFORM = "PC";
const ENGINE   = "Source Engine";
const ROLE     = "Solo Level Designer";
const TAGS     = ["Source", "Level Design", "Solo"];
const GALLERY  = [
  g00, g01, g02, g03, g04, g05, g06, g07, g08, g09,
  g10, g11, g12, g13, g14, g15, g16, g17, g18, g19, g20,
];

// ── Inline gallery ────────────────────────────────────────────────────────────
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
            <button key={i} onClick={() => setSelectedIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:border-accent transition-all duration-300 cursor-pointer">
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

// ── Page component ────────────────────────────────────────────────────────────
interface Props {
  onBack?: () => void;
  backLabel?: string;
}

export function ZmLilaPanicRemakePage({ onBack, backLabel }: Props) {
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

        {/* Banner */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative h-48 sm:h-64 md:h-96">
            <img src={thumbnail} alt={TITLE} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 md:mb-3">
                <Calendar className="w-4 h-4" />{YEAR}
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
          <div className="lg:col-span-2 space-y-8">
            <Gallery images={GALLERY} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-5 sm:p-6 border border-border">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Details</h3>
              <div className="space-y-3">
                {[
                  ["Status",   STATUS],
                  ["Platform", PLATFORM],
                  ["Engine",   ENGINE],
                  ["Role",     ROLE],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-muted-foreground font-medium">{label}:</span>
                    <span className="text-foreground ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
