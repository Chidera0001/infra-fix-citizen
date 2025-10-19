import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
	BarChart3, 
	Clock, 
	Activity,
	CheckCircle,
	MapPin,
	AlertTriangle
} from "lucide-react";
import { ReportSummary } from "@/lib/reportGenerator";

interface DetailedReportProps {
	summary: ReportSummary;
}

export const DetailedReport = ({ summary }: DetailedReportProps) => {
	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "critical": return "bg-red-100 text-red-700";
			case "high": return "bg-red-100 text-red-700";
			case "medium": return "bg-yellow-100 text-yellow-700";
			case "low": return "bg-green-100 text-green-700";
			default: return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<>
			{/* Comprehensive Metrics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Total Issues</p>
							<p className="text-3xl font-bold text-yellow-600 mb-1">{summary.totalIssues}</p>
							<p className="text-xs text-gray-500">All time</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution</p>
							<p className="text-3xl font-bold text-green-700 mb-1">{Math.round(summary.averageResolutionTime)}</p>
							<p className="text-xs text-gray-500">days</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
							<p className="text-3xl font-bold text-red-600 mb-1">{summary.inProgressIssues}</p>
							<p className="text-xs text-gray-500">Active</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Resolution Rate</p>
							<p className="text-3xl font-bold text-green-600 mb-1">{Math.round(summary.resolutionRate)}%</p>
							<p className="text-xs text-gray-500">Success</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Category Breakdown */}
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Issues by Category
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-4">
							{Object.entries(summary.categoryBreakdown).map(([category, count]) => (
								<div key={category} className="flex items-center justify-between">
									<span className="text-sm font-medium text-gray-700 capitalize">
										{category.replace('_', ' ')}
									</span>
									<div className="flex items-center flex-1 mx-4">
										<div className="flex-1 bg-gray-100 rounded-full h-2 mr-3">
											<div 
												className="bg-green-500 h-2 rounded-full transition-all duration-500" 
												style={{ 
													width: `${(count / summary.totalIssues) * 100}%` 
												}}
											></div>
										</div>
										<span className="text-sm font-bold text-gray-900 min-w-[2rem] text-right">{count}</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Severity Breakdown */}
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Issues by Severity
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-4">
							{Object.entries(summary.severityBreakdown).map(([severity, count]) => (
								<div key={severity} className="flex items-center justify-between">
									<Badge className={`${getSeverityColor(severity)} text-xs px-2 py-1`}>
										{severity.toUpperCase()}
									</Badge>
									<div className="flex items-center flex-1 mx-4">
										<div className="flex-1 bg-gray-100 rounded-full h-2 mr-3">
											<div 
												className="bg-green-500 h-2 rounded-full transition-all duration-500" 
												style={{ 
													width: `${(count / summary.totalIssues) * 100}%` 
												}}
											></div>
										</div>
										<span className="text-sm font-bold text-gray-900 min-w-[2rem] text-right">{count}</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Status Breakdown */}
			<Card className="border-none">
				<CardHeader className="pb-4 px-6">
					<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
						Status Distribution
					</CardTitle>
				</CardHeader>
				<CardContent className="px-6 pb-6">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{Object.entries(summary.statusBreakdown).map(([status, count], index) => {
							// Define colors based on status
							const getStatusColors = (status: string) => {
								switch (status) {
									case "open": return { bg: "bg-red-50", hover: "hover:bg-red-100", text: "text-red-600" };
									case "resolved": return { bg: "bg-green-50", hover: "hover:bg-green-100", text: "text-green-600" };
									case "in-progress": return { bg: "bg-yellow-50", hover: "hover:bg-yellow-100", text: "text-yellow-600" };
									default: return { bg: "bg-gray-50", hover: "hover:bg-gray-100", text: "text-gray-600" };
								}
							};
							
							const colors = getStatusColors(status);
							
							return (
								<div key={status} className={`text-center p-6 ${colors.bg} rounded-lg ${colors.hover} transition-colors duration-200`}>
									<div className={`text-2xl font-bold ${colors.text} mb-2`}>{count}</div>
									<div className="text-sm font-medium text-gray-700 capitalize">{status.replace('-', ' ')}</div>
									<div className="text-xs text-gray-500 mt-1">
										{Math.round((count / summary.totalIssues) * 100)}%
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</>
	);
};
