import { useState, useEffect } from "react";
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
import { slugToId } from "./utils/projectMapping";

type Page = "home" | "projects" | "gallery" | "contact" | "project-detail";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/projects/")) {
        const slug = hash.replace("#/projects/", "");
        const projectId = slugToId[slug];
        if (projectId) {
          setSelectedProject(projectId);
          setCurrentPage("project-detail");
        } else {
          setCurrentPage("projects");
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

  const handleViewProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage("project-detail");
    const slug = Object.keys(slugToId).find(key => slugToId[key] === projectId);
    window.location.hash = `#/projects/${slug}`;
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

  const navigationPage = currentPage === "project-detail" ? "projects" : currentPage;

  return (
      <div className="min-h-screen bg-[#F3F2F0]">
        <Navigation currentPage={navigationPage} onNavigate={handleNavigate} />

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
              <Footer />
            </>
        )}

        {currentPage === "projects" && (
            <>
              <ProjectsPage
                  onBack={handleBackToHome}
                  onViewProject={handleViewProject}
              />
              <Footer />
            </>
        )}

        {currentPage === "gallery" && (
            <>
              <GalleryPage onBack={handleBackToHome} />
              <Footer />
            </>
        )}

        {currentPage === "contact" && (
            <>
              <ContactPage onBack={handleBackToHome} />
              <Footer />
            </>
        )}

        {currentPage === "project-detail" && selectedProject && (
            <>
              <ProjectDetail
                  projectId={selectedProject}
                  onBack={handleBackToHome}
              />
              <Footer />
            </>
        )}
      </div>
  );
}