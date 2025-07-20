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
		sectionTitle,
		mainHeading,
		description,
		phoneNumber,
		email,
		faqItems,
		backgroundColor,
		sectionLabelColor,
		headingColor,
		textColor,
		iconBackgroundColor,
		iconColor,
		faqBorderColor,
		faqQuestionColor,
		faqAnswerColor,
		toggleIconColor,
		toggleIconBackgroundColor,
		phoneIcon,
		emailIcon
	} = attributes;

	return (
		<div {...useBlockProps.save({ style: { backgroundColor } })}>
			<div className="faq-1-wrapper">
				<div className="faq-1-grid">
					<div className="faq-1-left">
						<RichText.Content
							tagName="span"
							className="faq-1-section-label"
							value={sectionTitle}
							style={{ color: sectionLabelColor }}
						/>
						
						<RichText.Content
							tagName="h2"
							className="faq-1-heading"
							value={mainHeading}
							style={{ color: headingColor }}
						/>
						
						<RichText.Content
							tagName="p"
							className="faq-1-description"
							value={description}
							style={{ color: textColor }}
						/>
						
						<div className="faq-1-contact">
							<div className="faq-1-contact-item">
								{phoneIcon ? (
									<span className="faq-1-icon-emoji">{phoneIcon}</span>
								) : (
									<div 
										className="faq-1-icon"
										style={{ 
											backgroundColor: iconBackgroundColor,
											color: iconColor 
										}}
									>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
										</svg>
									</div>
								)}
								<span style={{ color: textColor }}>{phoneNumber}</span>
							</div>
							
							<div className="faq-1-contact-item">
								{emailIcon ? (
									<span className="faq-1-icon-emoji">{emailIcon}</span>
								) : (
									<div 
										className="faq-1-icon"
										style={{ 
											backgroundColor: iconBackgroundColor,
											color: iconColor 
										}}
									>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
											<polyline points="22,6 12,13 2,6"></polyline>
										</svg>
									</div>
								)}
								<span style={{ color: textColor }}>{email}</span>
							</div>
						</div>
					</div>
					
					<div className="faq-1-right">
						<div className="faq-1-items">
							{faqItems.map((item, index) => (
								<div 
									key={index} 
									className={`faq-1-item ${index === 0 ? 'is-expanded' : ''}`}
									style={{ borderBottomColor: faqBorderColor }}
									data-faq-index={index}
								>
									<button
										className="faq-1-item-header"
										aria-expanded={index === 0}
										aria-controls={`faq-content-${index}`}
									>
										<RichText.Content
											tagName="h3"
											className="faq-1-question"
											value={item.question}
											style={{ color: faqQuestionColor }}
										/>
										<span 
											className="faq-1-toggle"
											style={{ 
												color: toggleIconColor,
												backgroundColor: toggleIconBackgroundColor 
											}}
											aria-hidden="true"
										>
											{index === 0 ? '−' : '+'}
										</span>
									</button>
									
									<div 
										className="faq-1-item-content"
										id={`faq-content-${index}`}
										aria-hidden={index !== 0}
									>
										<RichText.Content
											tagName="p"
											className="faq-1-answer"
											value={item.answer}
											style={{ color: faqAnswerColor }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}