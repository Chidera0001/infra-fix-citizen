import { Button } from "@/components/ui/button";

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
				Export
			</Button>
			<Button 
				variant="outline" 
				size="sm" 
				className="border-gray-300"
				onClick={onShare}
			>
				Share
			</Button>
			<Button 
				size="sm" 
				className="bg-green-600 hover:bg-green-700"
				onClick={onAddIssue}
			>
				Add Issue
			</Button>
		</div>
	);
};
