import { ArrowLeft, Calendar, Tag, ExternalLink, Github } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import { projectsBySlug } from "../data/projects";
import { ProjectGallery } from "./project-gallery";

interface ProjectDetailProps {
  projectId: string;
  onBack?: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const project = projectsBySlug[projectId];

  if (!project) {
    return null;
  }

  const markdownComponents: Components = {
    p: ({ children }) => (
      <p className="text-[#C9C6C0] leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 text-[#C9C6C0] marker:text-[#D47A2B]">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 text-[#C9C6C0] marker:text-[#D47A2B]">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    )
  };

  return (
    <div className="min-h-screen bg-[#F3F2F0] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
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
          className="inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>

        {/* Header */}
        <div className="bg-[#1C1A1F] rounded-lg overflow-hidden border border-[#26242A] mb-8">
          <div className="relative h-96">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A1F] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 text-sm text-[#C9C6C0] mb-3">
                <Calendar className="w-4 h-4" />
                {project.year}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#D47A2B]/10 border border-[#D47A2B]/30 rounded text-sm text-[#D47A2B]"
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
            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
              <ReactMarkdown components={markdownComponents}>
                {project.description}
              </ReactMarkdown>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-4">My Role</h2>
              <p className="text-[#D47A2B] font-semibold">{project.role}</p>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-4">Challenges & Solutions</h2>
              <div className="space-y-4">
                <ReactMarkdown components={markdownComponents}>
                  {project.challenges}
                </ReactMarkdown>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 mt-6">Outcome</h3>
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
            <div className="bg-[#1C1A1F] rounded-lg p-6 border border-[#26242A]">
              <h3 className="text-xl font-bold text-white mb-4">Project Links</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Live Project</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              </div>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-6 border border-[#26242A]">
              <h3 className="text-xl font-bold text-white mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#D47A2B]/10 border border-[#D47A2B]/30 rounded text-sm text-[#D47A2B]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
