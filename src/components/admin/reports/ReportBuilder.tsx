import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BarChart3, Download, Settings, Loader2, CheckCircle } from "lucide-react";
import { ReportTypes } from "./ReportTypes";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { ExportFormatSelector } from "./filters/ExportFormatSelector";
import { AdvancedFiltersModal } from "./filters/AdvancedFiltersModal";
import { ReportPreview } from "./ReportPreview";
import { ReportFilters } from "@/lib/reportGenerator";
import { useReportGeneration } from "@/hooks/use-report-generation";

export const ReportBuilder = () => {
	const { 
		isGenerating, 
		isExporting, 
		reportData, 
		generateReport, 
		exportReport 
	} = useReportGeneration();
	
	// Report configuration state
	const [reportType, setReportType] = useState("summary");
	const [dateRange, setDateRange] = useState("30d");
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");
	const [category, setCategory] = useState("all");
	const [exportFormat, setExportFormat] = useState("pdf");
	const [advancedFilters, setAdvancedFilters] = useState<any>({});

	const handleGenerateReport = async () => {
		const filters: ReportFilters = {
			reportType,
			dateRange,
			customStartDate: dateRange === "custom" ? customStartDate : undefined,
			customEndDate: dateRange === "custom" ? customEndDate : undefined,
			category,
			exportFormat,
			advancedFilters
		};

		await generateReport(filters);
	};

	const handleExportReport = async () => {
		await exportReport(exportFormat);
	};

	const handleCustomDateChange = (startDate: string, endDate: string) => {
		setCustomStartDate(startDate);
		setCustomEndDate(endDate);
	};

	const handleAdvancedFiltersChange = (filters: any) => {
		setAdvancedFilters(filters);
	};

	return (
		<Card className="bg-white border-0 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-shadow duration-200">
			<CardHeader className="px-6 py-5">
				<CardTitle className="text-xl font-semibold text-gray-900">Report Builder</CardTitle>
				<CardDescription className="text-sm text-gray-600 mt-1">Generate comprehensive reports with custom filters</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 px-6 pb-6">
				{/* Report Type Selection */}
				<div>
					<h3 className="text-sm font-medium text-gray-900 mb-3">Select Report Type</h3>
					<ReportTypes selectedType={reportType} onTypeChange={setReportType} />
				</div>

				{/* Filters Grid - Mobile First */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
					<DateRangeFilter
						selectedRange={dateRange}
						onRangeChange={setDateRange}
						customStartDate={customStartDate}
						customEndDate={customEndDate}
						onCustomDateChange={handleCustomDateChange}
					/>
					<CategoryFilter
						selectedCategory={category}
						onCategoryChange={setCategory}
					/>
					<ExportFormatSelector
						selectedFormat={exportFormat}
						onFormatChange={setExportFormat}
					/>
				</div>

				{/* Report Summary */}
				{reportData && (
					<ReportPreview 
						reportData={reportData}
						onExport={handleExportReport}
						isExporting={isExporting}
					/>
				)}

				{/* Action Buttons - Mobile Responsive */}
				<div className="flex flex-col sm:flex-row gap-3 pt-2">
					<Button 
						onClick={handleGenerateReport}
						disabled={isGenerating}
						className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 w-full sm:w-auto transition-all duration-200 hover:shadow-md"
					>
						{isGenerating ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<BarChart3 className="h-4 w-4 mr-2" />
						)}
						{isGenerating ? "Generating..." : "Generate Report"}
					</Button>
					
					<Button 
						variant="outline" 
						className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 font-medium px-6 py-2.5 w-full sm:w-auto transition-all duration-200"
						onClick={handleExportReport}
						disabled={isExporting || !reportData}
					>
						{isExporting ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Download className="h-4 w-4 mr-2" />
						)}
						{isExporting ? "Exporting..." : "Export Data"}
					</Button>
					
					<div className="w-full sm:w-auto">
						<AdvancedFiltersModal
							onFiltersChange={handleAdvancedFiltersChange}
							currentFilters={advancedFilters}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
