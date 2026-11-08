import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { parseTimetable, parseTimeSlot } from "./parser.ts";
import { createCalendar } from "./calendar.ts";

const settings = { dataStartIndex: 3, weekDaysArr: [3, 4, 5, 6, 7], timeColumn: 2 };

function fixture() {
	const sheet = new ExcelJS.Workbook().addWorksheet("2nd YEAR Cyber");
	for (let day = 0; day < 5; day++) sheet.getCell(3, day + 3).value = new Date(Date.UTC(2026, 10, 9 + day));
	for (let row = 5; row <= 12; row++) {
		const label = (hour: number) => `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;
		sheet.getCell(row, 2).value = `${label(row + 4)} - ${label(row + 5)}`;
	}
	return sheet;
}

test("parses noon, midnight and half-hour slots", () => {
	assert.deepEqual(parseTimeSlot("12pm - 1pm"), [720, 780]);
	assert.deepEqual(parseTimeSlot("12am - 1am"), [0, 60]);
	assert.deepEqual(parseTimeSlot("9:30am – 12:30pm"), [570, 750]);
	assert.equal(parseTimeSlot("Monday"), undefined);
	assert.throws(() => parseTimeSlot("13am - 2pm"));
});

test("merged class blocks become one four-hour event in Sri Lankan time", () => {
	const sheet = fixture();
	sheet.mergeCells("C5:C8");
	sheet.getCell("C5").value = "Server Admin. & Mgt. 1";
	const events = parseTimetable(sheet, settings);
	assert.equal(events.length, 1);
	assert.equal(events[0]!.start.toISOString(), "2026-11-09T03:30:00.000Z");
	assert.equal(events[0]!.end.toISOString(), "2026-11-09T07:30:00.000Z");
});

test("a holiday merged across the week produces one full-day block per weekday", () => {
	const sheet = fixture();
	sheet.mergeCells("C5:G12");
	sheet.getCell("C5").value = "Convocation Week";
	const events = parseTimetable(sheet, settings);
	assert.equal(events.length, 5);
	assert.ok(events.every(event => event.end.getTime() - event.start.getTime() === 8 * 60 * 60 * 1000));
});

test("preserves source dates even when a week mixes years", () => {
	const sheet = fixture();
	sheet.getCell("D3").value = new Date("2025-11-17T00:00:00Z");
	sheet.getCell("D5").value = "Digital Forensics";
	assert.equal(parseTimetable(sheet, settings)[0]!.start.toISOString(), "2025-11-17T03:30:00.000Z");
});

test("blank slots are excluded and different adjacent classes stay separate", () => {
	const sheet = fixture();
	sheet.mergeCells("A13:B14");
	sheet.mergeCells("D5:D8");
	sheet.getCell("C5").value = "Class A";
	sheet.getCell("C6").value = "Class B";
	assert.equal(parseTimetable(sheet, settings).length, 2);
	assert.throws(() => parseTimetable(fixture(), settings), /No timetable events/);
});

test("calendar times are identical on UTC runners and Sri Lankan computers", () => {
	const sheet = fixture();
	sheet.mergeCells("C5:C8");
	sheet.getCell("C5").value = "Class A";
	const events = parseTimetable(sheet, settings);
	const original = process.env.TZ;
	try {
		process.env.TZ = "UTC";
		const utc = createCalendar(events, "BIT-CYBER");
		assert.ok(utc.includes("DTSTART;TZID=Asia/Colombo:20261109T090000"));
		assert.ok(utc.includes("DTEND;TZID=Asia/Colombo:20261109T130000"));
		process.env.TZ = "Asia/Colombo";
		assert.equal(createCalendar(events, "BIT-CYBER"), utc);
	} finally {
		if (original === undefined) delete process.env.TZ;
		else process.env.TZ = original;
	}
});
