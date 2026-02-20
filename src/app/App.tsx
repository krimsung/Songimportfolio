import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Navigation } from "./components/navigation";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { TechnicalExperience } from "./components/technical-experience";
import { ProjectsSection } from "./components/projects-section";
import { GallerySection } from "./components/gallery-section";
import { ContactPreview } from "./components/contact-preview";
import { ProjectDetail } from "./components/project-detail";
import { ProjectsPage } from "./components/projects-page";
import { ContactPage } from "./components/contact-page";
import { GalleryPage } from "./components/gallery-page";
import { Footer } from "./components/footer";
import { projectsBySlug } from "./data/projects";

type Page = "home" | "projects" | "gallery" | "contact" | "project-detail" | "project-not-found";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<Page>("home");

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProject = (projectSlug: string) => {
    setPreviousPage(currentPage);
    setSelectedProject(projectSlug);
    setCurrentPage("project-detail");
    window.location.hash = `#/projects/${projectSlug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllProjects = () => {
    setCurrentPage("projects");
    window.location.hash = "#/projects";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedProject(null);
    window.location.hash = "#/";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromProject = () => {
    if (previousPage === "projects") {
      setCurrentPage("projects");
      setSelectedProject(null);
      window.location.hash = "#/projects";
    } else {
      setCurrentPage("home");
      setSelectedProject(null);
      window.location.hash = "#/";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationPage = currentPage === "project-detail" ? "projects" : currentPage;

  return (
      <div className="min-h-screen bg-[#F3F2F0]">
        <Navigation currentPage={navigationPage} onNavigate={handleNavigate} />
        <Toaster position="bottom-right" richColors theme="dark" />

        <main>
          {currentPage === "home" && (
            <>
              <HeroSection />
              <AboutSection />
              <TechnicalExperience />
              <ProjectsSection
                onViewProject={handleViewProject}
                onViewAllProjects={handleViewAllProjects}
              />
              <GallerySection />
              <ContactPreview onNavigateToContact={() => handleNavigate("contact")} />
            </>
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
            <div className="min-h-screen bg-[#F3F2F0] pt-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#1C1A1F]">Project not found</h1>
                <p className="text-[#7E7A75] mt-2">Check the URL and try again.</p>
                <a
                  href="#/"
                  className="mt-6 inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors"
                >
                  <span>Back to Home</span>
                </a>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
  );
}