/**
 * assetManifest.ts
 *
 * Single source of truth for every preloadable asset in the portfolio.
 * All URLs here are resolved at build time by Vite (hashed, CDN-ready).
 *
 * The LoadingScreen consumes this manifest to track accurate per-file
 * progress. Adding or removing assets only requires changing this file.
 */

// ── Headshot ──────────────────────────────────────────────────────────────────
import headshot from "../media/portfolio-headshot.png";

// ── Project thumbnails ────────────────────────────────────────────────────────
import ghostCtrlThumb      from "../media/thumbnails/Ghost CTRL Thumbnail.png";
import finalShotThumb      from "../media/thumbnails/Final Shot Thumbnail.png";
import rogueDataThumb      from "../media/thumbnails/Rogue Data Thumbnail.png";
import metaconstructThumb  from "../media/thumbnails/METACONSTRUCT Thumbnail.png";
import tinySheriffThumb    from "../media/thumbnails/Tiny Sheriff Thumbnail.jpg";
import godforgedThumb      from "../media/thumbnails/GODFORGED Thumbnail.png";

// ── Gallery images ────────────────────────────────────────────────────────────
import HighresScreenshot00012 from "../media/gallery/HighresScreenshot00012.png";
import HighresScreenshot00010 from "../media/gallery/HighresScreenshot00010.png";
import HighresScreenshot00004 from "../media/gallery/HighresScreenshot00004.png";
import FinalScreenshot1       from "../media/gallery/Final Screenshot 1.png";
import FinalScreenshot2       from "../media/gallery/Final Screenshot 2.png";
import FinalScreenshot3       from "../media/gallery/Final Screenshot 3.png";
import FinalScreenshot4       from "../media/gallery/Final Screenshot 4.png";
import FinalScreenshot5       from "../media/gallery/Final Screenshot 5.png";
import FinalScreenshot6       from "../media/gallery/Final Screenshot 6.png";

// ── Gallery videos (web-optimized — see VIDEO_ENCODING.md) ───────────────────
import Hellbound                from "../media/gallery/Hellbound.mp4";
import Island                   from "../media/gallery/Island.mp4";
import Snow                     from "../media/gallery/Snow.mp4";
import BoulderDestruction       from "../media/gallery/Boulder Destruction.mp4";
import Sparks                   from "../media/gallery/Sparks.mp4";
import Lighting                 from "../media/gallery/Lighting.mp4";
import GrenadeToon              from "../media/gallery/Grenade Toon.mp4";
import Rocket                   from "../media/gallery/Rocket.mp4";
import FinisherBig              from "../media/gallery/Finisher Big.mp4";
import Grenade                  from "../media/gallery/Grenade.mp4";
import FinisherSmall            from "../media/gallery/Finisher Small.mp4";
import Campfire                 from "../media/gallery/Campfire.mp4";
import Flamethrower             from "../media/gallery/Flamethrower.mp4";
import RenderTargetFogOfWar     from "../media/gallery/Render Target Fog-of-War.mp4";
import MetaconstructLightingPass from "../media/gallery/Metaconstruct Lighting Pass 720p.mp4";
import GodForgedMainMenu        from "../media/gallery/GodForged Main Menu.mp4";
import PyGameGamejams           from "../media/gallery/PyGame Gamejams.mp4";
import HoudiniBuildingGenerator from "../media/gallery/Houdini Building Generator.mp4";

// ── Project gallery images (via glob — all project subfolders) ────────────────
const projectImageModules = import.meta.glob<{ default: string }>(
  "../media/projects/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true }
);
const projectImages: string[] = Object.values(projectImageModules).map(
  (m) => m.default
);

// ── Typed asset descriptors ───────────────────────────────────────────────────

export interface ImageAsset {
  type: "image";
  src: string;
  label: string;
}

export interface VideoAsset {
  type: "video";
  src: string;
  label: string;
}

export type Asset = ImageAsset | VideoAsset;

// ── Image manifest ────────────────────────────────────────────────────────────

export const imageAssets: ImageAsset[] = [
  // Core UI images — highest visual priority, loaded first
  { type: "image", src: headshot,               label: "headshot"              },
  // Thumbnails
  { type: "image", src: ghostCtrlThumb,         label: "thumb-ghostctrl"       },
  { type: "image", src: finalShotThumb,         label: "thumb-finalshot"       },
  { type: "image", src: rogueDataThumb,         label: "thumb-roguedata"       },
  { type: "image", src: metaconstructThumb,     label: "thumb-metaconstruct"   },
  { type: "image", src: tinySheriffThumb,       label: "thumb-tinysheriff"     },
  { type: "image", src: godforgedThumb,         label: "thumb-godforged"       },
  // Gallery stills
  { type: "image", src: HighresScreenshot00012, label: "gallery-hr12"          },
  { type: "image", src: HighresScreenshot00010, label: "gallery-hr10"          },
  { type: "image", src: HighresScreenshot00004, label: "gallery-hr04"          },
  { type: "image", src: FinalScreenshot1,       label: "gallery-final1"        },
  { type: "image", src: FinalScreenshot2,       label: "gallery-final2"        },
  { type: "image", src: FinalScreenshot3,       label: "gallery-final3"        },
  { type: "image", src: FinalScreenshot4,       label: "gallery-final4"        },
  { type: "image", src: FinalScreenshot5,       label: "gallery-final5"        },
  { type: "image", src: FinalScreenshot6,       label: "gallery-final6"        },
  // Project gallery images (dynamically discovered via glob)
  ...projectImages.map((src, i): ImageAsset => ({
    type: "image",
    src,
    label: `project-img-${i}`,
  })),
];

// ── Video manifest ────────────────────────────────────────────────────────────

export const videoAssets: VideoAsset[] = [
  { type: "video", src: Hellbound,                 label: "Hellbound"                   },
  { type: "video", src: Island,                    label: "Island"                      },
  { type: "video", src: Snow,                      label: "Snow"                        },
  { type: "video", src: BoulderDestruction,        label: "Boulder Destruction"         },
  { type: "video", src: Sparks,                    label: "Sparks"                      },
  { type: "video", src: Lighting,                  label: "Lighting"                    },
  { type: "video", src: GrenadeToon,               label: "Grenade Toon"                },
  { type: "video", src: Rocket,                    label: "Rocket"                      },
  { type: "video", src: FinisherBig,               label: "Finisher Big"                },
  { type: "video", src: Grenade,                   label: "Grenade"                     },
  { type: "video", src: FinisherSmall,             label: "Finisher Small"              },
  { type: "video", src: Campfire,                  label: "Campfire"                    },
  { type: "video", src: Flamethrower,              label: "Flamethrower"                },
  { type: "video", src: RenderTargetFogOfWar,      label: "Render Target Fog-of-War"    },
  { type: "video", src: MetaconstructLightingPass, label: "Metaconstruct Lighting Pass" },
  { type: "video", src: GodForgedMainMenu,         label: "GodForged Main Menu"         },
  { type: "video", src: PyGameGamejams,            label: "PyGame Gamejams"             },
  { type: "video", src: HoudiniBuildingGenerator,  label: "Houdini Building Generator"  },
];

// ── Combined flat manifest ────────────────────────────────────────────────────

export const allAssets: Asset[] = [...imageAssets, ...videoAssets];
