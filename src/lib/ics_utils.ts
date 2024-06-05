import * as ics from 'ics';

export function makeCalendarEvent(title: string, description: string, 
  start: number, end: number, location: string, recurrenceRule: string) 
  {
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
      makeBlobNoDocument(value);
    }
  );
  }
  // makeCalendarEvent('test Course', 'very cool course indeed', 1530466200000, 1530471600000, 'UBC', 'FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=1;UNTIL=20180816T000000Z');

export function makeBlobNoDocument(value: string) {
  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  // return url;
  window.location.href = url;
}

// export function makeBlob(value: string) {
//   // Create a Blob object from the iCalendar data
//   const blob = new Blob([value], { type: 'text/calendar;charset=utf-8;' });
//   // Create a link element
//   const link = document.createElement('a');
//   // Set the URL of the link to the Blob object
//   link.href = URL.createObjectURL(blob);
//   // Set the download attribute of the link to the desired file name
//   link.download = 'event.ics';
//   // Append the link to the body
//   document.body.appendChild(link);
//   // Programmatically click the link to start the download
//   link.click();
//   // Remove the link from the body
//   document.body.removeChild(link);
// }

