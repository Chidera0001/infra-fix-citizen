import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import type { Issue } from "@/lib/supabase-api";

interface StatsCardsProps {
	reports: Issue[];
}

export const StatsCards = ({ reports }: StatsCardsProps) => {
	const stats = {
		total: reports.length,
		open: reports.filter(r => r.status === "open").length,
		inProgress: reports.filter(r => r.status === "in-progress").length,
		resolved: reports.filter(r => r.status === "resolved").length,
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-green-600">Total Reports</p>
							<p className="text-2xl font-bold text-green-900">{stats.total}</p>
						</div>
						<AlertCircle className="h-8 w-8 text-green-500" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-green-600">Open Issues</p>
							<p className="text-2xl font-bold text-green-900">{stats.open}</p>
						</div>
						<AlertCircle className="h-8 w-8 text-green-500" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-green-600">In Progress</p>
							<p className="text-2xl font-bold text-green-900">{stats.inProgress}</p>
						</div>
						<Clock className="h-8 w-8 text-green-500" />
					</div>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-green-600">Resolved</p>
							<p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
						</div>
						<CheckCircle className="h-8 w-8 text-green-500" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
