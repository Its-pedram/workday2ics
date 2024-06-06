import * as ics from 'ics';
import { generateBlob } from './blob';
import type { Course } from './parsing_utils';

export class iCalendar {
	/**
	 * Generates a calendar file in iCalendar format based on the provided courses.
	 * @param courses - An array of Course objects representing the courses to include in the calendar.
	 * @returns A Promise that resolves to void.
	 */
	static async generateCalendarFile(courses: Array<Course>): Promise<void> {
		const courseEvents = courses.map(async (course) => {
			let eventValue = await this.makeCalendarEvent(
				course.courseName,
				'Instructional format: ' +
					course.format +
					'\nInstructor: ' +
					(course.instructor ? course.instructor : '') +
					'\nCredits: ' +
					course.credits,
				this.convertToUnixMilliseconds(
					this.adjustStartDate(course.startDate, course.meetingDays),
					course.startTime
				),
				this.convertToUnixMilliseconds(
					this.adjustStartDate(course.startDate, course.meetingDays),
					course.endTime
				),
				course.location,
				`FREQ=WEEKLY;BYDAY=${course.meetingDays.join(',')};INTERVAL=1;UNTIL=${this.formatDateString(course.endDate)}`
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

	/**
	 * Creates a calendar event using the provided parameters.
	 *
	 * @param title - The title of the event.
	 * @param description - The description of the event.
	 * @param start - The start time of the event in milliseconds.
	 * @param end - The end time of the event in milliseconds.
	 * @param location - The location of the event.
	 * @param recurrenceRule - The recurrence rule for the event.
	 * @returns A promise that resolves to the created event as a string, or rejects with an error.
	 */
	static async makeCalendarEvent(
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

	/**
	 * Formats a date string in a specific ISO format.
	 *
	 * @param date - The date to be formatted.
	 * @returns The formatted date string.
	 */
	static formatDateString(date: Date): string {
		const localDate = new Date(date.toLocaleDateString());
		localDate.setDate(localDate.getDate() + 1);
		return localDate.toISOString().replace(/[-:.]/g, '').replace('000Z', 'Z');
	}

	/**
	 * Adjusts the start date to the next available meeting day based on the provided meeting days.
	 * @param startDate - The initial start date.
	 * @param meetingDays - An array of meeting days represented as strings (e.g., ['MO', 'WE', 'FR']).
	 * @returns The adjusted start date.
	 */
	static adjustStartDate(startDate: Date, meetingDays: string[]): Date {
		const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
		const meetingDaysIndices = meetingDays.map((day) => DAYS.indexOf(day));
		let adjustedDate = new Date(startDate);

		while (!meetingDaysIndices.includes(adjustedDate.getDay())) {
			adjustedDate.setDate(adjustedDate.getDate() + 1);
		}
		return adjustedDate;
	}

	/**
	 * Converts a given date and time string to Unix milliseconds.
	 * @param date - The date object representing the date.
	 * @param timeString - The time string in the format "HH:mm a.m./p.m.".
	 * @returns The Unix milliseconds representation of the given date and time.
	 */
	static convertToUnixMilliseconds(date: Date, timeString: string): number {
		let [time, period] = timeString.split(' ');
		let [hours, minutes] = time.split(':').map(Number);

		if (period.toLowerCase() === 'p.m.' && hours !== 12) {
			hours += 12;
		} else if (period.toLowerCase() === 'a.m.' && hours === 12) {
			hours = 0;
		}

		let newDate = new Date(date);
		newDate.setHours(hours, minutes);

		return newDate.getTime();
	}
}
