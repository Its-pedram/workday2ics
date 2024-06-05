import ExcelJS from 'exceljs';

interface Course {
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

export async function parseWorkdayCal(file: File) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const calWorksheet = workbook.getWorksheet('View My Saved Schedules');
    
    let courses = await parseCourses(calWorksheet!);
}

export async function parseCourses(calWorksheet: ExcelJS.Worksheet): Promise<Array<Course>> {
    let courses: Array<Course> = [];
    for (let i = 3; i < calWorksheet.rowCount; i++) {
        let row = calWorksheet.getRow(i);
        let meetingPattern = await parseMeetingPatterns(row.getCell('J').value as string);
        let course: Course = {
            courseName: row.getCell('D').value as string,
            credits: row.getCell('C').value as number,
            format: row.getCell('F').value as string,
            instructor: row.getCell('G').value as string,
            startDate: row.getCell('H').value as string,
            endDate: row.getCell('I').value as string,
            meetingDays: meetingPattern[0].split(" "),
            startTime: meetingPattern[1],
            endTime: meetingPattern[2],
            location: meetingPattern[3],
        }
        console.log(course);
        courses.push(course);
    }
    return courses;
}

export async function parseMeetingPatterns(meetingPattern: string): Promise<Array<string>> {
    let pattern = meetingPattern.split(" | ");
    return [
        pattern[1],
        pattern[2].split(" - ")[0],
        pattern[2].split(" - ")[1],
        pattern[3].replace(/-/g, ' ')
    ];
}
