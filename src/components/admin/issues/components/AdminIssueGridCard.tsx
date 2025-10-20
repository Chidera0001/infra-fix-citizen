import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
	MoreHorizontal, 
	Calendar,
	MapPin,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Eye,
	Edit,
	Trash2,
	User,
	Share2,
	ImageIcon
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface AdminIssueGridCardProps {
	issue: Issue;
	onViewDetails?: (issue: Issue) => void;
	onUpdate?: (issue: Issue) => void;
	onDelete?: (issue: Issue) => void;
	onShare?: (issue: Issue) => void;
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case "open":
			return <AlertCircle className="h-4 w-4 text-red-500" />;
		case "in_progress":
			return <Clock className="h-4 w-4 text-yellow-500" />;
		case "resolved":
			return <CheckCircle className="h-4 w-4 text-green-500" />;
		default:
			return <XCircle className="h-4 w-4 text-gray-500" />;
	}
};

const getSeverityColor = (severity: string) => {
	switch (severity) {
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

export const AdminIssueGridCard = ({ issue, onViewDetails, onUpdate, onDelete, onShare }: AdminIssueGridCardProps) => {
	const hasImages = issue.image_urls && issue.image_urls.length > 0;
	const firstImage = hasImages ? issue.image_urls[0] : null;

	return (
		<Card className="border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 overflow-hidden group">
			{/* Image Section */}
			<div className="relative h-48 bg-gray-100 overflow-hidden">
				{firstImage ? (
					<>
						<img
							src={firstImage}
							alt={issue.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						{issue.image_urls.length > 1 && (
							<div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
								<ImageIcon className="h-3 w-3" />
								{issue.image_urls.length}
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
						<ImageIcon className="h-16 w-16 text-gray-400" />
					</div>
				)}
				
				{/* Status Badge Overlay */}
				<div className="absolute top-2 left-2">
					<Badge 
						variant="outline" 
						className={`${getSeverityColor(issue.severity)} text-xs font-medium backdrop-blur-sm bg-opacity-90`}
					>
						{issue.severity}
					</Badge>
				</div>
			</div>

			<CardContent className="p-4">
				{/* Title and Status */}
				<div className="flex items-start justify-between gap-2 mb-2">
					<h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
						{issue.title}
					</h3>
					{getStatusIcon(issue.status)}
				</div>
				
				{/* Description */}
				<p className="text-sm text-gray-600 mb-3 line-clamp-2">
					{issue.description}
				</p>
				
				{/* Details */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<MapPin className="h-3 w-3 flex-shrink-0" />
						<span className="truncate">{issue.address}</span>
					</div>
					<div className="flex items-center justify-between text-xs text-gray-500">
						<div className="flex items-center gap-1">
							<Calendar className="h-3 w-3 flex-shrink-0" />
							<span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
						</div>
						<Badge variant="outline" className="text-xs">
							{issue.category.replace("_", " ")}
						</Badge>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails?.(issue)}
						className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-xs"
					>
						<Eye className="h-3 w-3 mr-1" />
						View
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onUpdate?.(issue)}
						className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-xs"
					>
						<Edit className="h-3 w-3 mr-1" />
						Update
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="px-2">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onViewDetails?.(issue)}>
								<Eye className="h-4 w-4 mr-2" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onUpdate?.(issue)}>
								<Edit className="h-4 w-4 mr-2" />
								Update Status
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete?.(issue)}>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Issue
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onShare?.(issue)}>
								<Share2 className="h-4 w-4 mr-2" />
								Share Report
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	);
};

