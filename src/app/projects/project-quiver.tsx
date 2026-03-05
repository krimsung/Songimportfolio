import { useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";

// ── Thumbnail ────────────────────────────────────────────────────────────────
// No dedicated thumbnail yet — using Ghost CTRL as placeholder
import thumbnail from "../../media/thumbnails/Ghost CTRL Thumbnail.png";

// ── Static data ──────────────────────────────────────────────────────────────
const TITLE     = "Project Quiver";
const YEAR      = "2026";
const STATUS    = "In Development";
const PLATFORM  = "PC";
const ENGINE    = "Unreal Engine 5";
const TEAM_SIZE = "4";
const ROLE      = "Producer, Programmer, Tech Artist";
const LANGUAGE  = "Blueprint, C++";
const DURATION  = "On-going (December 2025)";
const LIVE_URL  = "";
const TAGS      = ["UE5", "Procedural", "GAS", "Team"];

const DESCRIPTION = `Project Quiver is a multiplayer movement-driven PvP roguelike — think Rounds but in 3D third-person with fantasy RPG elements, built around One-In-The-Quiver gameplay. Each player has three arrows they can recover after shooting; melee attacks add momentum and offer a high-risk close-range option. Movement is entirely velocity-based, letting players chain slides, wall slides, wall jumps, and melee bursts for advanced traversal across a procedurally generated tile arena.

This is my second original project built outside of school with a small team, targeting release on Steam and Itch.io. Currently in a polished prototype phase before expanding the team for full development.`;

const CHALLENGES = `Three systems needed to work together from the start: tile-based procedural generation, a deep ability-driven movement framework, and networked multiplayer sync. Each one had steep learning curves. GAS and Unreal C++ were both new to me, and multiplayer movement introduces client prediction, rollback risk, and replication accuracy problems that compound quickly once movement goes beyond basic locomotion.

Procedural generation also had to be deterministic across server and clients — not just convenient, but required. A single tile difference between host and client would break movement, collision, and line-of-sight for everyone in the match.`;

const PROCEDURAL = `The arena uses a tile-grid system supporting 1x1, 2x1, and 2x2 tile sizes, generated in three passes. The first pass frames the outer boundary with larger tiles, intentionally leaving gaps. The second fills the interior with non-standard tiles while preserving pockets of open space. The third backfills all remaining gaps — including wall pieces — with 1x1 tiles. The result is a fully closed arena with mixed tile sizes that feels structured but varied.

Map size is adjustable (minimum 3x3), and a shared stream seed ensures the same seed always generates the same level. That seed is synced between server and all clients, guaranteeing identical tile placement and collision everywhere in the network.`;

const GAS = `All player movement — slide, wall slide, wall jump, and melee momentum — is implemented as GAS abilities in C++. This lets the movement system scale with roguelike items and stat modifiers planned for later development, and it gives cleaner control over ability prediction windows and replication rules compared to non-GAS approaches.

Client-side prediction is the core multiplayer challenge for movement. Basic locomotion prediction ships with Unreal, but custom abilities like wall slide timing, slide friction, and melee impulse need more precise prediction to avoid rollback jitter. GAS provides the prediction hooks to handle this cleanly. Projectile arrows are also synced using Unreal's replication system so arrow physics stay consistent across host and clients.`;

// ── Page component ───────────────────────────────────────────────────────────
interface Props {
  onBack?: () => void;
  backLabel?: string;
}

export function ProjectQuiverPage({ onBack, backLabel }: Props) {
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Gameplay Ability System (GAS)</h2>
              <ReactMarkdown components={md}>{GAS}</ReactMarkdown>
            </div>
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
