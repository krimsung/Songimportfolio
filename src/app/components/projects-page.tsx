import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { idToSlug } from "../utils/projectMapping";

export function ProjectsPage() {
  const allProjects = [
    {
      id: "project-1",
      title: "Ethereal Realms",
      description: "Fantasy RPG featuring immersive world-building and dynamic combat systems with detailed character customization",
      image: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unreal Engine", "Character Design", "Environment Art"],
      date: "2024",
      status: "Released"
    },
    {
      id: "project-2",
      title: "Nexus Station",
      description: "Sci-fi exploration game set in a mysterious space station with atmospheric storytelling",
      image: "https://images.unsplash.com/photo-1727718296494-47d1e4fd41d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBlbnZpcm9ubWVudCUyMGNvbmNlcHR8ZW58MXx8fHwxNzcwMTU3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unity", "Level Design", "VFX"],
      date: "2024",
      status: "In Development"
    },
    {
      id: "project-3",
      title: "Pixel Legends",
      description: "Retro-inspired action platformer with modern gameplay mechanics and responsive controls",
      image: "https://images.unsplash.com/photo-1668119065888-eb6b7a98a84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc3MDEwMTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["2D Art", "Animation", "Game Design"],
      date: "2023",
      status: "Released"
    },
    {
      id: "project-4",
      title: "Shadow Protocol",
      description: "Stealth action game with innovative AI systems and dynamic level generation",
      image: "https://images.unsplash.com/photo-1760802185763-fe4999466b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGdhbWUlMjBhc3NldHxlbnwxfHx8fDE3NzAxNTcwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unreal Engine", "AI Programming", "Level Design"],
      date: "2023",
      status: "Released"
    },
    {
      id: "project-5",
      title: "Mystic Chronicles",
      description: "Story-driven adventure game with branching narratives and beautiful hand-painted art",
      image: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydGZvbGlvfGVufDF8fHx8MTc3MDE1NzAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unity", "Narrative Design", "2D Art"],
      date: "2023",
      status: "Released"
    },
    {
      id: "project-6",
      title: "Cyber Nexus",
      description: "Cyberpunk-themed multiplayer arena with fast-paced combat and neon aesthetics",
      image: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Unreal Engine", "Multiplayer", "VFX"],
      date: "2022",
      status: "Released"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released":
        return "bg-[#2F7A5E]/20 border-[#2F7A5E]/40 text-[#2F7A5E]";
      case "In Development":
        return "bg-[#C07A2C]/20 border-[#C07A2C]/40 text-[#C07A2C]";
      default:
        return "bg-[#2F6DAA]/20 border-[#2F6DAA]/40 text-[#2F6DAA]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2F0] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <a
          href="#/"
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
            <a
              key={project.id}
              href={`#/projects/${idToSlug[project.id] ?? ""}`}
              className="group block"
            >
              <div className="bg-[#1C1A1F] rounded-lg overflow-hidden border border-[#26242A] hover:border-[#D47A2B] transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A1F] to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-[#C9C6C0] mb-3">
                    <Calendar className="w-4 h-4" />
                    {project.date}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#D47A2B] transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-[#C9C6C0] mb-4 line-clamp-3 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
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
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
