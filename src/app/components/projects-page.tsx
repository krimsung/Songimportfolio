import { ArrowLeft } from "lucide-react";
import { projects } from "../data/projects";
import { ProjectCard } from "./project-card";

interface ProjectsPageProps {
  onBack: () => void;
  onViewProject: (projectId: string) => void;
}

export function ProjectsPage({ onBack, onViewProject }: ProjectsPageProps) {
  const allProjects = projects;

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
