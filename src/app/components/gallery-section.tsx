import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { videoAssets } from "../assetManifest";

import Hellbound                 from "../../media/gallery/Hellbound.mp4";
import GodForgedMainMenu         from "../../media/gallery/GodForged Main Menu.mp4";
import HoudiniBuildingGenerator  from "../../media/gallery/Houdini Building Generator.mp4";
import MetaconstructLightingPass from "../../media/gallery/Metaconstruct Lighting Pass 720p.mp4";
import FinalScreenshot1          from "../../media/gallery/Final Screenshot 1.png";
import FinisherBig               from "../../media/gallery/Finisher Big.mp4";

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
  { src: GodForgedMainMenu,         title: "Godforged Main Menu",         description: "Game menu UI",          type: "video" },
  { src: HoudiniBuildingGenerator,  title: "Houdini Procedural Building",  description: "Procedural generation", type: "video" },
  { src: MetaconstructLightingPass, title: "Metaconstruct Lighting Pass",  description: "VFX animation",         type: "video" },
  { src: FinalScreenshot1,          title: "Final Screenshot 1",           description: "Game screenshot",       type: "image" },
  { src: Hellbound,                 title: "Hellbound",                    description: "VFX animation",         type: "video" },
  { src: FinisherBig,               title: "Finisher Big",                 description: "VFX animation",         type: "video" },
];

export function GallerySection({ onNavigateToGallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const thumbSrcs = featuredVideos.map((media) =>
    media.type === "image" ? media.src : (videoThumbnailMap[media.src] ?? null)
  );

  const prevIndexRef = useRef<number>(-1);

  useEffect(() => {
    const prev = prevIndexRef.current;
    const curr = currentIndex;

    if (prev !== -1 && prev !== curr) {
      const prevVid = videoRefs.current[prev];
      if (prevVid) { prevVid.pause(); prevVid.currentTime = 0; }
    }

    const currVid = videoRefs.current[curr];
    if (currVid) void currVid.play().catch(() => {});

    prevIndexRef.current = curr;
  }, [currentIndex]);

  return (
    /*
      Outer section: fills the full carousel panel height, centers the constrained
      content block horizontally (and optionally vertically via justify-center).

      Inner wrapper: max-w-6xl — same width cap as Featured Projects / About Me.
      The inner wrapper is also a flex column so the media container can flex-1
      to fill the available height between heading and CTA.
    */
    <section className="w-full h-full flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col" style={{ minHeight: 0, flex: "1 1 0%" }}>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 text-center flex-shrink-0">
          Gallery
        </h2>

        {/*
          Media container — takes all remaining space between heading and CTA.
          flex-1 min-h-0 is the critical combination: flex-1 grows, min-h-0 allows
          it to shrink below its intrinsic content height (required for flex children).
        */}
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50 flex flex-col mb-3 md:mb-4">

          {/* Main display */}
          <div className="relative flex-1 min-h-0 overflow-hidden bg-black">
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

            <div className="absolute bottom-3 md:bottom-4 left-0 right-0 px-4 md:px-6 z-10">
              <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold text-foreground mb-0.5">
                {featuredVideos[currentIndex].title}
              </h3>
              <p className="text-accent-amber text-xs md:text-sm font-medium">
                {featuredVideos[currentIndex].description}
              </p>
            </div>
          </div>

          {/* Thumbnail strip — 2-col grid on mobile, single row on sm+ */}
          <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-1.5 md:gap-2 p-1 sm:p-1.5 md:p-2 bg-black flex-shrink-0">
            {featuredVideos.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-full aspect-video sm:aspect-auto sm:flex-1 sm:min-w-0 sm:h-20 md:h-24 lg:h-28 rounded overflow-hidden border-2 transition duration-100 bg-black ${
                  index === currentIndex ? "border-accent-amber" : "border-border/50"
                }`}
                aria-label={`Show ${media.title}`}
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

        {/* CTA */}
        <div className="flex justify-end flex-shrink-0">
          <a
            href="#/gallery"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
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
