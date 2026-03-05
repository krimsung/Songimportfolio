import { useState, useMemo, useRef } from "react";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { PROJECT_REGISTRY, ProjectStatus } from "../../data/projectRegistry";
import { ProjectCard } from "./project-card";

// ── Derive all unique tags from the registry ──────────────────────────────────
const ALL_TAGS: string[] = Array.from(
  new Set(PROJECT_REGISTRY.flatMap((p) => p.tags))
).sort();

const ALL_STATUSES: ProjectStatus[] = ["Released", "Finished", "In Development"];

const getStatusColor = (status: ProjectStatus, active: boolean) => {
  const base = active ? "border-opacity-100 " : "border-opacity-40 opacity-50 ";
  switch (status) {
    case "Released":
      return base + "bg-[var(--status-success)]/15 border-[var(--status-success)] text-[var(--status-success)]";
    case "Finished":
      return base + "bg-[var(--status-info)]/15 border-[var(--status-info)] text-[var(--status-info)]";
    case "In Development":
      return base + "bg-[var(--accent-amber)]/15 border-[var(--accent-amber)] text-[var(--accent-amber)]";
  }
};

interface ProjectsPageProps {
  onBack: () => void;
  onViewProject: (projectId: string) => void;
}

export function ProjectsPage({ onBack, onViewProject }: ProjectsPageProps) {
  const [filterOpen,      setFilterOpen]      = useState(false);
  const [activeTags,      setActiveTags]      = useState<Set<string>>(new Set());
  const [activeStatuses,  setActiveStatuses]  = useState<Set<ProjectStatus>>(new Set());
  const [sortAsc,         setSortAsc]         = useState(false); // default: newest first

  const panelRef = useRef<HTMLDivElement>(null);

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });

  const toggleStatus = (status: ProjectStatus) =>
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      next.has(status) ? next.delete(status) : next.add(status);
      return next;
    });

  const clearAll = () => {
    setActiveTags(new Set());
    setActiveStatuses(new Set());
    setSortAsc(false);
  };

  const hasActiveFilters = activeTags.size > 0 || activeStatuses.size > 0;

  const displayed = useMemo(() => {
    let list = [...PROJECT_REGISTRY];

    if (activeTags.size > 0)
      list = list.filter((p) => p.tags.some((t) => activeTags.has(t)));

    if (activeStatuses.size > 0)
      list = list.filter((p) => activeStatuses.has(p.status));

    list.sort((a, b) =>
      sortAsc
        ? Number(a.year) - Number(b.year)
        : Number(b.year) - Number(a.year)
    );

    return list;
  }, [activeTags, activeStatuses, sortAsc]);

  return (
    <div className="min-h-screen bg-background pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <a
          href="#/"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
            e.preventDefault();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </a>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
            All Projects
          </h1>
          <div className="flex items-end justify-between gap-4">
            <p className="text-base sm:text-lg text-muted-foreground">
              A comprehensive collection of my game development work
            </p>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200
                ${filterOpen
                  ? "bg-accent-amber/15 border-accent-amber text-accent-amber"
                  : "bg-card border-border text-muted-foreground hover:border-accent-amber/60 hover:text-foreground"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-amber text-[10px] font-bold text-background">
                  {activeTags.size + activeStatuses.size}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Filter panel ─────────────────────────────────────────────────── */}
        <div
          ref={panelRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: filterOpen ? "600px" : "0px",
            opacity:   filterOpen ? 1 : 0,
          }}
        >
          <div className="bg-card border border-border rounded-xl p-6 mb-12">

            {/* Sort */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sort by Date
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortAsc(false)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150
                    ${!sortAsc
                      ? "bg-accent-amber/15 border-accent-amber text-accent-amber"
                      : "bg-transparent border-border text-muted-foreground hover:border-accent-amber/50 hover:text-foreground"
                    }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => setSortAsc(true)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150
                    ${sortAsc
                      ? "bg-accent-amber/15 border-accent-amber text-accent-amber"
                      : "bg-transparent border-border text-muted-foreground hover:border-accent-amber/50 hover:text-foreground"
                    }`}
                >
                  Oldest First
                </button>
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </div>
            </div>

            <div className="border-t border-border my-4" />

            {/* Status badges */}
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                Status
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((status) => {
                  const active = activeStatuses.has(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${getStatusColor(status, active)}`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border my-4" />

            {/* Tags */}
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => {
                  const active = activeTags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-all duration-150
                        ${active
                          ? "bg-accent-amber/20 border-accent-amber text-accent-amber"
                          : "bg-transparent border-border text-muted-foreground opacity-50 hover:opacity-100 hover:border-accent-amber/50 hover:text-foreground"
                        }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Project grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.length > 0 ? (
            displayed.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onViewProject={onViewProject}
                showStatus={true}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No projects match the current filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
