/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
	useBlockProps,
	RichText,
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';
import { 
	PanelBody,
	Button,
	TextControl,
	RangeControl,
	SelectControl,
	ToggleControl
} from '@wordpress/components';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 */
export default function Edit({ attributes, setAttributes }) {
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

	const updateServiceCard = (index, field, value) => {
		const newCards = [...serviceCards];
		newCards[index][field] = value;
		setAttributes({ serviceCards: newCards });
	};

	const updateBenefitCard = (index, field, value) => {
		const newCards = [...benefitCards];
		newCards[index][field] = value;
		setAttributes({ benefitCards: newCards });
	};

	const addServiceCard = () => {
		const newCard = {
			icon: '◉',
			title: 'New Service',
			description: 'Description',
			link: '#'
		};
		setAttributes({ serviceCards: [...serviceCards, newCard] });
	};

	const removeServiceCard = (index) => {
		const newCards = serviceCards.filter((_, i) => i !== index);
		setAttributes({ serviceCards: newCards });
	};

	const addBenefitCard = () => {
		const newCard = {
			text: 'New Benefit'
		};
		setAttributes({ benefitCards: [...benefitCards, newCard] });
	};

	const removeBenefitCard = (index) => {
		const newCards = benefitCards.filter((_, i) => i !== index);
		setAttributes({ benefitCards: newCards });
	};

	const onSelectImage = (media) => {
		setAttributes({
			personImage: {
				url: media.url,
				id: media.id,
				alt: media.alt
			}
		});
	};

	const removeImage = () => {
		setAttributes({
			personImage: {
				url: '',
				id: 0,
				alt: ''
			}
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('General Settings', 'custom-blocks')}>
					<ToggleControl
						label={__('Full Height', 'custom-blocks')}
						checked={fullHeight}
						onChange={(value) => setAttributes({ fullHeight: value })}
						help={__('Make the block full viewport height', 'custom-blocks')}
					/>
					
					<SelectControl
						label={__('Block Z-Index', 'custom-blocks')}
						value={blockZIndex}
						options={[
							{ label: 'Auto', value: 'auto' },
							{ label: 'Below Header (1)', value: '1' },
							{ label: 'Above Header (9999)', value: '9999' }
						]}
						onChange={(value) => setAttributes({ blockZIndex: value })}
						help={__('Control whether the block appears above or below the header/menu', 'custom-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Person Image', 'custom-blocks')} initialOpen={false}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={personImage.id}
							render={({ open }) => (
								<Button onClick={open} variant="secondary">
									{personImage.url ? __('Change Image', 'custom-blocks') : __('Select Image', 'custom-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					
					{personImage.url && (
						<>
							<Button 
								onClick={removeImage} 
								variant="link" 
								isDestructive
								style={{ marginTop: '10px' }}
							>
								{__('Remove Image', 'custom-blocks')}
							</Button>
							
							<RangeControl
								label={__('Image Position', 'custom-blocks')}
								value={personImagePosition}
								onChange={(value) => setAttributes({ personImagePosition: value })}
								min={0}
								max={100}
								help={__('Adjust horizontal position (0 = left, 100 = right)', 'custom-blocks')}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Colors', 'custom-blocks')} initialOpen={false}>
					<PanelColorSettings
						title={__('Background Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: leftBackgroundColor,
								onChange: (color) => setAttributes({ leftBackgroundColor: color }),
								label: __('Left Background', 'custom-blocks')
							},
							{
								value: rightBackgroundColor,
								onChange: (color) => setAttributes({ rightBackgroundColor: color }),
								label: __('Right Background', 'custom-blocks')
							}
						]}
					/>
					
					<PanelColorSettings
						title={__('Text Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: headingColor,
								onChange: (color) => setAttributes({ headingColor: color }),
								label: __('Heading Color', 'custom-blocks')
							},
							{
								value: subheadingColor,
								onChange: (color) => setAttributes({ subheadingColor: color }),
								label: __('Subheading Color', 'custom-blocks')
							}
						]}
					/>
					
					<PanelColorSettings
						title={__('Service Card Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: cardBackgroundColor,
								onChange: (color) => setAttributes({ cardBackgroundColor: color }),
								label: __('Card Background', 'custom-blocks')
							},
							{
								value: cardIconBackgroundColor,
								onChange: (color) => setAttributes({ cardIconBackgroundColor: color }),
								label: __('Icon Background', 'custom-blocks')
							},
							{
								value: cardIconColor,
								onChange: (color) => setAttributes({ cardIconColor: color }),
								label: __('Icon Color', 'custom-blocks')
							},
							{
								value: cardTitleColor,
								onChange: (color) => setAttributes({ cardTitleColor: color }),
								label: __('Title Color', 'custom-blocks')
							},
							{
								value: cardDescriptionColor,
								onChange: (color) => setAttributes({ cardDescriptionColor: color }),
								label: __('Description Color', 'custom-blocks')
							}
						]}
					/>
					
					<PanelColorSettings
						title={__('Benefit Card Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: benefitTextColor,
								onChange: (color) => setAttributes({ benefitTextColor: color }),
								label: __('Text Color', 'custom-blocks')
							}
						]}
					/>
				</PanelBody>

				<PanelBody title={__('Service Cards', 'custom-blocks')} initialOpen={false}>
					{serviceCards.map((card, index) => (
						<div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<h4>{__('Service Card', 'custom-blocks')} {index + 1}</h4>
							
							<TextControl
								label={__('Icon', 'custom-blocks')}
								value={card.icon}
								onChange={(value) => updateServiceCard(index, 'icon', value)}
								help={__('Use simple symbols like ◉ ◎ ● ○ ▪ ▫ ♦ ♢', 'custom-blocks')}
							/>
							
							<TextControl
								label={__('Title', 'custom-blocks')}
								value={card.title}
								onChange={(value) => updateServiceCard(index, 'title', value)}
							/>
							
							<TextControl
								label={__('Description', 'custom-blocks')}
								value={card.description}
								onChange={(value) => updateServiceCard(index, 'description', value)}
							/>
							
							<TextControl
								label={__('Link URL', 'custom-blocks')}
								value={card.link}
								onChange={(value) => updateServiceCard(index, 'link', value)}
							/>
							
							{serviceCards.length > 1 && (
								<Button
									isDestructive
									variant="link"
									onClick={() => removeServiceCard(index)}
								>
									{__('Remove Card', 'custom-blocks')}
								</Button>
							)}
						</div>
					))}
					
					{serviceCards.length < 4 && (
						<Button variant="secondary" onClick={addServiceCard}>
							{__('Add Service Card', 'custom-blocks')}
						</Button>
					)}
				</PanelBody>

				<PanelBody title={__('Benefit Cards', 'custom-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Horizontal Position', 'custom-blocks')}
						value={benefitsHorizontalPosition}
						onChange={(value) => setAttributes({ benefitsHorizontalPosition: value })}
						min={-100}
						max={100}
						help={__('Adjust horizontal position of benefits section', 'custom-blocks')}
					/>
					<RangeControl
						label={__('Vertical Position', 'custom-blocks')}
						value={benefitsVerticalPosition}
						onChange={(value) => setAttributes({ benefitsVerticalPosition: value })}
						min={-50}
						max={50}
						help={__('Adjust vertical position of benefits section', 'custom-blocks')}
					/>
					{benefitCards.map((card, index) => (
						<div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<h4>{__('Benefit', 'custom-blocks')} {index + 1}</h4>
							
							<TextControl
								label={__('Text', 'custom-blocks')}
								value={card.text}
								onChange={(value) => updateBenefitCard(index, 'text', value)}
							/>
							
							{benefitCards.length > 1 && (
								<Button
									isDestructive
									variant="link"
									onClick={() => removeBenefitCard(index)}
								>
									{__('Remove Benefit', 'custom-blocks')}
								</Button>
							)}
						</div>
					))}
					
					<Button variant="secondary" onClick={addBenefitCard}>
						{__('Add Benefit', 'custom-blocks')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps({ 
				className: fullHeight ? 'is-full-height' : '',
				style: { zIndex: blockZIndex }
			})}>
				<div className="counseling-above-fold-wrapper">
					<div 
						className="counseling-above-fold-left"
						style={{ backgroundColor: leftBackgroundColor }}
					>
						<div className="counseling-above-fold-content">
							<RichText
								tagName="h1"
								className="counseling-above-fold-heading"
								value={heading}
								onChange={(value) => setAttributes({ heading: value })}
								placeholder={__('Enter heading...', 'custom-blocks')}
								style={{ color: headingColor }}
							/>
							
							<RichText
								tagName="p"
								className="counseling-above-fold-subheading"
								value={subheading}
								onChange={(value) => setAttributes({ subheading: value })}
								placeholder={__('Enter subheading...', 'custom-blocks')}
								style={{ color: subheadingColor }}
							/>
							
							<div className="counseling-above-fold-cards">
								{serviceCards.map((card, index) => (
									<div 
										key={index} 
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
										<div className="counseling-service-arrow">→</div>
									</div>
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
		</>
	);
}