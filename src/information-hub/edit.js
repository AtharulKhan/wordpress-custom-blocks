/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls,
	RichText,
	PanelColorSettings
} from '@wordpress/block-editor';

import { 
	PanelBody, 
	Button,
	SelectControl,
	TextControl,
	ToggleControl,
	ColorPalette,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack
} from '@wordpress/components';

import { useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const PREDEFINED_COLORS = [
	{ name: 'Light Blue', color: '#E3F2FD' },
	{ name: 'Light Green', color: '#E8F5E9' },
	{ name: 'Light Orange', color: '#FFF3E0' },
	{ name: 'Light Purple', color: '#F3E5F5' },
	{ name: 'Light Pink', color: '#FCE4EC' },
	{ name: 'Light Yellow', color: '#FFFDE7' },
	{ name: 'Light Teal', color: '#E0F2F1' },
	{ name: 'Light Red', color: '#FFEBEE' },
	{ name: 'Light Grey', color: '#F5F5F5' }
];

const BORDER_COLORS = [
	{ name: 'Blue', color: '#1976D2' },
	{ name: 'Green', color: '#388E3C' },
	{ name: 'Orange', color: '#F57C00' },
	{ name: 'Purple', color: '#7B1FA2' },
	{ name: 'Pink', color: '#C2185B' },
	{ name: 'Yellow', color: '#FBC02D' },
	{ name: 'Teal', color: '#00796B' },
	{ name: 'Red', color: '#D32F2F' },
	{ name: 'Grey', color: '#616161' }
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { cards, globalBackgroundColor, globalBorderColor, applyGlobalColors } = attributes;
	const [selectedCard, setSelectedCard] = useState(0);

	const addCard = () => {
		if (cards.length >= 9) return;
		
		const newCard = {
			id: `card-${Date.now()}`,
			title: 'New Card',
			items: [],
			backgroundColor: '#E3F2FD',
			borderColor: '#1976D2'
		};
		
		setAttributes({ cards: [...cards, newCard] });
		setSelectedCard(cards.length);
	};

	const updateCard = (index, updates) => {
		const newCards = [...cards];
		newCards[index] = { ...newCards[index], ...updates };
		setAttributes({ cards: newCards });
	};

	const deleteCard = (index) => {
		const newCards = cards.filter((_, i) => i !== index);
		setAttributes({ cards: newCards });
		if (selectedCard >= newCards.length) {
			setSelectedCard(Math.max(0, newCards.length - 1));
		}
	};

	const addItem = (cardIndex) => {
		const newCards = [...cards];
		const newItem = {
			id: `item-${Date.now()}`,
			text: 'New item',
			type: 'bullet',
			url: '',
			completed: false
		};
		newCards[cardIndex].items = [...(newCards[cardIndex].items || []), newItem];
		setAttributes({ cards: newCards });
	};

	const updateItem = (cardIndex, itemIndex, updates) => {
		const newCards = [...cards];
		newCards[cardIndex].items[itemIndex] = { 
			...newCards[cardIndex].items[itemIndex], 
			...updates 
		};
		setAttributes({ cards: newCards });
	};

	const deleteItem = (cardIndex, itemIndex) => {
		const newCards = [...cards];
		newCards[cardIndex].items = newCards[cardIndex].items.filter((_, i) => i !== itemIndex);
		setAttributes({ cards: newCards });
	};

	const applyColorsToAll = () => {
		if (!globalBackgroundColor && !globalBorderColor) return;
		
		const newCards = cards.map(card => ({
			...card,
			backgroundColor: globalBackgroundColor || card.backgroundColor,
			borderColor: globalBorderColor || card.borderColor
		}));
		
		setAttributes({ cards: newCards });
	};

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
		<>
			<InspectorControls>
				<PanelBody title={__('Information Hub Settings', 'custom-blocks')}>
					<p>{__(`${cards.length} of 9 cards used`, 'custom-blocks')}</p>
					{cards.length < 9 && (
						<Button 
							variant="primary" 
							onClick={addCard}
							style={{ marginBottom: '20px', width: '100%' }}
						>
							{__('Add New Card', 'custom-blocks')}
						</Button>
					)}
				</PanelBody>

				<PanelBody title={__('Global Color Settings', 'custom-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Apply colors to all cards', 'custom-blocks')}
						checked={applyGlobalColors}
						onChange={(value) => setAttributes({ applyGlobalColors: value })}
					/>
					
					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Global Background Color', 'custom-blocks')}</p>
						<ColorPalette
							colors={PREDEFINED_COLORS}
							value={globalBackgroundColor}
							onChange={(value) => setAttributes({ globalBackgroundColor: value })}
							clearable={true}
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Global Border Color', 'custom-blocks')}</p>
						<ColorPalette
							colors={BORDER_COLORS}
							value={globalBorderColor}
							onChange={(value) => setAttributes({ globalBorderColor: value })}
							clearable={true}
						/>
					</div>

					{(globalBackgroundColor || globalBorderColor) && (
						<Button 
							variant="secondary" 
							onClick={applyColorsToAll}
							style={{ width: '100%' }}
						>
							{__('Apply Colors to All Cards', 'custom-blocks')}
						</Button>
					)}
				</PanelBody>

				{cards.map((card, cardIndex) => (
					<PanelBody 
						key={card.id} 
						title={`Card ${cardIndex + 1}: ${card.title}`}
						initialOpen={cardIndex === selectedCard}
						onToggle={() => setSelectedCard(cardIndex)}
					>
						<TextControl
							label={__('Card Title', 'custom-blocks')}
							value={card.title}
							onChange={(value) => updateCard(cardIndex, { title: value })}
						/>

						<div style={{ marginBottom: '20px' }}>
							<p style={{ marginBottom: '10px' }}>{__('Background Color', 'custom-blocks')}</p>
							<ColorPalette
								colors={PREDEFINED_COLORS}
								value={card.backgroundColor}
								onChange={(value) => updateCard(cardIndex, { backgroundColor: value })}
							/>
						</div>

						<div style={{ marginBottom: '20px' }}>
							<p style={{ marginBottom: '10px' }}>{__('Border Color', 'custom-blocks')}</p>
							<ColorPalette
								colors={BORDER_COLORS}
								value={card.borderColor}
								onChange={(value) => updateCard(cardIndex, { borderColor: value })}
							/>
						</div>

						<div style={{ marginBottom: '20px' }}>
							<h4>{__('List Items', 'custom-blocks')}</h4>
							{(card.items || []).map((item, itemIndex) => (
								<div key={item.id} style={{ 
									marginBottom: '15px', 
									padding: '10px', 
									backgroundColor: '#f0f0f0',
									borderRadius: '4px' 
								}}>
									<SelectControl
										label={__('Item Type', 'custom-blocks')}
										value={item.type}
										options={[
											{ label: 'Bullet Point', value: 'bullet' },
											{ label: 'Checkmark', value: 'checkmark' },
											{ label: 'Checklist', value: 'checklist' },
											{ label: 'Link', value: 'link' }
										]}
										onChange={(value) => updateItem(cardIndex, itemIndex, { type: value })}
									/>
									
									<TextControl
										label={__('Text', 'custom-blocks')}
										value={item.text}
										onChange={(value) => updateItem(cardIndex, itemIndex, { text: value })}
									/>

									{item.type === 'link' && (
										<TextControl
											label={__('URL', 'custom-blocks')}
											value={item.url}
											onChange={(value) => updateItem(cardIndex, itemIndex, { url: value })}
											type="url"
										/>
									)}

									{item.type === 'checklist' && (
										<ToggleControl
											label={__('Completed', 'custom-blocks')}
											checked={item.completed}
											onChange={(value) => updateItem(cardIndex, itemIndex, { completed: value })}
										/>
									)}

									<Button
										isDestructive
										variant="secondary"
										onClick={() => deleteItem(cardIndex, itemIndex)}
										style={{ marginTop: '10px' }}
									>
										{__('Delete Item', 'custom-blocks')}
									</Button>
								</div>
							))}
							
							<Button 
								variant="secondary" 
								onClick={() => addItem(cardIndex)}
								style={{ marginTop: '10px' }}
							>
								{__('Add Item', 'custom-blocks')}
							</Button>
						</div>

						<Button 
							isDestructive 
							onClick={() => deleteCard(cardIndex)}
							style={{ width: '100%' }}
						>
							{__('Delete Card', 'custom-blocks')}
						</Button>
					</PanelBody>
				))}
			</InspectorControls>

			<div {...useBlockProps()}>
				<div className="information-hub-wrapper">
					{cards.length === 0 ? (
						<div className="information-hub-placeholder">
							<h3>{__('Information Hub', 'custom-blocks')}</h3>
							<p>{__('Click "Add New Card" in the sidebar to get started.', 'custom-blocks')}</p>
							<Button variant="primary" onClick={addCard}>
								{__('Add First Card', 'custom-blocks')}
							</Button>
						</div>
					) : (
						<div className="information-hub-cards">
							{cards.map((card, index) => (
								<div 
									key={card.id} 
									className="information-card"
									style={{
										backgroundColor: applyGlobalColors && globalBackgroundColor ? globalBackgroundColor : card.backgroundColor,
										borderColor: applyGlobalColors && globalBorderColor ? globalBorderColor : card.borderColor
									}}
								>
									<RichText
										tagName="h3"
										value={card.title}
										onChange={(value) => updateCard(index, { title: value })}
										placeholder={__('Card Title', 'custom-blocks')}
									/>
									
									<ul className="card-items">
										{(card.items || []).map((item, itemIndex) => (
											<li key={item.id} className={`item-type-${item.type}`}>
												<span className="item-icon">
													{getItemIcon(item.type, item.completed)}
												</span>
												{item.type === 'link' && item.url ? (
													<a href={item.url} onClick={(e) => e.preventDefault()}>
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
									
									{(!card.items || card.items.length === 0) && (
										<p className="empty-card-message">
											{__('Add items to this card using the sidebar.', 'custom-blocks')}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}