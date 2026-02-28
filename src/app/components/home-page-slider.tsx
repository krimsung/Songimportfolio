import { useState, useEffect, useCallback } from "react";
import { HeroSection, HeroOverlay } from "./hero-section";
import { TerrainScene } from "./TerrainScene";
import { AboutSection } from "./about-section";
import { TechnicalExperience } from "./technical-experience";
import { ProjectsSection } from "./projects-section";
import { GallerySection } from "./gallery-section";
import { ContactPreview } from "./contact-preview";

interface HomePageSliderProps {
  onViewProject: (slug: string) => void;
  onViewAllProjects: () => void;
  onNavigateToContact: () => void;
}

const sections = [
  { id: "hero", component: HeroSection },
  { id: "about", component: AboutSection },
  { id: "skills", component: TechnicalExperience },
  { id: "projects", component: ProjectsSection },
  { id: "gallery", component: GallerySection },
  { id: "contact", component: ContactPreview },
];

/** Accent orange matching --accent-primary (dark mode) */
const ACCENT = "#FF6B35";

const SECTION_LABELS = ["Landing", "About Me", "Technical Experience", "Featured Projects", "Gallery", "Get In Touch"];

export function HomePageSlider({ onViewProject, onViewAllProjects, onNavigateToContact }: HomePageSliderProps) {
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
      {/* Terrain Background */}
      <TerrainScene />

      {/* Hero overlay — outside the carousel transform so mix-blend-mode composites against the terrain */}
      {activeIndex === 0 && <HeroOverlay />}

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
            {section.id === "gallery" && <GallerySection />}
            {section.id === "contact" && <ContactPreview onNavigateToContact={onNavigateToContact} />}
          </div>
        ))}
      </div>

      {/* Section Indicators — orange + difference blend for terrain-reactive orange */}
      <div className="fixed right-16 top-[calc(50%+32px)] -translate-y-1/2 z-50 flex flex-col items-end gap-6 mix-blend-difference">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`flex items-center gap-3 transition-all duration-300 h-8 ${
              index === activeIndex ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
            aria-label={`Go to ${section.id}`}
          >
            <span
              className={`uppercase tracking-wider transition-all duration-300 ${
                index === activeIndex ? "text-sm font-bold" : "text-xs font-normal opacity-60 hover:opacity-80"
              }`}
              style={{ color: ACCENT }}
            >
              {SECTION_LABELS[index]}
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
