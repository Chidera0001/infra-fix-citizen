import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	MapPin,
	Clock,
	MessageSquare,
	ThumbsUp,
	Eye,
	Edit,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Camera,
	User,
	Calendar,
} from "lucide-react";

interface Issue {
	id: string;
	title: string;
	description: string;
	category: string;
	status: "open" | "in-progress" | "resolved";
	urgency: "low" | "medium" | "high";
	location: string;
	date: string;
	upvotes: number;
	comments: number;
	reporter?: string;
}

interface IssueCardProps {
	issue: Issue;
	showActions?: boolean;
}

const IssueCard = ({ issue, showActions = true }: IssueCardProps) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "open":
				return "bg-red-100 text-red-700 border-red-200";
			case "in-progress":
				return "bg-orange-100 text-orange-700 border-orange-200";
			case "resolved":
				return "bg-green-100 text-green-700 border-green-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getUrgencyColor = (urgency: string) => {
		switch (urgency) {
			case "high":
				return "bg-red-100 text-red-700 border-red-200";
			case "medium":
				return "bg-orange-100 text-orange-700 border-orange-200";
			case "low":
				return "bg-green-100 text-green-700 border-green-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "open":
				return <AlertTriangle className="h-4 w-4" />;
			case "in-progress":
				return <Clock className="h-4 w-4" />;
			case "resolved":
				return <CheckCircle className="h-4 w-4" />;
			default:
				return <XCircle className="h-4 w-4" />;
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category.toLowerCase()) {
			case "pothole":
				return <MapPin className="h-4 w-4" />;
			case "streetlight":
				return <Eye className="h-4 w-4" />;
			case "drainage":
				return <MapPin className="h-4 w-4" />;
			case "water":
				return <MapPin className="h-4 w-4" />;
			case "road":
				return <MapPin className="h-4 w-4" />;
			default:
				return <MapPin className="h-4 w-4" />;
		}
	};

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center space-x-3 mb-3">
							<h3 className="text-lg font-bold text-gray-900">
								{issue.title}
							</h3>
							<div className="flex items-center space-x-2">
								<Badge
									variant="secondary"
									className={getStatusColor(issue.status)}
								>
									{getStatusIcon(issue.status)}
									<span className="ml-1">{issue.status}</span>
								</Badge>
								<Badge
									variant="secondary"
									className={getUrgencyColor(issue.urgency)}
								>
									{issue.urgency}
								</Badge>
							</div>
						</div>

						<p className="text-gray-700 mb-4 leading-relaxed">
							{issue.description}
						</p>

						<div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
							<div className="flex items-center space-x-2">
								<MapPin className="h-4 w-4 text-green-600" />
								<span className="font-medium">
									{issue.location}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<Calendar className="h-4 w-4 text-blue-600" />
								<span>{issue.date}</span>
							</div>
							{issue.reporter && (
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-purple-600" />
									<span>Reported by {issue.reporter}</span>
								</div>
							)}
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<div className="bg-green-100 p-2 rounded-lg">
									{getCategoryIcon(issue.category)}
								</div>
								<span className="text-sm font-medium text-gray-700 capitalize">
									{issue.category}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced Action Section */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<div className="flex items-center space-x-6">
						<button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
							<ThumbsUp className="h-5 w-5" />
							<span className="text-sm font-medium">
								{issue.upvotes}
							</span>
						</button>
						<button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
							<MessageSquare className="h-5 w-5" />
							<span className="text-sm font-medium">
								{issue.comments} comments
							</span>
						</button>
						<button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
							<Camera className="h-5 w-5" />
							<span className="text-sm font-medium">
								View Photos
							</span>
						</button>
					</div>

					{showActions && (
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								className="border-green-300 text-green-700 hover:bg-green-50"
							>
								<Eye className="h-4 w-4 mr-2" />
								View Details
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="border-blue-300 text-blue-700 hover:bg-blue-50"
							>
								<Edit className="h-4 w-4 mr-2" />
								Update
							</Button>
						</div>
					)}
				</div>

				{/* Progress Indicator for In-Progress Issues */}
				{issue.status === "in-progress" && (
					<div className="mt-4 pt-4 border-t border-gray-100">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-gray-700">
								Resolution Progress
							</span>
							<span className="text-sm text-orange-600 font-medium">
								75%
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-orange-500 h-2 rounded-full"
								style={{ width: "75%" }}
							></div>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Estimated completion: 2 days
						</p>
					</div>
				)}

				{/* Resolution Notice for Resolved Issues */}
				{issue.status === "resolved" && (
					<div className="mt-4 pt-4 border-t border-gray-100">
						<div className="flex items-center space-x-2 text-green-600">
							<CheckCircle className="h-4 w-4" />
							<span className="text-sm font-medium">
								Issue Resolved
							</span>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Resolved on {issue.date}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default IssueCard;
