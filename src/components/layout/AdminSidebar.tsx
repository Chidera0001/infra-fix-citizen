import { 
	LayoutDashboard, 
	FileText, 
	Map, 
	Users, 
	BarChart3, 
	Settings, 
	LogOut,
	Shield,
	Activity,
	Menu,
	X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CitiznLogo from "@/components/CitiznLogo";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AdminSidebarProps {
	activeTab: string;
	onTabChange: (tab: "dashboard" | "issues" | "map" | "users" | "analytics") => void;
	adminUser: string;
}

export const AdminSidebar = ({ activeTab, onTabChange, adminUser }: AdminSidebarProps) => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem("adminAuthenticated");
		localStorage.removeItem("adminUser");
		toast({
			title: "Logged Out",
			description: "You have been successfully logged out",
		});
		navigate("/admin-login");
	};

	const handleMenuItemClick = (tab: "dashboard" | "issues" | "map" | "users" | "analytics") => {
		onTabChange(tab);
		setIsOpen(false); // Close sidebar on mobile after selection
	};

	const menuItems = [
		{ id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
		{ id: "issues", icon: FileText, label: "All Issues" },
		{ id: "map", icon: Map, label: "Map View" },
		{ id: "users", icon: Users, label: "Users" },
		{ id: "analytics", icon: BarChart3, label: "Analytics" },
	];

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
			>
				{isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
			</button>

			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}

		{/* Sidebar */}
		<div className={`
			fixed lg:sticky top-0 z-40 lg:z-auto
			w-64 bg-white border-r border-gray-200 h-screen flex flex-col
			transform transition-transform duration-300 ease-in-out
			${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
		`}>
		{/* Logo and Admin Profile Combined */}
		<div className="p-6 border-b border-gray-200">
			<div className="flex items-center space-x-3">
				<p className="text-lg font-normal text-gray-900">
					Welcome Admin
				</p>
			</div>
		</div>

			{/* Navigation Menu */}
			<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeTab === item.id;
					
					return (
						<button
							key={item.id}
							onClick={() => handleMenuItemClick(item.id as any)}
							className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
								isActive
									? "bg-green-50 text-green-700 font-semibold"
									: "text-gray-700 hover:bg-gray-50"
							}`}
						>
							<Icon className={`h-5 w-5 ${isActive ? "text-green-600" : "text-gray-500"}`} />
							<span>{item.label}</span>
						</button>
					);
				})}
			</nav>

			{/* Footer Actions */}
			<div className="p-4 border-t border-gray-200 space-y-2">
				<Button
					variant="ghost"
					className="w-full justify-start text-gray-700 hover:bg-gray-50"
					onClick={() => navigate("/admin/settings")}
				>
					<Settings className="h-5 w-5 mr-3 text-gray-500" />
					Settings
				</Button>
				<Button
					variant="ghost"
					className="w-full justify-start text-red-600 hover:bg-red-50"
					onClick={handleLogout}
				>
					<LogOut className="h-5 w-5 mr-3" />
					Sign Out
				</Button>
			</div>
		</div>
		</>
	);
};

