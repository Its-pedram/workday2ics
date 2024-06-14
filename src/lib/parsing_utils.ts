import ExcelJS from 'exceljs';

export interface Course {
	courseName: string;
	credits: number;
	format: string;
	instructor: string;
	startDate: Date;
	endDate: Date;
	meetingDays: Array<string>;
	startTime: string;
	endTime: string;
	location: string;
}

interface MeetingPattern {
	meetingDays: string;
	startTime: string;
	endTime: string;
	location: string;
}

export class WorkdayCal {
	static courses: Course[];

	static readonly EXPECTED_COLS = [
		'Course Listing',
		'Credits',
		'Grading Basis',
		'Section',
		'Instructional Format',
		'Delivery Mode',
		'Meeting Patterns',
		'Registration Status',
		'Instructor',
		'Start Date',
		'End Date'
	];

	static readonly DAY_MAPPING: { [key: string]: string } = {
		Sun: 'SU',
		Mon: 'MO',
		Tue: 'TU',
		Wed: 'WE',
		Thu: 'TH',
		Fri: 'FR',
		Sat: 'SA'
	};

	/**
	 * Parses the Workday calendar file and returns an array of courses.
	 * @param file - The Workday calendar file to parse.
	 * @returns A promise that resolves to an array of Course objects, or undefined if the file is invalid.
	 */
	static async parseWorkdayCal(file: File): Promise<Course[] | undefined> {
		let workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(await file.arrayBuffer());
		let calWorksheet = workbook.worksheets[0];

		if (!calWorksheet || !this.validateWorksheet(calWorksheet)) {
			alert('Invalid Workday calendar xlsx! Please refer to the help button below.');
			return;
		}

		this.courses = this.parseCourses(calWorksheet!);
		return this.courses;
		return [];
	}

	/**
	 * Parses the courses from the given Excel worksheet.
	 *
	 * @param calWorksheet - The Excel worksheet containing the course data.
	 * @returns An array of Course objects.
	 */
	static parseCourses(calWorksheet: ExcelJS.Worksheet): Array<Course> {
		let courses: Array<Course> = [];
		for (let i = 4; i <= calWorksheet.rowCount; i++) {
			let row = calWorksheet.getRow(i);
			let meetingPattern = this.parseMeetingPatterns(row.getCell('H').value as string);
			let course: Course = {
				courseName: row.getCell('E').value as string,
				credits: row.getCell('C').value as number,
				format: row.getCell('F').value as string,
				instructor: ((row.getCell('J').value as string)
					? (row.getCell('J').value as string)
					: 'Prof. TBA'
				).replace(/\n\n/g, ', '),
				startDate: new Date((row.getCell('K').value as Date).getTime() + 24 * 60 * 60 * 1000),
				endDate: new Date((row.getCell('L').value as Date).getTime() + 24 * 60 * 60 * 1000),
				meetingDays: meetingPattern.meetingDays.split(' ').map((day) => this.DAY_MAPPING[day]),
				startTime: meetingPattern.startTime,
				endTime: meetingPattern.endTime,
				location: meetingPattern.location
			};
			courses.push(course);
		}
		return courses;
	}

	/**
	 * Parses the meeting pattern and returns an array of strings.
	 *
	 * @param meetingPattern - The meeting pattern to be parsed.
	 * @returns An array of strings representing the parsed meeting pattern.
	 */
	static parseMeetingPatterns(meetingPattern: string): MeetingPattern {
		let firstPattern = meetingPattern.split('\n')[0];
		let pattern = firstPattern.split(' | ');
		return {
			meetingDays: this.cleanPattern(pattern[1]),
			startTime: this.cleanPattern(pattern[2].split(' - ')[0]),
			endTime: this.cleanPattern(pattern[2].split(' - ')[1]),
			location: pattern[3] ? this.cleanPattern(pattern[3].replace(/-/g, ' ')) : 'Roomless'
		};
	}

	/**
	 * Removes all occurrences of the '|' character from the given pattern and trims any leading or trailing whitespace.
	 *
	 * @param pattern - The pattern to clean.
	 * @returns The cleaned pattern.
	 */
	static cleanPattern(pattern: string): string {
		return pattern.replace(/\|/g, '').trim();
	}

	/**
	 * Validates the given worksheet by comparing the column names with the expected column names.
	 * @param calWorksheet - The worksheet to validate.
	 * @returns A boolean indicating whether the worksheet is valid or not.
	 */
	static validateWorksheet(calWorksheet: ExcelJS.Worksheet): boolean {
		const COLS = (calWorksheet.getRow(3).values as string[]).filter((col) => col !== undefined);
		if (COLS.length !== this.EXPECTED_COLS.length) {
			return false;
		}
		for (let i = 0; i < this.EXPECTED_COLS.length; i++) {
			if (COLS[i] !== this.EXPECTED_COLS[i]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Converts a string representation of a date to a Date object.
	 * @param date - The string representation of the date in the format "YYYY-MM-DD".
	 * @returns A Date object representing the given date.
	 */
	static convertToDate(date: string): Date {
		let dateSegments = date.split('-');
		return new Date(Number(dateSegments[0]), Number(dateSegments[1]) - 1, Number(dateSegments[2]));
	}
}
