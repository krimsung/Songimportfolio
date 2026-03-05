import { Code2, Palette, Box, Gamepad2, Layers, Sparkles } from "lucide-react";

const skills = [
  {
    icon: Code2,
    category: "Programming",
    items: ["C#", "C++", "Java", "Python", "Blueprint Scripting"],
  },
  {
    icon: Gamepad2,
    category: "Game Engines",
    items: ["Unreal Engine", "Unity", "GameMaker", "Source"],
  },
  {
    icon: Palette,
    category: "2D/3D Art",
    items: ["Blender", "Maya", "Photoshop", "ZBrush", "Substance Painter"],
  },
  {
    icon: Box,
    category: "Technical Art",
    items: ["Niagara Particle System", "UE5 Shader Graph", "Unity VFX Graph", "Unity Shader Graph", "Model Rigging"],
  },
  {
    icon: Layers,
    category: "Design",
    items: ["System Design", "Level Design", "Game Design", "UI/UX", "Prototyping"],
  },
  {
    icon: Sparkles,
    category: "Specializations",
    items: ["Graphic Design", "Team Collaboration", "Rapid Prototyping", "QA Testing"],
  },
] as const;

export function TechnicalExperience() {
  return (
    /*
      IMPORTANT: Do NOT use justify-center on this section.
      On mobile, 6 stacked cards exceed the panel height. justify-center splits
      the overflow above AND below — the top half is clipped and unreachable by scroll.
      Instead: justify-start (top-aligned) so all content flows downward and is
      reachable by the parent panel's overflow-y-auto scroll.
      On desktop the content fits comfortably so the py padding provides natural
      visual centering without needing flex centering.
    */
    <section className="w-full min-h-full flex flex-col justify-start lg:justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-6">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 text-center">
          TECHNICAL EXPERIENCE
        </h2>

        {/*
          Grid:
          - Mobile (1 col): auto-height compact cards, scrollable.
          - Tablet (2 col): 3 rows of 2 cards.
          - Desktop (3 col): 2 rows of 3 cards, lg:aspect-square for elegant square tiles.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:max-w-3xl lg:mx-auto">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-4 md:p-5 border border-border group transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent-amber/10 border border-accent-amber/30 rounded-lg flex-shrink-0">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-amber" />
                  </div>
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground leading-tight">{skill.category}</h3>
                </div>
                <ul className="space-y-1.5 md:space-y-2 flex-1">
                  {skill.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-muted-foreground flex items-center gap-2 text-sm md:text-base"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-amber/70 flex-shrink-0"></span>
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
