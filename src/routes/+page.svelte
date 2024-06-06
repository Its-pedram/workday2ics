<script lang="ts">
	import DropZone from './Components/DropZone.svelte';
	import Modal from './Components/HelpBtn.svelte';
	import { WorkdayCal } from '$lib/parsing_utils';
	import { generateCalendarFile } from '$lib/ics_utils';
	import Footer from './Components/Footer.svelte';
	import HelpBtn from './Components/HelpBtn.svelte';

	/**
	 * Handles the selection of a file and processes it.
	 * @param {Event} event - The event object representing the file selection.
	 */
	async function handleFileSelected(event: Event) {
		let calendarXlsx: File = (event as CustomEvent).detail;
		if (
			!calendarXlsx ||
			calendarXlsx.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		) {
			alert('Please upload a valid .xlsx file');
			return;
		}

		let courses;
		try {
			courses = await WorkdayCal.parseWorkdayCal(calendarXlsx);
		} catch (error) {
			console.error('Error parsing calendar file:', error);
			alert(
				'There was an error processing your calendar. Check console & open an issue on Github.'
			);
			return;
		}

		if (courses) {
			try {
				await generateCalendarFile(courses);
			} catch (error) {
				console.error('Error generating calendar file:', error);
				alert(
					'There was an error generating an ics file. Check console & open an issue on Github.◊'
				);
			}
		}
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
