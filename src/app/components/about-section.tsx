export function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1C1A1F] rounded-lg p-8 md:p-12 border border-[#26242A]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About Me</h2>
          <div className="space-y-4 text-[#C9C6C0]">
            <p className="text-lg leading-relaxed">
              I am a game developer with 5+ years of experience and a B.S. in Games from the University of Utah's EAE program (2025).
              I specialize in Unreal Engine and my skills span programming, level and game design, and technical art. My creative and technical background gives me sharp attention
              to detail and helps me learn new pipelines quickly and efficiently.
            </p>
            <p className="text-lg leading-relaxed">
              My journey into game development started at age 12, building Source engine levels using Valve's in-house level editor.
              That spark grew into creating mods across multiple games, developing my own OpenGL graphics renderer, and prototyping extensively in Unity.
              This early hands-on mix of design, engineering, and experimentation fundamentally shaped how I build games today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
