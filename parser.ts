import type { Cell, CellValue, Worksheet } from "exceljs";
import { fromZonedTime } from "date-fns-tz";
import { LK_TZ } from "./config.ts";

export interface TimetableEvent {
	start: Date;
	end: Date;
	summary: string;
}

export function cellDate(value: CellValue): Date | undefined {
	if (value instanceof Date && Number.isFinite(value.getTime())) return value;
	if (value && typeof value === "object" && "result" in value) return cellDate(value.result);
}

/** Times in this workbook are text, e.g. `9am - 10am` or `12:30pm - 1pm`. */
export function parseTimeSlot(text: string): [number, number] | undefined {
	const match = text.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
	if (!match) return;
	const minutes = (hour: string, minute: string | undefined, period: string) => {
		const h = Number(hour), m = Number(minute ?? 0);
		if (h < 1 || h > 12 || m > 59) throw new Error(`Invalid time: ${text}`);
		return (h % 12 + (period.toLowerCase() === "pm" ? 12 : 0)) * 60 + m;
	};
	const start = minutes(match[1]!, match[2], match[3]!);
	const end = minutes(match[4]!, match[5], match[6]!);
	if (end <= start) throw new Error(`Invalid time range: ${text}`);
	return [start, end];
}

function localTime(date: Date, minutes: number): Date {
	const day = date.toISOString().slice(0, 10);
	const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
	const minute = String(minutes % 60).padStart(2, "0");
	return fromZonedTime(`${day}T${hour}:${minute}:00`, LK_TZ);
}

function cellText(cell: Cell): string {
	const master = cell.master;
	return master.value == null ? "" : master.text;
}

export function parseTimetable(
	worksheet: Worksheet,
	settings: { dataStartIndex: number; weekDaysArr: readonly number[]; timeColumn: number },
): TimetableEvent[] {
	let dates: Date[] | undefined;
	const slots: TimetableEvent[] = [];
	for (let row = settings.dataStartIndex; row <= worksheet.rowCount; row++) {
		const rowDates = settings.weekDaysArr.map(col => cellDate(worksheet.getCell(row, col).value));
		if (rowDates.every((date): date is Date => date !== undefined)) {
			// Preserve each source date, including the inconsistent years in Weeks 2 and 7.
			dates = rowDates;
			continue;
		}
		const time = parseTimeSlot(cellText(worksheet.getCell(row, settings.timeColumn)));
		if (!time) continue;
		if (!dates) throw new Error(`Time slot at row ${row} has no date header`);
		settings.weekDaysArr.forEach((col, day) => {
			// ExcelJS resolves merged cells to their master. Expand class and holiday
			// blocks into slots, then merge adjacent slots back into full events.
			const summary = cellText(worksheet.getCell(row, col)).replace(/\s+/g, " ").trim();
			if (!summary) return;
			slots.push({ start: localTime(dates![day]!, time[0]), end: localTime(dates![day]!, time[1]), summary });
		});
	}
	slots.sort((a, b) => a.start.getTime() - b.start.getTime());
	const events: TimetableEvent[] = [];
	for (const slot of slots) {
		const previous = events.at(-1);
		if (previous && previous.summary === slot.summary && previous.end.getTime() === slot.start.getTime()) {
			previous.end = slot.end;
		} else {
			events.push({ ...slot });
		}
	}
	if (!events.length) throw new Error("No timetable events found; check the worksheet layout");
	return events;
}
