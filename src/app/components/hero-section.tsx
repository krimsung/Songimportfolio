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
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C1A1F] via-[#26242A] to-[#1C1A1F]">
        {/* Animated gradient overlay to simulate video */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D47A2B]/20 via-transparent to-[#2F6DAA]/20 animate-pulse"></div>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(#C9C6C0 1px, transparent 1px), linear-gradient(90deg, #C9C6C0 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
          SONG IM
        </h1>
        <div className="text-xl md:text-3xl text-[#C9C6C0] max-w-2xl mx-auto h-32 flex items-center justify-center overflow-hidden relative">
          <div className="relative w-full h-full flex justify-center items-center">
            {roles.map((role, index) => (
                <div
                    key={role}
                    className="carousel-item flex items-center justify-center w-full"
                    style={{
                      animationDelay: `${(index - 1) * 3}s`,
                    }}
                        >
                <span className="text-2xl md:text-3xl font-semibold text-[#C9C6C0] whitespace-nowrap">
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
          <div className="h-px w-12 bg-[#D47A2B]"></div>
          <span className="text-[#D47A2B] text-sm uppercase tracking-wider">Scroll to explore</span>
          <div className="h-px w-12 bg-[#D47A2B]"></div>
        </div>

        <div className="w-6 h-10 border-2 border-[#D47A2B] rounded-full p-1 animate-bounce">
          <div className="w-1 h-2 bg-[#D47A2B] rounded-full mx-auto"></div>
        </div>
      </div>
    </section>
  );
}
