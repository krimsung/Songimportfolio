import { ArrowLeft } from "lucide-react";
import { projects } from "../../data/projects";
import { ProjectCard } from "./project-card";

interface ProjectsPageProps {
  onBack: () => void;
  onViewProject: (projectId: string) => void;
}

export function ProjectsPage({ onBack, onViewProject }: ProjectsPageProps) {

  return (
    <div className="min-h-screen bg-background pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            All Projects
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive collection of my game development work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onViewProject={onViewProject}
              showStatus={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
