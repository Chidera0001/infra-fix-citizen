import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IssueMap from "@/components/IssueMap";
import { useToast } from "@/hooks/use-toast";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { 
	Analytics, 
	Dashboard, 
	AllIssues, 
	Users 
} from "@/components/admin";

const AdminDashboard = () => {
	const [adminUser, setAdminUser] = useState<string>("");
	const [showMap, setShowMap] = useState(false);
	const [activeTab, setActiveTab] = useState<"dashboard" | "issues" | "map" | "users" | "analytics">("dashboard");
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		const storedUser = localStorage.getItem("adminUser");
		if (storedUser) {
			setAdminUser(storedUser);
		}
	}, []);

	useEffect(() => {
		document.title = "Admin-Citizn";
	}, []);

	const handleBackToDashboard = () => {
		setShowMap(false);
		setActiveTab("dashboard");
	};

	// Handle tab changes
	const handleTabChange = (tab: "dashboard" | "issues" | "map" | "users" | "analytics") => {
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
			case "dashboard":
			default:
				return <Dashboard onShowMap={() => setShowMap(true)} />;
		}
	};

	// If showing map, render it with sidebar
	if (showMap) {
	return (
			<div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
				<AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} adminUser={adminUser} />
				<div className="flex-1 overflow-y-auto">
					<IssueMap onBack={handleBackToDashboard} isAdmin={true} />
						</div>
					</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			{/* Sidebar */}
			<AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} adminUser={adminUser} />

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">
				{renderContent()}
			</div>
		</div>
	);
};

export default AdminDashboard;
