import { QuickStats } from "./QuickStats";
import { ActionCards } from "./ActionCards";
import { CommunityMap } from "./CommunityMap";
import { RecentReports } from "./RecentReports";
import { NotificationsDropdown } from "./NotificationsDropdown";
import type { Issue, Notification } from "@/lib/supabase-api";

interface DashboardProps {
	myReports: Issue[];
	allIssues: Issue[];
	statistics: any;
	isLoading: boolean;
	notifications: Notification[];
	notificationsLoading: boolean;
	onReportIssue: () => void;
	onExploreMap: () => void;
	onViewAnalytics: () => void;
	onShowMap: () => void;
	onNotificationClick: (notificationId: string, isRead: boolean) => void;
}

export const Dashboard = ({
	myReports,
	allIssues,
	statistics,
	isLoading,
	notifications,
	notificationsLoading,
	onReportIssue,
	onExploreMap,
	onViewAnalytics,
	onShowMap,
	onNotificationClick,
}: DashboardProps) => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			{/* Enhanced Welcome Section */}
			<div className="mb-6 lg:mb-10 flex items-center justify-between">
				<div>
					<h1 className="text-l sm:text-xl lg:text-xl font-normal text-gray-900 mb-2 lg:mb-2">
						Citizen Dashboard
					</h1>
				</div>
				
				{/* Notifications Dropdown */}
				<NotificationsDropdown
					notifications={notifications}
					isLoading={notificationsLoading}
					onNotificationClick={onNotificationClick}
				/>
			</div>

			{/* Enhanced Quick Stats with Nigerian context */}
			<QuickStats
				myReportsCount={myReports.length}
				resolvedCount={statistics?.resolved_issues || 0}
				inProgressCount={statistics?.in_progress_issues || 0}
				totalIssues={statistics?.total_issues || 0}
			/>

			{/* Enhanced Action Cards */}
			<ActionCards
				onReportIssue={onReportIssue}
				onExploreMap={onExploreMap}
				onViewAnalytics={onViewAnalytics}
			/>

			{/* Interactive Map Section */}
			<CommunityMap
				issues={allIssues}
				isLoading={isLoading}
				onShowMap={onShowMap}
			/>

			{/* Enhanced My Recent Reports */}
			<RecentReports reports={myReports} />
		</div>
	);
};
