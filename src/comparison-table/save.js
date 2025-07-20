/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

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

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
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

	return (
		<div { ...useBlockProps.save() }>
			<div className="comparison-table-wrapper">
				{features.length > 0 && (
					<>
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
										<th className="feature-column">Features</th>
										<th 
											className="company-column our-column"
											style={{
												backgroundColor: ourColumnColor,
												borderColor: ourColumnBorderColor
											}}
										>
											<RichText.Content
												tagName="span"
												value={ourCompanyName}
											/>
										</th>
										{competitors.map((competitor) => (
											<th 
												key={competitor.id}
												className="company-column competitor-column"
												style={{
													backgroundColor: competitorColumnColor,
													borderColor: competitorBorderColor
												}}
											>
												<RichText.Content
													tagName="span"
													value={competitor.name}
												/>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{features.map((feature) => (
										<tr key={feature.id}>
											<td className="feature-cell">
												<span className="feature-name">
													{feature.name}
												</span>
												{feature.tooltip && (
													<span 
														className="tooltip-icon"
														data-tooltip={feature.tooltip}
														aria-label={feature.tooltip}
													>
														?
													</span>
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
						</div>

						<div className="mobile-view" data-feature-count={features.length}>
							<div className={`mobile-features-container ${features.length > 3 ? 'fade-out collapsed' : ''}`}>
								{features.map((feature, index) => (
									<div 
										key={feature.id} 
										className="mobile-feature-card"
										data-feature-index={index}
									>
									<div className="mobile-feature-header">
										<span className="feature-name">{feature.name}</span>
										{feature.tooltip && (
											<span 
												className="tooltip-icon"
												data-tooltip={feature.tooltip}
												aria-label={feature.tooltip}
											>
												?
											</span>
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
											<span className="company-name">
												<RichText.Content
													tagName="span"
													value={ourCompanyName}
												/>
											</span>
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
												<span className="company-name">
													<RichText.Content
														tagName="span"
														value={competitor.name}
													/>
												</span>
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
										type="button"
										aria-expanded="false"
										aria-label={`Show ${features.length - 3} more features`}
									>
										<span className="button-text">Show {features.length - 3} More</span>
										<svg 
											viewBox="0 0 24 24" 
											fill="none" 
											stroke="currentColor" 
											strokeWidth="2"
											className="arrow-icon"
										>
											<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</button>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}