<script lang="ts">
	import DropZone from './Components/DropZone.svelte';
	import Modal from './Components/HelpBtn.svelte';
	import { WorkdayCal } from '$lib/parsing_utils';
	import { generateCalendarFile } from '$lib/ics_utils';
	import Footer from './Components/Footer.svelte';
	import HelpBtn from './Components/HelpBtn.svelte';

	async function handleFileSelected(event: Event) {
		let calendarXlsx: File = (event as CustomEvent).detail;
		if (
			!calendarXlsx ||
			calendarXlsx.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		) {
			alert('Please upload a valid .xlsx file');
			return;
		}

		console.log(calendarXlsx);
		let courses = await WorkdayCal.parseWorkdayCal(calendarXlsx);
		if (courses) generateCalendarFile(courses);
	}
</script>

<div class="text-center">
	<h1 class="text-3xl font-inter" style="color: white;">Welcome to Workday2ics!</h1>

	<p style="color: white;">
		This is a simple tool to convert your Workday calendar (.xlsx) to an .ics file.
	</p>
</div>

<div class="dropzone">
	<DropZone on:fileSelected={handleFileSelected} />
</div>

<div class="help-footer-container">
	<div class="help-button">
		<HelpBtn />
	</div>
	<Footer />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}

	.font-inter {
		font-family: Inter, sans-serif;
	}

	.help-footer-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		height: 10vh;
	}

	.help-button {
		position: absolute;
		bottom: 30px;
	}

	.dropzone {
		margin-top: 25px;
	}
</style>
