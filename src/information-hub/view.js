/**
 * Frontend JavaScript for the Information Hub block
 * Handles interactive checklist functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	// Find all information hub blocks on the page
	const informationHubs = document.querySelectorAll('.wp-block-custom-blocks-information-hub');
	
	informationHubs.forEach(hub => {
		// Find all checklist items
		const checklistItems = hub.querySelectorAll('.item-type-checklist');
		
		checklistItems.forEach(item => {
			// Make checklist items interactive
			item.style.cursor = 'pointer';
			
			item.addEventListener('click', function(e) {
				// Prevent link clicks from toggling
				if (e.target.tagName === 'A') return;
				
				// Toggle completed state
				const isCompleted = this.getAttribute('data-completed') === 'true';
				this.setAttribute('data-completed', !isCompleted);
				
				// Update the icon
				const icon = this.querySelector('.item-icon');
				if (icon) {
					icon.textContent = !isCompleted ? '☑' : '☐';
				}
				
				// Update the text style
				const textSpan = this.querySelector('span:not(.item-icon)');
				if (textSpan) {
					if (!isCompleted) {
						textSpan.classList.add('completed');
					} else {
						textSpan.classList.remove('completed');
					}
				}
			});
		});
	});
});