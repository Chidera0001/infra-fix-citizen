import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { reportGenerator, ReportFilters, ReportData } from "@/lib/reportGenerator";

export const useReportGeneration = () => {
	const { toast } = useToast();
	const [isGenerating, setIsGenerating] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [reportData, setReportData] = useState<ReportData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generateReport = useCallback(async (filters: ReportFilters) => {
		setIsGenerating(true);
		setError(null);
		
		try {
			const data = await reportGenerator.generateReport(filters);
			setReportData(data);
			
			toast({
				title: "Report Generated Successfully",
				description: `Found ${data.summary.totalIssues} issues matching your criteria`,
			});
			
			return data;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			
			toast({
				title: "Error Generating Report",
				description: errorMessage,
				variant: "destructive",
			});
			
			throw err;
		} finally {
			setIsGenerating(false);
		}
	}, [toast]);

	const exportReport = useCallback(async (format: string) => {
		if (!reportData) {
			toast({
				title: "No Report Data",
				description: "Please generate a report first before exporting",
				variant: "destructive",
			});
			return;
		}

		setIsExporting(true);
		setError(null);
		
		try {
			await reportGenerator.exportReport(reportData, format);
			toast({
				title: "Export Successful",
				description: `Report exported as ${format.toUpperCase()}`,
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			
			toast({
				title: "Export Failed",
				description: errorMessage,
				variant: "destructive",
			});
			
			throw err;
		} finally {
			setIsExporting(false);
		}
	}, [reportData, toast]);

	const clearReport = useCallback(() => {
		setReportData(null);
		setError(null);
	}, []);

	return {
		isGenerating,
		isExporting,
		reportData,
		error,
		generateReport,
		exportReport,
		clearReport
	};
};
