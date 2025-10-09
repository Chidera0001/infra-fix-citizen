import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";

interface EmptyStateProps {
	hasReports: boolean;
	onReportIssue: () => void;
}

export const EmptyState = ({ hasReports, onReportIssue }: EmptyStateProps) => {
	return (
		<div className="py-12 text-center">
			<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<AlertCircle className="h-8 w-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				{hasReports ? "No Matching Reports" : "No Reports Yet"}
			</h3>
			<p className="text-gray-500 mb-6">
				{hasReports 
					? "Try adjusting your search terms or filters to find what you're looking for."
					: "You haven't submitted any reports yet. Start by reporting an infrastructure issue."
				}
			</p>
			{!hasReports && (
				<Button 
					onClick={onReportIssue} 
					className="bg-green-600 hover:bg-green-700"
				>
					<Plus className="h-4 w-4 mr-2" />
					Report Your First Issue
				</Button>
			)}
		</div>
	);
};
