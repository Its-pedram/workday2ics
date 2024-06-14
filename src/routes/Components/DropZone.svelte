<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let droppedFile: File;

	/**
	 * Handles the file upload event.
	 *
	 * @param {Event} event - The file upload event.
	 */
	function handleFileUpload(event: Event) {
		let inputElement = event.target as HTMLInputElement;
		droppedFile = inputElement.files![0];
		dispatch('fileSelected', droppedFile);
		inputElement.value = '';
	}

	/**
	 * Handles the drag over event for the DropZone component.
	 * Prevents the default behavior and sets the drop effect to 'copy'.
	 *
	 * @param {DragEvent} event - The drag event object.
	 */
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'copy';
	}

	/**
	 * Handles the drop event when a file is dropped onto the drop zone.
	 * @param {DragEvent} event - The drop event.
	 */
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		droppedFile = event.dataTransfer!.files[0];
		dispatch('fileSelected', droppedFile);
	}

	/**
	 * Triggers the file picker dialog.
	 */
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
	Click or Drop the file here
	<input type="file" id="fileUpload" accept=".xlsx" on:change={handleFileUpload} class="hidden" />
</div>

<style lang="postcss">
	.font-inter {
		font-family: Inter, sans-serif;
	}

	#dropZone:hover {
		border-color: orange;
	}

	#dropZone {
		border-color: gray;
	}
</style>
