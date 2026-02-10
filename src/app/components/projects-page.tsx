import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { projects } from "../data/projects";

interface ProjectsPageProps {
  onBack: () => void;
  onViewProject: (projectId: string) => void;
}

export function ProjectsPage({ onBack, onViewProject }: ProjectsPageProps) {
  const allProjects = projects;

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

  return (
    <div className="min-h-screen bg-[#F3F2F0] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <a
          href="#/"
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
              return;
            }
            event.preventDefault();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C1A1F] mb-4">
            All Projects
          </h1>
          <p className="text-lg text-[#7E7A75]">
            A comprehensive collection of my game development work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project) => (
            <a
              key={project.slug}
              href={`#/projects/${project.slug}`}
              className="group cursor-pointer"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                  return;
                }
                event.preventDefault();
                onViewProject(project.slug);
              }}
            >
              <div className="bg-[#1C1A1F] rounded-lg overflow-hidden border border-[#26242A] hover:border-[#D47A2B] transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A1F] to-transparent opacity-60"></div>
                  {project.status !== "N/A" && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-[#C9C6C0] mb-3">
                    <Calendar className="w-4 h-4" />
                    {project.year}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#D47A2B] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[#C9C6C0] mb-4 line-clamp-3 flex-1">
                    {project.shortDescription !== "N/A"
                      ? project.shortDescription
                      : project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#D47A2B]/10 border border-[#D47A2B]/30 rounded text-xs text-[#D47A2B]"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
