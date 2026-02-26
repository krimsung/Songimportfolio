import { ArrowLeft, Calendar, Tag, ExternalLink, Github } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import { projectsBySlug } from "../../data/projects";
import { ProjectGallery } from "./project-gallery";

interface ProjectDetailProps {
  projectId: string;
  onBack?: () => void;
  backLabel?: string;
}

export function ProjectDetail({ projectId, onBack, backLabel }: ProjectDetailProps) {
  const project = projectsBySlug[projectId];

  if (!project) {
    return null;
  }

  const markdownComponents: Components = {
    p: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 text-muted-foreground marker:text-accent">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    )
  };

  return (
    <div className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <a
          href="#/"
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
              return;
            }
            event.preventDefault();
            onBack?.();
          }}
          className="inline-flex items-center gap-2 text-accent-lime hover:text-accent-lime/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>{backLabel ?? "Back to Home"}</span>
        </a>

        {/* Header */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative h-96">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                {project.year}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-lime/10 border border-accent-lime/25 rounded text-xs text-accent-lime"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Project Overview</h2>
              <ReactMarkdown components={markdownComponents}>
                {project.description}
              </ReactMarkdown>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Challenges & Solutions</h2>
              <div className="space-y-4">
                <ReactMarkdown components={markdownComponents}>
                  {project.challenges}
                </ReactMarkdown>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">Outcome</h3>
              <ReactMarkdown components={markdownComponents}>
                {project.process}
              </ReactMarkdown>
            </div>

            {/* Project Gallery */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <ProjectGallery images={project.galleryImages} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground font-medium">Platform:</span>
                  <span className="text-foreground ml-2">{project.platform || "TBA"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Engine:</span>
                  <span className="text-foreground ml-2">{project.engine || "TBA"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Team Size:</span>
                  <span className="text-foreground ml-2">{project.teamSize || "TBA"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Role:</span>
                  <span className="text-foreground ml-2">{project.role || "TBA"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Language:</span>
                  <span className="text-foreground ml-2">{project.language || "TBA"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Duration:</span>
                  <span className="text-foreground ml-2">{project.duration || "TBA"}</span>
                </div>
              </div>
            </div>

            {(project.liveProjectUrl || project.sourceCodeUrl) && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.liveProjectUrl && (
                    <a
                      href={project.liveProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Live Project</span>
                    </a>
                  )}
                  {project.sourceCodeUrl && (
                    <a
                      href={project.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
