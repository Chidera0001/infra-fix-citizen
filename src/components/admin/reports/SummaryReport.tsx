import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
	BarChart3, 
	AlertTriangle, 
	CheckCircle,
	TrendingUp,
	MapPin
} from "lucide-react";
import { ReportSummary } from "@/lib/reportGenerator";

interface SummaryReportProps {
	summary: ReportSummary;
}

export const SummaryReport = ({ summary }: SummaryReportProps) => {
	return (
		<>
			{/* Key Metrics */}
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
							<p className="text-sm font-medium text-gray-600 mb-1">Open Issues</p>
							<p className="text-3xl font-bold text-red-600 mb-1">{summary.openIssues}</p>
							<p className="text-xs text-gray-500">Pending</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
							<p className="text-3xl font-bold text-green-600 mb-1">{summary.resolvedIssues}</p>
							<p className="text-xs text-gray-500">Completed</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Resolution Rate</p>
							<p className="text-3xl font-bold text-green-700 mb-1">{Math.round(summary.resolutionRate)}%</p>
							<p className="text-xs text-gray-500">Success</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Category Breakdown */}
			<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
				<CardHeader className="pb-4 px-6">
					<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
						<div className="p-2 bg-green-50 rounded-lg mr-3">
							<MapPin className="h-5 w-5 text-green-600" />
						</div>
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
		</>
	);
};
