import headshot from "../../media/images/portfolio-headshot.png";

export function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Profile Image with Caption */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex-1 w-full md:w-64 overflow-hidden rounded-lg border border-[#26242A]">
              <img
                src={headshot}
                alt="Portfolio headshot"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <p className="text-[#1C1A1F] text-center italic mt-3 w-full md:w-64">
              Picture taken at GDC 2024
            </p>
          </div>
          
          {/* About Me Card */}
          <div className="bg-[#1C1A1F] rounded-lg p-8 md:p-12 border border-[#26242A] flex-1">
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
      </div>
    </section>
  );
}
