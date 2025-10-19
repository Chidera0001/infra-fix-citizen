import { ReportBuilder } from "./ReportBuilder";
import { PerformanceInsights } from "./PerformanceInsights";
import { AdvancedAnalyticsGrid } from "./AdvancedAnalyticsGrid";

export const Analytics = () => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			<div className="mb-3 lg:mb-5 pb-2">
				<h1 className="text-xl sm:text-xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
					Advanced Analytics
				</h1>
			</div>

			<ReportBuilder />
			<PerformanceInsights />
			<AdvancedAnalyticsGrid />
		</div>
	);
};
