/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { cards, globalBackgroundColor, globalBorderColor, applyGlobalColors } = attributes;

	const getItemIcon = (type, completed) => {
		switch(type) {
			case 'checkmark':
				return '✓';
			case 'checklist':
				return completed ? '☑' : '☐';
			case 'bullet':
				return '•';
			case 'link':
				return '🔗';
			default:
				return '•';
		}
	};

	return (
		<div { ...useBlockProps.save() }>
			<div className="information-hub-wrapper">
				{cards.length > 0 && (
					<div className="information-hub-cards">
						{cards.map((card) => (
							<div 
								key={card.id} 
								className="information-card"
								style={{
									backgroundColor: applyGlobalColors && globalBackgroundColor ? globalBackgroundColor : card.backgroundColor,
									borderColor: applyGlobalColors && globalBorderColor ? globalBorderColor : card.borderColor
								}}
							>
								<RichText.Content
									tagName="h3"
									value={card.title}
								/>
								
								{card.items && card.items.length > 0 && (
									<ul className="card-items">
										{card.items.map((item) => (
											<li key={item.id} className={`item-type-${item.type}`} data-completed={item.completed}>
												<span className="item-icon">
													{getItemIcon(item.type, item.completed)}
												</span>
												{item.type === 'link' && item.url ? (
													<a href={item.url} target="_blank" rel="noopener noreferrer">
														{item.text}
													</a>
												) : (
													<span className={item.completed ? 'completed' : ''}>
														{item.text}
													</span>
												)}
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}