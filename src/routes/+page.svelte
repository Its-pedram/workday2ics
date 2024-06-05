<script lang="ts">
	import DropZone from './Components/DropZone.svelte';
	import { WorkdayCal } from '$lib/parsing_utils';
	import { generateCalendarFile } from '$lib/ics_utils';

	async function handleFileSelected(event: Event) {
		let calendarXlsx: File = (event as CustomEvent).detail;
		if (!calendarXlsx || calendarXlsx.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			alert('Please upload a valid .xlsx file');
			return;
		}
		console.log(calendarXlsx);
		let courses = await WorkdayCal.parseWorkdayCal(calendarXlsx);
		generateCalendarFile(courses);
	}

</script>

<div class="text-center">
	<h1 class="text-3xl font-inter" style="color: white;">Welcome to Workday2ics!</h1>

	<p style="color: white;">
		This is a simple tool to convert your Workday calendar (.xlsx) to an .ics file.
	</p>
</div>

<DropZone on:fileSelected={handleFileSelected} />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}

	.font-inter {
		font-family: Inter, sans-serif;
	}
</style>
