import { config as dotenvConfig } from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { parseTimetable } from "./parser.ts";
import { config } from "./config.ts";
import { createCalendar } from "./calendar.ts";

dotenvConfig({ quiet: true });

async function readOptional(path: string): Promise<string | undefined> {
	try { return await readFile(path, "utf8"); }
	catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
		throw error;
	}
}

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(process.env.TIMETABLE_FILE ?? `downloaded/${config.fileNameWithExt}`);
const worksheet = workbook.getWorksheet(config.worksheetName);
if (!worksheet) throw new Error(`Worksheet not found: ${config.worksheetName}`);
console.log(worksheet.getCell(config.summaryCell).text.trim());
const events = parseTimetable(worksheet, config);
await mkdir("ics", { recursive: true });
const previous = JSON.parse(await readOptional("config.json") ?? "{}");
let changed = false;

for (const degree of config.degrees) {
	const path = `ics/${degree}.ics`;
	const contents = createCalendar(events, degree);
	if (await readOptional(path) !== contents) changed = true;
	await writeFile(path, contents);
	console.log(`Wrote ${path} (${events.length} events)`);
}

await writeFile("config.json", JSON.stringify({
	baseUrl: process.env.CALENDAR_BASE_URL ?? config.baseUrl,
	lastUpdated: changed || !previous.lastUpdated ? new Date().toISOString() : previous.lastUpdated,
	modules: config.modules,
	degrees: config.degrees,
	degreeNames: config.degreeNames,
	degreeModules: config.degreeModules,
}, null, 2) + "\n");
console.log(changed ? "Timetable changed" : "Timetable unchanged");
