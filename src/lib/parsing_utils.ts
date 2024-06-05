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

const dayMapping: { [key: string]: string } = {
	'Sun': 'SU',
	'Mon': 'MO',
	'Tue': 'TU',
	'Wed': 'WE',
	'Thu': 'TH',
	'Fri': 'FR',
	'Sat': 'SA'
};

export class WorkdayCal {
	static courses: Course[];

	static async parseWorkdayCal(file: File): Promise<Course[] | undefined> {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(await file.arrayBuffer());
		const calWorksheet = workbook.getWorksheet('View My Saved Schedules');

		if (!calWorksheet || !this.validateWorksheet(calWorksheet)) {
			alert('Invalid Workday calendar xlsx! Please refer to the help button below.');
			return;
		}

		this.courses = this.parseCourses(calWorksheet!);
		return this.courses;
	}

	static parseCourses(calWorksheet: ExcelJS.Worksheet): Array<Course> {
		let courses: Array<Course> = [];
		for (let i = 3; i <= calWorksheet.rowCount; i++) {
			let row = calWorksheet.getRow(i);
			let meetingPattern = this.parseMeetingPatterns(row.getCell('J').value as string);
			let course: Course = {
				courseName: row.getCell('D').value as string,
				credits: row.getCell('C').value as number,
				format: row.getCell('F').value as string,
				instructor: row.getCell('G').value as string,
				startDate: this.convertToDate(meetingPattern[0]),
				endDate: this.convertToDate(meetingPattern[1]),
				meetingDays: meetingPattern[2].split(' ').map((day) => dayMapping[day]),
				startTime: meetingPattern[3],
				endTime: meetingPattern[4],
				location: meetingPattern[5]
			};
			courses.push(course);
			console.log(course);
		}
		return courses;
	}

	static parseMeetingPatterns(meetingPattern: string): Array<string> {
		let pattern = meetingPattern.split(' | ');
		return [
			this.cleanPattern(pattern[0].split(' - ')[0]),
			this.cleanPattern(pattern[0].split(' - ')[1]),
			this.cleanPattern(pattern[1]),
			this.cleanPattern(pattern[2].split(' - ')[0]),
			this.cleanPattern(pattern[2].split(' - ')[1]),
			pattern[3] ? this.cleanPattern(pattern[3].replace(/-/g, ' ')) : 'Roomless'
		];
	}

	static cleanPattern(pattern: string): string {
		return pattern.replace(/\|/g, '').trim();
	}

	static validateWorksheet(calWorksheet: ExcelJS.Worksheet): boolean {
		// Verify that these columns exist:
		// Course	Grading Basis	Credits	Section	Section Status	Instructional Format	Instructor	Start Date	End Date	Meeting Patterns
		// (A2:J2)
		const expectedColumns = [
			'',
			'Course',
			'Grading Basis',
			'Credits',
			'Section',
			'Section Status',
			'Instructional Format',
			'Instructor',
			'Start Date',
			'End Date',
			'Meeting Patterns'
		];
		const columns = calWorksheet.getRow(2).values as string[];
		for (let i = 1; i < expectedColumns.length; i++) {
			if (columns[i] !== expectedColumns[i]) {
				return false;
			}
		}
		return true;
	}

	static convertToDate(date: string): Date {
		let dateSegments = date.split('-');
		return new Date(Number(dateSegments[0]), Number(dateSegments[1]) - 1, Number(dateSegments[2]));
	}
}
