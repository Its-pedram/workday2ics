import * as ics from 'ics';
import { generateBlob } from './blob';
import type { Course } from './parsing_utils';

export class iCalendar {
	// TODO: Implement iCalendar class
}

export function generateCalendarFile(courses: Array<Course>) {
	// TODO: Implement generateCalendarFile function
}

export function makeCalendarEvent(
	title: string,
	description: string,
	start: number,
	end: number,
	location: string,
	recurrenceRule: string
) {
	ics.createEvent(
		{
			title: title,
			description: description,
			location: location,
			start: start,
			end: end,
			recurrenceRule: recurrenceRule
		},
		(error, value) => {
			if (error) {
				console.log(error);
			}
			console.log(value);
			generateBlob(value, 'calendarEvent.ics', 'text/calendar;charset=utf-8;');
		}
	);
}
// makeCalendarEvent('test Course', 'very cool course indeed', 1530466200000, 1530471600000, 'UBC', 'FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=1;UNTIL=20180816T000000Z');
