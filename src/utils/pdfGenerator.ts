import type { Issue } from '@/lib/supabase-api';
import type { ReportData } from '@/lib/reportGenerator';

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

export function generateAdminReportPDF(reportData: ReportData): void {
	// Create a new window for PDF generation
	const printWindow = window.open('', '_blank');
	if (!printWindow) {
		alert('Please allow popups to generate PDF');
		return;
	}

	const { summary, metadata } = reportData;
	const reportType = metadata.filters.reportType;

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

	// Get report type specific styling
	const getReportTypeStyle = (type: string) => {
		switch (type) {
			case "summary": return { color: "#22c55e", bgColor: "#f0fdf4" };
			case "detailed": return { color: "#3b82f6", bgColor: "#eff6ff" };
			case "performance": return { color: "#8b5cf6", bgColor: "#faf5ff" };
			case "trends": return { color: "#f59e0b", bgColor: "#fffbeb" };
			default: return { color: "#22c55e", bgColor: "#f0fdf4" };
		}
	};

	const reportStyle = getReportTypeStyle(reportType);

	// Generate HTML content for PDF
	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Citizn ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
			<link rel="icon" type="image/svg+xml" href="/favicon.svg">
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					margin: 0;
					padding: 20px;
					color: #333;
					line-height: 1.6;
					background-color: white;
				}
				.header {
					border-bottom: 3px solid ${reportStyle.color};
					padding-bottom: 20px;
					margin-bottom: 30px;
					background-color: ${reportStyle.bgColor};
					padding: 20px;
					border-radius: 8px;
				}
				.logo {
					font-size: 28px;
					font-weight: bold;
					color: ${reportStyle.color};
					margin-bottom: 10px;
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
					border-bottom: 2px solid ${reportStyle.color};
					padding-bottom: 5px;
				}
				.metrics-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 15px;
					margin-bottom: 20px;
				}
				.metric-card {
					background-color: white;
					padding: 15px;
					border-radius: 8px;
					border-left: 4px solid ${reportStyle.color};
					box-shadow: 0 1px 3px rgba(0,0,0,0.1);
				}
				.metric-value {
					font-size: 24px;
					font-weight: bold;
					color: ${reportStyle.color};
					margin-bottom: 5px;
				}
				.metric-label {
					font-size: 14px;
					color: #6b7280;
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
					.metrics-grid { break-inside: avoid; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div class="logo">Citizn</div>
				<div class="title">${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</div>
				<div class="subtitle">Generated on ${formatDate(metadata.generatedAt)} • Date Range: ${metadata.dateRange}</div>
			</div>

			<div class="section">
				<div class="section-title">Key Metrics</div>
				<div class="metrics-grid">
					<div class="metric-card">
						<div class="metric-value">${summary.totalIssues}</div>
						<div class="metric-label">Total Issues</div>
					</div>
					<div class="metric-card">
						<div class="metric-value">${summary.openIssues}</div>
						<div class="metric-label">Open Issues</div>
					</div>
					<div class="metric-card">
						<div class="metric-value">${summary.resolvedIssues}</div>
						<div class="metric-label">Resolved Issues</div>
					</div>
					<div class="metric-card">
						<div class="metric-value">${Math.round(summary.resolutionRate)}%</div>
						<div class="metric-label">Resolution Rate</div>
					</div>
					<div class="metric-card">
						<div class="metric-value">${Math.round(summary.averageResolutionTime)}</div>
						<div class="metric-label">Avg Resolution Time (days)</div>
					</div>
					<div class="metric-card">
						<div class="metric-value">${summary.inProgressIssues}</div>
						<div class="metric-label">In Progress</div>
					</div>
				</div>
			</div>

			<div class="section">
				<div class="section-title">Category Breakdown</div>
				<div class="info-grid">
					${Object.entries(summary.categoryBreakdown).map(([category, count]) => `
						<div class="info-item">
							<div class="info-label">${category.replace('_', ' ').toUpperCase()}:</div>
							<div class="info-value">${count} issues (${Math.round((count / summary.totalIssues) * 100)}%)</div>
						</div>
					`).join('')}
				</div>
			</div>

			<div class="section">
				<div class="section-title">Severity Distribution</div>
				<div class="info-grid">
					${Object.entries(summary.severityBreakdown).map(([severity, count]) => `
						<div class="info-item">
							<div class="info-label">
								<span class="badge badge-${severity}">${severity.toUpperCase()}</span>
							</div>
							<div class="info-value">${count} issues (${Math.round((count / summary.totalIssues) * 100)}%)</div>
						</div>
					`).join('')}
				</div>
			</div>

			<div class="section">
				<div class="section-title">Status Distribution</div>
				<div class="info-grid">
					${Object.entries(summary.statusBreakdown).map(([status, count]) => `
						<div class="info-item">
							<div class="info-label">${status.replace('-', ' ').toUpperCase()}:</div>
							<div class="info-value">${count} issues (${Math.round((count / summary.totalIssues) * 100)}%)</div>
						</div>
					`).join('')}
				</div>
			</div>

			<div class="footer">
				<p><strong>Citizn Infrastructure Reporting System</strong></p>
				<p>This report was generated on ${formatDate(metadata.generatedAt)}</p>
				<p>Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} | Date Range: ${metadata.dateRange}</p>
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
