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
import ghostCtrlThumb     from "../media/thumbnails/Ghost CTRL Thumbnail.png";
import finalShotThumb     from "../media/thumbnails/Final Shot Thumbnail.png";
import rogueDataThumb     from "../media/thumbnails/Rogue Data Thumbnail.png";
import metaconstructThumb from "../media/thumbnails/METACONSTRUCT Thumbnail.png";
import tinySheriffThumb   from "../media/thumbnails/Tiny Sheriff Thumbnail.png";
import insomniacThumb     from "../media/thumbnails/Insomniac Thumbnail.png";

// ── Gallery still images ──────────────────────────────────────────────────────
import HighresScreenshot00012 from "../media/gallery/HighresScreenshot00012.png";
import HighresScreenshot00010 from "../media/gallery/HighresScreenshot00010.png";
import HighresScreenshot00004 from "../media/gallery/HighresScreenshot00004.png";
import FinalScreenshot1       from "../media/gallery/Final Screenshot 1.png";
import FinalScreenshot2       from "../media/gallery/Final Screenshot 2.png";
import FinalScreenshot3       from "../media/gallery/Final Screenshot 3.png";
import FinalScreenshot4       from "../media/gallery/Final Screenshot 4.png";
import FinalScreenshot5       from "../media/gallery/Final Screenshot 5.png";
import FinalScreenshot6       from "../media/gallery/Final Screenshot 6.png";
import FinalScreenshot7       from "../media/gallery/Final Screenshot 7.png";
import Screenshot1            from "../media/gallery/Screenshot_1.png";
import Screenshot2            from "../media/gallery/Screenshot_2.png";
import Screenshot3            from "../media/gallery/Screenshot_3.png";
import Screenshot4            from "../media/gallery/Screenshot_4.png";

// ── Gallery video thumbnails ──────────────────────────────────────────────────
import thumbHellbound                from "../media/gallery/thumbnail/Hellbound.png";
import thumbBlizzard                 from "../media/gallery/thumbnail/Blizzard.png";
import thumbBoulderDestruction       from "../media/gallery/thumbnail/Boulder Destruction.png";
import thumbCampfire                 from "../media/gallery/thumbnail/Campfire.png";
import thumbFinisherBig              from "../media/gallery/thumbnail/Finisher Big.png";
import thumbFinisherSmall            from "../media/gallery/thumbnail/Finisher Small.png";
import thumbFlamethrower             from "../media/gallery/thumbnail/Flamethrower.png";
import thumbGodForgedMainMenu        from "../media/gallery/thumbnail/GodForged Main Menu.png";
import thumbGrenade                  from "../media/gallery/thumbnail/Grenade.png";
import thumbGrenadeToon              from "../media/gallery/thumbnail/Grenade Toon.png";
import thumbHoudiniBuildingGenerator from "../media/gallery/thumbnail/Houdini Building Generator.png";
import thumbLightning                from "../media/gallery/thumbnail/Lightning.png";
import thumbMetaconstructLightingPass from "../media/gallery/thumbnail/Metaconstruct Lighting Pass 720p.png";
import thumbPyGameGamejams           from "../media/gallery/thumbnail/PyGame Gamejams.png";
import thumbRenderTargetFogOfWar     from "../media/gallery/thumbnail/Render Target Fog-of-War.png";
import thumbRocket                   from "../media/gallery/thumbnail/Rocket.png";
import thumbSparks                   from "../media/gallery/thumbnail/Sparks.png";
import thumbVFXIsland                from "../media/gallery/thumbnail/VFX Island.png";

// ── Gallery videos (web-optimized — see VIDEO_ENCODING.md) ───────────────────
import Hellbound                from "../media/gallery/Hellbound.mp4";
import VFXIsland                from "../media/gallery/VFX Island.mp4";
import Blizzard                 from "../media/gallery/Blizzard.mp4";
import BoulderDestruction       from "../media/gallery/Boulder Destruction.mp4";
import Sparks                   from "../media/gallery/Sparks.mp4";
import Lightning                from "../media/gallery/Lightning.mp4";
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
  /** Pre-made thumbnail image for this video — shown in gallery grid/strip. */
  thumbnail: string;
}

export type Asset = ImageAsset | VideoAsset;

// ── Image manifest ────────────────────────────────────────────────────────────

