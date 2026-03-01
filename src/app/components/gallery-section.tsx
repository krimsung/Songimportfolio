import { useState } from "react";

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

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Gallery
        </h2>

        <div className="relative bg-card rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 mb-12">
          {/* Main Image */}
          <div className="relative h-[500px] overflow-hidden">
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {images[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-sm font-medium">
                {images[currentIndex].description}
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-1 p-1 sm:gap-2 sm:p-2 bg-card overflow-hidden">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-1 min-w-0 aspect-[3/2] rounded overflow-hidden border-2 transition duration-100 ${
                  index === currentIndex
                    ? "border-accent-amber bg-accent-amber/10 scale-105"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
