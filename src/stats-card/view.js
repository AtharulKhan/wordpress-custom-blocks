/**
 * Frontend JavaScript for the Stats Card block
 * Handles checklist interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
	// Find all stats card blocks on the page
	const statsCards = document.querySelectorAll('.wp-block-custom-blocks-stats-card');
	
	statsCards.forEach(card => {
		// Handle checklist items
		const checklistItems = card.querySelectorAll('.checklist-item input[type="checkbox"]');
		
		checklistItems.forEach(checkbox => {
			// Save state to localStorage
			const cardId = card.getAttribute('data-block-id') || card.id || 'default';
			const itemIndex = Array.from(checklistItems).indexOf(checkbox);
			const storageKey = `stats-card-${cardId}-item-${itemIndex}`;
			
			// Load saved state
			const savedState = localStorage.getItem(storageKey);
			if (savedState !== null) {
				checkbox.checked = savedState === 'true';
			}
			
			// Save state on change
			checkbox.addEventListener('change', function() {
				localStorage.setItem(storageKey, this.checked);
				
				// Add animation class
				const parentItem = this.closest('.card-item');
				parentItem.classList.add('state-changed');
				
				setTimeout(() => {
					parentItem.classList.remove('state-changed');
				}, 300);
			});
		});
		
		// Add hover effects for touch devices
		const items = card.querySelectorAll('.card-item:not(.checklist-item)');
		items.forEach(item => {
			item.addEventListener('touchstart', function() {
				this.classList.add('touched');
			});
			
			item.addEventListener('touchend', function() {
				setTimeout(() => {
					this.classList.remove('touched');
				}, 300);
			});
		});
		
		// Animate numbers on scroll
		const animateValue = (element, start, end, duration) => {
			const startTimestamp = Date.now();
			const step = () => {
				const timestamp = Date.now();
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				const value = Math.floor(progress * (end - start) + start);
				element.textContent = value.toLocaleString();
				
				if (progress < 1) {
					window.requestAnimationFrame(step);
				}
			};
			window.requestAnimationFrame(step);
		};
		
		// Set up intersection observer for number animations
		const valueElements = card.querySelectorAll('.item-value .value-text');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
					entry.target.setAttribute('data-animated', 'true');
					
					const finalValue = parseInt(entry.target.textContent.replace(/,/g, ''));
					if (!isNaN(finalValue)) {
						animateValue(entry.target, 0, finalValue, 1500);
					}
				}
			});
		}, {
			threshold: 0.5
		});
		
		valueElements.forEach(element => {
			observer.observe(element);
		});
	});
});