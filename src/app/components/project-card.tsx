import { ArrowRight, Calendar, Tag } from "lucide-react";
import { ProjectRecord } from "../data/projects";

interface ProjectCardProps {
  project: ProjectRecord;
  onViewProject: (slug: string) => void;
  showStatus?: boolean;
  showViewLink?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Released":
      return "bg-[#2F7A5E]/20 border-[#2F7A5E]/40 text-[#2F7A5E]";
    case "In Development":
      return "bg-[#C07A2C]/20 border-[#C07A2C]/40 text-[#C07A2C]";
    default:
      return "bg-[#2F6DAA]/20 border-[#2F6DAA]/40 text-[#2F6DAA]";
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
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
          return;
        }
        event.preventDefault();
        onViewProject(project.slug);
      }}
    >
      <div className="bg-[#1C1A1F] rounded-lg overflow-hidden border border-[#26242A] hover:border-[#D47A2B] transition-all duration-300 h-full flex flex-col">
        <div className="relative w-full aspect-square overflow-hidden flex-shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A1F] to-transparent opacity-60"></div>
          {showStatus && project.status !== "N/A" && (
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
          <div className="flex items-center gap-2 text-sm text-[#C9C6C0] mb-3">
            <Calendar className="w-4 h-4" />
            {project.year}
          </div>

          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#D47A2B] transition-colors">
            {project.title}
          </h3>

          <p className="text-[#C9C6C0] mb-4 line-clamp-2 flex-1">
            {project.shortDescription !== "N/A"
              ? project.shortDescription
              : project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#D47A2B]/10 border border-[#D47A2B]/30 rounded text-xs text-[#D47A2B] h-fit"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {showViewLink && (
            <div className="flex items-center gap-2 text-[#D47A2B] group-hover:gap-3 transition-all mt-auto">
              <span>View Project</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}