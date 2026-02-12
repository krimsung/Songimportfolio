import { Code2, Palette, Box, Gamepad2, Layers, Sparkles } from "lucide-react";

export function TechnicalExperience() {
  const skills = [
    {
      icon: Code2,
      category: "Programming",
      items: ["C#", "C++", "Java", "Python", "Blueprint Scripting"]
    },
    {
      icon: Gamepad2,
      category: "Game Engines",
      items: ["Unreal Engine", "Unity", "GameMaker", "Source"]
    },
    {
      icon: Palette,
      category: "2D/3D Art",
      items: ["Blender", "Maya", "Photoshop", "ZBrush", "Substance Painter"]
    },
    {
      icon: Box,
      category: "Technical Art",
      items: ["Niagara Particle System", "Unreal Engine Shader Graph", "Unity VFX Graph", "Unity Shader Graph", "Model Rigging"]
    },
    {
      icon: Layers,
      category: "Design",
      items: ["System Design", "Level Design", "Game Design", "UI/UX", "Prototyping"]
    },
    {
      icon: Sparkles,
      category: "Specializations",
      items: ["Graphic Design", "Team Collaboration", "Rapid Prototyping", "QA Testing"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#ECE9E5]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1A1F] mb-12 text-center">
          Technical Experience
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="bg-[#1C1A1F] rounded-lg p-6 border border-[#26242A] hover:border-[#D47A2B] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#D47A2B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{skill.category}</h3>
                </div>
                <ul className="space-y-2">
                  {skill.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-[#C9C6C0] flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#D47A2B]"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
