<script>
	export let showModal = false;
    let buttonText = 'Help! I\'m lost!';

	function toggleModal() {
		showModal = !showModal;
        buttonText = showModal ? 'Go Back' : 'Help! I\'m lost!';
	}
</script>

<button class="button" on:click={toggleModal}>{buttonText}</button>

{#if showModal}
	<div class="modal">
		<p>❓ How do I find a spreadsheet version of my schedule?</p>
		<p>
			➡️ 1. Go to Workday, and click on the "Academics" app.
            2. Click on the "Registration & Courses" tab, then select "View My Saved Schedules" on the right. <br>
            3. Select the schedule you want to export, then click on the "Export to Excel" button (it looks like a small notebook with a 'X' on it). <br>
            Note: There are two of those buttons on that page, pick the one closest to your schedule: <br>
		</p>
        <div class="image-container">
            <img src="/img/workday-export.png" alt="Workday export"> <br>
        </div>
	</div>
{/if}

<style>
	.button {
		color: white;
		border: 1px solid white;
		padding: 8px 16px;
		background-color: transparent;
		cursor: pointer;
	}

	.modal {
		border: 1px solid white;
        padding: 16px;
	}

    .modal img {
        width: 50%;
    }

    .image-container {
        display: flex;
        justify-content: center;
        margin-top: 16px;
    }

	* {
		color: white;
	}
</style>
