import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
	FileText,
	BarChart3,
	Activity,
	TrendingUp
} from "lucide-react";
import { ReportData } from "@/lib/reportGenerator";
import { 
	SummaryReport, 
	DetailedReport, 
	PerformanceReport, 
	TrendsReport 
} from "./reports";

interface ReportPreviewProps {
	reportData: ReportData;
	onExport: (format: string) => void;
	isExporting: boolean;
}

export const ReportPreview = ({ reportData, onExport, isExporting }: ReportPreviewProps) => {
	const { summary, metadata } = reportData;
	const reportType = metadata.filters.reportType;

	const getReportIcon = (type: string) => {
		switch (type) {
			case "summary": return <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />;
			case "detailed": return <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />;
			case "performance": return <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />;
			case "trends": return <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />;
			default: return <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />;
		}
	};

	const getReportColor = (type: string) => {
		switch (type) {
			case "summary": return "from-green-50 to-green-100 border-green-200";
			case "detailed": return "from-green-50 to-green-100 border-green-200";
			case "performance": return "from-green-50 to-green-100 border-green-200";
			case "trends": return "from-green-50 to-green-100 border-green-200";
			default: return "from-green-50 to-green-100 border-green-200";
		}
	};

	const renderReportTypeContent = () => {
		switch (reportType) {
			case "summary":
				return <SummaryReport summary={summary} />;
			case "detailed":
				return <DetailedReport summary={summary} />;
			case "performance":
				return <PerformanceReport summary={summary} />;
			case "trends":
				return <TrendsReport summary={summary} />;
			default:
				return <SummaryReport summary={summary} />;
		}
	};



	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Report Header */}
			<Card className={`bg-gradient-to-r ${getReportColor(reportType)}`}>
				<CardHeader className="px-4 sm:px-6">
					<CardTitle className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
						{metadata.filters.reportType.charAt(0).toUpperCase() + metadata.filters.reportType.slice(1)} Report
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm text-gray-600">
						Generated on {new Date(metadata.generatedAt).toLocaleDateString()} • 
						Date Range: {metadata.dateRange}
					</CardDescription>
				</CardHeader>
			</Card>


			{/* Report Type Specific Content */}
			{renderReportTypeContent()}
		</div>
	);
};
