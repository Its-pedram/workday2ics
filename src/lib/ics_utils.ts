import * as ics from 'ics';
import { generateBlob } from './blob';
import type { Course } from './parsing_utils';

export class iCalendar {
	// TODO: Implement iCalendar class
}

export function generateCalendarFile(courses: Array<Course>) {
	// TODO: Implement generateCalendarFile function
  console.log(courses[0].endDate.toISOString());
	const eventPromises = courses.map((course) => 
		makeCalendarEvent(
			course.courseName,
			'Instructional format: ' + course.format + '\nInstructor: ' 
        + (course.instructor ? course.instructor : '') + '\nCredits: ' + course.credits, 
			convertToUnixMilliseconds(adjustStartDate(course.startDate, course.meetingDays), course.startTime),
      convertToUnixMilliseconds(adjustStartDate(course.startDate, course.meetingDays), course.endTime),
			course.location,
			`FREQ=WEEKLY;BYDAY=${course.meetingDays.join(',')};INTERVAL=1;UNTIL=${formatDateString(course.endDate)}`
    )
	);

	Promise.all(eventPromises).then((events) => {
		const calendar = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'CALSCALE: GREGORIAN',
			'PRODID: adamgibbons/ics',
			'METHOD: PUBLISH',
			'X-PUBLISHED-TTL: PT1H',
			...events,
			'END:VCALENDAR'
		].join('\n');

		console.log(calendar);
		generateBlob(calendar, 'calendar.ics', 'text/calendar;charset=utf-8;');
	});
}

export function makeCalendarEvent(
	title: string,
	description: string,
	start: number,
	end: number,
	location: string,
	recurrenceRule: string
) {
	// ics.createEvent(
	// 	{
	// 		title: title,
	// 		description: description,
	// 		location: location,
	// 		start: start,
	// 		end: end,
	// 		recurrenceRule: recurrenceRule
	// 	},
	// 	(error, value) => {
	// 		if (error) {
	// 			console.log(error);
	// 		}
	// 		console.log(value);
	// 		generateBlob(value, 'calendarEvent.ics', 'text/calendar;charset=utf-8;');
	// 	}
	// );
	return new Promise((resolve, reject) => {
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
					reject(error);
				}
        // console.log(value);
        const matches = value.match(/(BEGIN:VEVENT[\s\S]*?END:VEVENT)/g);
				// if (match) {
				// 	console.log(match[1]); // Outputs the part of the string between and including "BEGIN:VEVENT" and "END:VEVENT"
				// }

				resolve(matches);
			}
		);
	});
}
// makeCalendarEvent('test Course', 'very cool course indeed', 1530466200000, 1530471600000, 'UBC', 'FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=1;UNTIL=20180816T000000Z');

export function formatDateString(date: Date): string {
  const localDate = new Date(date.toLocaleDateString());
  localDate.setDate(localDate.getDate() + 1);
  // console.log(localDate);
  return (localDate).toISOString().replace(/[-:.]/g, "").replace("000Z", "Z");
}

export function adjustStartDate(startDate: Date, meetingDays: string[]): Date {
  // console.log(startDate, meetingDays);
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const meetingDaysIndices = meetingDays.map(day => daysOfWeek.indexOf(day));
  let adjustedDate = new Date(startDate);

  while (!meetingDaysIndices.includes(adjustedDate.getDay())) {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
  }
  return adjustedDate;
}

export function convertToUnixMilliseconds(date: Date, timeString: string) {
	date.setHours(getHours(timeString));
	date.setMinutes(getMinutes(timeString));
	date.setSeconds(0);
	return date.getTime();
}

export function getHours(timeString: string) {
	const time = timeString.split(' ');
	const timeArr = time[0].split(':');
	const hour = parseInt(timeArr[0]);
	const minute = parseInt(timeArr[1]);
	if (time[1] === 'p.m.') {
    if (hour === 12) {
      return hour;
    }
		return hour + 12;
	}
	return hour;
}

export function getMinutes(timeString: string) {
	const time = timeString.split(' ');
	const timeArr = time[0].split(':');
	return parseInt(timeArr[1]);
}
