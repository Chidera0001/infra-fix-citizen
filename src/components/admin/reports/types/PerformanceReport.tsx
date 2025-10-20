import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
	TrendingUp,
	Activity
} from "lucide-react";
import { ReportSummary } from "@/lib/reportGenerator";

interface PerformanceReportProps {
	summary: ReportSummary;
}

export const PerformanceReport = ({ summary }: PerformanceReportProps) => {
	return (
		<>
			{/* Performance Metrics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution Time</p>
							<p className="text-3xl font-bold text-green-700 mb-1">{Math.round(summary.averageResolutionTime)}</p>
							<p className="text-xs text-gray-500">days</p>
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

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Active Issues</p>
							<p className="text-3xl font-bold text-red-600 mb-1">{summary.inProgressIssues}</p>
							<p className="text-xs text-gray-500">In Progress</p>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-600 mb-1">Total Volume</p>
							<p className="text-3xl font-bold text-yellow-600 mb-1">{summary.totalIssues}</p>
							<p className="text-xs text-gray-500">Issues</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Performance Analysis */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Resolution Performance
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-6">
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-medium text-gray-700">Resolution Rate</span>
									<span className="text-lg font-bold text-green-600">{Math.round(summary.resolutionRate)}%</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-2">
									<div 
										className="bg-green-500 h-2 rounded-full transition-all duration-500" 
										style={{ width: `${summary.resolutionRate}%` }}
									></div>
								</div>
							</div>
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-medium text-gray-700">Avg Resolution Time</span>
									<span className="text-lg font-bold text-green-700">{Math.round(summary.averageResolutionTime)} days</span>
								</div>
								<div className="text-xs text-gray-500">
									{summary.resolvedIssues > 0 ? 'Based on resolved issues' : 'No resolved issues to calculate'}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
					<CardHeader className="pb-4 px-6">
						<CardTitle className="text-base font-semibold text-gray-900 flex items-center">
							Workload Distribution
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<div className="space-y-4">
							{Object.entries(summary.statusBreakdown).map(([status, count]) => (
								<div key={status} className="flex items-center justify-between">
									<span className="text-sm font-medium text-gray-700 capitalize">{status.replace('-', ' ')}</span>
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
		</>
	);
};
