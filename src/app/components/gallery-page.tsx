import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { videoAssets } from "../assetManifest";

// ── Images ────────────────────────────────────────────────────────────────────
import HighresScreenshot00012 from "../../media/gallery/HighresScreenshot00012.png";
import HighresScreenshot00010 from "../../media/gallery/HighresScreenshot00010.png";
import HighresScreenshot00004 from "../../media/gallery/HighresScreenshot00004.png";
import HighresScreenshot00006 from "../../media/gallery/HighresScreenshot00006.png";
import FinalScreenshot1 from "../../media/gallery/Final Screenshot 1.png";
import FinalScreenshot2 from "../../media/gallery/Final Screenshot 2.png";
import FinalScreenshot3 from "../../media/gallery/Final Screenshot 3.png";
import FinalScreenshot4 from "../../media/gallery/Final Screenshot 4.png";
import FinalScreenshot6 from "../../media/gallery/Final Screenshot 6.png";
import FinalScreenshot7 from "../../media/gallery/Final Screenshot 7.png";
import Screenshot1      from "../../media/gallery/Screenshot_1.png";
import Screenshot2      from "../../media/gallery/Screenshot_2.png";
import Screenshot3      from "../../media/gallery/Screenshot_3.png";
import Screenshot4      from "../../media/gallery/Screenshot_4.png";

// Build a lookup: video src → thumbnail image src (populated from assetManifest)
const videoThumbnailMap: Record<string, string> = Object.fromEntries(
  videoAssets.map((a) => [a.src, a.thumbnail])
);

type GalleryItem =
  | { type: "video"; src: string; title: string; subtitle: string }
  | { type: "image"; src: string; title: string; subtitle: string };

// Pull video srcs directly from the manifest so names stay in sync
const v = Object.fromEntries(videoAssets.map((a) => [a.label, a.src]));

const galleryItems: GalleryItem[] = [
  { type: "video", src: v["Hellbound"],                   title: "Hellbound Title Screen",                   subtitle: "VFX Animation" },
  { type: "video", src: v["VFX Island"],                  title: "VFX Island",                  subtitle: "VFX Animation" },
  { type: "video", src: v["Blizzard"],                    title: "Blizzard",                    subtitle: "VFX Animation" },
  { type: "video", src: v["Boulder Destruction"],         title: "Boulder Destruction",         subtitle: "VFX Animation" },
  { type: "video", src: v["Sparks"],                      title: "Sparks",                      subtitle: "VFX Animation" },
  { type: "video", src: v["Lightning"],                   title: "Lightning",                   subtitle: "VFX Animation" },
  { type: "video", src: v["Grenade Toon"],                title: "Grenade Toon",                subtitle: "VFX Animation" },
  { type: "video", src: v["Rocket"],                      title: "Rocket",                      subtitle: "VFX Animation" },
  { type: "video", src: v["Finisher Big"],                title: "Finisher Big",                subtitle: "VFX Animation" },
  { type: "video", src: v["Grenade"],                     title: "Grenade",                     subtitle: "VFX Animation" },
  { type: "video", src: v["Finisher Small"],              title: "Finisher Small",              subtitle: "VFX Animation" },
  { type: "video", src: v["Campfire"],                    title: "Campfire",                    subtitle: "VFX Animation" },
  { type: "video", src: v["Flamethrower"],                title: "Flamethrower",                subtitle: "VFX Animation" },
  { type: "video", src: v["Render Target Fog-of-War"],    title: "Render Target \nFog-of-War",    subtitle: "Technical Art" },
  { type: "video", src: v["Metaconstruct Lighting Pass"], title: "Metaconstruct \nLighting Pass", subtitle: "Technical Art" },
  { type: "video", src: v["GodForged Main Menu"],         title: "GodForged Main Menu",         subtitle: "Technical Art" },
  { type: "video", src: v["PyGame Gamejams"],             title: "24 Hour Gamejams",             subtitle: "Made with PyGame" },
  { type: "video", src: v["Houdini Building Generator"],  title: "Houdini Building Generator",  subtitle: "Technical Art" },
  { type: "image", src: FinalScreenshot1,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: FinalScreenshot2,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: FinalScreenshot3,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: FinalScreenshot4,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: FinalScreenshot6,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: FinalScreenshot7,                 title: "Architecture Scene",          subtitle: "2023 Course Work" },
  { type: "image", src: HighresScreenshot00012,           title: "Character Bust",      subtitle: "ZBrush Retopology" },
  { type: "image", src: HighresScreenshot00004,           title: "Character Bust",      subtitle: "ZBrush Retopology" },
  { type: "image", src: HighresScreenshot00010,           title: "Character Bust",      subtitle: "ZBrush Retopology" },
  { type: "image", src: HighresScreenshot00006,           title: "Character Bust",      subtitle: "ZBrush Retopology" },
  { type: "image", src: Screenshot1,                      title: "Imposter Syndrome",                subtitle: "ZBrush Model" },
  { type: "image", src: Screenshot2,                      title: "Imposter Syndrome",                subtitle: "ZBrush Model" },
  { type: "image", src: Screenshot3,                      title: "Imposter Syndrome",                subtitle: "ZBrush Model" },
  { type: "image", src: Screenshot4,                      title: "Imposter Syndrome",                subtitle: "ZBrush Model" },
];

