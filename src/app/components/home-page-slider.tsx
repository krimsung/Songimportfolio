import { useState, useEffect, useCallback, useRef } from "react";
import { HeroSection, HeroOverlay } from "./hero-section";
import { AboutSection } from "./about-section";
import { TechnicalExperience } from "./technical-experience";
import { ProjectsSection } from "./projects-section";
import { GallerySection } from "./gallery-section";
import { ContactPreview } from "./contact-preview";

interface HomePageSliderProps {
  onViewProject: (slug: string) => void;
  onViewAllProjects: () => void;
  onNavigateToContact: () => void;
  onNavigateToGallery: () => void;
}

/** Accent orange matching --accent-primary — single colour for mix-blend-difference */
const ACCENT = "#FF6B35";

const sections = [
  { id: "hero",     label: "Landing"              },
  { id: "about",    label: "About Me"             },
  { id: "skills",   label: "Technical Experience" },
  { id: "projects", label: "Featured Projects"    },
  { id: "gallery",  label: "Gallery"              },
  { id: "contact",  label: "Get In Touch"         },
] as const;

export function HomePageSlider({ onViewProject, onViewAllProjects, onNavigateToContact, onNavigateToGallery }: HomePageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= sections.length || isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
  }, [activeIndex, isAnimating]);

  const goToNext = useCallback(() => {
    goToSection(activeIndex + 1);
  }, [activeIndex, goToSection]);

  const goToPrevious = useCallback(() => {
    goToSection(activeIndex - 1);
  }, [activeIndex, goToSection]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;
      
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious, isAnimating]);

  // ── Touch / swipe support ──────────────────────────────────────────────
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || isAnimating) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(deltaY) < 40) return; // ignore tiny swipes
      if (deltaY > 0) goToNext();
      else goToPrevious();
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrevious, isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, activeIndex]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Hero overlay — scrolls with carousel so mix-blend-mode composites against the terrain */}
      <HeroOverlay activeIndex={activeIndex} />

      {/* Carousel container - scrolls vertically */}
      <div 
        className="absolute top-16 left-0 right-0 bottom-0"
        style={{ 
          transform: `translateY(-${activeIndex * 100}%)`,
          transition: 'transform 500ms ease-out'
        }}
      >
        {sections.map((section) => (
          <div key={section.id} className="w-full h-full overflow-hidden">
            {section.id === "hero" && <HeroSection />}
            {section.id === "about" && <AboutSection />}
            {section.id === "skills" && <TechnicalExperience />}
            {section.id === "projects" && <ProjectsSection onViewProject={onViewProject} onViewAllProjects={onViewAllProjects} />}
            {section.id === "gallery" && <GallerySection onNavigateToGallery={onNavigateToGallery} />}
            {section.id === "contact" && <ContactPreview onNavigateToContact={onNavigateToContact} />}
          </div>
        ))}
      </div>

      {/* Section Indicators — orange + difference blend for terrain-reactive orange */}
      <div className="fixed right-16 top-[calc(50%+32px)] -translate-y-1/2 z-50 flex flex-col items-end gap-6 mix-blend-difference">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => goToSection(index)}
            className={`flex items-center gap-3 transition-all duration-300 h-8 ${
              index === activeIndex ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
            aria-label={`Go to ${section.label}`}
          >
            <span
              className={`uppercase tracking-wider transition-all duration-300 ${
                index === activeIndex ? "text-sm font-bold" : "text-xs font-normal opacity-60 hover:opacity-80"
              }`}
              style={{ color: ACCENT }}
            >
              {section.label}
            </span>
            <div className="w-4 h-4 flex items-center justify-center">
              <div
                className={`rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-3 h-3" : "w-1.5 h-1.5"
                }`}
                style={{ backgroundColor: ACCENT, opacity: index === activeIndex ? 1 : 0.3 }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
