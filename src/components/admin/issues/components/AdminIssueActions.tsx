import { Button } from "@/components/ui/button";
import { Download, Share2, Plus } from "lucide-react";

interface AdminIssueActionsProps {
	onExport?: () => void;
	onShare?: () => void;
	onAddIssue?: () => void;
}

export const AdminIssueActions = ({ onExport, onShare, onAddIssue }: AdminIssueActionsProps) => {
	return (
		<div className="flex items-center gap-2">
			<Button 
				variant="outline" 
				size="sm" 
				className="border-gray-300"
				onClick={onExport}
			>
				<Download className="h-4 w-4 mr-2" />
				Export
			</Button>
			<Button 
				variant="outline" 
				size="sm" 
				className="border-gray-300"
				onClick={onShare}
			>
				<Share2 className="h-4 w-4 mr-2" />
				Share
			</Button>
			<Button 
				size="sm" 
				className="bg-green-600 hover:bg-green-700"
				onClick={onAddIssue}
			>
				<Plus className="h-4 w-4 mr-2" />
				Add Issue
			</Button>
		</div>
	);
};
