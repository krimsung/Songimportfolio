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
      return "bg-[var(--status-success)]/15 border-[var(--status-success)]/35 text-[var(--status-success)]";
    case "Finished":
      return "bg-[var(--status-info)]/15 border-[var(--status-info)]/35 text-[var(--status-info)]";
    case "In Development":
      return "bg-[var(--accent-amber)]/15 border-[var(--accent-amber)]/35 text-[var(--accent-amber)]";
    default:
      return "bg-[var(--status-info)]/15 border-[var(--status-info)]/35 text-[var(--status-info)]";
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
      className="group cursor-pointer h-full"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        onViewProject(project.slug);
      }}
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50">
        <div className="relative w-full aspect-square overflow-hidden flex-shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
          {project.tags.includes("Source") && (
            <div className="absolute top-4 left-4">
              <img
                src={sourceLogo}
                alt="Source Engine"
                className="h-8 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}
          {showStatus && (
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            {project.year}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent-amber transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber h-fit"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {showViewLink && (
            <div className="flex items-center justify-end gap-2 text-accent-amber mt-auto">
              <span>View Project</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}