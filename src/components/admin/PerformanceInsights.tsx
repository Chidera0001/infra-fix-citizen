import { ResponseTimeAnalysis } from "./ResponseTimeAnalysis";
import { ResolutionRateTrends } from "./ResolutionRateTrends";

export const PerformanceInsights = () => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			<ResponseTimeAnalysis />
			<ResolutionRateTrends />
		</div>
	);
};
