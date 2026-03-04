/**
 * HeroSection — placeholder slide inside the vertical carousel.
 *
 * The visible hero content (SONG IM, role carousel, scroll indicator) is
 * rendered as a separate overlay in HomePageSlider so that it sits outside the
 * `transform`-based carousel container.  A single layer with orange-coloured
 * elements and `mix-blend-mode: difference` produces orange-tinted negative
 * colours that react to the terrain beneath.
 * SONG IM itself uses white + mix-blend-difference for a full negative inversion.
 */
export function HeroSection() {
  return <section className="w-full h-full" />;
}

// ─── Hero overlay (rendered outside the carousel transform) ─────────────────

const ROLES = [
  "PRODUCER",
  "GAMEPLAY DESIGNER",
  "LEVEL DESIGNER",
  "PROGRAMMER",
  "TECHNICAL ARTIST",
  "3D ARTIST",
  "UX/UI DESIGNER",
];

/** Accent amber matching --accent-primary (dark mode) */
const ACCENT = "#F5A623";

export function HeroOverlay({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none mix-blend-difference"
      style={{
        top: "4rem",
        height: "calc(100vh - 4rem)",
        transform: `translateY(-${activeIndex * 100}%)`,
        transition: "transform 500ms ease-out",
      }}
    >
      {/* Hero Text */}
      <div className="text-center px-4">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight mix-blend-difference"
          style={{ color: "#FFFFFF" }}
        >
          SONG IM
        </h1>
        <div className="text-xl md:text-3xl max-w-2xl mx-auto h-32 flex items-center justify-center overflow-hidden relative">
          <div className="relative w-full h-full flex justify-center items-center">
            {ROLES.map((role, index) => (
              <div
                key={role}
                className="carousel-item flex items-center justify-center w-full"
                style={{ animationDelay: `${(index - 1) * 3}s` }}
              >
                <span
                  className="text-2xl md:text-3xl font-semibold whitespace-nowrap"
                  style={{ color: ACCENT }}
                >
                  {role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12" style={{ backgroundColor: ACCENT }} />
          <span className="text-sm uppercase tracking-wider" style={{ color: ACCENT }}>
            Scroll to explore
          </span>
          <div className="h-px w-12" style={{ backgroundColor: ACCENT }} />
        </div>
        <div
          className="w-6 h-10 border-2 rounded-full p-1 animate-bounce"
          style={{ borderColor: ACCENT }}
        >
          <div className="w-1 h-2 rounded-full mx-auto" style={{ backgroundColor: ACCENT }} />
        </div>
      </div>
    </div>
  );
}