export function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Display video refs — used for hover play/pause only.
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Thumbnail for each item: video thumbnail image or image src directly.
  const thumbSrcs = galleryItems.map((item) =>
    item.type === "image" ? item.src : (videoThumbnailMap[item.src] ?? null)
  );

  // Track playback time when user hovers, for lightbox resume.
  const hoverTimeRef = useRef<number[]>(Array(galleryItems.length).fill(0));

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

  // ── Hover handlers for video cards ────────────────────────────────────────
  const handleMouseEnter = (index: number) => {
    const item = galleryItems[index];
    if (item.type !== "video") return;
    setHoveredIndex(index);
    const vid = videoRefs.current[index];
    if (vid) {
      vid.currentTime = 0;
      void vid.play().catch(() => {});
    }
  };

  const handleMouseLeave = (index: number) => {
    const item = galleryItems[index];
    if (item.type !== "video") return;
    const vid = videoRefs.current[index];
    if (vid) {
      hoverTimeRef.current[index] = vid.currentTime;
      vid.pause();
      vid.currentTime = 0;
    }
    setHoveredIndex(null);
  };

  // ── Pause card video when lightbox opens ─────────────────────────────────
  useEffect(() => {
    if (selectedIndex !== null) {
      const vid = videoRefs.current[selectedIndex];
      if (vid) {
        // hoverTimeRef already saved in handleMouseLeave
        vid.pause();
        vid.currentTime = 0;
      }
      setHoveredIndex(null);
    }
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
    <div className="min-h-screen bg-background pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </a>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
            Gallery
          </h1>
          <div className="flex items-end justify-between gap-4 min-h-[34px]">
            <p className="text-base sm:text-lg text-muted-foreground">
              A showcase of my VFX animations and effects work
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className="group relative cursor-pointer text-left"
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border transition duration-100 hover:border-accent-amber hover:bg-accent-amber/5 hover:shadow-lg hover:shadow-accent-amber/50">
                <div className="aspect-square relative bg-black">
                  {item.type === "video" ? (
                    <>
                      {/* Thumbnail image — always visible, preloaded by loading screen */}
                      {thumbSrcs[index] ? (
                        <img
                          src={thumbSrcs[index]!}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-900" />
                      )}
                      {/* Video — fades in on hover */}
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={item.src}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
                        style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10">
                    <h3 className="text-foreground font-semibold mb-1 whitespace-pre-line">{item.title}</h3>
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
              className="btn-icon absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              className="btn-icon absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10"
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
                // Fresh <video> keyed by src — browser reuses cached buffer.
                // Resume from hover time if available, applied only once via ref flag.
                <video
                  key={selectedItem.src}
                  src={selectedItem.src}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(vid) => {
                    if (!vid) return;
                    let seekApplied = false;
                    const applySeek = () => {
                      if (seekApplied) return;
                      seekApplied = true;
                      const savedTime = hoverTimeRef.current[selectedIndex ?? 0];
                      if (savedTime > 0) vid.currentTime = savedTime;
                    };
                    vid.addEventListener("canplay", applySeek, { once: true });
                  }}
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2 whitespace-pre-line">
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
