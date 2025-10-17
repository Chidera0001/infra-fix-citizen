import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
	Calendar, 
	MapPin, 
	Clock, 
	CheckCircle, 
	AlertCircle, 
	XCircle,
	Eye,
	Share2,
	Download,
	ExternalLink
} from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import { formatDistanceToNow } from "date-fns";

interface ReportDetailsModalProps {
	report: Issue | null;
	isOpen: boolean;
	onClose: () => void;
	onShare: (report: Issue) => void;
	onDownloadPDF: (report: Issue) => void;
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case "open":
			return <AlertCircle className="h-5 w-5 text-red-500" />;
		case "in_progress":
			return <Clock className="h-5 w-5 text-yellow-500" />;
		case "resolved":
			return <CheckCircle className="h-5 w-5 text-green-500" />;
		default:
			return <XCircle className="h-5 w-5 text-gray-500" />;
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

export const ReportDetailsModal = ({ 
	report, 
	isOpen, 
	onClose, 
	onShare, 
	onDownloadPDF 
}: ReportDetailsModalProps) => {
	if (!report) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const handleShare = () => {
		onShare(report);
		onClose();
	};

	const handleDownloadPDF = () => {
		onDownloadPDF(report);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
						{getStatusIcon(report.status)}
						Report Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Header Info */}
					<Card>
						<CardContent className="p-4">
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{report.title}
									</h3>
									<p className="text-gray-600">
										{report.description}
									</p>
								</div>

								<div className="flex flex-wrap gap-3">
									<Badge className={`${getSeverityColor(report.severity)} text-sm font-medium`}>
										{report.severity.toUpperCase()} SEVERITY
									</Badge>
									<Badge variant="outline" className="text-sm">
										{report.category.replace("_", " ").toUpperCase()}
									</Badge>
									<Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
										{report.status.replace("-", " ").toUpperCase()}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Location and Timeline */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Location Details
								</h4>
								<div className="space-y-2 text-sm">
									<p className="text-gray-600">
										<strong>Address:</strong> {report.address}
									</p>
									{report.latitude && report.longitude && (
										<p className="text-gray-600">
											<strong>Coordinates:</strong> {report.latitude}, {report.longitude}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Timeline
								</h4>
								<div className="space-y-2 text-sm">
									<p className="text-gray-600">
										<strong>Reported:</strong> {formatDate(report.created_at)}
									</p>
									<p className="text-gray-600">
										<strong>Time ago:</strong> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
									</p>
									{report.updated_at && report.updated_at !== report.created_at && (
										<p className="text-gray-600">
											<strong>Last updated:</strong> {formatDate(report.updated_at)}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Images if available */}
					{report.image_urls && report.image_urls.length > 0 && (
						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Attached Images</h4>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{report.image_urls.map((image, index) => (
										<div key={index} className="relative group">
											<img
												src={image}
												alt={`Report image ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-green-400 transition-colors cursor-pointer"
												onClick={() => window.open(image, '_blank')}
											/>
											<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
												<ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
											</div>
										</div>
									))}
								</div>
								<p className="text-xs text-gray-500 mt-2">
									Click on images to view them in full size
								</p>
							</CardContent>
						</Card>
					)}

					{/* Admin Notes if available */}
					{report.notes && (
						<Card>
							<CardContent className="p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Admin Notes</h4>
								<p className="text-gray-600 text-sm">
									{report.notes}
								</p>
							</CardContent>
						</Card>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<Button
							onClick={handleShare}
							variant="outline"
							className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
						>
							<Share2 className="h-4 w-4 mr-2" />
							Share Report
						</Button>
						<Button
							onClick={handleDownloadPDF}
							variant="outline"
							className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
						>
							<Download className="h-4 w-4 mr-2" />
							Download PDF
						</Button>
						<Button
							onClick={onClose}
							variant="default"
							className="flex-1 bg-green-600 hover:bg-green-700"
						>
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
