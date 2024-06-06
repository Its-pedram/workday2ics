import * as ics from 'ics';
import { generateBlob } from './blob';
import type { Course } from './parsing_utils';

export class iCalendar {
	// TODO: Implement iCalendar class
}

export async function generateCalendarFile(courses: Array<Course>) {
	// TODO: Implement generateCalendarFile function
	console.log(courses[0].endDate.toISOString());
	const courseEvents = courses.map(async (course) => {
		let eventValue = await makeCalendarEvent(
			course.courseName,
			'Instructional format: ' +
				course.format +
				'\nInstructor: ' +
				(course.instructor ? course.instructor : '') +
				'\nCredits: ' +
				course.credits,
			convertToUnixMilliseconds(
				adjustStartDate(course.startDate, course.meetingDays),
				course.startTime
			),
			convertToUnixMilliseconds(
				adjustStartDate(course.startDate, course.meetingDays),
				course.endTime
			),
			course.location,
			`FREQ=WEEKLY;BYDAY=${course.meetingDays.join(',')};INTERVAL=1;UNTIL=${formatDateString(course.endDate)}`,
		);

		let eventString = eventValue.toString().match(/(BEGIN:VEVENT[\s\S]*?END:VEVENT)/g)![0];
		eventString = eventString.replace(/DTSTART:/g, 'DTSTART;TZID=America/Vancouver:');
		eventString = eventString.replace(/DTEND:/g, 'DTEND;TZID=America/Vancouver:');
		return eventString;
	});

	Promise.all(courseEvents).then((events) => {
		const calendar = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'CALSCALE: GREGORIAN',
			'PRODID: workday2ics',
			'METHOD: PUBLISH',
			'X-PUBLISHED-TTL: PT1H',
			...events,
			'END:VCALENDAR'
		].join('\n');

		generateBlob(calendar, 'calendar.ics', 'text/calendar;charset=utf-8;');
	});
}

export async function makeCalendarEvent(
	title: string,
	description: string,
	start: number,
	end: number,
	location: string,
	recurrenceRule: string
): Promise<Error | string> {
	return new Promise((resolve, reject) => {
		ics.createEvent(
			{
				title: title,
				description: description,
				location: location,
				start: start,
				end: end,
				recurrenceRule: recurrenceRule,
				startOutputType: 'local',
				endOutputType: 'local'
			},
			(error, value) => {
				if (error) {
					reject(error);
				}
				resolve(value);
			}
		);
	});
}

export function formatDateString(date: Date): string {
	const localDate = new Date(date.toLocaleDateString());
	localDate.setDate(localDate.getDate() + 1);
	return localDate.toISOString().replace(/[-:.]/g, '').replace('000Z', 'Z');
}

export function adjustStartDate(startDate: Date, meetingDays: string[]): Date {
	const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
	const meetingDaysIndices = meetingDays.map((day) => DAYS.indexOf(day));
	let adjustedDate = new Date(startDate);

	while (!meetingDaysIndices.includes(adjustedDate.getDay())) {
		adjustedDate.setDate(adjustedDate.getDate() + 1);
	}
	return adjustedDate;
}

export function convertToUnixMilliseconds(date: Date, timeString: string) {
	const time = convertTimeStringToDate(date, timeString);
	console.log(time.getTime());
	return time.getTime();
}

function convertTimeStringToDate(date: Date, timeString: string): Date {
    let [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period.toLowerCase() === 'p.m.' && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === 'a.m.' && hours === 12) {
        hours = 0;
    }

    let newDate = new Date(date);
    newDate.setHours(hours, minutes);

    return newDate;
}