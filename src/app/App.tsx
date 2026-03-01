import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";
import { Navigation } from "./components/navigation";
import { HomePageSlider } from "./components/home-page-slider";
import { ProjectDetail } from "./components/project-detail";
import { ProjectsPage } from "./components/projects-page";
import { ContactPage } from "./components/contact-page";
import { GalleryPage } from "./components/gallery-page";
import { Footer } from "./components/footer";
import { projectsBySlug } from "../data/projects";

type Page = "home" | "projects" | "gallery" | "contact" | "project-detail" | "project-not-found";

/** Scroll to top after any page transition. */
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<Page>("home");

  // ── Hash-based routing (single source of truth) ─────────────────────────
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

  // ── Navigation helpers (set hash only — listener handles state) ─────────
  const handleNavigate = useCallback((page: string) => {
    window.location.hash = page === "home" ? "#/" : `#/${page}`;
  }, []);

  const handleViewProject = useCallback((projectSlug: string) => {
    setPreviousPage(currentPage);
    window.location.hash = `#/projects/${projectSlug}`;
  }, [currentPage]);

  const handleViewAllProjects = useCallback(() => {
    window.location.hash = "#/projects";
  }, []);

  const handleBackToHome = useCallback(() => {
    window.location.hash = "#/";
  }, []);

  const handleBackFromProject = useCallback(() => {
    window.location.hash = previousPage === "projects" ? "#/projects" : "#/";
  }, [previousPage]);

  const navigationPage = currentPage === "project-detail" ? "projects" : currentPage;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage={navigationPage} onNavigate={handleNavigate} />
      <Toaster position="bottom-right" richColors />

      <main>
        {currentPage === "home" && (
          <HomePageSlider
            onViewProject={handleViewProject}
            onViewAllProjects={handleViewAllProjects}
            onNavigateToContact={() => handleNavigate("contact")}
          />
        )}

        {currentPage === "projects" && (
          <ProjectsPage
            onBack={handleBackToHome}
            onViewProject={handleViewProject}
          />
        )}

        {currentPage === "gallery" && (
          <GalleryPage />
        )}

        {currentPage === "contact" && (
          <ContactPage />
        )}

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
              <h1 className="text-3xl font-bold text-foreground">Project not found</h1>
              <p className="text-muted-foreground mt-2">Check the URL and try again.</p>
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
  );
}
