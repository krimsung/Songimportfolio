export function HeroSection() {
  const roles = [
    "PRODUCER",
    "GAMEPLAY DESIGNER",
    "LEVEL DESIGNER",
    "PROGRAMMER",
    "TECHNICAL ARTIST",
    "3D ARTIST",
    "UX/UI DESIGNER"
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Neon gradient wash — coral left, cyan right */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/30 via-transparent to-accent-cyan/20 animate-pulse"></div>
        </div>
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]" style={{
          backgroundImage: `radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight">
          SONG IM
        </h1>
        <div className="text-xl md:text-3xl max-w-2xl mx-auto h-32 flex items-center justify-center overflow-hidden relative">
          <div className="relative w-full h-full flex justify-center items-center">
            {roles.map((role, index) => (
              <div
                key={role}
                className="carousel-item flex items-center justify-center w-full"
                style={{ animationDelay: `${(index - 1) * 3}s` }}
              >
                <span className="text-2xl md:text-3xl font-semibold text-muted-foreground whitespace-nowrap">
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
          <div className="h-px w-12 bg-accent-primary"></div>
          <span className="text-accent-primary text-sm uppercase tracking-wider">Scroll to explore</span>
          <div className="h-px w-12 bg-accent-primary"></div>
        </div>
        <div className="w-6 h-10 border-2 border-accent-primary rounded-full p-1 animate-bounce">
          <div className="w-1 h-2 bg-accent-primary rounded-full mx-auto"></div>
        </div>
      </div>
    </section>
  );
}
