import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BarChart3, Download, Settings } from "lucide-react";

export const ReportBuilder = () => {
	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl mb-6">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">Report Builder</CardTitle>
				<CardDescription>Generate comprehensive reports with custom filters</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div>
						<label className="block text-sm font-medium text-black mb-2">Report Type</label>
						<select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
							<option value="summary">Summary Report</option>
							<option value="detailed">Detailed Report</option>
							<option value="performance">Performance Report</option>
							<option value="trends">Trends Analysis</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-2">Date Range</label>
						<select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
							<option value="7d">Last 7 days</option>
							<option value="30d">Last 30 days</option>
							<option value="90d">Last 90 days</option>
							<option value="custom">Custom range</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-2">Category</label>
						<select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
							<option value="all">All Categories</option>
							<option value="infrastructure">Infrastructure</option>
							<option value="utilities">Utilities</option>
							<option value="transportation">Transportation</option>
							<option value="environment">Environment</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-black mb-2">Export Format</label>
						<select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
							<option value="pdf">PDF</option>
							<option value="csv">CSV</option>
							<option value="excel">Excel</option>
							<option value="json">JSON</option>
						</select>
					</div>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button className="bg-green-600 hover:bg-green-700">
						<BarChart3 className="h-4 w-4 mr-2" />
						Generate Report
					</Button>
					<Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
						<Download className="h-4 w-4 mr-2" />
						Export Data
					</Button>
					<Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
						<Settings className="h-4 w-4 mr-2" />
						Advanced Filters
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
