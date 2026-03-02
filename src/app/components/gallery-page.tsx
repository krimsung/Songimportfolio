import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

import Hellbound from "../../media/videos/Hellbound.mp4";
import Island from "../../media/videos/Island.mp4";
import Snow from "../../media/videos/Snow.mp4";
import BoulderDestruction from "../../media/videos/Boulder Destruction.mp4";
import Sparks from "../../media/videos/Sparks.mp4";
import Lighting from "../../media/videos/Lighting.mp4";
import GrenadeToon from "../../media/videos/Grenade Toon.mp4";
import Rocket from "../../media/videos/Rocket.mp4";
import FinisherBig from "../../media/videos/Finisher Big.mp4";
import Grenade from "../../media/videos/Grenade.mp4";
import FinisherSmall from "../../media/videos/Finisher Small.mp4";
import Campfire from "../../media/videos/Campfire.mp4";
import Flamethrower from "../../media/videos/Flamethrower.mp4";
import RenderTargetFogOfWar from "../../media/videos/Render Target Fog-of-War.mp4";
import MetaconstructLightingPass from "../../media/videos/Metaconstruct Lighting Pass 720p.mp4";
import GodForgedMainMenu from "../../media/videos/GodForged Main Menu.mp4";
import PyGameGamejams from "../../media/videos/PyGame Gamejams.mp4";

const galleryItems = [
  { src: Hellbound,             title: "Hellbound",                    subtitle: "VFX Animation" },
  { src: Island,                title: "Island",                       subtitle: "VFX Animation" },
  { src: Snow,                  title: "Snow",                         subtitle: "VFX Animation" },
  { src: BoulderDestruction,    title: "Boulder Destruction",          subtitle: "VFX Animation" },
  { src: Sparks,                title: "Sparks",                       subtitle: "VFX Animation" },
  { src: Lighting,              title: "Lighting",                     subtitle: "VFX Animation" },
  { src: GrenadeToon,           title: "Grenade Toon",                 subtitle: "VFX Animation" },
  { src: Rocket,                title: "Rocket",                       subtitle: "VFX Animation" },
  { src: FinisherBig,           title: "Finisher Big",                 subtitle: "VFX Animation" },
  { src: Grenade,               title: "Grenade",                      subtitle: "VFX Animation" },
  { src: FinisherSmall,         title: "Finisher Small",               subtitle: "VFX Animation" },
  { src: Campfire,              title: "Campfire",                     subtitle: "VFX Animation" },
  { src: Flamethrower,          title: "Flamethrower",                 subtitle: "VFX Animation" },
  { src: RenderTargetFogOfWar,  title: "Render Target Fog-of-War",     subtitle: "VFX Animation" },
  { src: MetaconstructLightingPass, title: "Metaconstruct Lighting Pass", subtitle: "VFX Animation" },
  { src: GodForgedMainMenu,     title: "GodForged Main Menu",          subtitle: "VFX Animation" },
  { src: PyGameGamejams,        title: "PyGame Gamejams",              subtitle: "VFX Animation" },
];

function LightboxVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play();
  }, [src]);

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      className="max-w-full max-h-[80vh] object-contain rounded-lg"
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

export function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length
    );
  }, []);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryItems.length
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeLightbox, goToPrevious, goToNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

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
            A showcase of my VFX animations and effects work
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="group relative cursor-pointer text-left"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border transition duration-100 hover:border-accent-amber hover:bg-accent-amber/5 hover:shadow-lg hover:shadow-accent-amber/50">
                <div className="aspect-square relative bg-black">
                  <video
                    src={item.src}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <h3 className="text-foreground font-semibold mb-1">{item.title}</h3>
                    <span className="text-sm text-accent-amber font-medium">{item.subtitle}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedIndex !== null && (
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
              aria-label="Previous video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              className="btn-icon absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              aria-label="Next video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Video + info */}
            <div
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <LightboxVideo src={galleryItems[selectedIndex].src} />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {galleryItems[selectedIndex].title}
                </h3>
                <span className="text-accent-amber font-medium">
                  {galleryItems[selectedIndex].subtitle}
                </span>
              </div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-sm bg-card/80 px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {galleryItems.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
