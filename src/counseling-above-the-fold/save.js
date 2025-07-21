/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should be combined
 * into the final markup, which is then serialized by the block editor into `post_content`.
 */
export default function save({ attributes }) {
	const {
		heading,
		subheading,
		serviceCards,
		benefitCards,
		personImage,
		personImagePosition,
		leftBackgroundColor,
		rightBackgroundColor,
		headingColor,
		subheadingColor,
		cardBackgroundColor,
		cardIconBackgroundColor,
		cardIconColor,
		cardTitleColor,
		cardDescriptionColor,
		benefitTextColor,
		blockZIndex,
		fullHeight,
		benefitsHorizontalPosition,
		benefitsVerticalPosition
	} = attributes;

	return (
		<div {...useBlockProps.save({ 
			className: fullHeight ? 'is-full-height' : '',
			style: { zIndex: blockZIndex }
		})}>
			<div className="counseling-above-fold-wrapper">
				<div 
					className="counseling-above-fold-left"
					style={{ backgroundColor: leftBackgroundColor }}
				>
					<div className="counseling-above-fold-content">
						<RichText.Content
							tagName="h1"
							className="counseling-above-fold-heading"
							value={heading}
							style={{ color: headingColor }}
						/>
						
						<RichText.Content
							tagName="p"
							className="counseling-above-fold-subheading"
							value={subheading}
							style={{ color: subheadingColor }}
						/>
						
						<div className="counseling-above-fold-cards">
							{serviceCards.map((card, index) => (
								<a 
									key={index} 
									href={card.link}
									className="counseling-service-card"
									style={{ backgroundColor: cardBackgroundColor }}
								>
									<div 
										className="counseling-service-icon"
										style={{ 
											backgroundColor: cardIconBackgroundColor,
											color: cardIconColor 
										}}
									>
										<span>{card.icon}</span>
									</div>
									<div className="counseling-service-content">
										<h3 style={{ color: cardTitleColor }}>{card.title}</h3>
										<p style={{ color: cardDescriptionColor }}>{card.description}</p>
									</div>
									<div className="counseling-service-arrow" aria-hidden="true">→</div>
								</a>
							))}
						</div>
					</div>
				</div>
				
				{personImage.url && (
					<div 
						className="counseling-above-fold-person"
						style={{ 
							backgroundImage: `url(${personImage.url})`,
							left: `${personImagePosition}%`
						}}
						role="img"
						aria-label={personImage.alt || 'Counselor'}
					/>
				)}
				
				<div 
					className="counseling-above-fold-right"
					style={{ backgroundColor: rightBackgroundColor }}
				>
					<div 
						className="counseling-above-fold-benefits"
						style={{ transform: `translate(${benefitsHorizontalPosition}px, ${benefitsVerticalPosition}px)` }}
					>
						{benefitCards.map((card, index) => (
							<div key={index} className="counseling-benefit-card">
								<span 
									className="counseling-benefit-text"
									style={{ color: benefitTextColor }}
								>
									{card.text}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}