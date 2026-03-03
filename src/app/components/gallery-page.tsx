import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Videos ────────────────────────────────────────────────────────────────────
import Hellbound from "../../media/gallery/Hellbound.mp4";
import Island from "../../media/gallery/Island.mp4";
import Snow from "../../media/gallery/Snow.mp4";
import BoulderDestruction from "../../media/gallery/Boulder Destruction.mp4";
import Sparks from "../../media/gallery/Sparks.mp4";
import Lighting from "../../media/gallery/Lighting.mp4";
import GrenadeToon from "../../media/gallery/Grenade Toon.mp4";
import Rocket from "../../media/gallery/Rocket.mp4";
import FinisherBig from "../../media/gallery/Finisher Big.mp4";
import Grenade from "../../media/gallery/Grenade.mp4";
import FinisherSmall from "../../media/gallery/Finisher Small.mp4";
import Campfire from "../../media/gallery/Campfire.mp4";
import Flamethrower from "../../media/gallery/Flamethrower.mp4";
import RenderTargetFogOfWar from "../../media/gallery/Render Target Fog-of-War.mp4";
import MetaconstructLightingPass from "../../media/gallery/Metaconstruct Lighting Pass 720p.mp4";
import GodForgedMainMenu from "../../media/gallery/GodForged Main Menu.mp4";
import PyGameGamejams from "../../media/gallery/PyGame Gamejams.mp4";
import HoudiniBuildingGenerator from "../../media/gallery/Houdini Building Generator.mp4";

// ── Images ────────────────────────────────────────────────────────────────────
import HighresScreenshot00012 from "../../media/gallery/HighresScreenshot00012.png";
import HighresScreenshot00010 from "../../media/gallery/HighresScreenshot00010.png";
import HighresScreenshot00004 from "../../media/gallery/HighresScreenshot00004.png";
import FinalScreenshot1 from "../../media/gallery/Final Screenshot 1.png";
import FinalScreenshot2 from "../../media/gallery/Final Screenshot 2.png";
import FinalScreenshot3 from "../../media/gallery/Final Screenshot 3.png";
import FinalScreenshot4 from "../../media/gallery/Final Screenshot 4.png";
import FinalScreenshot5 from "../../media/gallery/Final Screenshot 5.png";
import FinalScreenshot6 from "../../media/gallery/Final Screenshot 6.png";

type GalleryItem =
  | { type: "video"; src: string; title: string; subtitle: string }
  | { type: "image"; src: string; title: string; subtitle: string };

const galleryItems: GalleryItem[] = [
  { type: "video", src: Hellbound,                 title: "Hellbound",                   subtitle: "VFX Animation" },
  { type: "video", src: Island,                    title: "Island",                      subtitle: "VFX Animation" },
  { type: "video", src: Snow,                      title: "Snow",                        subtitle: "VFX Animation" },
  { type: "video", src: BoulderDestruction,        title: "Boulder Destruction",         subtitle: "VFX Animation" },
  { type: "video", src: Sparks,                    title: "Sparks",                      subtitle: "VFX Animation" },
  { type: "video", src: Lighting,                  title: "Lighting",                    subtitle: "VFX Animation" },
  { type: "video", src: GrenadeToon,               title: "Grenade Toon",                subtitle: "VFX Animation" },
  { type: "video", src: Rocket,                    title: "Rocket",                      subtitle: "VFX Animation" },
  { type: "video", src: FinisherBig,               title: "Finisher Big",                subtitle: "VFX Animation" },
  { type: "video", src: Grenade,                   title: "Grenade",                     subtitle: "VFX Animation" },
  { type: "video", src: FinisherSmall,             title: "Finisher Small",              subtitle: "VFX Animation" },
  { type: "video", src: Campfire,                  title: "Campfire",                    subtitle: "VFX Animation" },
  { type: "video", src: Flamethrower,              title: "Flamethrower",                subtitle: "VFX Animation" },
  { type: "video", src: RenderTargetFogOfWar,      title: "Render Target Fog-of-War",    subtitle: "VFX Animation" },
  { type: "video", src: MetaconstructLightingPass, title: "Metaconstruct Lighting Pass", subtitle: "VFX Animation" },
  { type: "video", src: GodForgedMainMenu,         title: "GodForged Main Menu",         subtitle: "VFX Animation" },
  { type: "video", src: PyGameGamejams,            title: "PyGame Gamejams",             subtitle: "VFX Animation" },
  { type: "video", src: HoudiniBuildingGenerator,  title: "Houdini Building Generator",  subtitle: "VFX Animation" },
  { type: "image", src: HighresScreenshot00012,    title: "HighresScreenshot00012",      subtitle: "VFX Animation" },
  { type: "image", src: HighresScreenshot00010,    title: "HighresScreenshot00010",      subtitle: "VFX Animation" },
  { type: "image", src: HighresScreenshot00004,    title: "HighresScreenshot00004",      subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot1,          title: "Final Screenshot 1",          subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot2,          title: "Final Screenshot 2",          subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot3,          title: "Final Screenshot 3",          subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot4,          title: "Final Screenshot 4",          subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot5,          title: "Final Screenshot 5",          subtitle: "VFX Animation" },
  { type: "image", src: FinalScreenshot6,          title: "Final Screenshot 6",          subtitle: "VFX Animation" },
];

export function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Refs for video DOM-reparenting (videos only)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lightboxSlotRef = useRef<HTMLDivElement>(null);
  const cardSlotsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  // For video items: move the card's <video> node into the lightbox slot (no double load).
  // For image items: nothing to reparent — the lightbox renders an <img> directly.
  useEffect(() => {
    const slot = lightboxSlotRef.current;

    // On close: return any reparented video back to its card
    if (selectedIndex === null) {
      videoRefs.current.forEach((vid, i) => {
        const cardSlot = cardSlotsRef.current[i];
        if (vid && cardSlot && !cardSlot.contains(vid)) {
          vid.className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-200";
          cardSlot.appendChild(vid);
        }
      });
      return;
    }

    const item = galleryItems[selectedIndex];
    if (item.type !== "video" || !slot) return;

    const vid = videoRefs.current[selectedIndex];
    if (!vid) return;

    vid.className = "max-w-full max-h-[80vh] object-contain rounded-lg";
    slot.appendChild(vid);
  }, [selectedIndex]);

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

  const selectedItem = selectedIndex !== null ? galleryItems[selectedIndex] : null;

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="group relative cursor-pointer text-left"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border transition duration-100 hover:border-accent-amber hover:bg-accent-amber/5 hover:shadow-lg hover:shadow-accent-amber/50">
                <div
                  className="aspect-square relative bg-black"
                  ref={(el) => { cardSlotsRef.current[index] = el; }}
                >
                  {item.type === "video" ? (
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={item.src}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
        {selectedItem !== null && selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="absolute inset-0 bg-black/90" />

            <button
              className="btn-icon absolute top-4 right-4 z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="btn-icon absolute left-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              className="btn-icon absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === "video" ? (
                /* Video: reparented node lands here */
                <div ref={lightboxSlotRef} />
              ) : (
                /* Image: rendered directly, no reparenting needed */
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {selectedItem.title}
                </h3>
                <span className="text-accent-amber font-medium">
                  {selectedItem.subtitle}
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-sm bg-card/80 px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {galleryItems.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
