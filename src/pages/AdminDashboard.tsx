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
	LogOut,
	Shield,
	Target,
	Heart,
	MapPin,
	Filter,
	ZoomIn,
	ZoomOut,
	Layers,
	Activity,
	Calendar,
	Eye,
	Settings,
} from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import InteractiveMap from "@/components/InteractiveMap";
import IssueMap from "@/components/IssueMap";
import { mockIssues } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
	const [adminUser, setAdminUser] = useState<string>("");
	const [recentIssues] = useState(mockIssues.slice(0, 5));
	const [selectedArea, setSelectedArea] = useState<string>("all");
	const [showMap, setShowMap] = useState(false);
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

	const handleLogout = () => {
		localStorage.removeItem("adminAuthenticated");
		localStorage.removeItem("adminUser");
		toast({
			title: "Logged Out",
			description: "You have been successfully logged out",
		});
		navigate("/admin-login");
	};

	const handleBackToDashboard = () => {
		setShowMap(false);
	};

	// If showing map, render it instead of dashboard
	if (showMap) {
		return <IssueMap onBack={handleBackToDashboard} isAdmin={true} />;
	}

	// Mock data for charts and analytics
	const areaData = [
		{ name: "Lagos Mainland", reports: 45, resolved: 32, pending: 13 },
		{ name: "Victoria Island", reports: 32, resolved: 28, pending: 4 },
		{ name: "Ikeja", reports: 28, resolved: 20, pending: 8 },
		{ name: "Surulere", reports: 22, resolved: 18, pending: 4 },
		{ name: "Oshodi", reports: 18, resolved: 15, pending: 3 },
	];

	const weeklyTrends = [
		{ day: "Mon", reports: 12, resolved: 8 },
		{ day: "Tue", reports: 15, resolved: 12 },
		{ day: "Wed", reports: 8, resolved: 6 },
		{ day: "Thu", reports: 20, resolved: 16 },
		{ day: "Fri", reports: 18, resolved: 14 },
		{ day: "Sat", reports: 10, resolved: 7 },
		{ day: "Sun", reports: 6, resolved: 4 },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<CitiznLogo size="md" />
						<div className="flex items-center space-x-4">
							<Badge
								variant="secondary"
								className="bg-green-50 text-green-700 border-green-200 font-semibold"
							>
								<Shield className="h-4 w-4 mr-2" />
								Administrator
							</Badge>
							<span className="text-sm text-gray-700 font-medium">
								Welcome, {adminUser}
							</span>
							<Button
								onClick={handleLogout}
								variant="outline"
								size="sm"
								className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
							>
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Dashboard Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-3">
						Administrative Dashboard
					</h1>
					<p className="text-gray-700 text-lg font-medium">
						Real-time monitoring and management of community reports
					</p>
				</div>

				{/* Key Metrics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										Total Issues
									</p>
									<p className="text-3xl font-bold text-gray-900">
										156
									</p>
									<p className="text-xs text-green-600 font-medium mt-1">
										+12 this week
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-xl">
									<BarChart3 className="h-8 w-8 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										Pending
									</p>
									<p className="text-3xl font-bold text-orange-600">
										23
									</p>
									<p className="text-xs text-orange-600 font-medium mt-1">
										Require attention
									</p>
								</div>
								<div className="bg-orange-100 p-3 rounded-xl">
									<AlertTriangle className="h-8 w-8 text-orange-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										In Progress
									</p>
									<p className="text-3xl font-bold text-blue-600">
										45
									</p>
									<p className="text-xs text-blue-600 font-medium mt-1">
										Being addressed
									</p>
								</div>
								<div className="bg-blue-100 p-3 rounded-xl">
									<Clock className="h-8 w-8 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										Resolved
									</p>
									<p className="text-3xl font-bold text-green-600">
										88
									</p>
									<p className="text-xs text-green-600 font-medium mt-1">
										56% success rate
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-xl">
									<CheckCircle className="h-8 w-8 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Interactive Map Section */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-8">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl font-bold flex items-center space-x-3">
									<MapPin className="h-6 w-6 text-green-600" />
									Interactive Heat Map
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
									Real-time report intensity across Nigerian
									communities
								</CardDescription>
							</div>
							<div className="flex items-center space-x-3">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowMap(true)}
									className="border-green-300 text-green-700 hover:bg-green-50"
								>
									<Eye className="h-4 w-4 mr-2" />
									Full Map View
								</Button>
								<Badge className="bg-green-50 text-green-700 border-green-200">
									Heat Map Active
								</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className="h-96 rounded-2xl overflow-hidden"
							style={{ width: "100%", height: "100%" }}
						>
							<InteractiveMap
								issues={mockIssues}
								isAdmin={true}
								className="h-full w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Analytics Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Area Performance Chart */}
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl lg:col-span-2">
						<CardHeader className="pb-6">
							<CardTitle className="text-2xl font-bold flex items-center space-x-3">
								<Activity className="h-6 w-6 text-green-600" />
								Area Performance Analytics
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								Report distribution and resolution rates by area
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{areaData.map((area, index) => (
									<div
										key={index}
										className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
									>
										<div className="flex items-center justify-between mb-3">
											<h4 className="font-semibold text-gray-900">
												{area.name}
											</h4>
											<Badge className="bg-green-100 text-green-700">
												{Math.round(
													(area.resolved /
														area.reports) *
														100
												)}
												%
											</Badge>
										</div>
										<div className="flex space-x-2">
											<div className="flex-1 bg-green-200 rounded-full h-3">
												<div
													className="bg-green-600 h-3 rounded-full transition-all duration-500"
													style={{
														width: `${
															(area.resolved /
																area.reports) *
															100
														}%`,
													}}
												></div>
											</div>
											<div className="flex-1 bg-orange-200 rounded-full h-3">
												<div
													className="bg-orange-600 h-3 rounded-full transition-all duration-500"
													style={{
														width: `${
															(area.pending /
																area.reports) *
															100
														}%`,
													}}
												></div>
											</div>
										</div>
										<div className="flex justify-between text-xs text-gray-600 mt-2">
											<span>
												Resolved: {area.resolved}
											</span>
											<span>Pending: {area.pending}</span>
											<span>Total: {area.reports}</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Weekly Trends */}
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
						<CardHeader className="pb-6">
							<CardTitle className="text-2xl font-bold flex items-center space-x-3">
								<TrendingUp className="h-6 w-6 text-blue-600" />
								Weekly Trends
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								Daily report and resolution patterns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{weeklyTrends.map((day, index) => (
									<div
										key={index}
										className="p-3 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-gray-900">
												{day.day}
											</span>
											<span className="text-sm text-gray-600">
												{day.resolved}/{day.reports}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
												style={{
													width: `${
														(day.resolved /
															day.reports) *
														100
													}%`,
												}}
											></div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Issues Management */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl font-bold">
									Recent Issues Management
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
									Latest reports requiring administrative
									attention
								</CardDescription>
							</div>
							<div className="flex items-center space-x-3">
								<Button
									variant="outline"
									size="sm"
									className="border-green-300 text-green-700 hover:bg-green-50"
								>
									<Filter className="h-4 w-4 mr-2" />
									Filter
								</Button>
								<Badge
									variant="secondary"
									className="bg-green-50 text-green-700 border-green-200"
								>
									{recentIssues.length} Issues
								</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{recentIssues.map((issue) => (
								<IssueCard
									key={issue.id}
									issue={issue}
									showActions={true}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminDashboard;
