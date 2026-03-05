import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
import thumbnail from "../../media/thumbnails/Final Shot Thumbnail.png";

// ── Gallery images ───────────────────────────────────────────────────────────
import g00 from "../../media/projects/finalshot/HighresScreenshot00000.png";
import g01 from "../../media/projects/finalshot/HighresScreenshot00001.png";
import g02 from "../../media/projects/finalshot/HighresScreenshot00002.png";
import g03 from "../../media/projects/finalshot/HighresScreenshot00003.png";
import g04 from "../../media/projects/finalshot/ScreenShot00000.png";
import g05 from "../../media/projects/finalshot/ScreenShot00001.png";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Final Shot";
const YEAR      = "2025";
const STATUS    = "Finished";
const PLATFORM  = "PC";
const ENGINE    = "Unreal Engine 5";
const TEAM_SIZE = "Solo";
const ROLE      = "Solo Developer";
const LANGUAGE  = "Blueprint";
const DURATION  = "48 hours";
const LIVE_URL  = "";
const TAGS      = ["UE5", "Blueprint", "Tech Art", "Solo"];
const GALLERY   = [g00, g01, g02, g03, g04, g05];

const DESCRIPTION = `Final Shot is the final project for Introduction to Game Scripting (Fernando J. Rodriguez, University of Utah), completed in 48 hours. It is a third-person mage shooter with two levels — a forest target range and a Roman colosseum arena — plus a main menu, resource-driven combat (health, stamina, mana), and a stylized cel-shaded presentation. All required deliverables and every available bonus item were completed within the time limit.`;

const CHALLENGES = `The assignment defined the core loop up front: a shooting range where destroying all targets advances to a showdown level, three-hit health rules for both player and enemy, a bullet actor with projectile movement, and UI tracking targets, player health, and enemy health. Bonus items included a main menu, a charged shot, distinct VFX, attack/death animations, and win/lose widgets.

Finishing everything in 48 hours meant hitting every required behavior while still leaving time for polish, animation, and VFX — none of which could slip if the bonus items were going to land too.`;

const LEVEL_DESIGN = `The Target Range is a small forest training area built with the landscape tool and asset-bashed trees and stone. A custom target blueprint supports two modes: targets that travel along spline paths, or targets that flip up 90 degrees on a wooden plank. Many targets are hidden at rest and only reveal on activation, rewarding sight-line awareness. After 10 targets are destroyed, a portal gate rises to load the Battle Arena.

The Battle Arena is a Roman colosseum-inspired pit with a spectator ring, pillars, boulders, and four entrances where ice mage AIs spawn. Both levels share a pickup-pad tool that periodically spawns mana crystals or health potions based on an exposed chance value. The game ends when all four mages in the arena are defeated.`;

const TECH_ART = `Mixamo animations were retargeted for both the player and enemies, with the firing animation blended with idle/run so casting reads clearly during movement. Timelines synchronize VFX and SFX with each stage of casting, release, and impact. Fireball and iceball effects are each built in three stages — hand hold, projectile flight, and impact — with layered emitters for each.

A custom cel shader was implemented using luminance thresholds to tune the stylized lighting, giving the game a clean hand-drawn look. The player stat system tracks health, stamina for dodge rolls, and mana for fireballs, with a charged fireball that scales to 3x size and damage over a 3-second charge.`;

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

export function FinalShotPage({ onBack, backLabel }: Props) {
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Level Design</h2>
              <ReactMarkdown components={md}>{LEVEL_DESIGN}</ReactMarkdown>
            </div>
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Tech Art & Animation</h2>
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
