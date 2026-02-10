import detailsCsv from "../../profile info/Portfolio Website - Sheet1.csv?raw";
import thumbsCsv from "../../profile info/Portfolio Website Thumbnail - Sheet1.csv?raw";

const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1765606290905-b9d377ea4d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNoYXJhY3RlciUyMGFydHxlbnwxfHx8fDE3NzAwNjY5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080";

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
  image: string;
  status: string;
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
      custom2: getCell(row, csv.headerIndex, "Custom 2")
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
      image: DEFAULT_PROJECT_IMAGE,
      status: "N/A"
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
export { DEFAULT_PROJECT_IMAGE };
