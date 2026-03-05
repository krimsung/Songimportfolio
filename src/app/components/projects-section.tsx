import { ArrowRight } from "lucide-react";
import { PROJECT_REGISTRY } from "../../data/projectRegistry";
import { ProjectCard } from "./project-card";

const FEATURED_SLUGS = ["ghost-ctrl", "final-shot", "insomniac"];
const featuredProjects = FEATURED_SLUGS.map((slug) => PROJECT_REGISTRY.find((p) => p.slug === slug)!).filter(Boolean);

interface ProjectsSectionProps {
  onViewProject: (projectId: string) => void;
  onViewAllProjects: () => void;
}

export function ProjectsSection({ onViewProject, onViewAllProjects }: ProjectsSectionProps) {
  return (
    /*
      section: h-full fills the carousel panel.
      flex flex-col justify-center vertically centers the block.
      On mobile the horizontal cards are short enough to fit with room to spare.
    */
    <section className="w-full h-full flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 text-center">
          Featured Projects
        </h2>

        {/*
          Grid:
          - Mobile: 1-col, horizontal project cards (short height, scrollable if needed).
          - md: 3-col with vertical cards (thumbnail on top, text below).
          gap tightened on mobile.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onViewProject={onViewProject}
              showStatus={true}
            />
          ))}
        </div>

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
