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
	Share2
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface AdminIssueCardProps {
	issue: Issue;
	onViewDetails?: (issue: Issue) => void;
	onUpdate?: (issue: Issue) => void;
	onDelete?: (issue: Issue) => void;
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case "open":
			return <AlertCircle className="h-4 w-4 text-red-500" />;
		case "in-progress":
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

export const AdminIssueCard = ({ issue, onViewDetails, onUpdate, onDelete }: AdminIssueCardProps) => {
	return (
		<Card className="border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div className="flex-1 min-w-0">
						{/* Title and Status Row */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
							<h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
								{issue.title}
							</h3>
							<div className="flex items-center gap-2 flex-shrink-0">
								{getStatusIcon(issue.status)}
								<Badge 
									variant="outline" 
									className={`${getSeverityColor(issue.severity)} text-xs font-medium`}
								>
									{issue.severity}
								</Badge>
							</div>
						</div>
						
						{/* Description */}
						<p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
							{issue.description}
						</p>
						
						{/* Details Row - Responsive */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 mb-4">
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span className="truncate">{issue.address}</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span className="whitespace-nowrap">{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
							</div>
							<div className="flex items-center gap-1">
								<User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span className="truncate">ID: {issue.reporter_id?.slice(0, 8)}...</span>
							</div>
							<Badge variant="outline" className="text-xs flex-shrink-0 w-fit">
								{issue.category.replace("_", " ")}
							</Badge>
						</div>

						{/* Admin Action Buttons - Responsive */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onViewDetails?.(issue)}
								className="border-green-300 text-green-700 hover:bg-green-50 flex-1 sm:flex-none"
							>
								<Eye className="h-4 w-4 mr-1" />
								<span className="hidden sm:inline">View Details</span>
								<span className="sm:hidden">View</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onUpdate?.(issue)}
								className="border-red-300 text-red-700 hover:bg-blue-50 flex-1 sm:flex-none"
							>
								<Edit className="h-4 w-4 mr-1" />
								<span className="hidden sm:inline">Update</span>
								<span className="sm:hidden">Edit</span>
							</Button>
						</div>
					</div>
					
					{/* Dropdown Menu - Hidden on mobile, shown on desktop */}
					<div className="hidden sm:block">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
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
								<DropdownMenuItem>
									<Share2 className="h-4 w-4 mr-2" />
									Share Report
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
