import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
	MoreHorizontal, 
	Calendar,
	MapPin,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Eye,
	Download,
	Share2
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
	report: Issue;
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

export const ReportCard = ({ report }: ReportCardProps) => {
	return (
		<Card className="border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div className="flex-1 min-w-0">
						{/* Title and Status Row */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
							<h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
								{report.title}
							</h3>
							<div className="flex items-center gap-2 flex-shrink-0">
								{getStatusIcon(report.status)}
								<Badge 
									variant="outline" 
									className={`${getSeverityColor(report.severity)} text-xs font-medium`}
								>
									{report.severity}
								</Badge>
							</div>
						</div>
						
						{/* Description */}
						<p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
							{report.description}
						</p>
						
						{/* Improved Details Section */}
						<div className="space-y-3">
							{/* Location and Date Row */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
								<div className="flex items-center gap-2">
									<MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">{report.address}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
									<span className="whitespace-nowrap">{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
								</div>
							</div>
							
							{/* Category Badge */}
							<div className="flex justify-start">
								<Badge variant="outline" className="text-xs bg-gray-50 text-black border-gray-200 w-fit">
									{report.category.replace("_", " ")}
								</Badge>
							</div>
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
								<DropdownMenuItem>
									<Eye className="h-4 w-4 mr-2" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Share2 className="h-4 w-4 mr-2" />
									Share Report
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Download className="h-4 w-4 mr-2" />
									Download PDF
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
