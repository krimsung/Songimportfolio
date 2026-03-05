import { UserRound } from "lucide-react";
import headshot from "../../media/portfolio-headshot.png";

export function AboutSection() {
  return (
    /*
      Layout:
      - section fills the full carousel panel height (h-full).
      - Inner flex column with py padding keeps content off the edges.
      - The content row (portrait + card) uses flex-1 so it expands to fill
        all vertical space between the top/bottom padding — portrait self-stretches
        to match the row height, giving it full utilization of the available space.
    */
    <section className="w-full h-full flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

        {/*
          Content row — no flex-1; sizes to content so the section stays truly centered
          without stretching the portrait to fill the full panel height.
          On mobile, stack vertically: portrait is a fixed compact height above the card.
          On md+, side-by-side with portrait capped by breakpoint-specific max dimensions.
        */}
        <div className="flex flex-col md:flex-row gap-4">

          {/*
            Portrait:
            - Mobile: full-width, fixed height (h-44 sm:h-56).
            - md:  w-56, max-h-64  (224×256 — fits tablet without overpowering)
            - lg:  w-64, max-h-80  (256×320)
            - xl:  w-72, max-h-96  (288×384)
            flex-shrink-0 prevents the portrait from collapsing when the card text grows.
          */}
          <div className="relative w-2/3 sm:w-1/2 h-auto aspect-square md:aspect-auto md:w-56 md:max-h-64 lg:w-64 lg:max-h-80 xl:w-72 xl:max-h-96 md:h-auto self-center md:self-auto flex-shrink-0 rounded-lg border border-accent-amber/30 transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 overflow-hidden">
            <img
              src={headshot}
              alt="Song Im headshot at GDC 2025"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              {...{ fetchpriority: "high" }}
            />
            <p className="absolute bottom-0 left-0 right-0 py-1.5 text-center italic text-xs font-semibold text-white/80 bg-black/40">
              Picture taken at GDC 2025
            </p>
          </div>

          {/* About Me Card — flex-1 takes remaining horizontal width */}
          <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border flex-1 flex flex-col transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-accent-amber/10 rounded-lg flex-shrink-0">
                <UserRound className="w-6 h-6 md:w-8 md:h-8 text-accent-amber" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">About Me</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-base sm:text-lg leading-relaxed">
                With 5+ years of experience and a B.S. in Games from the University of Utah's EAE program (2025), I specialize in Unreal Engine across programming, level and game design, and technical art. Starting at age 12 I started building Source engine levels, which grew into modding across multiple games, writing my own OpenGL graphics renderer, and prototyping in Unity.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
