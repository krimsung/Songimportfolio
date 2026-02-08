import { ArrowRight, Calendar, Tag } from "lucide-react";
import { idToSlug } from "../utils/projectMapping";

export function ProjectsSection() {
  const projects = [
    {
      id: "project-1",
      title: "Ethereal Realms",
      description: "Fantasy RPG featuring immersive world-building and dynamic combat systems",
      image: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unreal Engine", "Character Design", "Environment Art"],
      date: "2024"
    },
    {
      id: "project-2",
      title: "Nexus Station",
      description: "Sci-fi exploration game set in a mysterious space station",
      image: "https://images.unsplash.com/photo-1727718296494-47d1e4fd41d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBlbnZpcm9ubWVudCUyMGNvbmNlcHR8ZW58MXx8fHwxNzcwMTU3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unity", "Level Design", "VFX"],
      date: "2024"
    },
    {
      id: "project-3",
      title: "Pixel Legends",
      description: "Retro-inspired action platformer with modern gameplay mechanics",
      image: "https://images.unsplash.com/photo-1668119065888-eb6b7a98a84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc3MDEwMTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["2D Art", "Animation", "Game Design"],
      date: "2023"
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1A1F] mb-12 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`#/projects/${idToSlug[project.id] ?? ""}`}
              className="group block"
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
                    {project.date}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#D47A2B] transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-[#C9C6C0] mb-4 line-clamp-2">
                    {project.description}
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
