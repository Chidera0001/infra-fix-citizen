import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
	MapPin, 
	Calendar, 
	Clock, 
	User, 
	AlertCircle, 
	CheckCircle, 
	XCircle,
	Eye,
	Edit,
	Trash2,
	Share2,
	X
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface IssueDetailsModalProps {
	issue: Issue | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate?: (issue: Issue) => void;
	onDelete?: (issue: Issue) => void;
	onShare?: (issue: Issue) => void;
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case "open":
			return <AlertCircle className="h-4 w-4 text-orange-500" />;
		case "in_progress":
			return <Clock className="h-4 w-4 text-blue-500" />;
		case "resolved":
			return <CheckCircle className="h-4 w-4 text-green-500" />;
		case "closed":
			return <XCircle className="h-4 w-4 text-gray-500" />;
		default:
			return <AlertCircle className="h-4 w-4 text-gray-500" />;
	}
};

const getSeverityColor = (severity: string) => {
	switch (severity.toLowerCase()) {
		case "critical":
			return "bg-red-100 text-red-800 border-red-200";
		case "high":
			return "bg-orange-100 text-orange-800 border-orange-200";
		case "medium":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "low":
			return "bg-green-100 text-green-800 border-green-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

export const IssueDetailsModal = ({ 
	issue, 
	isOpen, 
	onClose, 
	onUpdate, 
	onDelete, 
	onShare 
}: IssueDetailsModalProps) => {
	if (!issue) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl [&>button]:hidden">
				<DialogHeader className="pb-6 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
							<div className="p-2 bg-red-100 rounded-lg">
								{getStatusIcon(issue.status)}
							</div>
							<span className="truncate">{issue.title}</span>
						</DialogTitle>
						<div className="flex items-center gap-2">
							{onUpdate && (
								<Button variant="outline" size="sm" onClick={() => onUpdate(issue)} className="rounded-lg">
									<Edit className="h-4 w-4 mr-1" />
									Edit
								</Button>
							)}
							<Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-6">
					{/* Status and Severity */}
					<div className="flex items-center gap-4">
						<Badge 
							variant="outline" 
							className={`${getSeverityColor(issue.severity)} font-medium`}
						>
							{issue.severity}
						</Badge>
						<Badge variant="outline" className="capitalize">
							{issue.status.replace('-', ' ')}
						</Badge>
					</div>

					{/* Description */}
					<Card>
						<CardContent className="p-4">
							<h4 className="font-semibold text-gray-900 mb-2">Description</h4>
							<p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
						</CardContent>
					</Card>

					{/* Issue Details */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Issue Information</h4>
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm">
										<MapPin className="h-4 w-4 text-gray-500" />
										<span className="text-gray-600">Location:</span>
										<span className="font-medium">{issue.location || 'Not specified'}</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<Calendar className="h-4 w-4 text-gray-500" />
										<span className="text-gray-600">Reported:</span>
										<span className="font-medium">
											{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<User className="h-4 w-4 text-gray-500" />
										<span className="text-gray-600">Reporter ID:</span>
										<span className="font-medium font-mono text-xs">
											{issue.reporter_id?.slice(0, 8)}...
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Issue ID & Tags</h4>
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm">
										<span className="text-gray-600">Issue ID:</span>
										<span className="font-medium font-mono text-xs">{issue.id}</span>
									</div>
									{issue.tags && issue.tags.length > 0 && (
										<div className="space-y-2">
											<span className="text-gray-600 text-sm">Tags:</span>
											<div className="flex flex-wrap gap-1">
												{issue.tags.map((tag, index) => (
													<Badge key={index} variant="secondary" className="text-xs">
														{tag}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Images if available */}
					{issue.image_urls && issue.image_urls.length > 0 && (
						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Attached Images</h4>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{issue.image_urls.map((image, index) => (
										<div key={index} className="relative group">
											<img
												src={image}
												alt={`Issue image ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-green-400 transition-colors cursor-pointer"
												onClick={() => window.open(image, '_blank')}
											/>
											<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
												<Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
					{onShare && (
						<Button variant="outline" onClick={() => onShare(issue)}>
							<Share2 className="h-4 w-4 mr-2" />
							Share Report
						</Button>
					)}
					{onUpdate && (
						<Button variant="outline" onClick={() => onUpdate(issue)}>
							<Edit className="h-4 w-4 mr-2" />
							Update Status
						</Button>
					)}
					{onDelete && (
						<Button variant="destructive" onClick={() => onDelete(issue)}>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete Issue
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
