import detailsCsv from "./Portfolio Website - Sheet1.csv?raw";
import thumbsCsv from "./Portfolio Website Thumbnail - Sheet1.csv?raw";

// Import thumbnail images
import ghostCtrlThumb from "../media/thumbnails/Ghost CTRL Thumbnail.png";
import finalShotThumb from "../media/thumbnails/Final Shot Thumbnail.png";
import rogueDataThumb from "../media/thumbnails/Rogue Data Thumbnail.png";
import metaconstructThumb from "../media/thumbnails/METACONSTRUCT Thumbnail.png";
import tinySheriffThumb from "../media/thumbnails/Tiny Sheriff Thumbnail.png";
import insomniacThumb from "../media/thumbnails/Insomniac Thumbnail.png";

// Map project titles (lowercased) to their thumbnail images.
// Add a new entry here whenever a new project thumbnail is added.
const thumbnailMap: Record<string, string> = {
  "ghost ctrl": ghostCtrlThumb,
  "final shot": finalShotThumb,
  "rogue data": rogueDataThumb,
  "metaconstruct": metaconstructThumb,
  "tiny sheriff": tinySheriffThumb,
  "insomniac": insomniacThumb,
};

const statusMap: Record<string, string> = {
  "ghost ctrl": "Released",
  "tiny sheriff": "Released",
  "insomniac": "Finished",
  "metaconstruct": "Finished",
  "final shot": "Finished",
  "rogue data": "Finished",
  "project quiver": "In Development",
};

const getThumbnailForProject = (title: string): string => {
  const normalizedTitle = title.toLowerCase();
  // Fall back to Ghost CTRL thumbnail as a placeholder for projects without their own
  return thumbnailMap[normalizedTitle] || ghostCtrlThumb;
};

// Dynamically import all project gallery images at build time
const projectImageModules = import.meta.glob<{ default: string }>(
  "../media/projects/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true }
);

// Normalize project title to folder name (lowercase, remove spaces and special chars).
// This matches folder names like "ghostctrl", "roguedata", "insomniac".
const normalizeTitleToFolder = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Explicit overrides: use when the folder name doesn't match the normalized title.
// Key = normalized title (output of normalizeTitleToFolder), Value = actual folder name.
const folderOverrides: Record<string, string> = {
  // e.g. "ghostcore": "ghost-core"  ← add entries here as needed
};

// Get gallery images for a project based on its title
const getGalleryImagesForProject = (title: string): string[] => {
  const normalized = normalizeTitleToFolder(title);
  const folderName = folderOverrides[normalized] ?? normalized;
  const images: string[] = [];

  for (const [path, module] of Object.entries(projectImageModules)) {
    // Path format: ../media/projects/[folderName]/[...subdirs/]image.ext
    // We match only the immediate subfolder of "projects/" to avoid subdirectory images.
    const pathParts = path.split("/");
    const projectsIndex = pathParts.indexOf("projects");
    if (projectsIndex !== -1 && pathParts[projectsIndex + 1] === folderName) {
      images.push(module.default);
    }
  }

  // Sort images by filename for consistent ordering
  return images.sort();
};

interface CsvData {
  headers: string[];
  rows: string[][];
  headerIndex: Record<string, number>;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  year: string;
  shortDescription: string;
  tags: string[];
  platform: string;
  engine: string;
  teamSize: string;
  role: string;
  language: string;
  duration: string;
  description: string;
  challenges: string;
  process: string;
  custom1: string;
  custom2: string;
  liveProjectUrl: string;
  sourceCodeUrl: string;
  image: string;
  status: string;
  galleryImages: string[];
}

const parseCsv = (raw: string): CsvData => {
  const text = raw.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === "\"") {
        const nextChar = text[i + 1];
        if (nextChar === "\"") {
          field += "\"";
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headers = (rows.shift() || []).map((header) => header.trim());
  const headerIndex: Record<string, number> = {};

  headers.forEach((header, idx) => {
    if (header) {
      headerIndex[header] = idx;
    }
  });

  return { headers, rows, headerIndex };
};

const normalizeCell = (value: string | undefined | null): string => {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : "N/A";
};

const getCell = (
  row: string[],
  headerIndex: Record<string, number>,
  header: string
): string => {
  const idx = headerIndex[header];
  if (idx === undefined) {
    return "N/A";
  }
  return normalizeCell(row[idx]);
};

const getUrlCell = (
  row: string[],
  headerIndex: Record<string, number>,
  header: string
): string => {
  const idx = headerIndex[header];
  if (idx === undefined) {
    return "";
  }
  const value = (row[idx] ?? "").trim();
  return value.length > 0 && value !== "N/A" ? value : "";
};

const buildSlug = (value: string): string => {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .trim() || "n-a"
  );
};

