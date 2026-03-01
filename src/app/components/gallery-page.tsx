import { ArrowLeft, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const galleryItems = [
  {
    url: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fantasy Character Design",
    category: "Character Art",
  },
  {
    url: "https://images.unsplash.com/photo-1727718296494-47d1e4fd41d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBlbnZpcm9ubWVudCUyMGNvbmNlcHR8ZW58MXx8fHwxNzcwMTU3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sci-Fi Environment",
    category: "Environment Art",
  },
  {
    url: "https://images.unsplash.com/photo-1668119065888-eb6b7a98a84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc3MDEwMTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Game Artwork",
    category: "Concept Art",
  },
  {
    url: "https://images.unsplash.com/photo-1760802185763-fe4999466b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGdhbWUlMjBhc3NldHxlbnwxfHx8fDE3NzAxNTcwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "3D Asset Creation",
    category: "3D Modeling",
  },
  {
    url: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydGZvbGlvfGVufDF8fHx8MTc3MDE1NzAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Digital Art",
    category: "Illustration",
  },
  {
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcwMTU3MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Game Development",
    category: "Development",
  },
  {
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwcHJvamVjdCUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzcwMTU3MDIw&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Project Management",
    category: "Planning",
  },
] as const;

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setSelectedImage(null), []);

  const goToPrevious = useCallback(() => {
    setSelectedImage((prev) =>
      prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length
    );
  }, []);

  const goToNext = useCallback(() => {
    setSelectedImage((prev) =>
      prev === null ? null : (prev + 1) % galleryItems.length
    );
  }, []);

  // Keyboard navigation: Escape / ArrowLeft / ArrowRight
  useEffect(() => {
    if (selectedImage === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, closeLightbox, goToPrevious, goToNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </a>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            A showcase of my artwork, character designs, and environment pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="group relative cursor-pointer text-left"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border transition duration-100 hover:border-accent-amber hover:bg-accent-amber/5 hover:shadow-lg hover:shadow-accent-amber/50">
                <div className="aspect-square relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-3 bg-accent-amber border-2 border-accent-amber/70 rounded-full shadow-lg shadow-accent-amber/50">
                      <ZoomIn className="w-6 h-6 text-[#0E0D11]" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <h3 className="text-foreground font-semibold mb-1">{item.title}</h3>
                    <span className="text-sm text-accent-amber font-medium">{item.category}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Close button */}
            <button
              className="btn-icon absolute top-4 right-4 z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            <button
              className="btn-icon absolute left-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              className="btn-icon absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image + info */}
            <div
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryItems[selectedImage].url}
                alt={galleryItems[selectedImage].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {galleryItems[selectedImage].title}
                </h3>
                <span className="text-accent-amber font-medium">
                  {galleryItems[selectedImage].category}
                </span>
              </div>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-sm bg-card/80 px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedImage + 1} / {galleryItems.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
