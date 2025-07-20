/**
 * Frontend JavaScript for the Information Dropdown Switcher block
 * Handles dropdown switching and tooltip interactions
 */

document.addEventListener('DOMContentLoaded', function() {
	// Find all information dropdown switcher blocks on the page
	const informationDropdowns = document.querySelectorAll('.wp-block-custom-blocks-information-dropdown-switcher');
	
	informationDropdowns.forEach(block => {
		const dropdown = block.querySelector('.category-dropdown');
		const informationContent = block.querySelector('.information-content');
		const tooltipTriggers = block.querySelectorAll('.tooltip-trigger');
		
		// Handle dropdown change
		if (dropdown && informationContent) {
			dropdown.addEventListener('change', function() {
				const selectedIndex = this.value;
				const grids = informationContent.querySelectorAll('.information-grid');
				
				// Hide all grids
				grids.forEach(grid => {
					grid.classList.remove('active');
				});
				
				// Show selected grid
				const selectedGrid = informationContent.querySelector(`.information-grid[data-category="${selectedIndex}"]`);
				if (selectedGrid) {
					selectedGrid.classList.add('active');
				}
			});
		}
		
		// Handle tooltip interactions
		let activeTooltip = null;
		
		tooltipTriggers.forEach(trigger => {
			// Show tooltip on click
			trigger.addEventListener('click', function(e) {
				e.stopPropagation();
				
				// Close any open tooltip
				if (activeTooltip && activeTooltip !== this) {
					activeTooltip.classList.remove('active');
				}
				
				// Toggle current tooltip
				this.classList.toggle('active');
				activeTooltip = this.classList.contains('active') ? this : null;
			});
			
			// Show tooltip on focus (keyboard navigation)
			trigger.addEventListener('focus', function() {
				if (activeTooltip && activeTooltip !== this) {
					activeTooltip.classList.remove('active');
				}
				this.classList.add('active');
				activeTooltip = this;
			});
			
			// Hide tooltip on blur
			trigger.addEventListener('blur', function(e) {
				// Check if focus is moving to the tooltip content itself
				const relatedTarget = e.relatedTarget;
				if (!relatedTarget || !this.contains(relatedTarget)) {
					setTimeout(() => {
						this.classList.remove('active');
						if (activeTooltip === this) {
							activeTooltip = null;
						}
					}, 100);
				}
			});
			
			// Keyboard support
			trigger.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					this.click();
				} else if (e.key === 'Escape') {
					this.classList.remove('active');
					if (activeTooltip === this) {
						activeTooltip = null;
					}
				}
			});
		});
		
		// Close tooltips when clicking outside
		document.addEventListener('click', function(e) {
			if (activeTooltip && !activeTooltip.contains(e.target)) {
				activeTooltip.classList.remove('active');
				activeTooltip = null;
			}
		});
		
		// Handle tooltip links to prevent tooltip from closing
		const tooltipLinks = block.querySelectorAll('.tooltip-content a');
		tooltipLinks.forEach(link => {
			link.addEventListener('click', function(e) {
				e.stopPropagation();
			});
		});
		
		// Touch device support
		let touchTimeout;
		tooltipTriggers.forEach(trigger => {
			trigger.addEventListener('touchstart', function(e) {
				e.preventDefault();
				
				// Clear any existing timeout
				clearTimeout(touchTimeout);
				
				// Close other tooltips
				if (activeTooltip && activeTooltip !== this) {
					activeTooltip.classList.remove('active');
				}
				
				// Toggle current tooltip
				this.classList.toggle('active');
				activeTooltip = this.classList.contains('active') ? this : null;
				
				// Set timeout to close tooltip after 5 seconds
				if (this.classList.contains('active')) {
					touchTimeout = setTimeout(() => {
						this.classList.remove('active');
						if (activeTooltip === this) {
							activeTooltip = null;
						}
					}, 5000);
				}
			});
		});
	});
});