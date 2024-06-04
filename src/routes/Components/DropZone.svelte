<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

	let calendarXlsx: File;

	function handleFileUpload(event: Event) {
		let inputElement = event.target as HTMLInputElement;
		calendarXlsx = inputElement.files![0];
		dispatch('fileSelected', calendarXlsx);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'copy';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		calendarXlsx = event.dataTransfer!.files[0];
		dispatch('fileSelected', calendarXlsx);
	}

	function triggerFilePicker() {
		let fileInput = document.getElementById('fileUpload') as HTMLInputElement;
		fileInput.click();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	id="dropZone"
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:click={triggerFilePicker}
	class="border-dashed border-2 h-32 w-64 text-center py-12 m-auto cursor-pointer font-inter"
	style="color: white;"
>
	Click or Drag and Drop file here
	<input type="file" id="fileUpload" on:change={handleFileUpload} class="hidden" />
</div>

<style lang="postcss">
	.font-inter {
		font-family: Inter, sans-serif;
	}

	#dropZone.active {
		border-color: blue;
	}

	#dropZone {
		border-color: gray;
	}
</style>
