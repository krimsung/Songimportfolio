import { ArrowRight, Calendar, Tag } from "lucide-react";
import { featuredProjects } from "../data/projects";

interface ProjectsSectionProps {
  onViewProject: (projectId: string) => void;
  onViewAllProjects: () => void;
}

export function ProjectsSection({ onViewProject, onViewAllProjects }: ProjectsSectionProps) {
  const projects = featuredProjects;

  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1A1F] mb-12 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
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
              <div className="bg-[#1C1A1F] rounded-lg overflow-hidden border border-[#26242A] hover:border-[#D47A2B] transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A1F] to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-[#C9C6C0] mb-3">
                    <Calendar className="w-4 h-4" />
                    {project.year}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#D47A2B] transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-[#C9C6C0] mb-4 line-clamp-2">
                    {project.shortDescription !== "N/A"
                      ? project.shortDescription
                      : project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  
                  <div className="flex items-center gap-2 text-[#D47A2B] group-hover:gap-3 transition-all">
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Projects Link */}
        <div className="flex justify-end">
          <a
            href="#/projects"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                return;
              }
              event.preventDefault();
              onViewAllProjects();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D47A2B] text-white rounded-lg hover:bg-[#C07A2C] transition-colors group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
