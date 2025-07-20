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
	ColorPalette,
	Tooltip,
	Icon,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const BACKGROUND_COLORS = [
	{ name: 'White', color: '#FFFFFF' },
	{ name: 'Light Gray', color: '#F9FAFB' },
	{ name: 'Light Blue', color: '#EFF6FF' },
	{ name: 'Light Green', color: '#F0FDF4' },
	{ name: 'Light Yellow', color: '#FEFCE8' },
	{ name: 'Light Purple', color: '#FAF5FF' },
	{ name: 'Light Pink', color: '#FDF2F8' }
];

const BORDER_COLORS = [
	{ name: 'Gray', color: '#E5E7EB' },
	{ name: 'Blue', color: '#3B82F6' },
	{ name: 'Green', color: '#10B981' },
	{ name: 'Yellow', color: '#F59E0B' },
	{ name: 'Purple', color: '#8B5CF6' },
	{ name: 'Pink', color: '#EC4899' },
	{ name: 'Dark Gray', color: '#6B7280' }
];

const ICON_COLORS = [
	{ name: 'Green', color: '#10B981' },
	{ name: 'Red', color: '#EF4444' },
	{ name: 'Blue', color: '#3B82F6' },
	{ name: 'Gray', color: '#9CA3AF' },
	{ name: 'Yellow', color: '#F59E0B' },
	{ name: 'Purple', color: '#8B5CF6' },
	{ name: 'Black', color: '#111827' }
];

const VALUE_TYPES = [
	{ label: 'Checkmark', value: 'check' },
	{ label: 'Empty Circle', value: 'check-empty' },
	{ label: 'Cross', value: 'cross' },
	{ label: 'Dash', value: 'dash' },
	{ label: 'Text', value: 'text' }
];

const getValueIcon = (type, value, iconColor = null) => {
	const color = iconColor || getDefaultIconColor(type);
	
	switch (type) {
		case 'check':
			return (
				<svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" className="icon-check">
					<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			);
		case 'check-empty':
			return (
				<svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="icon-check-empty">
					<circle cx="12" cy="12" r="10"/>
				</svg>
			);
		case 'cross':
			return (
				<svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" className="icon-cross">
					<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			);
		case 'dash':
			return (
				<svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" className="icon-dash">
					<path d="M5 12h14" strokeLinecap="round"/>
				</svg>
			);
		case 'text':
			return <span style={{ color, fontSize: '14px', fontWeight: '500' }}>{value || ''}</span>;
		default:
			return null;
	}
};

const getDefaultIconColor = (type) => {
	switch (type) {
		case 'check':
			return '#10b981';
		case 'check-empty':
			return '#d1d5db';
		case 'cross':
			return '#ef4444';
		case 'dash':
			return '#9ca3af';
		default:
			return '#374151';
	}
};

