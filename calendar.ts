import ical from "ical-generator";
import { createHash } from "node:crypto";
import { toZonedTime } from "date-fns-tz";
import { LK_TZ } from "./config.ts";
import type { TimetableEvent } from "./parser.ts";

export function createCalendar(events: TimetableEvent[], degree: string): string {
	const calendar = ical({ name: `${degree} Timetable`, timezone: LK_TZ });
	for (const event of events) {
		// With a named timezone, ical-generator uses local Date getters. Supply
		// Colombo wall-clock dates so UTC CI runners emit the same times as Windows.
		calendar.createEvent({
			id: `${createHash("sha1").update(`${degree}|${event.start.toISOString()}|${event.summary}`).digest("hex")}@nsbm-timetable`,
			start: toZonedTime(event.start, LK_TZ),
			end: toZonedTime(event.end, LK_TZ),
			timezone: LK_TZ,
			summary: event.summary,
			stamp: toZonedTime(event.start, LK_TZ),
		});
	}
	return calendar.toString();
}
