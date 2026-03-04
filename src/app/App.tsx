import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";
import { Navigation }      from "./components/navigation";
import { HomePageSlider }  from "./components/home-page-slider";
import { ProjectDetail }   from "./components/project-detail";
import { ProjectsPage }    from "./components/projects-page";
import { ContactPage }     from "./components/contact-page";
import { GalleryPage }     from "./components/gallery-page";
import { Footer }          from "./components/footer";
import { TerrainScene }    from "./components/TerrainScene";
import { LoadingScreen }   from "./components/LoadingScreen";
import { projectsBySlug }  from "../data/projects";

type Page =
  | "home"
  | "projects"
  | "gallery"
  | "contact"
  | "project-detail"
  | "project-not-found";

/** Scroll to top after any page transition. */
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function App() {
  const [currentPage,      setCurrentPage]      = useState<Page>("home");
  const [selectedProject,  setSelectedProject]  = useState<string | null>(null);
  const [previousPage,     setPreviousPage]     = useState<Page>("home");

  // ── Loading state ──────────────────────────────────────────────────────────
  /** True once the TerrainScene fires its onReady callback. */
  const [terrainReady,    setTerrainReady]    = useState(false);
  /** True the instant the split animation begins — reveals the app shell. */
  const [shellVisible,    setShellVisible]    = useState(false);
  /** True once the LoadingScreen's full exit animation completes. */
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleTerrainReady    = useCallback(() => setTerrainReady(true),    []);
  const handleSplitStart      = useCallback(() => setShellVisible(true),    []);
  const handleLoadingComplete = useCallback(() => setLoadingComplete(true), []);

  // ── Hash-based routing (single source of truth) ────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/projects/")) {
        const slug = hash.replace("#/projects/", "");
        if (projectsBySlug[slug]) {
          setSelectedProject(slug);
          setCurrentPage("project-detail");
        } else {
          setSelectedProject(null);
          setCurrentPage("project-not-found");
        }
      } else if (hash === "#/projects") {
        setCurrentPage("projects");
      } else if (hash === "#/gallery") {
        setCurrentPage("gallery");
      } else if (hash === "#/contact") {
        setCurrentPage("contact");
      } else {
        setCurrentPage("home");
        setSelectedProject(null);
      }
      scrollToTop();
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // ── Navigation helpers (set hash only — listener handles state) ────────────
  const handleNavigate = useCallback((page: string) => {
    window.location.hash = page === "home" ? "#/" : `#/${page}`;
  }, []);

  const handleViewProject = useCallback((projectSlug: string) => {
    setPreviousPage(currentPage);
    window.location.hash = `#/projects/${projectSlug}`;
  }, [currentPage]);

  const handleViewAllProjects  = useCallback(() => { window.location.hash = "#/projects"; }, []);
  const handleBackToHome       = useCallback(() => { window.location.hash = "#/";          }, []);
  const handleBackFromProject  = useCallback(() => {
    window.location.hash = previousPage === "projects" ? "#/projects" : "#/";
  }, [previousPage]);

  const navigationPage = currentPage === "project-detail" ? "projects" : currentPage;

  // ── Terrain visibility ─────────────────────────────────────────────────────
  // The terrain is always mounted (never unmounted) so the Three.js context
  // and GPU resources persist across page navigations.
  // • visible = on home page
  // • active  = loop running (paused on non-home pages to save GPU)
  const isOnHome       = currentPage === "home";
  const terrainVisible = isOnHome;
  // Start the RAF loop as soon as the terrain signals ready — not after the
  // loading screen finishes. This way it's already scrolling when the split
  // panels slide open. Only pause it when navigating away from home.
  const terrainActive  = isOnHome && terrainReady;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Persistent terrain — always mounted, shown only on home ─────────
          position: fixed + inset: 0 puts it behind everything (z-index 0).
          visibility: hidden keeps it in the GPU without painting pixels.   */}
      <div
        aria-hidden
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     0,
          visibility: terrainVisible ? "visible" : "hidden",
          // Pointer events always off — interaction is handled by the
          // TerrainScene itself via window-level listeners.
          pointerEvents: "none",
        }}
      >
        <TerrainScene
          onReady={handleTerrainReady}
          isActive={terrainActive}
        />
      </div>

      {/* ── Loading screen ───────────────────────────────────────────────────
          Rendered until the reveal animation fully completes.              */}
      {!loadingComplete && (
        <LoadingScreen
          terrainReady={terrainReady}
          onSplitStart={handleSplitStart}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* ── App shell — navigation + pages ──────────────────────────────────
          Positioned above the terrain (z-index 1+).
          Navigation and page content are rendered regardless of loading
          state so they are fully initialised before the screen lifts.
          Pointer events on the entire shell are blocked by the transparent
          overlay that the LoadingScreen renders at z-index 9998.          */}
      <div
        style={{
          // Do NOT set position+zIndex here — that would create an isolated
          // stacking context which prevents mix-blend-difference in child
          // components from compositing against the terrain canvas behind it.
          // The LoadingScreen's z-index 9999 overlay handles click-blocking
          // during load independently.
          opacity: shellVisible ? 1 : 0,
          transition: "none",
        }}
      >
        <Navigation currentPage={navigationPage} onNavigate={handleNavigate} />
        <Toaster position="bottom-right" richColors />

        <main>
          {currentPage === "home" && (
            <HomePageSlider
              onViewProject={handleViewProject}
              onViewAllProjects={handleViewAllProjects}
              onNavigateToContact={() => handleNavigate("contact")}
              onNavigateToGallery={() => handleNavigate("gallery")}
            />
          )}

          {currentPage === "projects" && (
            <ProjectsPage
              onBack={handleBackToHome}
              onViewProject={handleViewProject}
            />
          )}

          {currentPage === "gallery"  && <GalleryPage />}
          {currentPage === "contact"  && <ContactPage />}

          {currentPage === "project-detail" && selectedProject && (
            <ProjectDetail
              projectId={selectedProject}
              onBack={handleBackFromProject}
              backLabel={previousPage === "projects" ? "Back to Projects" : "Back to Home"}
            />
          )}

          {currentPage === "project-not-found" && (
            <div className="min-h-screen bg-background pt-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-foreground">
                  Project not found
                </h1>
                <p className="text-muted-foreground mt-2">
                  Check the URL and try again.
                </p>
                <a
                  href="#/"
                  className="mt-6 inline-flex items-center gap-2 text-accent hover:text-accent/90 transition-colors"
                >
                  <span>Back to Home</span>
                </a>
              </div>
            </div>
          )}
        </main>

        {currentPage !== "home" && <Footer />}
      </div>
    </div>
  );
}
