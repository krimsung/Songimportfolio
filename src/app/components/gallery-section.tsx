import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { videoAssets } from "../assetManifest";

import Hellbound             from "../../media/gallery/Hellbound.mp4";
import GodForgedMainMenu     from "../../media/gallery/GodForged Main Menu.mp4";
import HoudiniBuildingGenerator from "../../media/gallery/Houdini Building Generator.mp4";
import MetaconstructLightingPass from "../../media/gallery/Metaconstruct Lighting Pass 720p.mp4";
import FinalScreenshot1      from "../../media/gallery/Final Screenshot 1.png";
import FinisherBig           from "../../media/gallery/Finisher Big.mp4";

// Lookup: video src → thumbnail image src
const videoThumbnailMap: Record<string, string> = Object.fromEntries(
  videoAssets.map((a) => [a.src, a.thumbnail])
);

interface GallerySectionProps {
  onNavigateToGallery?: () => void;
}

type MediaItem = {
  src: string;
  title: string;
  description: string;
  type: "video" | "image";
};

const featuredVideos: MediaItem[] = [
  { src: GodForgedMainMenu,         title: "Godforged Main Menu",        description: "Game menu UI",          type: "video" },
  { src: HoudiniBuildingGenerator,  title: "Houdini Procedural Building", description: "Procedural generation", type: "video" },
  { src: MetaconstructLightingPass, title: "Metaconstruct Lighting Pass", description: "VFX animation",         type: "video" },
  { src: FinalScreenshot1,          title: "Final Screenshot 1",          description: "Game screenshot",       type: "image" },
  { src: Hellbound,                 title: "Hellbound",                   description: "VFX animation",         type: "video" },
  { src: FinisherBig,               title: "Finisher Big",                description: "VFX animation",         type: "video" },
];

export function GallerySection({ onNavigateToGallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Display video refs — used for play/pause management only.
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Thumbnail for each item: preloaded image or image src directly.
  const thumbSrcs = featuredVideos.map((media) =>
    media.type === "image" ? media.src : (videoThumbnailMap[media.src] ?? null)
  );

  // ── Play/pause management ─────────────────────────────────────────────────
  // Only the active video plays. All others are paused and rewound.
  const prevIndexRef = useRef<number>(-1);

  useEffect(() => {
    const prev = prevIndexRef.current;
    const curr = currentIndex;

    if (prev !== -1 && prev !== curr) {
      const prevVid = videoRefs.current[prev];
      if (prevVid) {
        prevVid.pause();
        prevVid.currentTime = 0;
      }
    }

    const currVid = videoRefs.current[curr];
    if (currVid) {
      void currVid.play().catch(() => {});
    }

    prevIndexRef.current = curr;
  }, [currentIndex]);

  return (
    <section className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Gallery
        </h2>

        <div className="relative rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 mb-12">
          {/* ── Main display: media items stacked, only the selected one is visible ── */}
          <div className="relative h-[624px] overflow-hidden bg-black">

            {featuredVideos.map((media, index) => (
              media.type === "video" ? (
                <video
                  key={media.src}
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={media.src}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity:       index === currentIndex ? 1 : 0,
                    zIndex:        index === currentIndex ? 1 : 0,
                    transition:    "opacity 150ms ease",
                    pointerEvents: index === currentIndex ? "auto" : "none",
                  }}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  key={media.src}
                  src={media.src}
                  alt={media.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity:    index === currentIndex ? 1 : 0,
                    zIndex:     index === currentIndex ? 1 : 0,
                    transition: "opacity 150ms ease",
                  }}
                />
              )
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />

            <div className="absolute bottom-[132px] left-0 right-0 px-6 z-10">
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {featuredVideos[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-sm font-medium">
                {featuredVideos[currentIndex].description}
              </p>
            </div>

            {/* ── Thumbnail strip: preloaded images ── */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2 overflow-hidden z-10">
              {featuredVideos.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-1 min-w-0 h-[104px] rounded-lg overflow-hidden border-2 transition duration-100 bg-black ${
                    index === currentIndex
                      ? "border-accent-amber scale-105"
                      : "border-border/50"
                  }`}
                >
                  {thumbSrcs[index] ? (
                    <img
                      src={thumbSrcs[index]!}
                      alt={media.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900" />
                  )}
                  {index !== currentIndex && (
                    <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition duration-100 z-10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

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
