import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";

interface AdminEmptyStateProps {
	hasIssues: boolean;
	onAddIssue?: () => void;
}

export const AdminEmptyState = ({ hasIssues, onAddIssue }: AdminEmptyStateProps) => {
	return (
		<div className="py-12 text-center">
			<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<AlertCircle className="h-8 w-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				{hasIssues ? "No Matching Issues" : "No Issues Yet"}
			</h3>
			<p className="text-gray-500 mb-6">
				{hasIssues 
					? "Try adjusting your search terms or filters to find what you're looking for."
					: "No issues have been reported yet. Issues will appear here as citizens submit reports."
				}
			</p>
			{onAddIssue && (
				<Button 
					onClick={onAddIssue} 
					className="bg-green-600 hover:bg-green-700"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add First Issue
				</Button>
			)}
		</div>
	);
};
