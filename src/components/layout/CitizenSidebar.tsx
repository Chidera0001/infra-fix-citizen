import { Home, FileText, Map, LogOut, Menu, X, Camera } from "lucide-react";
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
		try {
			// Sign out and wait for completion (includes cleanup delay)
			await signOut();
			// Wait a bit more to ensure user state is cleared and caches are cleared
			await new Promise(resolve => setTimeout(resolve, 100));
			// Navigate to home page after cleanup completes
			navigate("/");
		} catch (error) {
			console.warn('Sign out failed:', error);
			// Navigate to home page even if sign out fails
			navigate("/");
		}
	};

	const handleMenuItemClick = (tab: string) => {
		if (tab === "report-now") {
			navigate("/report-now");
			setIsOpen(false);
		} else {
			onTabChange(tab as "dashboard" | "reports" | "map");
			setIsOpen(false);
		}
	};

	const menuItems = [
		{ id: "dashboard", icon: Home, label: "Dashboard" },
		{ id: "report-now", icon: Camera, label: "Report Now", svgIcon: "/Assets/icons/camera.svg" },
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
							<img 
								src="/Assets/logo/Trademark.png" 
								alt="Citizn Logo" 
								className="h-6 w-auto"
							/>
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
				<nav className="flex-1 p-4 space-y-1 overflow-y-hidden">
					{menuItems.map((item: any) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;
						
						return (
							<button
								key={item.id}
								onClick={() => handleMenuItemClick(item.id)}
								className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
									isActive
										? "bg-green-50 text-green-700 font-semibold"
										: "text-black hover:bg-gray-50"
								}`}
							>
								{item.svgIcon ? (
									<svg 
										className={`h-5 w-5 ${isActive ? "text-green-600" : "text-gray-500"}`}
										fill="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M4 4h7l2-2h1l2 2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
									</svg>
								) : (
									<Icon className={`h-5 w-5 ${isActive ? "text-green-600" : "text-gray-500"}`} />
								)}
								<span>{item.label}</span>
							</button>
						);
					})}
				</nav>

				{/* Footer Actions */}
				<div className="p-4 pb-16 border-t border-gray-200 space-y-2" style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
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

