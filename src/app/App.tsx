import { useState } from "react";
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

type Page = "home" | "projects" | "gallery" | "contact" | "project-detail" | "all-projects";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage("project-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllProjects = () => {
    setCurrentPage("all-projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F3F2F0]">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
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

      {currentPage === "all-projects" && (
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
