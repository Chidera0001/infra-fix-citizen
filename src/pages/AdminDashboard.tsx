import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BarChart3,
	Users,
	Clock,
	CheckCircle,
	AlertTriangle,
	TrendingUp,
	TrendingDown,
	MapPin,
	Activity,
	Eye,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import IssueCard from "@/components/IssueCard";
import IssueMap from "@/components/IssueMap";
import { useToast } from "@/hooks/use-toast";
import { useIssues, useIssueStatistics } from "@/hooks/use-issues";
import { adminApi } from "@/lib/supabase-api";
import { useQuery } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Area,
	AreaChart,
} from "recharts";

const AdminDashboard = () => {
	const [adminUser, setAdminUser] = useState<string>("");
	const [showMap, setShowMap] = useState(false);
	const [activeTab, setActiveTab] = useState<"dashboard" | "issues" | "map" | "users" | "analytics">("dashboard");
	const navigate = useNavigate();
	const { toast } = useToast();
	
	// Fetch real data from Supabase
	const { data: issues = [], isLoading: issuesLoading } = useIssues({ limit: 5, sortBy: 'created_at', sortOrder: 'DESC' });
	const { data: statistics } = useIssueStatistics();
	const { data: analytics } = useQuery({
		queryKey: ['admin-analytics', '30d'],
		queryFn: () => adminApi.getDashboardAnalytics('30d'),
	});
	
	// Fetch area statistics and weekly trends
	const { data: areaData = [], isLoading: areaLoading } = useQuery({
		queryKey: ['area-statistics'],
		queryFn: () => adminApi.getAreaStatistics(),
	});
	
	const { data: weeklyTrends = [], isLoading: trendsLoading } = useQuery({
		queryKey: ['weekly-trends'],
		queryFn: () => adminApi.getWeeklyTrends(),
	});

	// Fetch performance metrics
	const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
		queryKey: ['performance-metrics'],
		queryFn: () => adminApi.getPerformanceMetrics(),
	});

	// Fetch trend comparison
	const { data: trendComparison, isLoading: trendComparisonLoading } = useQuery({
		queryKey: ['trend-comparison', 30],
		queryFn: () => adminApi.getTrendComparison(30),
	});

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
		if (activeTab === "issues") {
			return (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
					<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
							All Issues
						</h1>
						<p className="text-gray-700 text-base lg:text-sm font-medium">
							Manage and track all reported issues
						</p>
					</div>

					<Card className="bg-white border-0 shadow-xl rounded-2xl">
						<CardHeader>
							<CardTitle className="text-xl font-normal text-gray-900">All Reported Issues</CardTitle>
							<CardDescription>View and manage all issues in the system</CardDescription>
						</CardHeader>
						<CardContent>
							{issuesLoading ? (
								<div className="py-8 text-center text-gray-500">Loading issues...</div>
							) : issues.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-gray-500">No issues found</p>
								</div>
							) : (
								<div className="space-y-4">
									{issues.map((issue) => (
										<IssueCard
											key={issue.id}
											issue={issue}
											showActions={true}
										/>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			);
		}

		if (activeTab === "users") {
			return (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
					<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
							User Management
						</h1>
						<p className="text-gray-700 text-base lg:text-sm font-medium">
							Manage platform users and their access
						</p>
					</div>

					<Card className="bg-white border-0 shadow-xl rounded-2xl">
						<CardHeader>
							<CardTitle className="text-xl font-normal text-gray-900">System Users</CardTitle>
							<CardDescription>View and manage all platform users</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="py-12 text-center">
								<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500 mb-4">User management interface coming soon</p>
								<p className="text-sm text-gray-400">This feature will allow you to view, edit, and manage user accounts</p>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		if (activeTab === "analytics") {
			return (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
					<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
							Advanced Analytics
						</h1>
						<p className="text-gray-700 text-base lg:text-sm font-medium">
							Detailed analytics and reporting tools
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="bg-white border-0 shadow-xl rounded-2xl">
							<CardHeader>
								<CardTitle className="text-xl font-normal text-gray-900">Detailed Reports</CardTitle>
								<CardDescription>Generate comprehensive reports</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="py-12 text-center">
									<BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500 mb-4">Advanced reporting tools coming soon</p>
									<p className="text-sm text-gray-400">Export data, generate custom reports, and analyze trends</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white border-0 shadow-xl rounded-2xl">
							<CardHeader>
								<CardTitle className="text-xl font-normal text-gray-900">Performance Insights</CardTitle>
								<CardDescription>Deep dive into system performance</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="py-12 text-center">
									<Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500 mb-4">Performance analytics coming soon</p>
									<p className="text-sm text-gray-400">Track response times, resolution rates, and user satisfaction</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			);
		}

		// Default dashboard view
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
				{/* Dashboard Header */}
				<div className="mb-6 lg:mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-l sm:text-xl lg:text-2xl font-normal text-gray-900 mb-2 lg:mb-3">
								Analytics Dashboard
							</h1>
						</div>
						<Button
							onClick={() => setShowMap(true)}
							className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
						>
							<MapPin className="h-4 w-4 mr-2" />
							View Map
						</Button>
					</div>
				</div>

				{/* Key Metrics Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
					{/* Total Issues */}
					<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								Total Issues
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{(statistics?.total_issues || 0).toLocaleString()}
							</p>
							<div className="flex items-center justify-center text-xs text-green-600 font-medium">
								{((trendComparison?.issuesChange || 0) >= 0) ? (
									<ArrowUpRight className="h-3 w-3 mr-1" />
								) : (
									<ArrowDownRight className="h-3 w-3 mr-1" />
								)}
								<span>{Math.abs(trendComparison?.issuesChange || 0)}% vs last month</span>
							</div>
						</CardContent>
					</Card>

					{/* Open Issues */}
					<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								Pending
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.open_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Require attention
							</p>
						</CardContent>
					</Card>

					{/* In Progress */}
					<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								In Progress
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.in_progress_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								Being resolved
							</p>
						</CardContent>
					</Card>

					{/* Resolved */}
					<Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardContent className="p-6 text-center">
							<p className="text-sm font-medium text-gray-600 mb-2">
								Resolved
							</p>
							<p className="text-4xl font-bold text-gray-900 mb-2">
								{statistics?.resolved_issues || 0}
							</p>
							<p className="text-xs text-green-600 font-medium">
								{(statistics?.total_issues || 0) > 0 ? Math.round(((statistics?.resolved_issues || 0) / (statistics?.total_issues || 1)) * 100) : 0}% success rate
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Charts Row 1 */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
					{/* Weekly Trend Chart */}
					<Card className="lg:col-span-2 bg-white border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold text-gray-900">
								Issues Trend
							</CardTitle>
							<CardDescription className="text-green-600">Reports vs Resolutions (Last 7 Days)</CardDescription>
						</CardHeader>
						<CardContent>
							{trendsLoading ? (
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-gray-500">Loading chart...</p>
								</div>
							) : (
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart data={weeklyTrends.map((day: any) => ({
										name: day.day?.substring(0, 3) || 'N/A',
										reports: day.reports || 0,
										resolved: day.resolved || 0,
									}))}>
										<defs>
											<linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
												<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
											</linearGradient>
											<linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
												<stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis dataKey="name" stroke="#6b7280" />
										<YAxis stroke="#6b7280" />
										<Tooltip 
											contentStyle={{ 
												backgroundColor: '#fff', 
												border: '1px solid #e5e7eb',
												borderRadius: '8px',
												boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
											}}
										/>
										<Legend />
										<Area 
											type="monotone" 
											dataKey="reports" 
											stroke="#3b82f6" 
											fillOpacity={1} 
											fill="url(#colorReports)" 
											name="Reports"
										/>
										<Area 
											type="monotone" 
											dataKey="resolved" 
											stroke="#10b981" 
											fillOpacity={1} 
											fill="url(#colorResolved)" 
											name="Resolved"
										/>
									</AreaChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>

					{/* Status Distribution Pie Chart */}
					<Card className="bg-white border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold text-gray-900">
								Status Distribution
							</CardTitle>
							<CardDescription className="text-green-600">Current issue breakdown</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={[
											{ name: 'Open', value: statistics?.open_issues || 0, color: '#f59e0b' },
											{ name: 'In Progress', value: statistics?.in_progress_issues || 0, color: '#3b82f6' },
											{ name: 'Resolved', value: statistics?.resolved_issues || 0, color: '#10b981' },
										].filter(item => item.value > 0)}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={100}
										fill="#8884d8"
										paddingAngle={5}
										dataKey="value"
										label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
									>
										{[
											{ name: 'Open', value: statistics?.open_issues || 0, color: '#f59e0b' },
											{ name: 'In Progress', value: statistics?.in_progress_issues || 0, color: '#3b82f6' },
											{ name: 'Resolved', value: statistics?.resolved_issues || 0, color: '#10b981' },
										].filter(item => item.value > 0).map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				{/* Charts Row 2 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
					{/* Area Performance */}
					<Card className="bg-white border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold text-gray-900">
								Top Areas by Reports
							</CardTitle>
							<CardDescription className="text-green-600">Issues by location</CardDescription>
						</CardHeader>
						<CardContent>
							{areaLoading ? (
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-gray-500">Loading areas...</p>
								</div>
							) : areaData.length === 0 ? (
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-gray-500">No area data available</p>
								</div>
							) : (
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={areaData.slice(0, 6)} layout="vertical">
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis type="number" stroke="#6b7280" />
										<YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
										<Tooltip 
											contentStyle={{ 
												backgroundColor: '#fff', 
												border: '1px solid #e5e7eb',
												borderRadius: '8px'
											}}
										/>
										<Legend />
										<Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[0, 8, 8, 0]} />
										<Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[0, 8, 8, 0]} />
									</BarChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>

					{/* Performance Metrics */}
					<Card className="bg-white border-0 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold text-gray-900">
								Performance Metrics
							</CardTitle>
							<CardDescription className="text-green-600">Key indicators this month</CardDescription>
						</CardHeader>
						<CardContent>
							{metricsLoading ? (
								<div className="h-[300px] flex items-center justify-center">
									<p className="text-gray-500">Loading metrics...</p>
								</div>
							) : (
								<div className="space-y-6">
									{/* Resolution Rate */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">Resolution Rate</span>
											<span className="text-sm font-bold text-green-600">
												{performanceMetrics?.resolutionRate || 0}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div
												className="bg-green-600 h-3 rounded-full transition-all duration-500"
												style={{ width: `${performanceMetrics?.resolutionRate || 0}%` }}
											></div>
										</div>
									</div>

									{/* Avg Response Time */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">Avg Response Time</span>
											<span className="text-sm font-bold text-green-600">
												{performanceMetrics?.avgResponseTime || 0} hrs
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div 
												className="bg-green-500 h-3 rounded-full transition-all duration-500"
												style={{
													width: `${Math.min(100, Math.max(0, 100 - (performanceMetrics?.avgResponseTime || 0) * 10))}%` 
												}}
											></div>
										</div>
									</div>

									{/* User Satisfaction */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">User Satisfaction</span>
											<span className="text-sm font-bold text-green-600">
												{performanceMetrics?.userSatisfaction || 0}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div 
												className="bg-green-400 h-3 rounded-full transition-all duration-500"
												style={{ width: `${performanceMetrics?.userSatisfaction || 0}%` }}
											></div>
										</div>
									</div>

									{/* Completion Rate */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">Issue Completion</span>
											<span className="text-sm font-bold text-green-600">
												{performanceMetrics?.totalCompleted || 0} / {performanceMetrics?.totalIssues || 0}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div 
												className="bg-green-300 h-3 rounded-full transition-all duration-500"
												style={{ width: `${performanceMetrics?.completionRate || 0}%` }}
											></div>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Recent Issues */}
				<Card className="bg-white border-0 shadow-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-bold text-gray-900">
									Recent Issues
								</CardTitle>
								<CardDescription className="text-green-600">
									Latest reports requiring attention
								</CardDescription>
							</div>
							<Badge className="bg-green-100 text-green-700 border-green-200">
								{issues.slice(0, 5).length} New
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						{issuesLoading ? (
							<div className="py-8 text-center text-gray-500">
								Loading issues...
							</div>
						) : issues.slice(0, 5).length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								No recent issues
							</div>
						) : (
							<div className="space-y-4">
								{issues.slice(0, 5).map((issue) => (
									<IssueCard
										key={issue.id}
										issue={issue}
										showActions={true}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		);
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