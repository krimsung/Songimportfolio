import { ArrowRight } from "lucide-react";
import { PROJECT_REGISTRY } from "../../data/projectRegistry";
import { ProjectCard } from "./project-card";

const featuredProjects = PROJECT_REGISTRY.slice(0, 3);

interface ProjectsSectionProps {
  onViewProject: (projectId: string) => void;
  onViewAllProjects: () => void;
}

export function ProjectsSection({ onViewProject, onViewAllProjects }: ProjectsSectionProps) {

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onViewProject={onViewProject}
              showStatus={true}
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
            className="btn-amber group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}
