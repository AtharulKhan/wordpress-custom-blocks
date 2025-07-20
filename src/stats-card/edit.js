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
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 */
export default function Edit({ attributes, setAttributes }) {
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

	const [editingItemIndex, setEditingItemIndex] = useState(null);

	const updateTitle = (value) => {
		setAttributes({ title: value });
	};

	const addItem = () => {
		const newItem = {
			type: 'text',
			value: '0',
			label: 'New Item',
			isChecklist: false,
			isChecked: false
		};
		setAttributes({ items: [...items, newItem] });
		setEditingItemIndex(items.length);
	};

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index][field] = value;
		setAttributes({ items: newItems });
	};

	const deleteItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
		setEditingItemIndex(null);
	};

	const moveItem = (index, direction) => {
		const newItems = [...items];
		const newIndex = index + direction;
		
		if (newIndex < 0 || newIndex >= items.length) return;
		
		[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
		setAttributes({ items: newItems });
		setEditingItemIndex(newIndex);
	};

	const getItemIcon = (type) => {
		switch (type) {
			case 'percentage':
				return '%';
			case 'currency':
				return '$';
			case 'text':
			default:
				return '#';
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Card Settings', 'custom-blocks')}>
					<PanelColorSettings
						title={__('Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: (color) => setAttributes({ backgroundColor: color }),
								label: __('Background Color', 'custom-blocks')
							},
							{
								value: borderColor,
								onChange: (color) => setAttributes({ borderColor: color }),
								label: __('Border Color', 'custom-blocks')
							},
							{
								value: titleColor,
								onChange: (color) => setAttributes({ titleColor: color }),
								label: __('Title Color', 'custom-blocks')
							},
							{
								value: itemColor,
								onChange: (color) => setAttributes({ itemColor: color }),
								label: __('Item Value Color', 'custom-blocks')
							},
							{
								value: labelColor,
								onChange: (color) => setAttributes({ labelColor: color }),
								label: __('Label Color', 'custom-blocks')
							}
						]}
					/>
					
					<RangeControl
						label={__('Border Width (px)', 'custom-blocks')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={20}
						step={1}
						help={__('Set the width of the left border in pixels', 'custom-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Items', 'custom-blocks')} initialOpen={false}>
					{items.map((item, index) => (
						<div key={index} className="item-settings" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
								{__('Item', 'custom-blocks')} {index + 1}
							</div>
							
							<SelectControl
								label={__('Type', 'custom-blocks')}
								value={item.type}
								options={[
									{ label: 'Text/Number', value: 'text' },
									{ label: 'Percentage', value: 'percentage' },
									{ label: 'Currency', value: 'currency' },
									{ label: 'Checklist', value: 'checklist' }
								]}
								onChange={(value) => {
									updateItem(index, 'type', value);
									if (value === 'checklist') {
										updateItem(index, 'isChecklist', true);
									} else {
										updateItem(index, 'isChecklist', false);
									}
								}}
							/>

							{item.type !== 'checklist' && (
								<TextControl
									label={__('Value', 'custom-blocks')}
									value={item.value}
									onChange={(value) => updateItem(index, 'value', value)}
								/>
							)}

							<TextControl
								label={__('Label', 'custom-blocks')}
								value={item.label}
								onChange={(value) => updateItem(index, 'label', value)}
							/>

							{item.type === 'checklist' && (
								<ToggleControl
									label={__('Checked by default', 'custom-blocks')}
									checked={item.isChecked}
									onChange={(value) => updateItem(index, 'isChecked', value)}
								/>
							)}

							<div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
								<Button
									isSmall
									variant="secondary"
									onClick={() => moveItem(index, -1)}
									disabled={index === 0}
								>
									↑
								</Button>
								<Button
									isSmall
									variant="secondary"
									onClick={() => moveItem(index, 1)}
									disabled={index === items.length - 1}
								>
									↓
								</Button>
								<Button
									isSmall
									isDestructive
									onClick={() => deleteItem(index)}
								>
									{__('Delete', 'custom-blocks')}
								</Button>
							</div>
						</div>
					))}
					
					<Button
						variant="primary"
						onClick={addItem}
						style={{ width: '100%' }}
					>
						{__('Add Item', 'custom-blocks')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				<div className="stats-card-wrapper">
					<div 
						className="stats-card"
						style={{
							backgroundColor: backgroundColor,
							borderLeftColor: borderColor,
							borderLeftWidth: `${borderWidth}px`
						}}
					>
						<RichText
							tagName="h3"
							className="card-title"
							value={title}
							onChange={updateTitle}
							placeholder={__('Card Title', 'custom-blocks')}
							style={{ color: titleColor }}
						/>
						
						{items.length === 0 ? (
							<div className="placeholder-content">
								<p>{__('Add items to display in this card', 'custom-blocks')}</p>
								<Button variant="primary" onClick={addItem}>
									{__('Add First Item', 'custom-blocks')}
								</Button>
							</div>
						) : (
							<div className="card-items">
								{items.map((item, index) => (
									<div 
										key={index} 
										className={`card-item ${editingItemIndex === index ? 'editing' : ''}`}
										onClick={() => setEditingItemIndex(index)}
									>
										{item.isChecklist ? (
											<>
												<input 
													type="checkbox" 
													checked={item.isChecked}
													onChange={(e) => updateItem(index, 'isChecked', e.target.checked)}
													className="checklist-checkbox"
												/>
												<span 
													className="item-label checklist-label"
													style={{ color: labelColor }}
												>
													{item.label}
												</span>
											</>
										) : (
											<>
												<div 
													className="item-value"
													style={{ color: itemColor }}
												>
													{item.type === 'currency' && '$'}
													{item.value}
													{item.type === 'percentage' && '%'}
												</div>
												<div 
													className="item-label"
													style={{ color: labelColor }}
												>
													{item.label}
												</div>
											</>
										)}
										
										{editingItemIndex === index && (
											<div className="item-actions">
												<Button
													isSmall
													onClick={(e) => {
														e.stopPropagation();
														deleteItem(index);
													}}
												>
													{__('Delete', 'custom-blocks')}
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}