<script lang="ts">
	import DropZone from './Components/DropZone.svelte';

	function handleFileSelected(event: Event) {
		let calendarXlsx: File = (event as CustomEvent).detail;
		console.log(calendarXlsx);
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
