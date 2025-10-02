import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Plus,
	MapPin,
	Camera,
	MessageSquare,
	ThumbsUp,
	BarChart3,
	TrendingUp,
	Target,
	Heart,
	Clock,
	CheckCircle,
	AlertTriangle,
	Bell,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import ReportForm from "@/components/ReportForm";
import IssueMap from "@/components/IssueMap";
import InteractiveMapV2 from "@/components/InteractiveMapV2";
import { useIssues, useIssueStatistics } from "@/hooks/use-issues";
import { useNotifications, useMarkAsRead } from "@/hooks/use-notifications";
import { CitizenSidebar } from "@/components/layout/CitizenSidebar";
import { formatDistanceToNow } from "date-fns";

const CitizenDashboard = () => {
	const { user } = useUser();
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
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
				

					{/* Header with Border */}
					<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
						<h1 className="text-l sm:text-xl lg:text-2xl font-normal text-gray-900 mb-1 lg:mb-2">
							My Reports
						</h1>
						<p className="text-gray-700 text-base lg:text-sm font-medium">
							View and track all your submitted reports
						</p>
					</div>

					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
						<CardHeader>
							<CardTitle className="text-l font-normal text-gray-900">Your Submitted Reports</CardTitle>
							<CardDescription>All reports you've submitted to the platform</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="py-8 text-center text-gray-500">Loading your reports...</div>
							) : myReports.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-gray-500 mb-4">You haven't submitted any reports yet</p>
									<Button onClick={() => setShowReportForm(true)} className="bg-green-600 hover:bg-green-700">
										<Plus className="h-4 w-4 mr-2" />
										Report an Issue
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									{myReports.map((issue) => (
										<IssueCard
											key={issue.id}
											issue={issue}
											showActions={false}
										/>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			);
		}

		// Default dashboard view
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
				{/* Enhanced Welcome Section */}
				<div className="mb-6 lg:mb-10 flex items-center justify-between">
					<div>
						<h1 className="text-l sm:text-xl lg:text-2xl font-normal text-gray-900 mb-2 lg:mb-2">
							Citizen Dashboard
						</h1>
					</div>
					
					{/* Notifications Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								{!notificationsLoading && notifications.filter(n => !n.read).length > 0 && (
									<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
										{notifications.filter(n => !n.read).length}
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
							<div className="p-2">
								<div className="flex items-center justify-between mb-2 px-2">
									<h3 className="font-semibold text-sm">Notifications</h3>
									{notifications.filter(n => !n.read).length > 0 && (
										<span className="text-xs text-green-600 font-medium">
											{notifications.filter(n => !n.read).length} unread
										</span>
									)}
								</div>
								{notificationsLoading ? (
									<p className="text-sm text-gray-500 px-2 py-4">Loading notifications...</p>
								) : notifications.length === 0 ? (
									<p className="text-sm text-gray-500 px-2 py-4">No notifications</p>
								) : (
									notifications.map((notification) => (
										<DropdownMenuItem 
											key={notification.id} 
											className="cursor-pointer p-3 hover:bg-gray-50"
											onClick={() => handleNotificationClick(notification.id, notification.read)}
										>
											<div className="flex-1">
												<p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
													{notification.message}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
												</p>
											</div>
											{!notification.read && (
												<div className="ml-2 h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></div>
											)}
										</DropdownMenuItem>
									))
								)}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Enhanced Quick Stats with Nigerian context */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
					<Card className="bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								My Reports
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{myReports.length}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Recent reports
							</p>
						</CardContent>
					</Card>
					<Card className="bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								Resolved
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.resolved_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Community wide
							</p>
						</CardContent>
					</Card>
					<Card className="bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								In Progress
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.in_progress_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Being addressed
							</p>
						</CardContent>
					</Card>
					<Card className="bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								Community Impact
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.total_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Total reports
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Enhanced Action Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<Card
						className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden"
						onClick={() => setShowReportForm(true)}
					>
						<CardContent className="p-8 text-center">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
								<Plus className="h-10 w-10 text-white" />
							</div>
							<h3 className="text-xl font-normal text-gray-900 mb-2">
								Report New Issue
							</h3>
							<p className="text-sm text-gray-600">
								Report infrastructure problems in your community
							</p>
						</CardContent>
					</Card>
					<Card
						className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden"
						onClick={() => setShowMap(true)}
					>
						<CardContent className="p-8 text-center">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
								<MapPin className="h-10 w-10 text-white" />
							</div>
							<h3 className="text-xl font-normal text-gray-900 mb-2">
								Explore Map
							</h3>
							<p className="text-sm text-gray-600">
								View all reported issues on an interactive map
							</p>
						</CardContent>
					</Card>
					<Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden">
						<CardContent className="p-8 text-center">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
								<BarChart3 className="h-10 w-10 text-white" />
							</div>
							<h3 className="text-xl font-normal text-gray-900 mb-2">
								View Analytics
							</h3>
							<p className="text-sm text-gray-600">
								Track your community impact and statistics
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Interactive Map Section */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-10">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-normal flex items-center space-x-3">
									Community Issues Map
								</CardTitle>
								<CardDescription className="text-gray-600 text-m">
									See all reported issues in your area. Click
									on any location to report a new issue.
								</CardDescription>
							</div>
							<div className="flex items-center space-x-3">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowMap(true)}
									className="border-green-300 text-green-700 hover:bg-green-50"
								>
									<MapPin className="h-4 w-4 mr-2" />
									Full Map View
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className="h-96 rounded-2xl overflow-hidden"
							style={{ width: "100%", height: "100%" }}
						>
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<p className="text-gray-500">Loading map...</p>
								</div>
							) : (
								<InteractiveMapV2
									issues={allIssues}
									isAdmin={false}
									className="h-full w-full"
								/>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Enhanced My Recent Reports */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-normal">
									My Recent Reports
								</CardTitle>
								<CardDescription className="text-gray-600 text-m">
									Track the progress of your submitted issues
									in your Nigerian community
								</CardDescription>
							</div>
							<Badge
								variant="secondary"
								className="bg-green-50 text-green-700 border-green-200"
							>
								{myReports.length} Reports
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{myReports.map((issue) => (
								<IssueCard
									key={issue.id}
									issue={issue}
									showActions={false}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
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
