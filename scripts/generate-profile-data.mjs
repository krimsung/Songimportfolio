import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const inputDir = path.join(rootDir, "src", "profile info");
const outputDir = path.join(inputDir, "generated");

const detailsCsvPath = path.join(inputDir, "Portfolio Website - Sheet1.csv");
const thumbnailCsvPath = path.join(inputDir, "Portfolio Website Thumbnail - Sheet1.csv");

const DETAILS_HEADERS = [
	"Project Name",
	"Platform",
	"Engine",
	"Team Size",
	"Role",
	"Language",
	"Duration",
	"Description",
	"Challenges",
	"Process",
	"Custom 1",
	"Custom 2",
	"Year"
];

const THUMB_HEADERS = [
	"Title",
	"Short Description",
	"Tag 1",
	"Tag 2",
	"Tag 3",
	"Tag 4",
	"Year"
];

const warnings = [];
const warnedHeaders = new Set();

const warn = (message) => {
	warnings.push(message);
};

const warnMissingHeader = (header, csvName) => {
	const key = `${csvName}:${header}`;
	if (!warnedHeaders.has(key)) {
		warnedHeaders.add(key);
		warn(`Missing header "${header}" in ${csvName}; defaulting values to N/A.`);
	}
};

const parseCsv = (raw) => {
	const text = raw.replace(/^\uFEFF/, "");
	const rows = [];
	let row = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];

		if (inQuotes) {
			if (char === '"') {
				const nextChar = text[i + 1];
				if (nextChar === '"') {
					field += '"';
					i += 1;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
			continue;
		}

		if (char === '"') {
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
	return { headers, rows };
};

const buildHeaderIndex = (headers) => {
	const index = {};
	headers.forEach((header, idx) => {
		if (header) {
			index[header] = idx;
		}
	});
	return index;
};

const normalizeCell = (value, rowIndex, header, csvName) => {
	const normalized = (value ?? "").trim();
	if (normalized.length > 0) {
		return normalized;
	}
	warn(`Empty value for "${header}" in ${csvName} row ${rowIndex}; using N/A.`);
	return "N/A";
};

const getCell = (row, headerIndex, header, rowIndex, csvName) => {
	const idx = headerIndex[header];
	if (idx === undefined) {
		warnMissingHeader(header, csvName);
		return "N/A";
	}
	return normalizeCell(row[idx], rowIndex, header, csvName);
};

const buildSlug = (value) => {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "")
		.trim() || "n-a";
};

const collectTags = (row, headerIndex, rowIndex, csvName) => {
	const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"].map((header) =>
		getCell(row, headerIndex, header, rowIndex, csvName)
	);
	return tags.filter((tag) => tag !== "N/A");
};

const loadCsv = async (filePath, csvName) => {
	const raw = await fs.readFile(filePath, "utf8");
	const { headers, rows } = parseCsv(raw);
	const headerIndex = buildHeaderIndex(headers);

	return { headers, headerIndex, rows, csvName };
};

const buildDetailRecords = (csv) => {
	return csv.rows.map((row, index) => {
		const rowIndex = index + 2;
		const title = getCell(row, csv.headerIndex, "Project Name", rowIndex, csv.csvName);

		return {
			title,
			slug: buildSlug(title),
			year: getCell(row, csv.headerIndex, "Year", rowIndex, csv.csvName),
			platform: getCell(row, csv.headerIndex, "Platform", rowIndex, csv.csvName),
			engine: getCell(row, csv.headerIndex, "Engine", rowIndex, csv.csvName),
			teamSize: getCell(row, csv.headerIndex, "Team Size", rowIndex, csv.csvName),
			role: getCell(row, csv.headerIndex, "Role", rowIndex, csv.csvName),
			language: getCell(row, csv.headerIndex, "Language", rowIndex, csv.csvName),
			duration: getCell(row, csv.headerIndex, "Duration", rowIndex, csv.csvName),
			description: getCell(row, csv.headerIndex, "Description", rowIndex, csv.csvName),
			challenges: getCell(row, csv.headerIndex, "Challenges", rowIndex, csv.csvName),
			process: getCell(row, csv.headerIndex, "Process", rowIndex, csv.csvName),
			custom1: getCell(row, csv.headerIndex, "Custom 1", rowIndex, csv.csvName),
			custom2: getCell(row, csv.headerIndex, "Custom 2", rowIndex, csv.csvName)
		};
	});
};

const buildThumbnailRecords = (csv) => {
	return csv.rows.map((row, index) => {
		const rowIndex = index + 2;
		const title = getCell(row, csv.headerIndex, "Title", rowIndex, csv.csvName);

		return {
			title,
			slug: buildSlug(title),
			year: getCell(row, csv.headerIndex, "Year", rowIndex, csv.csvName),
			shortDescription: getCell(row, csv.headerIndex, "Short Description", rowIndex, csv.csvName),
			tags: collectTags(row, csv.headerIndex, rowIndex, csv.csvName)
		};
	});
};

const mergeRecords = (details, thumbnails) => {
	const thumbByTitle = new Map(
		thumbnails.map((thumb) => [thumb.title.toLowerCase(), thumb])
	);

	return details
		.map((detail) => {
			const thumbnail = thumbByTitle.get(detail.title.toLowerCase());
			const mergedTags = thumbnail?.tags?.length ? thumbnail.tags : [];
			const shortDescription = thumbnail?.shortDescription ?? "N/A";
			const year = detail.year !== "N/A" ? detail.year : thumbnail?.year ?? "N/A";

			if (!thumbnail) {
				warn(`No thumbnail row found for "${detail.title}"; using N/A defaults.`);
			}

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
				status: "N/A"
			};
		})
		.sort((a, b) => a.title.localeCompare(b.title));
};

const writeJson = async (filePath, data) => {
	const content = `${JSON.stringify(data, null, 2)}\n`;
	await fs.writeFile(filePath, content, "utf8");
};

const ensureHeaders = (csv, expectedHeaders) => {
	expectedHeaders.forEach((header) => {
		if (!csv.headers.includes(header)) {
			warnMissingHeader(header, csv.csvName);
		}
	});
};

const main = async () => {
	await fs.mkdir(outputDir, { recursive: true });

	const detailsCsv = await loadCsv(detailsCsvPath, "Portfolio Website - Sheet1.csv");
	const thumbsCsv = await loadCsv(thumbnailCsvPath, "Portfolio Website Thumbnail - Sheet1.csv");

	ensureHeaders(detailsCsv, DETAILS_HEADERS);
	ensureHeaders(thumbsCsv, THUMB_HEADERS);

	const detailRecords = buildDetailRecords(detailsCsv);
	const thumbnailRecords = buildThumbnailRecords(thumbsCsv);
	const mergedRecords = mergeRecords(detailRecords, thumbnailRecords);

	await writeJson(path.join(outputDir, "projects.json"), mergedRecords);
	await writeJson(path.join(outputDir, "thumbnails.json"), thumbnailRecords);

	if (warnings.length > 0) {
		console.warn("\nCSV generation warnings:");
		warnings.forEach((message) => console.warn(`- ${message}`));
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