const collectTags = (
  row: string[],
  headerIndex: Record<string, number>
): string[] => {
  const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"].map((header) =>
    getCell(row, headerIndex, header)
  );
  return tags.filter((tag) => tag !== "N/A");
};

const buildDetailRecords = (csv: CsvData) => {
  return csv.rows.map((row) => {
    const title = getCell(row, csv.headerIndex, "Project Name");

    return {
      title,
      slug: buildSlug(title),
      year: getCell(row, csv.headerIndex, "Year"),
      platform: getCell(row, csv.headerIndex, "Platform"),
      engine: getCell(row, csv.headerIndex, "Engine"),
      teamSize: getCell(row, csv.headerIndex, "Team Size"),
      role: getCell(row, csv.headerIndex, "Role"),
      language: getCell(row, csv.headerIndex, "Language"),
      duration: getCell(row, csv.headerIndex, "Duration"),
      description: getCell(row, csv.headerIndex, "Description"),
      challenges: getCell(row, csv.headerIndex, "Challenges"),
      process: getCell(row, csv.headerIndex, "Process"),
      custom1: getCell(row, csv.headerIndex, "Custom 1"),
      custom2: getCell(row, csv.headerIndex, "Custom 2"),
      liveProjectUrl: getUrlCell(row, csv.headerIndex, "Live Project URL"),
      sourceCodeUrl: getUrlCell(row, csv.headerIndex, "Source Code URL")
    };
  });
};

const buildThumbnailRecords = (csv: CsvData) => {
  return csv.rows.map((row) => {
    const title = getCell(row, csv.headerIndex, "Title");

    return {
      title,
      slug: buildSlug(title),
      year: getCell(row, csv.headerIndex, "Year"),
      shortDescription: getCell(row, csv.headerIndex, "Short Description"),
      tags: collectTags(row, csv.headerIndex)
    };
  });
};

const mergeRecords = (details: ReturnType<typeof buildDetailRecords>, thumbnails: ReturnType<typeof buildThumbnailRecords>): ProjectRecord[] => {
  const thumbByTitle = new Map(
    thumbnails.map((thumb) => [thumb.title.toLowerCase(), thumb])
  );

  return details.map((detail) => {
    const normalizedTitle = detail.title.toLowerCase();
    const thumbnail = thumbByTitle.get(detail.title.toLowerCase());
    const mergedTags = thumbnail?.tags?.length ? thumbnail.tags : [];
    const shortDescription = thumbnail?.shortDescription ?? "N/A";
    const year = detail.year !== "N/A" ? detail.year : thumbnail?.year ?? "N/A";

    return {
      id: detail.slug,
      slug: detail.slug,
      title: detail.title,
      year,
      shortDescription,
      tags: mergedTags,
      platform: detail.platform,
      engine: detail.engine,
      teamSize: detail.teamSize,
      role: detail.role,
      language: detail.language,
      duration: detail.duration,
      description: detail.description,
      challenges: detail.challenges,
      process: detail.process,
      custom1: detail.custom1,
      custom2: detail.custom2,
      liveProjectUrl: detail.liveProjectUrl,
      sourceCodeUrl: detail.sourceCodeUrl,
      image: getThumbnailForProject(detail.title),
      status: statusMap[normalizedTitle] || "N/A",
      galleryImages: getGalleryImagesForProject(detail.title)
    };
  });
};

const details = parseCsv(detailsCsv);
const thumbnails = parseCsv(thumbsCsv);

export const projects: ProjectRecord[] = mergeRecords(
  buildDetailRecords(details),
  buildThumbnailRecords(thumbnails)
);

export const projectsBySlug: Record<string, ProjectRecord> = Object.fromEntries(
  projects.map((project) => [project.slug, project])
);

export const featuredProjects: ProjectRecord[] = projects.slice(0, 3);
