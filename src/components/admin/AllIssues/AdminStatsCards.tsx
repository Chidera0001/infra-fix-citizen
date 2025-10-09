import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, Users } from "lucide-react";
import type { Issue } from "@/lib/supabase-api";

interface AdminStatsCardsProps {
	issues: Issue[];
}

export const AdminStatsCards = ({ issues }: AdminStatsCardsProps) => {
	const stats = {
		total: issues.length,
		open: issues.filter(i => i.status === "open").length,
		inProgress: issues.filter(i => i.status === "in_progress").length,
		resolved: issues.filter(i => i.status === "resolved").length,
	};

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-3 sm:p-4">
					<div className="flex items-center justify-between">
						<div className="min-w-0">
							<p className="text-xs sm:text-sm font-medium text-green-600 truncate">Total Issues</p>
							<p className="text-lg sm:text-2xl font-bold text-green-900">{stats.total}</p>
						</div>
						<AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-3 sm:p-4">
					<div className="flex items-center justify-between">
						<div className="min-w-0">
							<p className="text-xs sm:text-sm font-medium text-green-600 truncate">Open Issues</p>
							<p className="text-lg sm:text-2xl font-bold text-green-900">{stats.open}</p>
						</div>
						<AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-3 sm:p-4">
					<div className="flex items-center justify-between">
						<div className="min-w-0">
							<p className="text-xs sm:text-sm font-medium text-green-600 truncate">In Progress</p>
							<p className="text-lg sm:text-2xl font-bold text-green-900">{stats.inProgress}</p>
						</div>
						<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
				<CardContent className="p-3 sm:p-4">
					<div className="flex items-center justify-between">
						<div className="min-w-0">
							<p className="text-xs sm:text-sm font-medium text-green-600 truncate">Resolved</p>
							<p className="text-lg sm:text-2xl font-bold text-green-900">{stats.resolved}</p>
						</div>
						<CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
