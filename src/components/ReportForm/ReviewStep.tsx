import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MapPin, Calendar, AlertTriangle, Tag, FileText } from "lucide-react";

interface ReviewStepProps {
	formData: {
		title: string;
		description: string;
		category: string;
		severity: string;
		address: string;
		photos: File[];
	};
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
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

	const getSeverityIcon = (severity: string) => {
		switch (severity) {
			case "critical":
				return "🔴";
			case "high":
				return "🟠";
			case "medium":
				return "🟡";
			case "low":
				return "🟢";
			default:
				return "⚪";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "pothole":
				return "🕳️";
			case "street_lighting":
				return "💡";
			case "drainage":
				return "🌊";
			case "water_supply":
				return "💧";
			case "traffic_signal":
				return "🚦";
			case "sidewalk":
				return "🚶";
			default:
				return "📋";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<div className="flex items-center justify-center space-x-2">
					<CheckCircle className="h-6 w-6 text-green-600" />
					<h3 className="text-xl font-semibold text-gray-900">
						Review Your Report
					</h3>
				</div>
				<p className="text-gray-600 text-sm">
					Please review all details before submitting
				</p>
			</div>

			{/* Main Review Card */}
			<Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg">
				<CardContent className="p-6 space-y-6">
					{/* Issue Title */}
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<FileText className="h-4 w-4 text-gray-600" />
							<Label className="text-sm font-medium text-gray-600">
								Issue Title
							</Label>
						</div>
						<p className="text-lg font-semibold text-gray-900 bg-white/60 p-3 rounded-lg border">
							{formData.title}
						</p>
					</div>

					{/* Category and Severity Row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Tag className="h-4 w-4 text-gray-600" />
								<Label className="text-sm font-medium text-gray-600">
									Category
								</Label>
							</div>
							<div className="flex items-center space-x-2 bg-white/60 p-3 rounded-lg border">
								<span className="text-lg">{getCategoryIcon(formData.category)}</span>
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-800 border-green-200 font-medium"
								>
									{formData.category.replace('_', ' ').toUpperCase()}
								</Badge>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<AlertTriangle className="h-4 w-4 text-gray-600" />
								<Label className="text-sm font-medium text-gray-600">
									Severity
								</Label>
							</div>
							<div className="flex items-center space-x-2 bg-white/60 p-3 rounded-lg border">
								<span className="text-lg">{getSeverityIcon(formData.severity)}</span>
								<Badge
									variant="secondary"
									className={`${getSeverityColor(formData.severity)} font-medium`}
								>
									{formData.severity.toUpperCase()}
								</Badge>
							</div>
						</div>
					</div>

					{/* Address */}
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<MapPin className="h-4 w-4 text-gray-600" />
							<Label className="text-sm font-medium text-gray-600">
								Location Address
							</Label>
						</div>
						<div className="bg-white/60 p-3 rounded-lg border">
							<p className="text-gray-900 font-medium">
								{formData.address}
							</p>
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<FileText className="h-4 w-4 text-gray-600" />
							<Label className="text-sm font-medium text-gray-600">
								Description
							</Label>
						</div>
						<div className="bg-white/60 p-4 rounded-lg border">
							<p className="text-gray-900 break-words whitespace-pre-wrap leading-relaxed">
								{formData.description}
							</p>
						</div>
					</div>

					{/* Photos */}
					{formData.photos.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Calendar className="h-4 w-4 text-gray-600" />
								<Label className="text-sm font-medium text-gray-600">
									Attached Photos
								</Label>
							</div>
							<div className="bg-white/60 p-3 rounded-lg border">
								<div className="flex items-center space-x-2">
									<span className="text-2xl">📷</span>
									<p className="text-gray-900 font-medium">
										{formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''} attached
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Summary Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div className="bg-white/80 p-3 rounded-lg border text-center">
					<div className="text-lg font-semibold text-gray-900">
						{formData.title.length}
					</div>
					<div className="text-xs text-gray-600">Title Length</div>
				</div>
				<div className="bg-white/80 p-3 rounded-lg border text-center">
					<div className="text-lg font-semibold text-gray-900">
						{formData.description.length}
					</div>
					<div className="text-xs text-gray-600">Description Length</div>
				</div>
				<div className="bg-white/80 p-3 rounded-lg border text-center">
					<div className="text-lg font-semibold text-gray-900">
						{formData.photos.length}
					</div>
					<div className="text-xs text-gray-600">Photos</div>
				</div>
				<div className="bg-white/80 p-3 rounded-lg border text-center">
					<div className="text-lg font-semibold text-gray-900">
						{formData.address.split(',').length}
					</div>
					<div className="text-xs text-gray-600">Address Parts</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewStep;
