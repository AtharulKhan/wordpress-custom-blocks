/**
 * Frontend script for FAQ expand/collapse functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	const faqBlocks = document.querySelectorAll('.wp-block-custom-blocks-faq-1');
	
	faqBlocks.forEach(block => {
		const faqItems = block.querySelectorAll('.faq-1-item');
		
		faqItems.forEach(item => {
			const header = item.querySelector('.faq-1-item-header');
			const content = item.querySelector('.faq-1-item-content');
			const toggle = item.querySelector('.faq-1-toggle');
			
			if (!header || !content || !toggle) return;
			
			header.addEventListener('click', function(e) {
				e.preventDefault();
				
				const isExpanded = item.classList.contains('is-expanded');
				
				// Close all other items in this FAQ block
				faqItems.forEach(otherItem => {
					if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
						otherItem.classList.remove('is-expanded');
						const otherHeader = otherItem.querySelector('.faq-1-item-header');
						const otherContent = otherItem.querySelector('.faq-1-item-content');
						const otherToggle = otherItem.querySelector('.faq-1-toggle');
						
						if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
						if (otherContent) otherContent.setAttribute('aria-hidden', 'true');
						if (otherToggle) otherToggle.textContent = '+';
					}
				});
				
				// Toggle current item
				if (isExpanded) {
					item.classList.remove('is-expanded');
					header.setAttribute('aria-expanded', 'false');
					content.setAttribute('aria-hidden', 'true');
					toggle.textContent = '+';
				} else {
					item.classList.add('is-expanded');
					header.setAttribute('aria-expanded', 'true');
					content.setAttribute('aria-hidden', 'false');
					toggle.textContent = '−';
				}
			});
		});
	});
});