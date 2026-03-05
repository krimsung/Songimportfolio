import { useMemo } from "react";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
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

  const markdownComponents: Components = useMemo(() => ({
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
    ),
  }), []);

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Back Button */}
        <a
          href="#/"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
            e.preventDefault();
            onBack?.();
          }}
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>{backLabel ?? "Back to Home"}</span>
        </a>

        {/* Header */}
        <div className="bg-card rounded-lg overflow-hidden border border-border mb-8">
          <div className="relative h-48 sm:h-64 md:h-96">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 md:mb-3">
                <Calendar className="w-4 h-4" />
                {project.year}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-amber/10 border border-accent-amber/25 rounded text-xs text-accent-amber"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Project Description</h2>
              <ReactMarkdown components={markdownComponents}>
                {project.description}
              </ReactMarkdown>
            </div>

            {/* Challenges */}
            {project.challenges && project.challenges !== "N/A" && (
              <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Challenges</h2>
                <ReactMarkdown components={markdownComponents}>
                  {project.challenges}
                </ReactMarkdown>
              </div>
            )}

            {/* Process */}
            {project.process && project.process !== "N/A" && (
              <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Process</h2>
                <ReactMarkdown components={markdownComponents}>
                  {project.process}
                </ReactMarkdown>
              </div>
            )}

            {/* Custom Section 1 */}
            {project.custom1Header && project.custom1Body && (
              <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{project.custom1Header}</h2>
                <ReactMarkdown components={markdownComponents}>
                  {project.custom1Body}
                </ReactMarkdown>
              </div>
            )}

            {/* Custom Section 2 */}
            {project.custom2Header && project.custom2Body && (
              <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{project.custom2Header}</h2>
                <ReactMarkdown components={markdownComponents}>
                  {project.custom2Body}
                </ReactMarkdown>
              </div>
            )}

            {/* Project Gallery */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <ProjectGallery images={project.galleryImages} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-5 sm:p-6 border border-border">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Details</h3>
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

            {project.liveProjectUrl && (
              <div className="bg-card rounded-lg p-5 sm:p-6 border border-border">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Project Links</h3>
                <div className="space-y-3">
                  <a
                    href={project.liveProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Live Project</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
