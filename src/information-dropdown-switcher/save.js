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
		categories,
		checkmarkColor,
		backgroundColor,
		textColor,
		tooltipBackgroundColor,
		tooltipTextColor,
		wrapperBackgroundColor,
		borderColor,
		borderSide
	} = attributes;

	// Generate unique ID for this block instance
	const blockId = `information-dropdown-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div {...useBlockProps.save()}>
			<div 
				className="information-dropdown-wrapper"
				style={{ 
					backgroundColor: wrapperBackgroundColor,
					borderColor: borderColor
				}}
				data-block-id={blockId}
				data-border-side={borderSide}
			>
				<RichText.Content
					tagName="h2"
					className="information-title"
					value={title}
					style={{ color: textColor }}
				/>
				
				{categories.length > 0 && (
					<>
						<div className="dropdown-container">
							<select 
								className="category-dropdown"
								style={{ color: textColor }}
								data-text-color={textColor}
							>
								{categories.map((category, index) => (
									<option key={category.id} value={index}>
										{category.name}
									</option>
								))}
							</select>
							<svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
								<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
						
						<div className="information-content">
							{categories.map((category, categoryIndex) => (
								<div 
									key={category.id}
									className={`information-grid ${categoryIndex === 0 ? 'active' : ''}`}
									data-category={categoryIndex}
									data-item-count={category.items.length}
								>
									{category.items.map((item) => (
										<div key={item.id} className="information-item">
											{item.checked && (
												<svg className="checkmark" viewBox="0 0 24 24" fill="none" stroke={checkmarkColor} strokeWidth="3">
													<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
											<span className="information-label" style={{ color: textColor }}>
												{item.label}
											</span>
											<div className="tooltip-trigger" tabIndex="0" role="button" aria-label={`Information about ${item.label}`}>
												<svg className="info-icon" viewBox="0 0 24 24" fill="none">
													<circle cx="12" cy="12" r="10" fill="#DBEAFE"/>
													<text x="12" y="16" textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="bold">i</text>
												</svg>
												<div 
													className="tooltip-content"
													style={{ 
														backgroundColor: tooltipBackgroundColor,
														color: tooltipTextColor
													}}
												>
													<p>{item.tooltip}</p>
													{item.link && (
														<a 
															href={item.link}
															className="learn-more-link"
															style={{ color: '#DC2626' }}
														>
															Learn More
														</a>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}