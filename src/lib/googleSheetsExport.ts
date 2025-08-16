import { Issue } from "./mockData";

export interface ExportData {
  ID: string;
  Title: string;
  Description: string;
  Category: string;
  Status: string;
  Urgency: string;
  Location: string;
  Date: string;
  ReportedBy: string;
  Upvotes: number;
  Comments: number;
  Latitude: number;
  Longitude: number;
  Severity: number;
}

/**
 * Export data to CSV format for easy import into Google Sheets
 */
export const exportToCSV = (issues: Issue[], filename?: string): void => {
  // Prepare data for export
  const exportData: ExportData[] = issues.map(issue => ({
    ID: issue.id,
    Title: issue.title,
    Description: issue.description,
    Category: issue.category,
    Status: issue.status,
    Urgency: issue.urgency || "N/A",
    Location: issue.location,
    Date: issue.date,
    ReportedBy: issue.reportedBy,
    Upvotes: issue.upvotes,
    Comments: issue.comments,
    Latitude: issue.latitude,
    Longitude: issue.longitude,
    Severity: issue.severity
  }));

  // Convert to CSV format
  const headers = Object.keys(exportData[0]).join(",");
  const csvContent = [
    headers,
    ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(","))
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || `infrastructure-issues-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to Excel format (XLSX) for better compatibility
 */
export const exportToExcel = (issues: Issue[], filename?: string): void => {
  // This would require a library like xlsx or exceljs
  // For now, we'll export as CSV which Excel can open
  exportToCSV(issues, filename?.replace('.xlsx', '.csv') || `infrastructure-issues-${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Generate a formatted filename based on filters
 */
export const generateFilename = (filters: {
  timeFilter?: string;
  categoryFilter?: string;
  statusFilter?: string;
}): string => {
  const parts = ['infrastructure-issues'];
  
  if (filters.timeFilter && filters.timeFilter !== 'all') {
    parts.push(filters.timeFilter);
  }
  if (filters.categoryFilter && filters.categoryFilter !== 'all') {
    parts.push(filters.categoryFilter.replace(/\s+/g, '-').toLowerCase());
  }
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    parts.push(filters.statusFilter.replace(/\s+/g, '-').toLowerCase());
  }
  
  parts.push(new Date().toISOString().split('T')[0]);
  return `${parts.join('-')}.csv`;
};

/**
 * Format data for better readability in Google Sheets
 */
export const formatDataForSheets = (issues: Issue[]): ExportData[] => {
  return issues.map(issue => ({
    ID: issue.id,
    Title: issue.title,
    Description: issue.description,
    Category: issue.category,
    Status: issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' '),
    Urgency: issue.urgency ? issue.urgency.charAt(0).toUpperCase() + issue.urgency.slice(1) : "N/A",
    Location: issue.location,
    Date: new Date(issue.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    ReportedBy: issue.reportedBy,
    Upvotes: issue.upvotes,
    Comments: issue.comments,
    Latitude: issue.latitude,
    Longitude: issue.longitude,
    Severity: issue.severity
  }));
};

/**
 * Get export statistics for the filtered data
 */
export const getExportStats = (issues: Issue[]) => {
  const totalIssues = issues.length;
  const openIssues = issues.filter(issue => issue.status === 'open').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'in-progress').length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
  
  const categories = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const urgencies = issues.reduce((acc, issue) => {
    const urgency = issue.urgency || 'low';
    acc[urgency] = (acc[urgency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    categories,
    urgencies,
    dateRange: {
      earliest: issues.length > 0 ? new Date(Math.min(...issues.map(i => new Date(i.date).getTime()))) : null,
      latest: issues.length > 0 ? new Date(Math.max(...issues.map(i => new Date(i.date).getTime()))) : null
    }
  };
};

/**
 * Create a summary report for the exported data
 */
export const createSummaryReport = (issues: Issue[], filters: {
  timeFilter?: string;
  categoryFilter?: string;
  statusFilter?: string;
}): string => {
  const stats = getExportStats(issues);
  
  let report = `Infrastructure Issues Report\n`;
  report += `Generated on: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n\n`;
  
  // Filter information
  report += `Filters Applied:\n`;
  if (filters.timeFilter && filters.timeFilter !== 'all') {
    report += `• Time Period: ${filters.timeFilter}\n`;
  }
  if (filters.categoryFilter && filters.categoryFilter !== 'all') {
    report += `• Category: ${filters.categoryFilter}\n`;
  }
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    report += `• Status: ${filters.statusFilter}\n`;
  }
  if (filters.timeFilter === 'all' && filters.categoryFilter === 'all' && filters.statusFilter === 'all') {
    report += `• No filters applied (showing all data)\n`;
  }
  report += `\n`;
  
  // Summary statistics
  report += `Summary Statistics:\n`;
  report += `• Total Issues: ${stats.totalIssues}\n`;
  report += `• Open Issues: ${stats.openIssues}\n`;
  report += `• In Progress: ${stats.inProgressIssues}\n`;
  report += `• Resolved: ${stats.resolvedIssues}\n`;
  report += `• Resolution Rate: ${stats.totalIssues > 0 ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100) : 0}%\n\n`;
  
  // Category breakdown
  report += `Issues by Category:\n`;
  Object.entries(stats.categories).forEach(([category, count]) => {
    report += `• ${category}: ${count}\n`;
  });
  report += `\n`;
  
  // Urgency breakdown
  report += `Issues by Urgency:\n`;
  Object.entries(stats.urgencies).forEach(([urgency, count]) => {
    report += `• ${urgency.charAt(0).toUpperCase() + urgency.slice(1)}: ${count}\n`;
  });
  report += `\n`;
  
  // Date range
  if (stats.dateRange.earliest && stats.dateRange.latest) {
    report += `Date Range:\n`;
    report += `• From: ${stats.dateRange.earliest.toLocaleDateString()}\n`;
    report += `• To: ${stats.dateRange.latest.toLocaleDateString()}\n`;
  }
  
  return report;
};

