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
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Technical Experience
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-6 border border-border group transition duration-100 hover:border-accent-violet hover:bg-accent-violet/5 hover:shadow-lg hover:shadow-accent-violet/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent-violet/10 border border-accent-violet/30 rounded-lg">
                    <Icon className="w-6 h-6 text-accent-violet" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{skill.category}</h3>
                </div>
                <ul className="space-y-2">
                  {skill.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-violet/70"></span>
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
