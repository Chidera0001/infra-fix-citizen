import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const PerformanceMetrics = () => {
	const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
		queryKey: ['performance-metrics'],
		queryFn: () => adminApi.getPerformanceMetrics(),
	});

	if (metricsLoading) {
		return (
			<div className="h-[300px] flex items-center justify-center">
				<p className="text-gray-500">Loading metrics...</p>
			</div>
		);
	}

	if (!performanceMetrics) {
		return (
			<div className="h-[300px] flex items-center justify-center">
				<p className="text-gray-500">No performance data available</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Resolution Rate */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">Resolution Rate</span>
					<span className="text-sm font-normal text-green-600">
						{performanceMetrics.resolutionRate || 0}%
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div
						className="bg-green-500 h-3 rounded-full transition-all duration-500"
						style={{ width: `${performanceMetrics.resolutionRate || 0}%` }}
					></div>
				</div>
			</div>

			{/* Avg Response Time */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">Avg Response Time</span>
					<span className="text-sm font-normal text-green-600">
						{performanceMetrics.avgResponseTime || 0} hrs
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div 
						className="bg-red-500 h-3 rounded-full transition-all duration-500"
						style={{
							width: `${Math.min(100, Math.max(0, 100 - (performanceMetrics.avgResponseTime || 0) * 10))}%` 
						}}
					></div>
				</div>
			</div>

			{/* User Satisfaction */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">User Satisfaction</span>
					<span className="text-sm font-normal text-green-600">
						{performanceMetrics.userSatisfaction || 0}%
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div 
						className="bg-green-400 h-3 rounded-full transition-all duration-500"
						style={{ width: `${performanceMetrics.userSatisfaction || 0}%` }}
					></div>
				</div>
			</div>

			{/* Completion Rate */}
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">Issue Completion</span>
					<span className="text-sm font-normal text-green-600">
						{performanceMetrics.totalCompleted || 0} / {performanceMetrics.totalIssues || 0}
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div 
						className="bg-red-400 h-3 rounded-full transition-all duration-500"
						style={{ width: `${performanceMetrics.completionRate || 0}%` }}
					></div>
				</div>
			</div>
		</div>
	);
};
