import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IssueMap from "@/components/maps/IssueMap";
import { useToast } from "@/hooks/use-toast";
import { useCurrentProfile } from "@/hooks/use-profile";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { 
	Analytics, 
	Dashboard, 
	AllIssues, 
	Users 
} from "@/components/admin";
import { AdminCommunityDashboard } from "@/components/admin/community/AdminCommunityDashboard";

const AdminDashboard = () => {
	const [showMap, setShowMap] = useState(false);
	const [activeTab, setActiveTab] = useState<"dashboard" | "issues" | "map" | "users" | "analytics" | "community">("dashboard");
	const navigate = useNavigate();
	const { toast } = useToast();
	const { signOut } = useAuth();

	// Get current user profile
	const { data: profile } = useCurrentProfile();

	useEffect(() => {
		document.title = "Admin-Citizn";
	}, []);

	const handleBackToDashboard = () => {
		setShowMap(false);
		setActiveTab("dashboard");
	};

	// Handle tab changes
	const handleTabChange = (tab: "dashboard" | "issues" | "map" | "users" | "analytics" | "community") => {
		setActiveTab(tab);
		if (tab === "map") {
			setShowMap(true);
		} else {
		setShowMap(false);
		}
	};

	// Render content based on active tab
	const renderContent = () => {
		switch (activeTab) {
			case "issues":
				return <AllIssues />;
			case "users":
				return <Users />;
			case "analytics":
				return <Analytics />;
			case "community":
				return <AdminCommunityDashboard />;
			case "dashboard":
			default:
				return <Dashboard onShowMap={() => setShowMap(true)} />;
		}
	};

	// If showing map, render it with sidebar
	if (showMap) {
	return (
			<div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
				<AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} profile={profile} />
				<div className="flex-1 overflow-y-auto">
					<IssueMap onBack={handleBackToDashboard} isAdmin={true} />
						</div>
					</div>
	);
}

return (
	<div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
		{/* Sidebar */}
		<AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} profile={profile} />

		{/* Main Content */}
		<div className="flex-1 overflow-y-auto">
			{renderContent()}
			</div>
		</div>
	);
};

export default AdminDashboard;
