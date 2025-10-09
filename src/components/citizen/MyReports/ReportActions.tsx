import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface ReportActionsProps {
	onExport?: () => void;
	onShare?: () => void;
}

export const ReportActions = ({ onExport, onShare }: ReportActionsProps) => {
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
		</div>
	);
};
