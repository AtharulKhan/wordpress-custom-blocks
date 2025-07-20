/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 */
export default function save({ attributes }) {
	const {
		title,
		items,
		backgroundColor,
		borderColor,
		borderWidth,
		titleColor,
		itemColor,
		labelColor
	} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className="stats-card-wrapper">
				<div 
					className="stats-card"
					style={{
						backgroundColor: backgroundColor,
						borderLeftColor: borderColor,
						borderLeftWidth: `${borderWidth}px`
					}}
				>
					<RichText.Content
						tagName="h3"
						className="card-title"
						value={title}
						style={{ color: titleColor }}
					/>
					
					{items.length > 0 && (
						<div className="card-items">
							{items.map((item, index) => (
								<div 
									key={index} 
									className={`card-item ${item.isChecklist ? 'checklist-item' : ''}`}
								>
									{item.isChecklist ? (
										<>
											<input 
												type="checkbox" 
												className="checklist-checkbox"
												defaultChecked={item.isChecked}
												id={`checklist-${index}`}
											/>
											<label 
												htmlFor={`checklist-${index}`}
												className="item-label checklist-label"
												style={{ color: labelColor }}
											>
												{item.label}
											</label>
										</>
									) : (
										<>
											<div 
												className="item-value"
												style={{ color: itemColor }}
											>
												{item.type === 'currency' && <span className="currency-symbol">$</span>}
												<span className="value-text">{item.value}</span>
												{item.type === 'percentage' && <span className="percentage-symbol">%</span>}
											</div>
											<div 
												className="item-label"
												style={{ color: labelColor }}
											>
												{item.label}
											</div>
										</>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}