import { UserRound } from "lucide-react";
import headshot from "../../media/portfolio-headshot.png";

export function AboutSection() {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row gap-6 items-stretch">

          {/* Portrait */}
          <div className="relative w-full md:w-64 flex-shrink-0 self-stretch aspect-[3/4] md:aspect-auto rounded-lg border border-accent-cyan/30 transition duration-100 hover:border-accent-cyan hover:shadow-lg hover:shadow-accent-cyan/50 overflow-hidden">
            <img
              src={headshot}
              alt="Song Im headshot at GDC 2025"
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="eager"
              {...{ fetchpriority: "high" }}
            />
            <p className="absolute bottom-0 left-0 right-0 py-2 text-center italic text-xs font-semibold text-white/80">
              Picture taken at GDC 2025
            </p>
          </div>

          {/* About Me Card */}
          <div className="bg-card rounded-lg p-8 border border-border flex-1 transition duration-100 hover:border-accent-cyan hover:shadow-lg hover:shadow-accent-cyan/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-cyan/10 rounded-lg">
                <UserRound className="w-8 h-8 text-accent-cyan" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">About Me</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                With 5+ years of experience and a B.S. in Games from the University of Utah's EAE program (2025), I specialize in Unreal Engine across programming, level and game design, and technical art. Starting at age 12 I started building Source engine levels, which grew into modding across multiple games, writing my own OpenGL graphics renderer, and prototyping in Unity.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
