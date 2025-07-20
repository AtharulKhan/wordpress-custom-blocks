/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
	useBlockProps,
	RichText,
	InspectorControls,
	PanelColorSettings
} from '@wordpress/block-editor';
import { 
	PanelBody,
	Button,
	TextControl
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 */
export default function Edit({ attributes, setAttributes }) {
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

	const [expandedItems, setExpandedItems] = useState(
		faqItems.map((item, index) => index === 0)
	);

	const updateFaqItem = (index, field, value) => {
		const newItems = [...faqItems];
		newItems[index][field] = value;
		setAttributes({ faqItems: newItems });
	};

	const addFaqItem = () => {
		const newItem = {
			question: 'New Question',
			answer: 'New Answer',
			isExpanded: false
		};
		setAttributes({ faqItems: [...faqItems, newItem] });
		setExpandedItems([...expandedItems, false]);
	};

	const deleteFaqItem = (index) => {
		const newItems = faqItems.filter((_, i) => i !== index);
		setAttributes({ faqItems: newItems });
		const newExpanded = expandedItems.filter((_, i) => i !== index);
		setExpandedItems(newExpanded);
	};

	const moveFaqItem = (index, direction) => {
		const newItems = [...faqItems];
		const newIndex = index + direction;
		
		if (newIndex < 0 || newIndex >= faqItems.length) return;
		
		[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
		setAttributes({ faqItems: newItems });
		
		const newExpanded = [...expandedItems];
		[newExpanded[index], newExpanded[newIndex]] = [newExpanded[newIndex], newExpanded[index]];
		setExpandedItems(newExpanded);
	};

	const toggleFaqItem = (index) => {
		const newExpanded = [...expandedItems];
		newExpanded[index] = !newExpanded[index];
		setExpandedItems(newExpanded);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('FAQ Settings', 'custom-blocks')}>
					<TextControl
						label={__('Phone Number', 'custom-blocks')}
						value={phoneNumber}
						onChange={(value) => setAttributes({ phoneNumber: value })}
					/>
					<TextControl
						label={__('Phone Icon (Emoji)', 'custom-blocks')}
						value={phoneIcon}
						onChange={(value) => setAttributes({ phoneIcon: value })}
						help={__('Enter an emoji or leave empty to use default icon', 'custom-blocks')}
					/>
					<TextControl
						label={__('Email', 'custom-blocks')}
						value={email}
						onChange={(value) => setAttributes({ email: value })}
					/>
					<TextControl
						label={__('Email Icon (Emoji)', 'custom-blocks')}
						value={emailIcon}
						onChange={(value) => setAttributes({ emailIcon: value })}
						help={__('Enter an emoji or leave empty to use default icon', 'custom-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Colors', 'custom-blocks')} initialOpen={false}>
					<PanelColorSettings
						title={__('General Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: (color) => setAttributes({ backgroundColor: color }),
								label: __('Background Color', 'custom-blocks')
							},
							{
								value: sectionLabelColor,
								onChange: (color) => setAttributes({ sectionLabelColor: color }),
								label: __('Section Label Color', 'custom-blocks')
							},
							{
								value: headingColor,
								onChange: (color) => setAttributes({ headingColor: color }),
								label: __('Heading Color', 'custom-blocks')
							},
							{
								value: textColor,
								onChange: (color) => setAttributes({ textColor: color }),
								label: __('Text Color', 'custom-blocks')
							}
						]}
					/>
					
					<PanelColorSettings
						title={__('Icon Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: iconBackgroundColor,
								onChange: (color) => setAttributes({ iconBackgroundColor: color }),
								label: __('Icon Background Color', 'custom-blocks')
							},
							{
								value: iconColor,
								onChange: (color) => setAttributes({ iconColor: color }),
								label: __('Icon Color', 'custom-blocks')
							}
						]}
					/>
					
					<PanelColorSettings
						title={__('FAQ Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: faqBorderColor,
								onChange: (color) => setAttributes({ faqBorderColor: color }),
								label: __('FAQ Border Color', 'custom-blocks')
							},
							{
								value: faqQuestionColor,
								onChange: (color) => setAttributes({ faqQuestionColor: color }),
								label: __('FAQ Question Color', 'custom-blocks')
							},
							{
								value: faqAnswerColor,
								onChange: (color) => setAttributes({ faqAnswerColor: color }),
								label: __('FAQ Answer Color', 'custom-blocks')
							},
							{
								value: toggleIconColor,
								onChange: (color) => setAttributes({ toggleIconColor: color }),
								label: __('Toggle Icon Color', 'custom-blocks')
							},
							{
								value: toggleIconBackgroundColor,
								onChange: (color) => setAttributes({ toggleIconBackgroundColor: color }),
								label: __('Toggle Icon Background', 'custom-blocks')
							}
						]}
					/>
				</PanelBody>

				<PanelBody title={__('FAQ Items', 'custom-blocks')} initialOpen={false}>
					{faqItems.map((item, index) => (
						<div key={index} className="faq-item-settings" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
								{__('FAQ Item', 'custom-blocks')} {index + 1}
							</div>
							
							<TextControl
								label={__('Question', 'custom-blocks')}
								value={item.question}
								onChange={(value) => updateFaqItem(index, 'question', value)}
							/>
							
							<TextControl
								label={__('Answer', 'custom-blocks')}
								value={item.answer}
								onChange={(value) => updateFaqItem(index, 'answer', value)}
								help={__('Leave empty to hide this item', 'custom-blocks')}
							/>

							<div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
								<Button
									isSmall
									variant="secondary"
									onClick={() => moveFaqItem(index, -1)}
									disabled={index === 0}
								>
									↑
								</Button>
								<Button
									isSmall
									variant="secondary"
									onClick={() => moveFaqItem(index, 1)}
									disabled={index === faqItems.length - 1}
								>
									↓
								</Button>
								<Button
									isSmall
									isDestructive
									onClick={() => deleteFaqItem(index)}
								>
									{__('Delete', 'custom-blocks')}
								</Button>
							</div>
						</div>
					))}
					
					<Button
						variant="primary"
						onClick={addFaqItem}
						style={{ width: '100%' }}
					>
						{__('Add FAQ Item', 'custom-blocks')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps({ style: { backgroundColor } })}>
				<div className="faq-1-wrapper">
					<div className="faq-1-grid">
						<div className="faq-1-left">
							<RichText
								tagName="span"
								className="faq-1-section-label"
								value={sectionTitle}
								onChange={(value) => setAttributes({ sectionTitle: value })}
								placeholder={__('FAQ', 'custom-blocks')}
								style={{ color: sectionLabelColor }}
							/>
							
							<RichText
								tagName="h2"
								className="faq-1-heading"
								value={mainHeading}
								onChange={(value) => setAttributes({ mainHeading: value })}
								placeholder={__('Do you need some help?', 'custom-blocks')}
								style={{ color: headingColor }}
							/>
							
							<RichText
								tagName="p"
								className="faq-1-description"
								value={description}
								onChange={(value) => setAttributes({ description: value })}
								placeholder={__('Enter description...', 'custom-blocks')}
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
										className={`faq-1-item ${expandedItems[index] ? 'is-expanded' : ''}`}
										style={{ borderBottomColor: faqBorderColor }}
									>
										<button
											className="faq-1-item-header"
											onClick={() => toggleFaqItem(index)}
											aria-expanded={expandedItems[index]}
										>
											<RichText
												tagName="h3"
												className="faq-1-question"
												value={item.question}
												onChange={(value) => updateFaqItem(index, 'question', value)}
												placeholder={__('Enter question...', 'custom-blocks')}
												style={{ color: faqQuestionColor }}
											/>
											<span 
												className="faq-1-toggle"
												style={{ 
													color: toggleIconColor,
													backgroundColor: toggleIconBackgroundColor 
												}}
											>
												{expandedItems[index] ? '−' : '+'}
											</span>
										</button>
										
										{expandedItems[index] && (
											<div className="faq-1-item-content">
												<RichText
													tagName="p"
													className="faq-1-answer"
													value={item.answer}
													onChange={(value) => updateFaqItem(index, 'answer', value)}
													placeholder={__('Enter answer...', 'custom-blocks')}
													style={{ color: faqAnswerColor }}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}