import { ArrowRight } from "lucide-react";
import { featuredProjects } from "../data/projects";
import { ProjectCard } from "./project-card";

interface ProjectsSectionProps {
  onViewProject: (projectId: string) => void;
  onViewAllProjects: () => void;
}

export function ProjectsSection({ onViewProject, onViewAllProjects }: ProjectsSectionProps) {

  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1A1F] mb-12 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onViewProject={onViewProject}
              showViewLink={true}
            />
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
