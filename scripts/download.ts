import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ExcelJS from "exceljs";
import { config } from "../config.ts";

const link = process.env.CAL_LINK || config.sourceUrl;
const url = new URL(link);
if (url.hostname.endsWith(".sharepoint.com")) url.searchParams.set("download", "1");
// SharePoint sets a cookie on the sharing-link redirect. wget keeps that cookie;
// Node's fetch does not maintain a cookie jar across redirects.
const args = ["--quiet", "--timeout=25", "--tries=2", "--output-document=-", url.href];
const command = process.platform === "win32" ? "wsl.exe" : "wget";
const commandArgs = process.platform === "win32" ? ["--exec", "wget", ...args] : args;
let buffer: ArrayBuffer;
try {
	const { stdout } = await promisify(execFile)(command, commandArgs, {
		encoding: "buffer",
		maxBuffer: 20 * 1024 * 1024,
		timeout: 90_000,
		windowsHide: true,
	});
	buffer = Uint8Array.from(stdout).buffer;
} catch (error) {
	const code = (error as NodeJS.ErrnoException).code;
	throw new Error(`wget download failed (${code ?? "unknown error"}). Ensure wget is installed (in the default WSL distribution on Windows) and CAL_LINK is accessible.`, { cause: error });
}
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
