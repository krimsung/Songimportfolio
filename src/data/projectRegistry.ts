/**
 * Standalone project registry — single source of truth for the projects list page
 * and project card grid. Fully decoupled from CSV files.
 *
 * To add a new project:
 *  1. Create its page component in src/app/projects/<slug>.tsx
 *  2. Add a thumbnail import below
 *  3. Add an entry to PROJECT_REGISTRY
 *  4. Wire the slug in App.tsx
 */

import ghostCtrlThumb      from "../media/thumbnails/Ghost CTRL Thumbnail.png";
import ghostCoreThumb      from "../media/thumbnails/Ghost Core Thumbnail.png";
import finalShotThumb      from "../media/thumbnails/Final Shot Thumbnail.png";
import rogueDataThumb      from "../media/thumbnails/Rogue Data Thumbnail.png";
import metaconstructThumb  from "../media/thumbnails/METACONSTRUCT Thumbnail.png";
import tinySheriffThumb    from "../media/thumbnails/Tiny Sheriff Thumbnail.png";
import insomniacThumb      from "../media/thumbnails/Insomniac Thumbnail.png";
import deHeavyHazardThumb     from "../media/projects/de_heavy_hazard/Untitled-1.png";
import zmLilaPanicThumb       from "../media/projects/zm_lila_panic remake/thumbnail.png";
import ggNorthernPatrolThumb  from "../media/projects/gg_northern_patrol/Untitled-2.png";
import csSubjectivityThumb    from "../media/projects/cs_subjectivity/20251022164020_1.jpg";

export type ProjectStatus = "Released" | "Finished" | "In Development";

export interface ProjectEntry {
  /** URL slug — must match the hash route: #/projects/<slug> */
  slug:             string;
  title:            string;
  year:             string;
  status:           ProjectStatus;
  shortDescription: string;
  tags:             string[];
  image:            string;
}

export const PROJECT_REGISTRY: ProjectEntry[] = [
  // ── Source Engine works (merged into main list) ───────────────────────────
  {
    slug:             "de-heavy-hazard",
    title:            "Heavy Hazard",
    year:             "2016",
    status:           "Finished",
    shortDescription: "DE_ map built in the Source engine",
    tags:             ["Source", "Level Design", "Solo"],
    image:            deHeavyHazardThumb,
  },
  {
    slug:             "zm-lila-panic-remake",
    title:            "Lila Panic Remake",
    year:             "2014",
    status:           "Finished",
    shortDescription: "ZM_ map remake built in the Source engine",
    tags:             ["Source", "Level Design", "Solo"],
    image:            zmLilaPanicThumb,
  },
  {
    slug:             "gg-northern-patrol",
    title:            "Northern Patrol",
    year:             "2015",
    status:           "Finished",
    shortDescription: "GG_ map built in the Source engine",
    tags:             ["Source", "Level Design", "Solo"],
    image:            ggNorthernPatrolThumb,
  },
  {
    slug:             "cs-subjectivity",
    title:            "Subjectivity",
    year:             "2015",
    status:           "Finished",
    shortDescription: "CS_ map built in the Source engine",
    tags:             ["Source", "Level Design", "Solo"],
    image:            csSubjectivityThumb,
  },
  {
    slug:             "ghost-core",
    title:            "Ghost Core",
    year:             "2026",
    status:           "In Development",
    shortDescription: "Dystopian sci-fi first-person extraction shooter — full indie studio project",
    tags:             ["UE5", "Producer", "Level Design", "Tech Art", "Blueprint", "Team"],
    image:            ghostCoreThumb,
  },
  {
    slug:             "ghost-ctrl",
    title:            "Ghost CTRL",
    year:             "2025",
    status:           "Released",
    shortDescription: "Dystopian cyberpunk extraction shooter with playable demo",
    tags:             ["UE5", "Level Design", "Tech Art", "Solo", "Blueprint"],
    image:            ghostCtrlThumb,
  },
  {
    slug:             "final-shot",
    title:            "Final Shot",
    year:             "2025",
    status:           "Finished",
    shortDescription: "48-hour rapid prototype featuring magical spells",
    tags:             ["UE5", "Blueprint", "Tech Art", "Solo"],
    image:            finalShotThumb,
  },
  {
    slug:             "rogue-data",
    title:            "Rogue Data",
    year:             "2025",
    status:           "Finished",
    shortDescription: "2D movement platformer focused on level design",
    tags:             ["UE5", "Level Design", "Tech Art", "Solo", "Blueprint"],
    image:            rogueDataThumb,
  },
  {
    slug:             "metaconstruct",
    title:            "METACONSTRUCT",
    year:             "2024",
    status:           "Finished",
    shortDescription: "Polished FPS game featuring procedural generation",
    tags:             ["UE5", "Producer", "Procedural", "Team", "Blueprint", "Tech Art"],
    image:            metaconstructThumb,
  },
  {
    slug:             "tiny-sheriff",
    title:            "Tiny Sheriff",
    year:             "2025",
    status:           "Released",
    shortDescription: "2D movement platformer where weapons become traversal tools, built in Unity.",
    tags:             ["Unity", "C#", "Tech Art", "Team"],
    image:            tinySheriffThumb,
  },
  // Hidden until further development — uncomment to restore
  // {
  //   slug:             "project-quiver",
  //   title:            "Project Quiver",
  //   year:             "2026",
  //   status:           "In Development",
  //   shortDescription: "Multiplayer movement-driven PvP roguelike — currently in prototype",
  //   tags:             ["UE5", "Procedural", "GAS", "Team"],
  //   image:            ghostCtrlThumb,
  // },
  {
    slug:             "insomniac",
    title:            "Insomniac",
    year:             "2025",
    status:           "Finished",
    shortDescription: "Walking simulator set in a dystopian underground South Korean megastructure",
    tags:             ["UE5", "Level Design", "Solo", "Blueprint"],
    image:            insomniacThumb,
  },
];

/** Lookup by slug for O(1) routing checks */
export const PROJECT_REGISTRY_BY_SLUG: Record<string, ProjectEntry> = Object.fromEntries(
  PROJECT_REGISTRY.map((p) => [p.slug, p])
);

/** Combined lookup — all projects by slug */
export const ALL_PROJECTS_BY_SLUG: Record<string, ProjectEntry> = PROJECT_REGISTRY_BY_SLUG;
