import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface GallerySectionProps {
  onNavigateToGallery?: () => void;
}

const images = [
  {
    url: "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fantasy Character Design",
    description: "Character concept art and design",
  },
  {
    url: "https://images.unsplash.com/photo-1727718296494-47d1e4fd41d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBlbnZpcm9ubWVudCUyMGNvbmNlcHR8ZW58MXx8fHwxNzcwMTU3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sci-Fi Environment",
    description: "Environment and atmosphere design",
  },
  {
    url: "https://images.unsplash.com/photo-1668119065888-eb6b7a98a84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc3MDEwMTc5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Game Artwork",
    description: "In-game assets and artwork",
  },
  {
    url: "https://images.unsplash.com/photo-1760802185763-fe4999466b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGdhbWUlMjBhc3NldHxlbnwxfHx8fDE3NzAxNTcwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "3D Asset Creation",
    description: "3D modeling and texturing",
  },
  {
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcwMTU3MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Game Development",
    description: "Tools, pipelines, and development workflow",
  },
  {
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwcHJvamVjdCUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzcwMTU3MDIw&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Project Management",
    description: "Planning, execution, and delivery",
  },
] as const;

export function GallerySection({ onNavigateToGallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Gallery
        </h2>

        <div className="relative rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 mb-12">
          {/* Main Image — thumbnails overlaid at bottom */}
          <div className="relative h-[624px] overflow-hidden">
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

            {/* Image Info — positioned above thumbnails */}
            <div className="absolute bottom-[132px] left-0 right-0 px-6">
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {images[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-sm font-medium">
                {images[currentIndex].description}
              </p>
            </div>

            {/* Thumbnails — overlaid at bottom, 5 small thumbnails */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2 overflow-hidden">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-1 min-w-0 h-[104px] rounded-lg overflow-hidden border-2 transition duration-100 ${
                    index === currentIndex
                      ? "border-accent-amber scale-105"
                      : "border-border/50"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    loading="lazy"
                  />
                  {index !== currentIndex && (
                    <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition duration-100" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Full Gallery Link */}
        <div className="flex justify-end">
          <a
            href="#/gallery"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                return;
              }
              event.preventDefault();
              onNavigateToGallery?.();
            }}
            className="btn-amber group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}
