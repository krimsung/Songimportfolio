import { useState } from "react";
import { ArrowRight } from "lucide-react";

import Hellbound from "../../media/videos/Hellbound.mp4";
import Island from "../../media/videos/Island.mp4";
import Snow from "../../media/videos/Snow.mp4";
import BoulderDestruction from "../../media/videos/Boulder Destruction.mp4";
import Sparks from "../../media/videos/Sparks.mp4";
import Campfire from "../../media/videos/Campfire.mp4";

interface GallerySectionProps {
  onNavigateToGallery?: () => void;
}

// ─── Featured videos shown in the homepage gallery ───────────────────────────
// There are 6 slots. Swap out any entry to change what appears.
// Each entry needs a `src` (imported video) and a `title` / `description`.
const featuredVideos = [
  { src: Hellbound,        title: "Hellbound",          description: "VFX animation" },
  { src: Island,           title: "Island",             description: "VFX animation" },
  { src: Snow,             title: "Snow",               description: "VFX animation" },
  { src: BoulderDestruction, title: "Boulder Destruction", description: "VFX animation" },
  { src: Sparks,           title: "Sparks",             description: "VFX animation" },
  { src: Campfire,         title: "Campfire",           description: "VFX animation" },
];
// ─────────────────────────────────────────────────────────────────────────────

export function GallerySection({ onNavigateToGallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Gallery
        </h2>

        <div className="relative rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 mb-12">
          {/* Main video — thumbnails overlaid at bottom */}
          <div className="relative h-[624px] overflow-hidden bg-black">
            <video
              key={featuredVideos[currentIndex].src}
              src={featuredVideos[currentIndex].src}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            {/* Video info — positioned above thumbnails */}
            <div className="absolute bottom-[132px] left-0 right-0 px-6">
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {featuredVideos[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-sm font-medium">
                {featuredVideos[currentIndex].description}
              </p>
            </div>

            {/* Thumbnails — overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2 overflow-hidden">
              {featuredVideos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-1 min-w-0 h-[104px] rounded-lg overflow-hidden border-2 transition duration-100 bg-black ${
                    index === currentIndex
                      ? "border-accent-amber scale-105"
                      : "border-border/50"
                  }`}
                >
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
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
