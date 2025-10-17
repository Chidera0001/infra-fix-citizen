import type { Issue } from '@/lib/supabase-api';

export function generateReportPDF(report: Issue): void {
	// Create a new window for PDF generation
	const printWindow = window.open('', '_blank');
	if (!printWindow) {
		alert('Please allow popups to generate PDF');
		return;
	}

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	// Get status icon (text representation)
	const getStatusText = (status: string) => {
		switch (status) {
			case "open": return "🔴 Open";
			case "in-progress": return "🟡 In Progress";
			case "resolved": return "✅ Resolved";
			default: return "⚪ Unknown";
		}
	};

	// Generate HTML content for PDF
	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Report: ${report.title}</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					margin: 0;
					padding: 20px;
					color: #333;
					line-height: 1.6;
				}
				.header {
					border-bottom: 3px solid #22c55e;
					padding-bottom: 20px;
					margin-bottom: 30px;
				}
				.title {
					font-size: 24px;
					font-weight: bold;
					color: #1f2937;
					margin-bottom: 10px;
				}
				.subtitle {
					color: #6b7280;
					font-size: 14px;
				}
				.section {
					margin-bottom: 25px;
					padding: 20px;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					background-color: #f9fafb;
				}
				.section-title {
					font-size: 18px;
					font-weight: bold;
					color: #1f2937;
					margin-bottom: 15px;
					border-bottom: 2px solid #22c55e;
					padding-bottom: 5px;
				}
				.info-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 20px;
				}
				.info-item {
					margin-bottom: 10px;
				}
				.info-label {
					font-weight: bold;
					color: #374151;
				}
				.info-value {
					color: #6b7280;
					margin-top: 2px;
				}
				.badge {
					display: inline-block;
					padding: 4px 8px;
					border-radius: 4px;
					font-size: 12px;
					font-weight: bold;
					margin: 2px;
				}
				.badge-critical { background-color: #fee2e2; color: #dc2626; }
				.badge-high { background-color: #fed7aa; color: #ea580c; }
				.badge-medium { background-color: #fef3c7; color: #d97706; }
				.badge-low { background-color: #d1fae5; color: #059669; }
				.badge-status { background-color: #e0f2fe; color: #0369a1; }
				.badge-category { background-color: #f3e8ff; color: #7c3aed; }
				.images-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 15px;
					margin-top: 15px;
				}
				.image-item {
					text-align: center;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					padding: 10px;
					background-color: white;
				}
				.image-placeholder {
					width: 100%;
					height: 150px;
					background-color: #f3f4f6;
					border: 2px dashed #d1d5db;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #6b7280;
					font-size: 14px;
					border-radius: 4px;
					margin-bottom: 10px;
				}
				.footer {
					margin-top: 40px;
					padding-top: 20px;
					border-top: 1px solid #e5e7eb;
					text-align: center;
					color: #6b7280;
					font-size: 12px;
				}
				@media print {
					body { margin: 0; padding: 15px; }
					.section { break-inside: avoid; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div class="title">${report.title}</div>
				<div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>
			</div>

			<div class="section">
				<div class="section-title">Report Information</div>
				<div class="info-grid">
					<div>
						<div class="info-item">
							<div class="info-label">Status:</div>
							<div class="info-value">${getStatusText(report.status)}</div>
						</div>
						<div class="info-item">
							<div class="info-label">Severity:</div>
							<div class="info-value">
								<span class="badge badge-${report.severity}">${report.severity.toUpperCase()}</span>
							</div>
						</div>
						<div class="info-item">
							<div class="info-label">Category:</div>
							<div class="info-value">
								<span class="badge badge-category">${report.category.replace('_', ' ').toUpperCase()}</span>
							</div>
						</div>
					</div>
					<div>
						<div class="info-item">
							<div class="info-label">Reported:</div>
							<div class="info-value">${formatDate(report.created_at)}</div>
						</div>
						<div class="info-item">
							<div class="info-label">Report ID:</div>
							<div class="info-value">${report.id}</div>
						</div>
						${report.updated_at && report.updated_at !== report.created_at ? `
						<div class="info-item">
							<div class="info-label">Last Updated:</div>
							<div class="info-value">${formatDate(report.updated_at)}</div>
						</div>
						` : ''}
					</div>
				</div>
			</div>

			<div class="section">
				<div class="section-title">Description</div>
				<div class="info-value">${report.description}</div>
			</div>

			<div class="section">
				<div class="section-title">Location Details</div>
				<div class="info-item">
					<div class="info-label">Address:</div>
					<div class="info-value">${report.address}</div>
				</div>
				${report.latitude && report.longitude ? `
				<div class="info-item">
					<div class="info-label">Coordinates:</div>
					<div class="info-value">${report.latitude}, ${report.longitude}</div>
				</div>
				` : ''}
			</div>

			${report.image_urls && report.image_urls.length > 0 ? `
			<div class="section">
				<div class="section-title">Attached Images</div>
				<div class="images-grid">
					${report.image_urls.map((image, index) => `
						<div class="image-item">
							<div class="image-placeholder">
								Image ${index + 1}<br>
								<small>${image}</small>
							</div>
							<div style="font-size: 12px; color: #6b7280;">
								Note: Images are not included in PDF.<br>
								URL: ${image}
							</div>
						</div>
					`).join('')}
				</div>
			</div>
			` : ''}

			${report.notes ? `
			<div class="section">
				<div class="section-title">Admin Notes</div>
				<div class="info-value">${report.notes}</div>
			</div>
			` : ''}

			<div class="footer">
				<p>This report was generated from the Citizen Infrastructure Reporting System</p>
				<p>For questions or updates, please contact your local administration</p>
			</div>

			<script>
				// Auto-print when loaded
				window.onload = function() {
					setTimeout(function() {
						window.print();
					}, 500);
				};
			</script>
		</body>
		</html>
	`;

	printWindow.document.write(htmlContent);
	printWindow.document.close();
}

export function shareReport(report: Issue): void {
	const shareText = `Check out this infrastructure issue report:\n\n` +
		`📋 **${report.title}**\n` +
		`📍 Location: ${report.address}\n` +
		`🚨 Severity: ${report.severity.toUpperCase()}\n` +
		`📂 Category: ${report.category.replace('_', ' ')}\n` +
		`📅 Reported: ${new Date(report.created_at).toLocaleDateString()}\n\n` +
		`Status: ${report.status.replace('-', ' ')}\n\n` +
		`Description: ${report.description}\n\n` +
		`Report ID: ${report.id}`;

	// Check if Web Share API is supported
	if (navigator.share) {
		navigator.share({
			title: `Infrastructure Report: ${report.title}`,
			text: shareText,
			url: window.location.href
		}).catch((error) => {
			console.log('Error sharing:', error);
			// Fallback to clipboard
			copyToClipboard(shareText);
		});
	} else {
		// Fallback to clipboard
		copyToClipboard(shareText);
	}
}

function copyToClipboard(text: string): void {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(() => {
			alert('Report details copied to clipboard!');
		}).catch(() => {
			// Fallback for older browsers
			fallbackCopyToClipboard(text);
		});
	} else {
		fallbackCopyToClipboard(text);
	}
}

function fallbackCopyToClipboard(text: string): void {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	textArea.style.top = '-999999px';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	
	try {
		document.execCommand('copy');
		alert('Report details copied to clipboard!');
	} catch (err) {
		alert('Unable to copy to clipboard. Please copy the text manually.');
		console.error('Fallback: Could not copy text: ', err);
	}
	
	document.body.removeChild(textArea);
}
