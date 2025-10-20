import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCharts } from "./DashboardCharts";
import { RecentIssues } from "../issues/RecentIssues";

interface DashboardProps {
	onShowMap: () => void;
}

export const Dashboard = ({ onShowMap }: DashboardProps) => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			{/* Dashboard Header */}
			<div className="mb-6 lg:mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-xl sm:text-xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
							Analytics Dashboard
						</h1>
					</div>
					<Button
						onClick={onShowMap}
						className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-500"
					>
						<MapPin className="h-4 w-4 mr-2" />
						View Map
					</Button>
				</div>
			</div>

			<DashboardMetrics />
			<DashboardCharts />
			<RecentIssues />
		</div>
	);
};
