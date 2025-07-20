/**
 * Frontend JavaScript for the Comparison Table block
 * Handles enhanced tooltip functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	// Find all comparison table blocks on the page
	const comparisonTables = document.querySelectorAll('.wp-block-custom-blocks-comparison-table');
	
	comparisonTables.forEach(table => {
		// Enhanced tooltip functionality for mobile
		const tooltipIcons = table.querySelectorAll('.tooltip-icon');
		
		tooltipIcons.forEach(icon => {
			// Mobile touch support for tooltips
			icon.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				// Toggle tooltip visibility on mobile
				const tooltip = this.getAttribute('data-tooltip');
				if (tooltip && window.innerWidth <= 768) {
					// Create mobile tooltip
					const existingTooltip = document.querySelector('.mobile-tooltip');
					if (existingTooltip) {
						existingTooltip.remove();
					}
					
					const tooltipEl = document.createElement('div');
					tooltipEl.className = 'mobile-tooltip';
					tooltipEl.textContent = tooltip;
					tooltipEl.style.cssText = `
						position: fixed;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background: #333;
						color: white;
						padding: 16px 20px;
						border-radius: 8px;
						max-width: 80%;
						z-index: 9999;
						box-shadow: 0 4px 20px rgba(0,0,0,0.3);
						font-size: 14px;
						line-height: 1.5;
					`;
					
					// Add close button
					const closeBtn = document.createElement('button');
					closeBtn.textContent = '�';
					closeBtn.style.cssText = `
						position: absolute;
						top: 8px;
						right: 8px;
						background: none;
						border: none;
						color: white;
						font-size: 24px;
						cursor: pointer;
						width: 30px;
						height: 30px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 4px;
					`;
					closeBtn.addEventListener('click', () => tooltipEl.remove());
					
					tooltipEl.appendChild(closeBtn);
					document.body.appendChild(tooltipEl);
					
					// Add overlay
					const overlay = document.createElement('div');
					overlay.className = 'mobile-tooltip-overlay';
					overlay.style.cssText = `
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: rgba(0,0,0,0.5);
						z-index: 9998;
					`;
					overlay.addEventListener('click', () => {
						tooltipEl.remove();
						overlay.remove();
					});
					document.body.appendChild(overlay);
				}
			});
		});
		
		// Add smooth scroll behavior for wide tables on mobile
		const tableContainer = table.querySelector('.comparison-table-container');
		if (tableContainer) {
			let isDown = false;
			let startX;
			let scrollLeft;
			
			tableContainer.addEventListener('mousedown', (e) => {
				isDown = true;
				startX = e.pageX - tableContainer.offsetLeft;
				scrollLeft = tableContainer.scrollLeft;
			});
			
			tableContainer.addEventListener('mouseleave', () => {
				isDown = false;
			});
			
			tableContainer.addEventListener('mouseup', () => {
				isDown = false;
			});
			
			tableContainer.addEventListener('mousemove', (e) => {
				if (!isDown) return;
				e.preventDefault();
				const x = e.pageX - tableContainer.offsetLeft;
				const walk = (x - startX) * 2;
				tableContainer.scrollLeft = scrollLeft - walk;
			});
		}
		
		// Show more/less functionality for mobile view
		const mobileView = table.querySelector('.mobile-view');
		if (mobileView) {
			const showMoreButton = mobileView.querySelector('.show-more-button');
			const featuresContainer = mobileView.querySelector('.mobile-features-container');
			const featureCards = mobileView.querySelectorAll('.mobile-feature-card');
			
			if (showMoreButton && featuresContainer && featureCards.length > 3) {
				// Initially collapse the container if not already collapsed
				if (!featuresContainer.classList.contains('collapsed')) {
					featuresContainer.classList.add('collapsed');
				}
				
				showMoreButton.addEventListener('click', function() {
					const isExpanded = !featuresContainer.classList.contains('collapsed');
					const buttonText = showMoreButton.querySelector('.button-text');
					const arrowIcon = showMoreButton.querySelector('.arrow-icon');
					const hiddenCount = featureCards.length - 3;
					
					if (isExpanded) {
						// Collapse with smooth animation
						featuresContainer.style.maxHeight = featuresContainer.scrollHeight + 'px';
						featuresContainer.offsetHeight; // Force reflow
						featuresContainer.classList.add('collapsed');
						featuresContainer.style.maxHeight = '650px';
						
						buttonText.textContent = `Show ${hiddenCount} More`;
						arrowIcon.classList.remove('rotate');
						showMoreButton.setAttribute('aria-expanded', 'false');
						
						// Smooth scroll to top of mobile view if scrolled past it
						setTimeout(() => {
							const mobileViewTop = mobileView.getBoundingClientRect().top + window.scrollY;
							const currentScroll = window.scrollY;
							
							if (currentScroll > mobileViewTop + 200) {
								window.scrollTo({
									top: mobileViewTop - 20,
									behavior: 'smooth'
								});
							}
						}, 300);
					} else {
						// Expand with smooth animation
						featuresContainer.style.maxHeight = '650px';
						featuresContainer.classList.remove('collapsed');
						
						// Calculate and set the full height for smooth transition
						const fullHeight = featuresContainer.scrollHeight;
						featuresContainer.style.maxHeight = fullHeight + 'px';
						
						buttonText.textContent = 'Show Less';
						arrowIcon.classList.add('rotate');
						showMoreButton.setAttribute('aria-expanded', 'true');
						
						// Remove max-height after transition completes
						setTimeout(() => {
							if (!featuresContainer.classList.contains('collapsed')) {
								featuresContainer.style.maxHeight = 'none';
							}
						}, 500);
					}
				});
			}
		}
	});
	
	// Clean up mobile tooltips on window resize
	window.addEventListener('resize', function() {
		const mobileTooltips = document.querySelectorAll('.mobile-tooltip, .mobile-tooltip-overlay');
		mobileTooltips.forEach(el => el.remove());
	});
});