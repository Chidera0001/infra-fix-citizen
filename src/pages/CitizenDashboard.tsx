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
} from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import ReportForm from "@/components/ReportForm";
import IssueMap from "@/components/IssueMap";
import InteractiveMap from "@/components/InteractiveMap";
import { mockIssues } from "@/lib/mockData";

const CitizenDashboard = () => {
	const { user } = useUser();
	const [activeTab, setActiveTab] = useState<"dashboard" | "report" | "map">(
		"dashboard"
	);
	const [myReports] = useState(mockIssues.slice(0, 3));
	const [showReportForm, setShowReportForm] = useState(false);
	const [showMap, setShowMap] = useState(false);

	useEffect(() => {
		document.title = "Citizn";
	}, []);

	const handleBackToDashboard = () => {
		setShowReportForm(false);
		setShowMap(false);
		setActiveTab("dashboard");
	};

	// If showing report form, render it instead of dashboard
	if (showReportForm) {
		return <ReportForm onBack={handleBackToDashboard} />;
	}

	// If showing map, render it instead of dashboard
	if (showMap) {
		return <IssueMap onBack={handleBackToDashboard} isAdmin={false} />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header with Nigerian styling */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<CitiznLogo size="md" />
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-3">
								<span className="text-sm text-gray-700 font-medium">
									Welcome back, {user?.firstName}
								</span>
								<Badge
									variant="secondary"
									className="bg-green-50 text-green-700 border-green-200"
								>
									Citizen
								</Badge>
							</div>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-10 h-10",
									},
								}}
							/>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Enhanced Welcome Section */}
				<div className="mb-10">
					<h1 className="text-4xl font-bold text-gray-900 mb-3">
						Citizen Dashboard
					</h1>
					<p className="text-gray-700 text-lg font-medium">
						Track your reports and make a difference in your
						Nigerian community
					</p>
				</div>

				{/* Enhanced Quick Stats with Nigerian context */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										My Reports
									</p>
									<p className="text-3xl font-bold text-gray-900">
										12
									</p>
									<p className="text-xs text-green-600 font-medium mt-1">
										+2 this month
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-xl">
									<Camera className="h-8 w-8 text-green-600" />
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
										8
									</p>
									<p className="text-xs text-green-600 font-medium mt-1">
										67% success rate
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-xl">
									<CheckCircle className="h-8 w-8 text-green-600" />
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
									<p className="text-3xl font-bold text-orange-600">
										3
									</p>
									<p className="text-xs text-orange-600 font-medium mt-1">
										Being addressed
									</p>
								</div>
								<div className="bg-orange-100 p-3 rounded-xl">
									<Clock className="h-8 w-8 text-orange-600" />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-1">
										Community Impact
									</p>
									<p className="text-3xl font-bold text-blue-600">
										47
									</p>
									<p className="text-xs text-blue-600 font-medium mt-1">
										Lives improved
									</p>
								</div>
								<div className="bg-blue-100 p-3 rounded-xl">
									<Heart className="h-8 w-8 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Enhanced Action Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<Card
						className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-300 group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden"
						onClick={() => setShowReportForm(true)}
					>
						<CardHeader className="pb-6">
							<CardTitle className="flex items-center space-x-4">
								<div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<Plus className="h-8 w-8 text-white" />
								</div>
								<span className="text-2xl font-bold">
									Report New Issue
								</span>
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								Found a pothole, broken streetlight, or other
								infrastructure problem in your Nigerian
								community? Report it here.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card
						className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-300 group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden"
						onClick={() => setShowMap(true)}
					>
						<CardHeader className="pb-6">
							<CardTitle className="flex items-center space-x-4">
								<div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<MapPin className="h-8 w-8 text-white" />
								</div>
								<span className="text-2xl font-bold">
									Explore Map
								</span>
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								See all reported issues in your Nigerian area on
								an interactive map.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-300 group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
						<CardHeader className="pb-6">
							<CardTitle className="flex items-center space-x-4">
								<div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<BarChart3 className="h-8 w-8 text-white" />
								</div>
								<span className="text-2xl font-bold">
									View Analytics
								</span>
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								Track your community impact and contribution
								statistics in Nigeria.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>

				{/* Interactive Map Section */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-10">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl font-bold flex items-center space-x-3">
									<MapPin className="h-6 w-6 text-green-600" />
									Community Issues Map
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
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
								<Badge className="bg-green-50 text-green-700 border-green-200">
									Interactive Map
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
								isAdmin={false}
								className="h-full w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Enhanced My Recent Reports */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl font-bold">
									My Recent Reports
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
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
		</div>
	);
};

export default CitizenDashboard;
