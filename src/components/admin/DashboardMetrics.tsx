import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useIssueStatistics } from "@/hooks/use-issues";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const DashboardMetrics = () => {
	const { data: statistics } = useIssueStatistics();
	const { data: trendComparison } = useQuery({
		queryKey: ['trend-comparison', 30],
		queryFn: () => adminApi.getTrendComparison(30),
	});

	return (
		<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
			{/* Total Issues */}
			<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						Total Issues
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{(statistics?.total_issues || 0).toLocaleString()}
					</p>
					<div className="flex items-center justify-center text-xs text-green-600 font-medium">
						{((trendComparison?.issuesChange || 0) >= 0) ? (
							<ArrowUpRight className="h-3 w-3 mr-1" />
						) : (
							<ArrowDownRight className="h-3 w-3 mr-1" />
						)}
						<span>{Math.abs(trendComparison?.issuesChange || 0)}% vs last month</span>
					</div>
				</CardContent>
			</Card>

			{/* Open Issues */}
			<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						Pending
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{statistics?.open_issues || 0}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Require attention
					</p>
				</CardContent>
			</Card>

			{/* In Progress */}
			<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						In Progress
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{statistics?.in_progress_issues || 0}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Being resolved
					</p>
				</CardContent>
			</Card>

			{/* Resolved */}
			<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						Resolved
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{statistics?.resolved_issues || 0}
					</p>
					<p className="text-xs text-green-600 font-medium">
						{(statistics?.total_issues || 0) > 0 ? Math.round(((statistics?.resolved_issues || 0) / (statistics?.total_issues || 1)) * 100) : 0}% success rate
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
