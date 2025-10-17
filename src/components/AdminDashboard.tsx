import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	ArrowLeft,
	BarChart3,
	MapPin,
	AlertTriangle,
	CheckCircle,
	Clock,
	TrendingUp,
	Filter,
	Download,
	FileSpreadsheet,
	FileText,
	BarChart,
} from "lucide-react";
import IssueCard from "@/components/IssueCard";
import { useIssues } from "@/hooks/use-issues";
import {
	exportToCSV,
	exportToExcel,
	generateFilename,
	formatDataForSheets,
	createSummaryReport,
} from "@/lib/googleSheetsExport";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts";
import {
	format,
	subDays,
	subWeeks,
	subMonths,
	startOfDay,
	endOfDay,
	isWithinInterval,
	parseISO,
} from "date-fns";

interface AdminDashboardProps {
	onBack: () => void;
}

type TimeFilter = "all" | "today" | "week" | "month" | "quarter" | "year";

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
	const { data: issues = [], isLoading } = useIssues({ limit: 100 });
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [exportDialogOpen, setExportDialogOpen] = useState(false);

	// Filter issues based on selected filters
	const filteredIssues = useMemo(() => {
		let filtered = issues;

		// Apply time filter
		if (timeFilter !== "all") {
			const now = new Date();
			let startDate: Date;
			let endDate: Date;

			switch (timeFilter) {
				case "today":
					startDate = startOfDay(now);
					endDate = endOfDay(now);
					break;
				case "week":
					startDate = startOfDay(subWeeks(now, 1));
					endDate = endOfDay(now);
					break;
				case "month":
					startDate = startOfDay(subMonths(now, 1));
					endDate = endOfDay(now);
					break;
				case "quarter":
					startDate = startOfDay(subMonths(now, 3));
					endDate = endOfDay(now);
					break;
				case "year":
					startDate = startOfDay(subMonths(now, 12));
					endDate = endOfDay(now);
					break;
				default:
					startDate = startOfDay(subDays(now, 365));
					endDate = endOfDay(now);
			}

			filtered = filtered.filter((issue) => {
				const issueDate = parseISO(issue.date);
				return isWithinInterval(issueDate, {
					start: startDate,
					end: endDate,
				});
			});
		}

		// Apply category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.category === categoryFilter
			);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.status === statusFilter
			);
		}

		return filtered;
	}, [issues, timeFilter, categoryFilter, statusFilter]);

	const openIssues = filteredIssues.filter(
		(issue) => issue.status === "open"
	);
	const inProgressIssues = filteredIssues.filter(
		(issue) => issue.status === "in_progress"
	);
	const resolvedIssues = filteredIssues.filter(
		(issue) => issue.status === "resolved"
	);

	// Get unique categories for filter
	const categories = useMemo(() => {
		const uniqueCategories = [
			...new Set(issues.map((issue) => issue.category)),
		];
		return uniqueCategories.sort();
	}, [issues]);

	// Export functions
	const handleCSVExport = () => {
		const filename = generateFilename({
			timeFilter,
			categoryFilter,
			statusFilter,
		});
		exportToCSV(filteredIssues, filename);
		setExportDialogOpen(false);
	};

	const handleExcelExport = () => {
		const filename = generateFilename({
			timeFilter,
			categoryFilter,
			statusFilter,
		}).replace(".csv", ".xlsx");
		exportToExcel(filteredIssues, filename);
		setExportDialogOpen(false);
	};

	const handleFormattedExport = () => {
		const filename = `formatted-${generateFilename({
			timeFilter,
			categoryFilter,
			statusFilter,
		})}`;
		const formattedData = formatDataForSheets(filteredIssues);
		exportToCSV(formattedData as any, filename);
		setExportDialogOpen(false);
	};

	const handleSummaryReport = () => {
		const report = createSummaryReport(filteredIssues, {
			timeFilter,
			categoryFilter,
			statusFilter,
		});
		const blob = new Blob([report], { type: "text/plain;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`summary-report-${new Date().toISOString().split("T")[0]}.txt`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		setExportDialogOpen(false);
	};

	// Chart data based on filtered issues
	const categoryData = useMemo(() => {
		const categoryCounts = filteredIssues.reduce((acc, issue) => {
			acc[issue.category] = (acc[issue.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(categoryCounts).map(([name, value]) => ({
			name,
			value,
			color: getCategoryColor(name),
		}));
	}, [filteredIssues]);

	const monthlyData = useMemo(() => {
		const monthCounts = filteredIssues.reduce((acc, issue) => {
			const month = format(parseISO(issue.date), "MMM");
			acc[month] = (acc[month] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(monthCounts).map(([month, reports]) => ({
			month,
			reports,
			resolved: Math.floor(reports * 0.8), // Mock resolved count
		}));
	}, [filteredIssues]);

	const urgencyData = useMemo(() => {
		const urgencyCounts = filteredIssues.reduce((acc, issue) => {
			const urgency = issue.urgency || "low";
			acc[urgency] = (acc[urgency] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(urgencyCounts).map(([name, count]) => ({
			name: name.charAt(0).toUpperCase() + name.slice(1),
			count,
		}));
	}, [filteredIssues]);

	// Helper function to get category colors
	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			Pothole: "#3B82F6",
			Streetlight: "#10B981",
			"Water Supply": "#F59E0B",
			"Traffic Light": "#EF4444",
			Drainage: "#8B5CF6",
			"Road Damage": "#06B6D4",
		};
		return colors[category] || "#6B7280";
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="sm" onClick={onBack}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back
							</Button>
							<div className="flex items-center space-x-3">
								<div className="bg-green-600 p-2 rounded-lg">
									<BarChart3 className="h-5 w-5 text-white" />
								</div>
								<div>
									<h1 className="text-xl font-normal text-gray-900">
										Admin Dashboard
									</h1>
									<p className="text-sm text-gray-600">
										Lagos State Infrastructure Management
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Filters Section */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Filter className="h-5 w-5 text-green-600" />
							<span>Filters & Export</span>
						</CardTitle>
						<CardDescription>
							Filter data by time period, category, and status
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{/* Time Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-black">
									Time Period
								</label>
								<Select
									value={timeFilter}
									onValueChange={(value: TimeFilter) =>
										setTimeFilter(value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select time period" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Time
										</SelectItem>
										<SelectItem value="today">
											Today
										</SelectItem>
										<SelectItem value="week">
											Last Week
										</SelectItem>
										<SelectItem value="month">
											Last Month
										</SelectItem>
										<SelectItem value="quarter">
											Last Quarter
										</SelectItem>
										<SelectItem value="year">
											Last Year
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Category Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-black">
									Category
								</label>
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Categories
										</SelectItem>
										{categories.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Status Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-black">
									Status
								</label>
								<Select
									value={statusFilter}
									onValueChange={setStatusFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Statuses
										</SelectItem>
										<SelectItem value="open">
											Open
										</SelectItem>
										<SelectItem value="in_progress">
											In Progress
										</SelectItem>
										<SelectItem value="resolved">
											Resolved
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Export Button */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-black">
									Export
								</label>
								<Dialog
									open={exportDialogOpen}
									onOpenChange={setExportDialogOpen}
								>
									<DialogTrigger asChild>
										<Button
											className="w-full bg-green-600 hover:bg-green-700"
											disabled={
												filteredIssues.length === 0
											}
										>
											<FileSpreadsheet className="h-4 w-4 mr-2" />
											Export Data
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-md">
										<DialogHeader>
											<DialogTitle>
												Export Data
											</DialogTitle>
											<DialogDescription>
												Choose your preferred export
												format. The data will be
												filtered according to your
												current selections.
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="space-y-3">
												<Button
													onClick={handleCSVExport}
													variant="outline"
													className="w-full justify-start"
													disabled={
														filteredIssues.length ===
														0
													}
												>
													<FileText className="h-4 w-4 mr-2" />
													Export as CSV (Google Sheets
													compatible)
												</Button>
												<Button
													onClick={handleExcelExport}
													variant="outline"
													className="w-full justify-start"
													disabled={
														filteredIssues.length ===
														0
													}
												>
													<FileSpreadsheet className="h-4 w-4 mr-2" />
													Export as Excel (XLSX)
												</Button>
												<Button
													onClick={
														handleFormattedExport
													}
													variant="outline"
													className="w-full justify-start"
													disabled={
														filteredIssues.length ===
														0
													}
												>
													<BarChart className="h-4 w-4 mr-2" />
													Export Formatted Data
													(Better readability)
												</Button>
												<Button
													onClick={
														handleSummaryReport
													}
													variant="outline"
													className="w-full justify-start"
													disabled={
														filteredIssues.length ===
														0
													}
												>
													<FileText className="h-4 w-4 mr-2" />
													Generate Summary Report
												</Button>
											</div>
											<div className="text-sm text-gray-500 text-center">
												{filteredIssues.length > 0 ? (
													<p>
														Exporting{" "}
														{filteredIssues.length}{" "}
														issues with current
														filters
													</p>
												) : (
													<p>
														No data available for
														export with current
														filters
													</p>
												)}
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						{/* Filter Summary */}
						<div className="mt-4 p-3 bg-gray-50 rounded-lg">
							<p className="text-sm text-gray-600">
								Showing{" "}
								<span className="font-semibold text-green-600">
									{filteredIssues.length}
								</span>{" "}
								issues
								{timeFilter !== "all" && ` from ${timeFilter}`}
								{categoryFilter !== "all" &&
									` in ${categoryFilter}`}
								{statusFilter !== "all" &&
									` with status ${statusFilter}`}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Overview Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										Total Reports
									</p>
									<p className="text-3xl font-normal text-gray-900">
										{filteredIssues.length}
									</p>
									<p className="text-sm text-green-600 mt-1">
										{filteredIssues.length > 0
											? `Filtered from ${issues.length} total`
											: "No data"}
									</p>
								</div>
								<BarChart3 className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										Open Issues
									</p>
									<p className="text-3xl font-normal text-red-600">
										{openIssues.length}
									</p>
									<p className="text-sm text-red-600 mt-1">
										{openIssues.length > 0
											? "Needs attention"
											: "All resolved"}
									</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-red-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										In Progress
									</p>
									<p className="text-3xl font-normal text-orange-600">
										{inProgressIssues.length}
									</p>
									<p className="text-sm text-orange-600 mt-1">
										{inProgressIssues.length > 0
											? "Being worked on"
											: "None in progress"}
									</p>
								</div>
								<Clock className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										Resolved
									</p>
									<p className="text-3xl font-normal text-green-600">
										{resolvedIssues.length}
									</p>
									<p className="text-sm text-green-600 mt-1">
										{resolvedIssues.length > 0
											? `${Math.round(
													(resolvedIssues.length /
														filteredIssues.length) *
														100
											  )}% rate`
											: "No resolved issues"}
									</p>
								</div>
								<CheckCircle className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="analytics" className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="issues">
							Issue Management
						</TabsTrigger>
						<TabsTrigger value="reports">
							Detailed Reports
						</TabsTrigger>
					</TabsList>

					<TabsContent value="analytics" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Monthly Trends */}
							<Card>
								<CardHeader>
									<CardTitle>Monthly Trends</CardTitle>
									<CardDescription>
										Reports vs. Resolutions over time
									</CardDescription>
								</CardHeader>
								<CardContent>
									{monthlyData.length > 0 ? (
										<ResponsiveContainer
											width="100%"
											height={300}
										>
											<LineChart data={monthlyData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="month" />
												<YAxis />
												<Tooltip />
												<Line
													type="monotone"
													dataKey="reports"
													stroke="#3B82F6"
													strokeWidth={2}
													name="Reports"
												/>
												<Line
													type="monotone"
													dataKey="resolved"
													stroke="#10B981"
													strokeWidth={2}
													name="Resolved"
												/>
											</LineChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[300px] flex items-center justify-center text-gray-500">
											No data available for selected
											filters
										</div>
									)}
								</CardContent>
							</Card>

							{/* Issue Categories */}
							<Card>
								<CardHeader>
									<CardTitle>Issue Categories</CardTitle>
									<CardDescription>
										Distribution of reported problems
									</CardDescription>
								</CardHeader>
								<CardContent>
									{categoryData.length > 0 ? (
										<ResponsiveContainer
											width="100%"
											height={300}
										>
											<PieChart>
												<Pie
													data={categoryData}
													cx="50%"
													cy="50%"
													outerRadius={80}
													dataKey="value"
													label={({ name, value }) =>
														`${name}: ${value}`
													}
												>
													{categoryData.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														)
													)}
												</Pie>
												<Tooltip />
											</PieChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[300px] flex items-center justify-center text-gray-500">
											No data available for selected
											filters
										</div>
									)}
								</CardContent>
							</Card>

							{/* Urgency Levels */}
							<Card>
								<CardHeader>
									<CardTitle>
										Issue Priority Distribution
									</CardTitle>
									<CardDescription>
										Current open issues by urgency
									</CardDescription>
								</CardHeader>
								<CardContent>
									{urgencyData.length > 0 ? (
										<ResponsiveContainer
											width="100%"
											height={250}
										>
											<BarChart data={urgencyData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Bar
													dataKey="count"
													fill="#3B82F6"
												/>
											</BarChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[250px] flex items-center justify-center text-gray-500">
											No data available for selected
											filters
										</div>
									)}
								</CardContent>
							</Card>

							{/* Performance Metrics */}
							<Card>
								<CardHeader>
									<CardTitle>Performance Metrics</CardTitle>
									<CardDescription>
										Key performance indicators
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Average Resolution Time
											</span>
											<span className="text-xl font-normal text-blue-600">
												{filteredIssues.length > 0
													? "5.2 days"
													: "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Citizen Satisfaction
											</span>
											<span className="text-xl font-normal text-green-600">
												{filteredIssues.length > 0
													? "4.7/5"
													: "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Resolution Rate
											</span>
											<span className="text-xl font-normal text-green-600">
												{filteredIssues.length > 0
													? `${Math.round(
															(resolvedIssues.length /
																filteredIssues.length) *
																100
													  )}%`
													: "N/A"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Response Time
											</span>
											<span className="text-xl font-normal text-blue-600">
												{filteredIssues.length > 0
													? "2.1 hours"
													: "N/A"}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="issues" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* High Priority Issues */}
							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<AlertTriangle className="h-5 w-5 text-red-600" />
										<span>High Priority Issues</span>
									</CardTitle>
									<CardDescription>
										Issues requiring immediate attention
									</CardDescription>
								</CardHeader>
								<CardContent>
									{filteredIssues.filter(
										(issue) => issue.urgency === "high"
									).length > 0 ? (
										<div className="space-y-4">
											{filteredIssues
												.filter(
													(issue) =>
														issue.urgency === "high"
												)
												.slice(0, 5)
												.map((issue) => (
													<IssueCard
														key={issue.id}
														issue={issue}
														showActions={true}
													/>
												))}
										</div>
									) : (
										<div className="text-center py-8 text-gray-500">
											No high priority issues found for
											selected filters
										</div>
									)}
								</CardContent>
							</Card>

							{/* Quick Actions */}
							<Card>
								<CardHeader>
									<CardTitle>Quick Actions</CardTitle>
									<CardDescription>
										Common administrative tasks
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button
										className="w-full justify-start"
										variant="outline"
									>
										<TrendingUp className="h-4 w-4 mr-2" />
										Generate Report
									</Button>
									<Button
										className="w-full justify-start"
										variant="outline"
									>
										<MapPin className="h-4 w-4 mr-2" />
										View Map
									</Button>
									<Button
										className="w-full justify-start"
										variant="outline"
									>
										<CheckCircle className="h-4 w-4 mr-2" />
										Bulk Update Status
									</Button>
									<Button
										className="w-full justify-start"
										variant="outline"
									>
										<AlertTriangle className="h-4 w-4 mr-2" />
										Send Alerts
									</Button>
									<Dialog
										open={exportDialogOpen}
										onOpenChange={setExportDialogOpen}
									>
										<DialogTrigger asChild>
											<Button
												className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
												disabled={
													filteredIssues.length === 0
												}
											>
												<Download className="h-4 w-4 mr-2" />
												Export Data
											</Button>
										</DialogTrigger>
									</Dialog>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="reports" className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>
											All Reported Issues
										</CardTitle>
										<CardDescription>
											Complete list of citizen reports
											with management options
										</CardDescription>
									</div>
									<Dialog
										open={exportDialogOpen}
										onOpenChange={setExportDialogOpen}
									>
										<DialogTrigger asChild>
											<Button
												className="bg-green-600 hover:bg-green-700"
												disabled={
													filteredIssues.length === 0
												}
											>
												<FileSpreadsheet className="h-4 w-4 mr-2" />
												Export to CSV
											</Button>
										</DialogTrigger>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent>
								{filteredIssues.length > 0 ? (
									<div className="space-y-4">
										{filteredIssues.map((issue) => (
											<IssueCard
												key={issue.id}
												issue={issue}
												showActions={true}
											/>
										))}
									</div>
								) : (
									<div className="text-center py-12 text-gray-500">
										<FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p className="text-lg font-medium">
											No issues found
										</p>
										<p className="text-sm">
											Try adjusting your filters or select
											a different time period
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default AdminDashboard;
