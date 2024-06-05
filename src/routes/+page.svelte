<script lang="ts">
	import DropZone from './Components/DropZone.svelte';
	import { parseWorkdayCal } from '$lib/calendar_utils';
	import { makeCalendarEvent } from '$lib/ics_utils';

	async function handleFileSelected(event: Event) {
		let calendarXlsx: File = (event as CustomEvent).detail;
		if (!calendarXlsx || calendarXlsx.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			alert('Please upload a valid .xlsx file');
			return;
		}
		console.log(calendarXlsx);
		await parseWorkdayCal(calendarXlsx);
	}

	function handleClick() {
        // Replace 'param1' and 'param2' with the actual parameters you want to pass
		makeCalendarEvent('test Course', 'very cool course indeed', 1530466200000, 1530471600000, 'UBC', 'FREQ=WEEKLY;BYDAY=TU,TH;INTERVAL=1;UNTIL=20180816T000000Z');
    }

</script>

<div class="text-center">
	<h1 class="text-3xl font-inter" style="color: white;">Welcome to Workday2ics!</h1>

	<p style="color: white;">
		This is a simple tool to convert your Workday calendar (.xlsx) to an .ics file.
	</p>
</div>

<DropZone on:fileSelected={handleFileSelected} />

<button on:click={handleClick}>test dl</button>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}

	.font-inter {
		font-family: Inter, sans-serif;
	}
</style>
