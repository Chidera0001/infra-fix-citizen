import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
	PieChart,
	TrendingUp,
	Activity
} from "lucide-react";
import { ReportSummary } from "@/lib/reportGenerator";

interface TrendsReportProps {
	summary: ReportSummary;
}

export const TrendsReport = ({ summary }: TrendsReportProps) => {
	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "critical": return "bg-red-100 text-red-700";
			case "high": return "bg-orange-100 text-orange-700";
			case "medium": return "bg-yellow-100 text-yellow-700";
			case "low": return "bg-green-100 text-green-700";
			default: return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<>
			{/* Trend Metrics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Total Volume</p>
							<p className="text-3xl font-bold text-yellow-600 mb-1">{summary.totalIssues}</p>
							<p className="text-xs text-gray-500">All time</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Resolution Trend</p>
							<p className="text-3xl font-bold text-green-600 mb-1">{Math.round(summary.resolutionRate)}%</p>
							<p className="text-xs text-gray-500">Success rate</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution</p>
							<p className="text-3xl font-bold text-green-700 mb-1">{Math.round(summary.averageResolutionTime)}</p>
							<p className="text-xs text-gray-500">days trend</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Active Issues</p>
							<p className="text-3xl font-bold text-red-600 mb-1">{summary.inProgressIssues}</p>
							<p className="text-xs text-gray-500">Current</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Trend Analysis */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Category Trends
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

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Severity Trends
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

			{/* Trend Insights */}
			<Card className=" border-none">
				<CardHeader className="pb-4 px-6">
					<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
						Trend Insights
					</CardTitle>
				</CardHeader>
				<CardContent className="px-6 pb-6">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="text-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
							<div className="text-2xl font-bold text-green-600 mb-2">
								{Math.round(summary.resolutionRate)}%
							</div>
							<div className="text-sm font-medium text-gray-700">Resolution Rate</div>
							<div className="text-xs text-gray-500 mt-1">Overall trend</div>
						</div>
						<div className="text-center p-6 bg-green-100 rounded-lg hover:bg-green-200 transition-colors duration-200">
							<div className="text-2xl font-bold text-green-700 mb-2">
								{Math.round(summary.averageResolutionTime)}
							</div>
							<div className="text-sm font-medium text-gray-700">Avg Resolution</div>
							<div className="text-xs text-gray-500 mt-1">Time trend</div>
						</div>
						<div className="text-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
							<div className="text-2xl font-bold text-red-600 mb-2">
								{summary.resolvedIssues}
							</div>
							<div className="text-sm font-medium text-gray-700">Resolved Issues</div>
							<div className="text-xs text-gray-500 mt-1">Success trend</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};
