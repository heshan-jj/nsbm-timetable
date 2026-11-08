import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { config } from "../config.ts";

const link = process.env.CAL_LINK;
if (!link) throw new Error("Set CAL_LINK to the live NSBM workbook download URL");
const url = new URL(link);
if (url.hostname.endsWith(".sharepoint.com")) url.searchParams.set("download", "1");
const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
if (!response.ok) throw new Error(`Workbook download failed (${response.status}). Check CAL_LINK and anonymous access.`);
const buffer = await response.arrayBuffer();
const workbook = new ExcelJS.Workbook();
try {
	await workbook.xlsx.load(buffer);
} catch {
	throw new Error("The URL did not return an Excel workbook. SharePoint may require sign-in; use a direct link accessible without authentication.");
}
if (!workbook.getWorksheet(config.worksheetName)) throw new Error(`Downloaded workbook is missing ${config.worksheetName}`);
await mkdir("downloaded", { recursive: true });
const target = `downloaded/${config.fileNameWithExt}`;
const temporary = `${target}.tmp`;
try {
	await writeFile(temporary, new Uint8Array(buffer));
	await rename(temporary, target);
} finally {
	await rm(temporary, { force: true });
}
console.log(`Downloaded ${target}`);
