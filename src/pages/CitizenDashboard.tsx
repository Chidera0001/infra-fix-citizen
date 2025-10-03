import { useState, useEffect } from "react";
import ReportForm from "@/components/ReportForm";
import IssueMap from "@/components/IssueMap";
import { useIssues, useIssueStatistics } from "@/hooks/use-issues";
import { useNotifications, useMarkAsRead } from "@/hooks/use-notifications";
import { CitizenSidebar } from "@/components/layout/CitizenSidebar";
import { Dashboard, MyReports } from "@/components/citizen";

const CitizenDashboard = () => {
	const [activeTab, setActiveTab] = useState<"dashboard" | "reports" | "map">(
		"dashboard"
	);
	const [showReportForm, setShowReportForm] = useState(false);
	const [showMap, setShowMap] = useState(false);
	
	// Fetch real data from Supabase
	const { data: allIssues = [], isLoading } = useIssues({ limit: 50 });
	const { data: statistics } = useIssueStatistics();
	const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
	const markAsReadMutation = useMarkAsRead();
	
	// Filter user's own reports (when we have user profile integration)
	const myReports = allIssues.slice(0, 3);

	useEffect(() => {
		document.title = "Citizn";
	}, []);

	const handleBackToDashboard = () => {
		setShowReportForm(false);
		setShowMap(false);
		setActiveTab("dashboard");
	};

	// Handle tab changes
	const handleTabChange = (tab: "dashboard" | "reports" | "map") => {
		setActiveTab(tab);
		if (tab === "map") {
			setShowMap(true);
		} else {
			setShowMap(false);
		}
	};

	// Handle notification click
	const handleNotificationClick = (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			markAsReadMutation.mutate(notificationId);
		}
	};

	// If showing report form, render it with sidebar
	if (showReportForm) {
		return (
			<div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
				<CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />
				<div className="flex-1 overflow-y-auto">
					<ReportForm onBack={handleBackToDashboard} />
				</div>
			</div>
		);
	}

	// If showing map, render it with sidebar
	if (showMap) {
		return (
			<div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
				<CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />
				<div className="flex-1 overflow-y-auto">
					<IssueMap onBack={handleBackToDashboard} isAdmin={false} />
				</div>
			</div>
		);
	}

	// Render content based on active tab
	const renderContent = () => {
		if (activeTab === "reports") {
			return (
				<MyReports
					reports={myReports}
					isLoading={isLoading}
					onReportIssue={() => setShowReportForm(true)}
				/>
			);
		}

		// Default dashboard view
		return (
			<Dashboard
				myReports={myReports}
				allIssues={allIssues}
				statistics={statistics}
				isLoading={isLoading}
				notifications={notifications}
				notificationsLoading={notificationsLoading}
				onReportIssue={() => setShowReportForm(true)}
				onExploreMap={() => setShowMap(true)}
				onViewAnalytics={() => {}} // TODO: Implement analytics view
				onShowMap={() => setShowMap(true)}
				onNotificationClick={handleNotificationClick}
			/>
		);
	};

	return (
		<div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Sidebar */}
			<CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">
				{renderContent()}
			</div>
		</div>
	);
};

export default CitizenDashboard;
