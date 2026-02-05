import { ArrowLeft, Calendar, Tag, ExternalLink, Github } from "lucide-react";

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  // Project data can be fetched from media folder or CSVs
  const projectData: Record<string, any> = {
    "project-1": {
      title: "Ethereal Realms",
      date: "2024",
      tags: ["Unreal Engine", "Character Design", "Environment Art", "C++", "Blueprint"],
      // Replace with actual local image paths
      image: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "An immersive fantasy RPG that transports players into a world of magic and adventure. Features include dynamic combat systems, intricate character customization, and a rich narrative experience.",
      role: "Lead Character Artist & Technical Designer",
      responsibilities: [
        "Created 20+ unique character models with detailed textures and animations",
        "Developed custom shaders for magical effects and particle systems",
        "Implemented character customization system with 500+ options",
        "Designed and prototyped combat mechanics in Blueprint",
        "Optimized assets for performance across multiple platforms"
      ],
      challenges: "The main challenge was balancing artistic fidelity with performance requirements. We solved this by implementing a dynamic LOD system and optimizing shaders.",
      outcome: "Successfully launched with 95% positive reviews, praised for visual quality and smooth performance."
    },
    "project-2": {
      title: "Nexus Station",
      date: "2024",
      tags: ["Unity", "Level Design", "VFX", "C#", "Shader Graph"],
      // Replace with actual local image paths
      image: "https://images.unsplash.com/photo-1727718296494-47d1e4fd41d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBlbnZpcm9ubWVudCUyMGNvbmNlcHR8ZW58MXx8fHwxNzcwMTU3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "A atmospheric sci-fi exploration game set aboard a mysterious space station. Players uncover the station's dark secrets through environmental storytelling and puzzle-solving.",
      role: "Environment Artist & Level Designer",
      responsibilities: [
        "Designed and built 15+ detailed environment sections",
        "Created custom VFX for holographic interfaces and atmospheric effects",
        "Implemented dynamic lighting system for mood and gameplay",
        "Developed environmental puzzle mechanics",
        "Collaborated with narrative team to integrate story elements into level design"
      ],
      challenges: "Creating a cohesive sci-fi aesthetic while maintaining visual variety across different station sections required extensive iteration and prototyping.",
      outcome: "Nominated for Best Art Direction at Indie Game Awards 2024."
    },
    "project-3": {
      title: "Pixel Legends",
      date: "2023",
      tags: ["2D Art", "Animation", "Game Design", "Unity", "Aseprite"],
      // Replace with actual local image paths
      image: "https://images.unsplash.com/photo-1668119065888-eb6b7a98a84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc3MDEwMTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      overview: "A retro-inspired action platformer that combines classic pixel art aesthetics with modern gameplay mechanics and responsive controls.",
      role: "Lead Artist & Game Designer",
      responsibilities: [
        "Created all 2D art assets including characters, environments, and UI",
        "Animated 10+ characters with fluid movement cycles",
        "Designed and balanced 30+ levels with increasing difficulty",
        "Implemented responsive player controls and game feel mechanics",
        "Composed pixel art promotional materials and game art"
      ],
      challenges: "Balancing nostalgia with modern expectations while maintaining a cohesive visual style throughout the game.",
      outcome: "Successfully funded on Kickstarter with 150% of goal, released to positive reception."
    }
  };

  const project = projectData[projectId] || projectData["project-1"];

  return (
    <div className="min-h-screen bg-[#F3F2F0] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => { window.location.hash = "#/"; onBack(); }}
          className="inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

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
                {project.date}
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
              <p className="text-[#C9C6C0] leading-relaxed">
                {project.overview}
              </p>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-4">My Role</h2>
              <p className="text-[#D47A2B] font-semibold mb-4">{project.role}</p>
              <h3 className="text-lg font-semibold text-white mb-3">Key Responsibilities:</h3>
              <ul className="space-y-2">
                {project.responsibilities.map((item: string, index: number) => (
                  <li key={index} className="text-[#C9C6C0] flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D47A2B] mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-4">Challenges & Solutions</h2>
              <p className="text-[#C9C6C0] leading-relaxed mb-4">
                {project.challenges}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">Outcome</h3>
              <p className="text-[#C9C6C0] leading-relaxed">
                {project.outcome}
              </p>
            </div>
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
