import { Home, FileText, Map, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CitiznLogo from "@/components/CitiznLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CitizenSidebarProps {
	activeTab: string;
	onTabChange: (tab: "dashboard" | "reports" | "map") => void;
}

export const CitizenSidebar = ({ activeTab, onTabChange }: CitizenSidebarProps) => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		navigate("/");
	};

	const handleMenuItemClick = (tab: "dashboard" | "reports" | "map") => {
		onTabChange(tab);
		setIsOpen(false); // Close sidebar on mobile after selection
	};

	const menuItems = [
		{ id: "dashboard", icon: Home, label: "Dashboard" },
		{ id: "reports", icon: FileText, label: "My Reports" },
		{ id: "map", icon: Map, label: "Map View" },
	];

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
			>
				{isOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
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
		{/* User Profile */}
		<div className="p-6 border-b border-gray-200">
			<div className="flex items-center space-x-3">
				<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
					<span className="text-green-600 font-semibold text-lg">
						{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
					</span>
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-base font-semibold text-gray-900 truncate">
						{user?.user_metadata?.full_name || user?.email || 'User'}
					</p>
					<p className="text-sm text-gray-600 truncate">Citizen</p>
				</div>
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
									: "text-black hover:bg-gray-50"
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
					className="w-full justify-start text-black hover:bg-gray-50"
					onClick={() => navigate("/settings")}
				>
					<Settings className="h-5 w-5 mr-3 text-gray-500" />
					Settings
				</Button>
				<Button
					variant="ghost"
					className="w-full justify-start text-red-600 hover:bg-red-50"
					onClick={handleSignOut}
				>
					<LogOut className="h-5 w-5 mr-3" />
					Sign Out
				</Button>
			</div>
		</div>
		</>
	);
};

