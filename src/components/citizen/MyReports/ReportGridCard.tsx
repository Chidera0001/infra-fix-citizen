import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	MoreHorizontal,
	Calendar,
	MapPin,
	CheckCircle,
	AlertCircle,
	XCircle,
	Eye,
	Image,
	Clock,
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface ReportGridCardProps {
	report: Issue;
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

export const ReportGridCard = ({ report }: ReportGridCardProps) => {
	const imageUrl = report.image_urls?.[0];
	const hasImages = report.image_urls && report.image_urls.length > 0;

	return (
		<Card className="border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
			<div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
				{hasImages ? (
					<img
						src={imageUrl}
						alt={report.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400">
						<Image className="h-16 w-16" />
					</div>
				)}
				<div className="absolute top-2 left-2 flex items-center gap-2">
					{getStatusIcon(report.status)}
					<Badge
						variant="outline"
						className={`${getSeverityColor(report.severity)} text-xs font-medium`}
					>
						{report.severity}
					</Badge>
				</div>
				{report.image_urls && report.image_urls.length > 1 && (
					<Badge className="absolute bottom-2 right-2 bg-black/50 text-white text-xs">
						+{report.image_urls.length - 1} more
					</Badge>
				)}
			</div>
			<CardContent className="p-4 flex-1 flex flex-col">
				<h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
					{report.title}
				</h3>
				<p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
					{report.description}
				</p>

				<div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
					<MapPin className="h-3 w-3 flex-shrink-0" />
					<span className="truncate">{report.address}</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
					<Calendar className="h-3 w-3 flex-shrink-0" />
					<span className="whitespace-nowrap">{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
					<Badge variant="outline" className="text-xs flex-shrink-0 w-fit ml-auto">
						{report.category.replace("_", " ")}
					</Badge>
				</div>

				<div className="flex items-center gap-2 mt-auto">
					<Badge
						variant="outline"
						className={`flex-1 justify-center border-green-300 text-green-700 ${getSeverityColor(report.status)}`}
					>
						{report.status.replace("-", " ")}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
};
