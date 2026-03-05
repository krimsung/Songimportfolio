import { ArrowRight, Calendar, Tag } from "lucide-react";
import { ProjectEntry } from "../../data/projectRegistry";
import sourceLogo from "../../media/SourceLogo.webp";

interface ProjectCardProps {
  project: ProjectEntry;
  onViewProject: (slug: string) => void;
  showStatus?: boolean;
  showViewLink?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Released":
      return "bg-[var(--status-success)] border-[var(--status-success)] text-white";
    case "Finished":
      return "bg-[var(--status-info)] border-[var(--status-info)] text-white";
    case "In Development":
      return "bg-[var(--accent-amber)] border-[var(--accent-amber)] text-white";
    default:
      return "bg-[var(--status-info)] border-[var(--status-info)] text-white";
  }
};

export function ProjectCard({
  project,
  onViewProject,
  showStatus = false,
  showViewLink = false,
}: ProjectCardProps) {
  return (
    <a
      key={project.slug}
      href={`#/projects/${project.slug}`}
      className="group cursor-pointer h-48 sm:h-44 md:h-full"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        onViewProject(project.slug);
      }}
    >
      {/*
        Layout strategy:
        - Mobile (<md): horizontal flex-row — thumbnail is a fixed square on the left,
          text content on the right. Compact height (~120–150px) fits multiple cards.
        - Tablet+ (md+): vertical flex-col — full-width aspect-square thumbnail on top,
          text content below. Classic card layout.
      */}
      <div className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-row md:flex-col transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50">

        {/* Thumbnail */}
        <div className="relative w-28 flex-shrink-0 md:w-full md:aspect-square overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>

          {project.tags.includes("Source") && (
            <div className="absolute bottom-2 left-2 md:top-4 md:bottom-auto md:left-4">
              <img
                src={sourceLogo}
                alt="Source Engine"
                className="h-5 md:h-8 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}

          {showStatus && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <span
                className={`inline-flex px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="p-3 md:p-6 flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-1 md:mb-3">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            {project.year}
          </div>

          <h3 className="text-base md:text-xl font-semibold text-foreground mb-1 md:mb-2 group-hover:text-accent-amber transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 flex-1">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1 md:gap-2 md:mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber h-fit"
              >
                <Tag className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                {tag}
              </span>
            ))}
          </div>

          {showViewLink && (
            <div className="hidden md:flex items-center justify-end gap-2 text-accent-amber mt-auto">
              <span>View Project</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
