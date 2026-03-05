import { ArrowRight, Calendar, Tag } from "lucide-react";
import { ProjectEntry } from "../../data/projectRegistry";
import sourceLogo from "../../media/SourceLogo.webp";

interface ProjectCardProps {
  project: ProjectEntry;
  onViewProject: (slug: string) => void;
  showStatus?: boolean;
  showViewLink?: boolean;
  listMode?: boolean;
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
  listMode = false,
}: ProjectCardProps) {
  return (
    <a
      key={project.slug}
      href={`#/projects/${project.slug}`}
      className={`group cursor-pointer ${listMode ? "h-36 sm:h-32" : "h-48 sm:h-44 md:h-full"}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        onViewProject(project.slug);
      }}
    >
      <div className={`bg-card rounded-lg overflow-hidden border border-border h-full flex flex-row transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 ${listMode ? "" : "md:flex-col"}`}>

        {/* Thumbnail */}
        <div className={`relative flex-shrink-0 overflow-hidden ${listMode ? "w-28 sm:w-36" : "w-28 md:w-full md:aspect-square"}`}>
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>

          {project.tags.includes("Source") && (
            <div className={`absolute bottom-2 left-2 ${listMode ? "" : "md:top-4 md:bottom-auto md:left-4"}`}>
              <img
                src={sourceLogo}
                alt="Source Engine"
                className={`h-5 w-auto object-contain drop-shadow-md ${listMode ? "" : "md:h-8"}`}
              />
            </div>
          )}

          {showStatus && (
            <div className={`absolute top-2 right-2 ${listMode ? "" : "md:top-4 md:right-4"}`}>
              <span
                className={`inline-flex rounded-full font-semibold border ${getStatusColor(project.status)} ${listMode ? "px-2 py-0.5 text-xs" : "px-2 py-0.5 md:px-3 md:py-1 text-xs"}`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className={`flex flex-col flex-1 min-w-0 ${listMode ? "p-3" : "p-3 md:p-6"}`}>
          <div className={`flex items-center gap-2 text-muted-foreground mb-1 ${listMode ? "text-xs" : "text-xs md:text-sm md:mb-3"}`}>
            <Calendar className={`flex-shrink-0 ${listMode ? "w-3 h-3" : "w-3 h-3 md:w-4 md:h-4"}`} />
            {project.year}
          </div>

          <h3 className={`font-semibold text-foreground mb-1 group-hover:text-accent-amber transition-colors leading-snug text-base ${listMode ? "" : "md:text-xl md:mb-2"}`}>
            {project.title}
          </h3>

          <p className={`text-muted-foreground line-clamp-2 ${listMode ? "text-xs mb-2 flex-1" : "text-xs md:text-sm mb-2 md:mb-4 md:h-[42px]"}`}>
            {project.shortDescription}
          </p>

          <div className={`flex flex-wrap overflow-hidden ${listMode ? "gap-1 pb-0" : "gap-1 md:gap-2 pb-3 md:pb-0 md:h-[64px]"}`}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber h-fit ${listMode ? "px-1.5 py-0.5" : "px-1.5 py-0.5 md:px-2 md:py-1"}`}
              >
                <Tag className={`flex-shrink-0 ${listMode ? "w-2.5 h-2.5" : "w-2.5 h-2.5 md:w-3 md:h-3"}`} />
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
