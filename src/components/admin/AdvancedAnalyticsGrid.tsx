import { UserSatisfaction } from "./UserSatisfaction";
import { IssueVolumeBySeverity } from "./IssueVolumeBySeverity";
import { PerformanceSummary } from "./PerformanceSummary";

export const AdvancedAnalyticsGrid = () => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<UserSatisfaction />
			<IssueVolumeBySeverity />
			<PerformanceSummary />
		</div>
	);
};
