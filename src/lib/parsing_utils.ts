import ExcelJS from 'exceljs';

export interface Course {
	courseName: string;
	credits: number;
	format: string;
	instructor: string;
	startDate: string;
	endDate: string;
	meetingDays: Array<string>;
	startTime: string;
	endTime: string;
	location: string;
}

export class WorkdayCal {
	static courses: Course[];

	static async parseWorkdayCal(file: File): Promise<Array<Course>> {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(await file.arrayBuffer());
		const calWorksheet = workbook.getWorksheet('View My Saved Schedules');
	
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
				startDate: new Date(meetingPattern[0]).toISOString(),
				endDate:  new Date(meetingPattern[1]).toISOString(),
				meetingDays: meetingPattern[2].split(' '),
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
}