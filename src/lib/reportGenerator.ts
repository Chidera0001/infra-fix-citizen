import { adminApi, issuesApi } from "@/lib/supabase-api";
import { exportToCSV, exportToExcel, createSummaryReport, formatDataForSheets } from "@/lib/googleSheetsExport";
import { generateAdminReportPDF } from "@/utils/pdfGenerator";
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from "date-fns";

export interface ReportFilters {
	reportType: string;
	dateRange: string;
	customStartDate?: string;
	customEndDate?: string;
	category: string;
	exportFormat: string;
	advancedFilters?: {
		status?: string[];
		severity?: string[];
		priority?: string[];
		assignedTo?: string;
		location?: {
			radius?: number;
			lat?: number;
			lng?: number;
		};
		tags?: string[];
	};
}

export interface ReportData {
	issues: any[];
	summary: {
		totalIssues: number;
		openIssues: number;
		inProgressIssues: number;
		resolvedIssues: number;
		resolutionRate: number;
		averageResolutionTime: number;
		categoryBreakdown: Record<string, number>;
		severityBreakdown: Record<string, number>;
		statusBreakdown: Record<string, number>;
	};
	metadata: {
		generatedAt: string;
		dateRange: string;
		filters: ReportFilters;
	};
}

export class ReportGenerator {
	private async getDateRange(dateRange: string, customStartDate?: string, customEndDate?: string) {
		const now = new Date();
		let startDate: Date;
		let endDate: Date = endOfDay(now);

		if (dateRange === "custom" && customStartDate && customEndDate) {
			startDate = startOfDay(new Date(customStartDate));
			endDate = endOfDay(new Date(customEndDate));
		} else {
			switch (dateRange) {
				case "7d":
					startDate = startOfDay(subDays(now, 7));
					break;
				case "30d":
					startDate = startOfDay(subDays(now, 30));
					break;
				case "90d":
					startDate = startOfDay(subDays(now, 90));
					break;
				case "1y":
					startDate = startOfDay(subDays(now, 365));
					break;
				default:
					startDate = startOfDay(subDays(now, 30));
			}
		}

		return {
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		};
	}

	private async fetchIssues(filters: ReportFilters) {
		try {
			const { startDate, endDate } = await this.getDateRange(
				filters.dateRange,
				filters.customStartDate,
				filters.customEndDate
			);

			const issueFilters: any = {
				limit: 1000, // Get more issues for comprehensive reports
				sortBy: 'created_at',
				sortOrder: 'DESC'
			};

			// Apply category filter
			if (filters.category && filters.category !== "all") {
				issueFilters.category = filters.category;
			}

			// Apply advanced filters
			if (filters.advancedFilters) {
				if (filters.advancedFilters.status && filters.advancedFilters.status.length > 0) {
					// Note: This would need to be handled by the API to support multiple statuses
					issueFilters.status = filters.advancedFilters.status[0];
				}
				if (filters.advancedFilters.severity && filters.advancedFilters.severity.length > 0) {
					issueFilters.severity = filters.advancedFilters.severity[0];
				}
				if (filters.advancedFilters.location) {
					issueFilters.lat = filters.advancedFilters.location.lat;
					issueFilters.lng = filters.advancedFilters.location.lng;
					issueFilters.radius = filters.advancedFilters.location.radius;
				}
			}

			const issues = await issuesApi.getIssues(issueFilters);

			// Filter by date range on the client side (since API might not support date filtering)
			return issues.filter((issue: any) => {
				const issueDate = new Date(issue.created_at);
				return issueDate >= new Date(startDate) && issueDate <= new Date(endDate);
			});
		} catch (error) {
			console.error('Error fetching issues:', error);
			throw new Error(`Failed to fetch issues: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	private calculateSummary(issues: any[]) {
		const totalIssues = issues.length;
		const openIssues = issues.filter(issue => issue.status === 'open').length;
		const inProgressIssues = issues.filter(issue => issue.status === 'in-progress').length;
		const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
		const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

		// Calculate average resolution time
		const resolvedIssuesWithTimes = issues.filter(issue => 
			issue.status === 'resolved' && issue.updated_at && issue.created_at
		);
		const averageResolutionTime = resolvedIssuesWithTimes.length > 0
			? resolvedIssuesWithTimes.reduce((sum, issue) => {
				const resolutionTime = new Date(issue.updated_at).getTime() - new Date(issue.created_at).getTime();
				return sum + resolutionTime;
			}, 0) / resolvedIssuesWithTimes.length / (1000 * 60 * 60 * 24) // Convert to days
			: 0;

		// Category breakdown
		const categoryBreakdown = issues.reduce((acc, issue) => {
			acc[issue.category] = (acc[issue.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Severity breakdown
		const severityBreakdown = issues.reduce((acc, issue) => {
			const severity = issue.severity || 'unknown';
			acc[severity] = (acc[severity] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Status breakdown
		const statusBreakdown = issues.reduce((acc, issue) => {
			acc[issue.status] = (acc[issue.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return {
			totalIssues,
			openIssues,
			inProgressIssues,
			resolvedIssues,
			resolutionRate,
			averageResolutionTime,
			categoryBreakdown,
			severityBreakdown,
			statusBreakdown
		};
	}

	async generateReport(filters: ReportFilters): Promise<ReportData> {
		try {
			const issues = await this.fetchIssues(filters);
			const summary = this.calculateSummary(issues);
			const { startDate, endDate } = await this.getDateRange(
				filters.dateRange,
				filters.customStartDate,
				filters.customEndDate
			);

			return {
				issues,
				summary,
				metadata: {
					generatedAt: new Date().toISOString(),
					dateRange: `${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`,
					filters
				}
			};
		} catch (error) {
			console.error('Error generating report:', error);
			throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async exportReport(reportData: ReportData, format: string) {
		const { issues, summary, metadata } = reportData;
		
		// Check if there are issues to export
		if (!issues || issues.length === 0) {
			throw new Error('No issues found to export. Please adjust your filters and try again.');
		}
		
		const timestamp = new Date().toISOString().split('T')[0];
		const reportType = metadata.filters.reportType;

		switch (format) {
			case 'pdf':
				// For PDF, we'll generate a comprehensive report
				this.generatePDFReport(reportData);
				break;

			case 'csv':
				const csvFilename = `report-${reportType}-${timestamp}.csv`;
				exportToCSV(issues, csvFilename);
				break;

			case 'excel':
				const excelFilename = `report-${reportType}-${timestamp}.xlsx`;
				exportToExcel(issues, excelFilename);
				break;

			case 'json':
				const jsonFilename = `report-${reportType}-${timestamp}.json`;
				this.downloadJSON(reportData, jsonFilename);
				break;

			default:
				throw new Error(`Unsupported export format: ${format}`);
		}
	}

	private generatePDFReport(reportData: ReportData) {
		// Use the new admin PDF generator with proper branding
		generateAdminReportPDF(reportData);
	}

	private downloadJSON(reportData: ReportData, filename: string) {
		const jsonContent = JSON.stringify(reportData, null, 2);
		const blob = new Blob([jsonContent], { type: "application/json" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

export const reportGenerator = new ReportGenerator();