export default function Edit({ attributes, setAttributes }) {
	const {
		ourCompanyName,
		competitors,
		features,
		tableBackgroundColor,
		tableBorderColor,
		ourColumnColor,
		ourColumnBorderColor,
		competitorColumnColor,
		competitorBorderColor
	} = attributes;

	const [selectedFeature, setSelectedFeature] = useState(0);
	const [showAllFeatures, setShowAllFeatures] = useState(false);

	// Add competitor (max 5)
	const addCompetitor = () => {
		if (competitors.length >= 5) return;
		
		const newCompetitor = {
			id: `competitor-${Date.now()}`,
			name: `Competitor ${competitors.length + 1}`
		};
		
		const newCompetitors = [...competitors, newCompetitor];
		setAttributes({ competitors: newCompetitors });
		
		// Add values for the new competitor to all features
		const newFeatures = features.map(feature => ({
			...feature,
			competitorValues: [
				...(feature.competitorValues || []),
				{ type: 'cross', value: false }
			]
		}));
		setAttributes({ features: newFeatures });
	};

	// Remove competitor
	const removeCompetitor = (index) => {
		const newCompetitors = competitors.filter((_, i) => i !== index);
		setAttributes({ competitors: newCompetitors });
		
		// Remove competitor values from all features
		const newFeatures = features.map(feature => ({
			...feature,
			competitorValues: (feature.competitorValues || []).filter((_, i) => i !== index)
		}));
		setAttributes({ features: newFeatures });
	};

	// Update competitor name
	const updateCompetitorName = (index, name) => {
		const newCompetitors = [...competitors];
		newCompetitors[index] = { ...newCompetitors[index], name };
		setAttributes({ competitors: newCompetitors });
	};

	// Add feature
	const addFeature = () => {
		const newFeature = {
			id: `feature-${Date.now()}`,
			name: `Feature ${features.length + 1}`,
			tooltip: '',
			ourValue: { type: 'check', value: true },
			competitorValues: competitors.map(() => ({ type: 'cross', value: false }))
		};
		setAttributes({ features: [...features, newFeature] });
		setSelectedFeature(features.length);
	};

	// Remove feature
	const removeFeature = (index) => {
		const newFeatures = features.filter((_, i) => i !== index);
		setAttributes({ features: newFeatures });
		if (selectedFeature >= newFeatures.length) {
			setSelectedFeature(Math.max(0, newFeatures.length - 1));
		}
	};

	// Update feature
	const updateFeature = (index, updates) => {
		const newFeatures = [...features];
		newFeatures[index] = { ...newFeatures[index], ...updates };
		setAttributes({ features: newFeatures });
	};

	// Update feature value
	const updateFeatureValue = (featureIndex, column, valueUpdates) => {
		const newFeatures = [...features];
		if (column === 'our') {
			newFeatures[featureIndex].ourValue = { 
				...newFeatures[featureIndex].ourValue, 
				...valueUpdates 
			};
		} else {
			newFeatures[featureIndex].competitorValues[column] = {
				...newFeatures[featureIndex].competitorValues[column],
				...valueUpdates
			};
		}
		setAttributes({ features: newFeatures });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Table Settings', 'custom-blocks')}>
					<TextControl
						label={__('Your Company Name', 'custom-blocks')}
						value={ourCompanyName}
						onChange={(value) => setAttributes({ ourCompanyName: value })}
					/>
					
					<div style={{ marginTop: '20px', marginBottom: '10px' }}>
						<strong>{__('Competitors', 'custom-blocks')}</strong>
						<p style={{ marginTop: '5px', fontSize: '12px' }}>
							{__(`${competitors.length} of 5 competitors`, 'custom-blocks')}
						</p>
					</div>
					
					{competitors.length < 5 && (
						<Button 
							variant="secondary" 
							onClick={addCompetitor}
							style={{ marginBottom: '20px', width: '100%' }}
						>
							{__('+ Add Competitor', 'custom-blocks')}
						</Button>
					)}

					{competitors.map((competitor, index) => (
						<div key={competitor.id} style={{ 
							marginBottom: '15px', 
							padding: '15px', 
							backgroundColor: '#f9fafb',
							borderRadius: '8px',
							border: '1px solid #e5e7eb'
						}}>
							<TextControl
								label={__(`Competitor ${index + 1} Name`, 'custom-blocks')}
								value={competitor.name}
								onChange={(value) => updateCompetitorName(index, value)}
							/>
							<Button
								isDestructive
								variant="secondary"
								onClick={() => removeCompetitor(index)}
								style={{ marginTop: '10px' }}
							>
								{__('Remove Competitor', 'custom-blocks')}
							</Button>
						</div>
					))}
				</PanelBody>

				<PanelBody title={__('Color Settings', 'custom-blocks')} initialOpen={false}>
					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Table Background', 'custom-blocks')}</p>
						<ColorPalette
							colors={BACKGROUND_COLORS}
							value={tableBackgroundColor}
							onChange={(value) => setAttributes({ tableBackgroundColor: value })}
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Table Border', 'custom-blocks')}</p>
						<ColorPalette
							colors={BORDER_COLORS}
							value={tableBorderColor}
							onChange={(value) => setAttributes({ tableBorderColor: value })}
						/>
					</div>

					<hr style={{ margin: '20px 0' }} />

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Your Column Background', 'custom-blocks')}</p>
						<ColorPalette
							colors={BACKGROUND_COLORS}
							value={ourColumnColor}
							onChange={(value) => setAttributes({ ourColumnColor: value })}
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Your Column Border', 'custom-blocks')}</p>
						<ColorPalette
							colors={BORDER_COLORS}
							value={ourColumnBorderColor}
							onChange={(value) => setAttributes({ ourColumnBorderColor: value })}
						/>
					</div>

					<hr style={{ margin: '20px 0' }} />

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Competitor Columns Background', 'custom-blocks')}</p>
						<ColorPalette
							colors={BACKGROUND_COLORS}
							value={competitorColumnColor}
							onChange={(value) => setAttributes({ competitorColumnColor: value })}
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<p style={{ marginBottom: '10px' }}>{__('Competitor Columns Border', 'custom-blocks')}</p>
						<ColorPalette
							colors={BORDER_COLORS}
							value={competitorBorderColor}
							onChange={(value) => setAttributes({ competitorBorderColor: value })}
						/>
					</div>
				</PanelBody>

				<PanelBody title={__('Features', 'custom-blocks')}>
					<Button 
						variant="primary" 
						onClick={addFeature}
						style={{ marginBottom: '20px', width: '100%' }}
					>
						{__('+ Add Feature', 'custom-blocks')}
					</Button>

					{features.map((feature, featureIndex) => (
						<PanelBody 
							key={feature.id} 
							title={feature.name}
							initialOpen={featureIndex === selectedFeature}
							onToggle={() => setSelectedFeature(featureIndex)}
						>
							<TextControl
								label={__('Feature Name', 'custom-blocks')}
								value={feature.name}
								onChange={(value) => updateFeature(featureIndex, { name: value })}
							/>

							<TextControl
								label={__('Tooltip (optional)', 'custom-blocks')}
								value={feature.tooltip}
								onChange={(value) => updateFeature(featureIndex, { tooltip: value })}
								help={__('Add additional information about this feature', 'custom-blocks')}
							/>

							<hr style={{ margin: '20px 0' }} />

							<div style={{ marginBottom: '20px' }}>
								<strong>{__('Your Company', 'custom-blocks')}</strong>
								<SelectControl
									label={__('Value Type', 'custom-blocks')}
									value={feature.ourValue?.type || 'check'}
									options={VALUE_TYPES}
									onChange={(type) => updateFeatureValue(featureIndex, 'our', { type })}
								/>
								{feature.ourValue?.type === 'text' && (
									<TextControl
										label={__('Text Value', 'custom-blocks')}
										value={feature.ourValue?.value || ''}
										onChange={(value) => updateFeatureValue(featureIndex, 'our', { value })}
									/>
								)}
							</div>

							{competitors.map((competitor, compIndex) => (
								<div key={competitor.id} style={{ marginBottom: '20px' }}>
									<strong>{competitor.name}</strong>
									<SelectControl
										label={__('Value Type', 'custom-blocks')}
										value={feature.competitorValues?.[compIndex]?.type || 'cross'}
										options={VALUE_TYPES}
										onChange={(type) => updateFeatureValue(featureIndex, compIndex, { type })}
									/>
									{feature.competitorValues?.[compIndex]?.type === 'text' && (
										<TextControl
											label={__('Text Value', 'custom-blocks')}
											value={feature.competitorValues?.[compIndex]?.value || ''}
											onChange={(value) => updateFeatureValue(featureIndex, compIndex, { value })}
										/>
									)}
								</div>
							))}

							<Button 
								isDestructive 
								onClick={() => removeFeature(featureIndex)}
								style={{ width: '100%' }}
							>
								{__('Remove Feature', 'custom-blocks')}
							</Button>
						</PanelBody>
					))}
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				<div className="comparison-table-wrapper">
					{features.length === 0 ? (
						<div className="comparison-table-placeholder">
							<h3>{__('Comparison Table', 'custom-blocks')}</h3>
							<p>{__('Add features and competitors to create your comparison table.', 'custom-blocks')}</p>
							<Button variant="primary" onClick={addFeature}>
								{__('Add First Feature', 'custom-blocks')}
							</Button>
						</div>
					) : (
						<div className="comparison-table-container">
							<table 
								className="comparison-table"
								style={{
									backgroundColor: tableBackgroundColor,
									borderColor: tableBorderColor
								}}
							>
								<thead>
									<tr>
										<th className="feature-column">
											{__('Features', 'custom-blocks')}
										</th>
										<th 
											className="company-column our-column"
											style={{
												backgroundColor: ourColumnColor,
												borderColor: ourColumnBorderColor
											}}
										>
											<RichText
												tagName="span"
												value={ourCompanyName}
												onChange={(value) => setAttributes({ ourCompanyName: value })}
												placeholder={__('Your Company', 'custom-blocks')}
											/>
										</th>
										{competitors.map((competitor, index) => (
											<th 
												key={competitor.id}
												className="company-column competitor-column"
												style={{
													backgroundColor: competitorColumnColor,
													borderColor: competitorBorderColor
												}}
											>
												<span>{competitor.name}</span>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{features.map((feature, index) => (
										<tr key={feature.id}>
											<td className="feature-cell">
												<span className="feature-name">
													{feature.name}
												</span>
												{feature.tooltip && (
													<Tooltip text={feature.tooltip}>
														<span className="tooltip-icon">
															?
														</span>
													</Tooltip>
												)}
											</td>
											<td 
												className="value-cell our-value"
												style={{
													backgroundColor: ourColumnColor,
													borderColor: ourColumnBorderColor
												}}
											>
												<span className={`value-icon type-${feature.ourValue?.type || 'check'}`}>
													{getValueIcon(feature.ourValue?.type || 'check', feature.ourValue?.value)}
												</span>
											</td>
											{(feature.competitorValues || []).map((value, compIndex) => (
												<td 
													key={`${feature.id}-${compIndex}`}
													className="value-cell competitor-value"
													style={{
														backgroundColor: competitorColumnColor,
														borderColor: competitorBorderColor
													}}
												>
													<span className={`value-icon type-${value?.type || 'cross'}`}>
														{getValueIcon(value?.type || 'cross', value?.value)}
													</span>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>

							<div className="mobile-view">
								<div className={`mobile-features-container ${!showAllFeatures && features.length > 3 ? 'fade-out' : ''}`}>
									{features.map((feature, index) => (
										<div 
											key={feature.id} 
											className={`mobile-feature-card ${!showAllFeatures && index >= 3 ? 'hidden-feature' : ''}`}
											style={{
												display: !showAllFeatures && index >= 3 ? 'none' : 'block'
											}}
										>
										<div className="mobile-feature-header">
											<span className="feature-name">{feature.name}</span>
											{feature.tooltip && (
												<Tooltip text={feature.tooltip}>
													<span className="tooltip-icon">
														?
													</span>
												</Tooltip>
											)}
										</div>
										<div className="mobile-values">
											<div 
												className="mobile-value our-value"
												style={{
													backgroundColor: ourColumnColor,
													borderColor: ourColumnBorderColor
												}}
											>
												<span className="company-name">{ourCompanyName}</span>
												<span className={`value-icon type-${feature.ourValue?.type || 'check'}`}>
													{getValueIcon(feature.ourValue?.type || 'check', feature.ourValue?.value)}
												</span>
											</div>
											{competitors.map((competitor, index) => (
												<div 
													key={competitor.id}
													className="mobile-value competitor-value"
													style={{
														backgroundColor: competitorColumnColor,
														borderColor: competitorBorderColor
													}}
												>
													<span className="company-name">{competitor.name}</span>
													<span className={`value-icon type-${feature.competitorValues?.[index]?.type || 'cross'}`}>
														{getValueIcon(feature.competitorValues?.[index]?.type || 'cross', feature.competitorValues?.[index]?.value)}
													</span>
												</div>
											))}
										</div>
									</div>
									))}
								</div>
								{features.length > 3 && (
									<div className="mobile-show-more">
										<button 
											className="show-more-button"
											onClick={() => setShowAllFeatures(!showAllFeatures)}
											type="button"
										>
											<span>{showAllFeatures ? 'Show Less' : `Show ${features.length - 3} More`}</span>
											<svg 
												viewBox="0 0 24 24" 
												fill="none" 
												stroke="currentColor" 
												strokeWidth="2"
												className={`arrow-icon ${showAllFeatures ? 'rotate' : ''}`}
											>
												<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}