export const imageAssets: ImageAsset[] = [
  // Core UI
  { type: "image", src: headshot,               label: "headshot"              },
  // Project thumbnails
  { type: "image", src: ghostCtrlThumb,         label: "thumb-ghostctrl"       },
  { type: "image", src: finalShotThumb,         label: "thumb-finalshot"       },
  { type: "image", src: rogueDataThumb,         label: "thumb-roguedata"       },
  { type: "image", src: metaconstructThumb,     label: "thumb-metaconstruct"   },
  { type: "image", src: tinySheriffThumb,       label: "thumb-tinysheriff"     },
  { type: "image", src: insomniacThumb,         label: "thumb-insomniac"       },
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
  { type: "image", src: FinalScreenshot7,       label: "gallery-final7"        },
  { type: "image", src: Screenshot1,            label: "gallery-screenshot1"   },
  { type: "image", src: Screenshot2,            label: "gallery-screenshot2"   },
  { type: "image", src: Screenshot3,            label: "gallery-screenshot3"   },
  { type: "image", src: Screenshot4,            label: "gallery-screenshot4"   },
  // Gallery video thumbnails
  { type: "image", src: thumbHellbound,                label: "vthumb-hellbound"           },
  { type: "image", src: thumbBlizzard,                 label: "vthumb-blizzard"            },
  { type: "image", src: thumbBoulderDestruction,       label: "vthumb-boulderdestruction"  },
  { type: "image", src: thumbCampfire,                 label: "vthumb-campfire"            },
  { type: "image", src: thumbFinisherBig,              label: "vthumb-finisherbig"         },
  { type: "image", src: thumbFinisherSmall,            label: "vthumb-finishersmall"       },
  { type: "image", src: thumbFlamethrower,             label: "vthumb-flamethrower"        },
  { type: "image", src: thumbGodForgedMainMenu,        label: "vthumb-godforgedmainmenu"   },
  { type: "image", src: thumbGrenade,                  label: "vthumb-grenade"             },
  { type: "image", src: thumbGrenadeToon,              label: "vthumb-grenadetoon"         },
  { type: "image", src: thumbHoudiniBuildingGenerator, label: "vthumb-houdinibuildinggen"  },
  { type: "image", src: thumbLightning,                label: "vthumb-lightning"           },
  { type: "image", src: thumbMetaconstructLightingPass, label: "vthumb-metaconstruct"      },
  { type: "image", src: thumbPyGameGamejams,           label: "vthumb-pygamegamejams"      },
  { type: "image", src: thumbRenderTargetFogOfWar,     label: "vthumb-rendertargetfow"     },
  { type: "image", src: thumbRocket,                   label: "vthumb-rocket"              },
  { type: "image", src: thumbSparks,                   label: "vthumb-sparks"              },
  { type: "image", src: thumbVFXIsland,                label: "vthumb-vfxisland"           },
  // Project gallery images (dynamically discovered via glob)
  ...projectImages.map((src, i): ImageAsset => ({
    type: "image",
    src,
    label: `project-img-${i}`,
  })),
];

// ── Video manifest ────────────────────────────────────────────────────────────

export const videoAssets: VideoAsset[] = [
  { type: "video", src: Hellbound,                 label: "Hellbound",                   thumbnail: thumbHellbound                },
  { type: "video", src: VFXIsland,                 label: "VFX Island",                  thumbnail: thumbVFXIsland                },
  { type: "video", src: Blizzard,                  label: "Blizzard",                    thumbnail: thumbBlizzard                 },
  { type: "video", src: BoulderDestruction,        label: "Boulder Destruction",          thumbnail: thumbBoulderDestruction       },
  { type: "video", src: Sparks,                    label: "Sparks",                      thumbnail: thumbSparks                   },
  { type: "video", src: Lightning,                 label: "Lightning",                   thumbnail: thumbLightning                },
  { type: "video", src: GrenadeToon,               label: "Grenade Toon",                thumbnail: thumbGrenadeToon              },
  { type: "video", src: Rocket,                    label: "Rocket",                      thumbnail: thumbRocket                   },
  { type: "video", src: FinisherBig,               label: "Finisher Big",                thumbnail: thumbFinisherBig              },
  { type: "video", src: Grenade,                   label: "Grenade",                     thumbnail: thumbGrenade                  },
  { type: "video", src: FinisherSmall,             label: "Finisher Small",              thumbnail: thumbFinisherSmall            },
  { type: "video", src: Campfire,                  label: "Campfire",                    thumbnail: thumbCampfire                 },
  { type: "video", src: Flamethrower,              label: "Flamethrower",                thumbnail: thumbFlamethrower             },
  { type: "video", src: RenderTargetFogOfWar,      label: "Render Target Fog-of-War",    thumbnail: thumbRenderTargetFogOfWar     },
  { type: "video", src: MetaconstructLightingPass, label: "Metaconstruct Lighting Pass",  thumbnail: thumbMetaconstructLightingPass },
  { type: "video", src: GodForgedMainMenu,         label: "GodForged Main Menu",          thumbnail: thumbGodForgedMainMenu        },
  { type: "video", src: PyGameGamejams,            label: "PyGame Gamejams",              thumbnail: thumbPyGameGamejams           },
  { type: "video", src: HoudiniBuildingGenerator,  label: "Houdini Building Generator",   thumbnail: thumbHoudiniBuildingGenerator },
];

// Lookup map: video src → thumbnail image src
export const videoThumbnailMap: Record<string, string> = Object.fromEntries(
  videoAssets.map((a) => [a.src, a.thumbnail])
);

// ── Combined flat manifest ────────────────────────────────────────────────────

export const allAssets: Asset[] = [...imageAssets, ...videoAssets];
