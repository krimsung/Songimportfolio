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

/** Accent amber matching --accent-primary — single colour for mix-blend-difference */
const ACCENT = "#F5A623";

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

  // Refs for each section's scrollable container — used for smart swipe detection
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      if (e.deltaY > 0) goToNext();
      else goToPrevious();
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

  // ── Touch / swipe support with smart scroll detection ─────────────────────
  // Only fire section navigation when the panel is already at its scroll
  // boundary — prevents accidental section changes while scrolling content.
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || isAnimating) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(deltaY) < 50) return;

      const activeEl = sectionRefs.current[activeIndex];

      if (deltaY > 0) {
        // Swiping up → next section — only if already at the bottom of content
        const atBottom = !activeEl ||
          activeEl.scrollTop + activeEl.clientHeight >= activeEl.scrollHeight - 4;
        if (atBottom) goToNext();
      } else {
        // Swiping down → previous section — only if already at the top
        const atTop = !activeEl || activeEl.scrollTop <= 4;
        if (atTop) goToPrevious();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrevious, isAnimating, activeIndex]);

  // Reset each section's internal scroll when navigating to it
  useEffect(() => {
    const el = sectionRefs.current[activeIndex];
    if (el) el.scrollTop = 0;
  }, [activeIndex]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, activeIndex]);

  return (
    /*
      Outer shell: full viewport, clips the sliding stack.
      The nav bar is `fixed` at z-50, so we need to account for its height (--nav-height = 4rem).
      We do NOT use `top-16` padding here — the carousel container handles the offset below.
    */
    <div className="h-screen w-full relative overflow-hidden">
      {/* Hero overlay — moves with the carousel transform for mix-blend-difference terrain compositing */}
      <HeroOverlay activeIndex={activeIndex} />

      {/*
        Carousel container.
        • Starts at `top: var(--nav-height)` so content begins below the fixed nav.
        • Each child section is exactly `calc(100vh - var(--nav-height))` tall via h-full.
        • translateY shifts the entire stack so the active section is in view.
      */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "var(--nav-height)",
          transform: `translateY(-${activeIndex * 100}%)`,
          transition: "transform 500ms ease-out",
        }}
      >
        {sections.map((section, index) => (
          /*
            Each section panel:
            • h-full = calc(100vh - nav-height) — fills exactly one viewport slot.
            • overflow-y-auto — allows internal scroll when content exceeds the panel.
            • slide-panel — applies thin custom scrollbar styling.
            Sections internally use `min-h-full flex flex-col justify-center` so
            their content is vertically centered when it fits, and scrollable when it doesn't.
          */
          <div
            key={section.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className="w-full h-full overflow-y-auto slide-panel"
          >
            {section.id === "hero"     && <HeroSection />}
            {section.id === "about"    && <AboutSection />}
            {section.id === "skills"   && <TechnicalExperience />}
            {section.id === "projects" && <ProjectsSection onViewProject={onViewProject} onViewAllProjects={onViewAllProjects} />}
            {section.id === "gallery"  && <GallerySection onNavigateToGallery={onNavigateToGallery} />}
            {section.id === "contact"  && <ContactPreview onNavigateToContact={onNavigateToContact} />}
          </div>
        ))}
      </div>

      {/* Section indicator dots — hidden below md, dots-only md→xl, labels at 2xl+ */}
      <div className="hidden md:flex fixed right-16 top-[calc(50%+32px)] -translate-y-1/2 z-50 flex-col items-end gap-6 mix-blend-difference">
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
              className={`hidden 2xl:inline uppercase tracking-wider transition-all duration-300 ${
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
