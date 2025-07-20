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
	TextareaControl,
	ToggleControl,
	SelectControl
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
		categories,
		selectedCategory,
		checkmarkColor,
		backgroundColor,
		textColor,
		tooltipBackgroundColor,
		tooltipTextColor,
		wrapperBackgroundColor,
		borderColor,
		borderSide
	} = attributes;

	const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
	const [editingItemIndex, setEditingItemIndex] = useState(null);

	const updateTitle = (value) => {
		setAttributes({ title: value });
	};

	const addCategory = () => {
		const newCategory = {
			id: Date.now().toString(),
			name: 'New Category',
			items: []
		};
		setAttributes({ categories: [...categories, newCategory] });
		setEditingCategoryIndex(categories.length);
	};

	const updateCategory = (index, field, value) => {
		const newCategories = [...categories];
		newCategories[index][field] = value;
		setAttributes({ categories: newCategories });
	};

	const deleteCategory = (index) => {
		const newCategories = categories.filter((_, i) => i !== index);
		setAttributes({ categories: newCategories });
		if (selectedCategory === index.toString()) {
			setAttributes({ selectedCategory: '0' });
		}
	};

	const addItem = (categoryIndex) => {
		const newItem = {
			id: Date.now().toString(),
			label: 'New Item',
			tooltip: 'Item description',
			link: '',
			checked: true
		};
		const newCategories = [...categories];
		newCategories[categoryIndex].items.push(newItem);
		setAttributes({ categories: newCategories });
	};

	const updateItem = (categoryIndex, itemIndex, field, value) => {
		const newCategories = [...categories];
		newCategories[categoryIndex].items[itemIndex][field] = value;
		setAttributes({ categories: newCategories });
	};

	const deleteItem = (categoryIndex, itemIndex) => {
		const newCategories = [...categories];
		newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter((_, i) => i !== itemIndex);
		setAttributes({ categories: newCategories });
	};

	const currentCategory = categories[parseInt(selectedCategory)] || categories[0];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'custom-blocks')}>
					<PanelColorSettings
						title={__('Colors', 'custom-blocks')}
						colorSettings={[
							{
								value: checkmarkColor,
								onChange: (color) => setAttributes({ checkmarkColor: color }),
								label: __('Checkmark Color', 'custom-blocks')
							},
							{
								value: backgroundColor,
								onChange: (color) => setAttributes({ backgroundColor: color }),
								label: __('Background Color', 'custom-blocks')
							},
							{
								value: textColor,
								onChange: (color) => setAttributes({ textColor: color }),
								label: __('Text Color', 'custom-blocks')
							},
							{
								value: tooltipBackgroundColor,
								onChange: (color) => setAttributes({ tooltipBackgroundColor: color }),
								label: __('Tooltip Background', 'custom-blocks')
							},
							{
								value: tooltipTextColor,
								onChange: (color) => setAttributes({ tooltipTextColor: color }),
								label: __('Tooltip Text Color', 'custom-blocks')
							},
							{
								value: wrapperBackgroundColor,
								onChange: (color) => setAttributes({ wrapperBackgroundColor: color }),
								label: __('Wrapper Background Color', 'custom-blocks')
							},
							{
								value: borderColor,
								onChange: (color) => setAttributes({ borderColor: color }),
								label: __('Border Color', 'custom-blocks')
							}
						]}
					/>
					
					<SelectControl
						label={__('Border Side', 'custom-blocks')}
						value={borderSide}
						onChange={(value) => setAttributes({ borderSide: value })}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Top', value: 'top' },
							{ label: 'Right', value: 'right' },
							{ label: 'Bottom', value: 'bottom' },
							{ label: 'Left', value: 'left' },
							{ label: 'All Sides', value: 'all' }
						]}
					/>
				</PanelBody>

				<PanelBody title={__('Categories', 'custom-blocks')} initialOpen={false}>
					{categories.map((category, index) => (
						<div key={category.id} className="category-settings" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<TextControl
								label={__('Category Name', 'custom-blocks')}
								value={category.name}
								onChange={(value) => updateCategory(index, 'name', value)}
							/>
							<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
								<Button
									variant="secondary"
									onClick={() => {
										setSelectedCategory(index.toString());
										setEditingCategoryIndex(index);
									}}
								>
									{__('Edit Items', 'custom-blocks')}
								</Button>
								<Button
									isDestructive
									onClick={() => deleteCategory(index)}
									disabled={categories.length === 1}
								>
									{__('Delete', 'custom-blocks')}
								</Button>
							</div>
						</div>
					))}
					
					<Button
						variant="primary"
						onClick={addCategory}
						style={{ width: '100%' }}
					>
						{__('Add Category', 'custom-blocks')}
					</Button>
				</PanelBody>

				{currentCategory && (
					<PanelBody title={__('Items in ', 'custom-blocks') + currentCategory.name} initialOpen={false}>
						{currentCategory.items.map((item, itemIndex) => (
							<div key={item.id} className="item-settings" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
								<TextControl
									label={__('Item Name', 'custom-blocks')}
									value={item.label}
									onChange={(value) => updateItem(parseInt(selectedCategory), itemIndex, 'label', value)}
								/>
								
								<TextareaControl
									label={__('Tooltip Description', 'custom-blocks')}
									value={item.tooltip}
									onChange={(value) => updateItem(parseInt(selectedCategory), itemIndex, 'tooltip', value)}
									rows={3}
								/>
								
								<TextControl
									label={__('Learn More Link (optional)', 'custom-blocks')}
									value={item.link}
									onChange={(value) => updateItem(parseInt(selectedCategory), itemIndex, 'link', value)}
									placeholder="https://..."
								/>
								
								<ToggleControl
									label={__('Show Checkmark', 'custom-blocks')}
									checked={item.checked}
									onChange={(value) => updateItem(parseInt(selectedCategory), itemIndex, 'checked', value)}
								/>
								
								<Button
									isDestructive
									onClick={() => deleteItem(parseInt(selectedCategory), itemIndex)}
									style={{ marginTop: '10px' }}
								>
									{__('Delete Item', 'custom-blocks')}
								</Button>
							</div>
						))}
						
						<Button
							variant="primary"
							onClick={() => addItem(parseInt(selectedCategory))}
							style={{ width: '100%' }}
						>
							{__('Add Item', 'custom-blocks')}
						</Button>
					</PanelBody>
				)}
			</InspectorControls>

			<div {...useBlockProps()}>
				<div 
					className="information-dropdown-wrapper"
					style={{ 
						backgroundColor: wrapperBackgroundColor,
						borderColor: borderColor
					}}
					data-border-side={borderSide}
				>
					<RichText
						tagName="h2"
						className="information-title"
						value={title}
						onChange={updateTitle}
						placeholder={__('Block Title', 'custom-blocks')}
						style={{ color: textColor }}
					/>
					
					{categories.length > 0 && (
						<>
							<div className="dropdown-container">
								<select 
									className="category-dropdown"
									value={selectedCategory}
									onChange={(e) => setAttributes({ selectedCategory: e.target.value })}
									style={{ color: textColor }}
								>
									{categories.map((category, index) => (
										<option key={category.id} value={index}>
											{category.name}
										</option>
									))}
								</select>
								<svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							
							{currentCategory && currentCategory.items.length > 0 ? (
								<div className="information-grid">
									{currentCategory.items.map((item, index) => (
										<div key={item.id} className="information-item">
											{item.checked && (
												<svg className="checkmark" viewBox="0 0 24 24" fill="none" stroke={checkmarkColor} strokeWidth="3">
													<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
											<span className="information-label" style={{ color: textColor }}>
												{item.label}
											</span>
											<div className="tooltip-trigger">
												<svg className="info-icon" viewBox="0 0 24 24" fill="#93C5FD">
													<circle cx="12" cy="12" r="10" fill="#DBEAFE"/>
													<text x="12" y="16" textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="bold">i</text>
												</svg>
												<div 
													className="tooltip-preview"
													style={{ 
														backgroundColor: tooltipBackgroundColor,
														color: tooltipTextColor
													}}
												>
													<p>{item.tooltip}</p>
													{item.link && <a href="#">{__('Learn More', 'custom-blocks')}</a>}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="placeholder-content">
									<p>{__('Add items to this category', 'custom-blocks')}</p>
									<Button 
										variant="primary" 
										onClick={() => addItem(parseInt(selectedCategory))}
									>
										{__('Add First Item', 'custom-blocks')}
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}