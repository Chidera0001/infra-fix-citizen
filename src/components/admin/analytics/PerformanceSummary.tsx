import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const PerformanceSummary = () => {
	const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
		queryKey: ['performance-metrics'],
		queryFn: () => adminApi.getPerformanceMetrics(),
	});

	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">Performance Summary</CardTitle>
				<CardDescription>Key performance indicators</CardDescription>
			</CardHeader>
			<CardContent>
				{metricsLoading ? (
					<div className="h-[200px] flex items-center justify-center">
						<LoadingSpinner text="Loading performance data..." />
					</div>
				) : !performanceMetrics ? (
					<div className="h-[200px] flex items-center justify-center">
						<p className="text-gray-500">No performance data available</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Avg Resolution Time</span>
							<span className="text-lg font-normal text-green-600">{performanceMetrics.avgResponseTime} hrs</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Resolution Rate</span>
							<span className="text-lg font-normal text-green-600">{performanceMetrics.resolutionRate}%</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Completion Rate</span>
							<span className="text-lg font-normal text-green-600">{performanceMetrics.completionRate}%</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">User Satisfaction</span>
							<span className="text-lg font-normal text-green-600">{performanceMetrics.userSatisfaction}%</span>
						</div>
						<div className="pt-4 border-t border-gray-200">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-black">Overall Score</span>
								<span className="text-xl font-normal text-green-600">
									{performanceMetrics.completionRate >= 90 ? 'A+' : 
									 performanceMetrics.completionRate >= 80 ? 'A' :
									 performanceMetrics.completionRate >= 70 ? 'B+' :
									 performanceMetrics.completionRate >= 60 ? 'B' : 'C'}
								</span>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
