import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";
import { useIssueStatistics } from "@/hooks/use-issues";
import { PerformanceMetrics } from "./PerformanceMetrics";

export const DashboardCharts = () => {
	const { data: statistics, isLoading: statsLoading, error: statsError } = useIssueStatistics();
	const { data: areaData = [], isLoading: areaLoading, error: areaError } = useQuery({
		queryKey: ['area-statistics'],
		queryFn: () => adminApi.getAreaStatistics(),
	});
	
	const { data: weeklyTrends = [], isLoading: trendsLoading, error: trendsError } = useQuery({
		queryKey: ['weekly-trends'],
		queryFn: () => adminApi.getWeeklyTrends(),
	});


	return (
		<>
			{/* Charts Row 1 */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
				{/* Weekly Trend Chart */}
				<Card className="lg:col-span-2 bg-white border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-normal text-gray-900">
							Issues Trend
						</CardTitle>
						<CardDescription className="text-green-600">Reports vs Resolutions (Last 7 Days)</CardDescription>
					</CardHeader>
					<CardContent>
						{trendsLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-gray-500">Loading chart...</p>
							</div>
						) : trendsError ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-red-500">Error loading trends: {trendsError.message}</p>
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
											<stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
											<stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
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
										stroke="#ef4444" 
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
						<CardTitle className="text-xl font-normal text-gray-900">
							Status Distribution
						</CardTitle>
						<CardDescription className="text-green-600">Current issue breakdown</CardDescription>
					</CardHeader>
					<CardContent>
						{statsLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-gray-500">Loading statistics...</p>
							</div>
						) : statsError ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-red-500">Error loading statistics: {statsError.message}</p>
							</div>
						) : !statistics ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-gray-500">No statistics available</p>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={350}>
								<PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
									<Pie
										data={[
											{ name: 'Open', value: statistics.open_issues || 0, color: '#ef4444' },
											{ name: 'In Progress', value: statistics.in_progress_issues || 0, color: '#f59e0b' },
											{ name: 'Resolved', value: statistics.resolved_issues || 0, color: '#22c55e' },
										].filter(item => item.value > 0)}
										cx="50%"
										cy="50%"
										innerRadius={50}
										outerRadius={80}
										fill="#8884d8"
										paddingAngle={5}
										dataKey="value"
										label={({ name, value }) => {
											if (value === 0) return '';
											return `${name}`;
										}}
										labelLine={false}
									>
										{[
											{ name: 'Open', value: statistics.open_issues || 0, color: '#ef4444' },
											{ name: 'In Progress', value: statistics.in_progress_issues || 0, color: '#f59e0b' },
											{ name: 'Resolved', value: statistics.resolved_issues || 0, color: '#22c55e' },
										].filter(item => item.value > 0).map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip 
										formatter={(value, name) => [`${value} issues`, name]}
										labelFormatter={() => 'Issue Status'}
									/>
									<Legend 
										verticalAlign="bottom" 
										height={36}
										formatter={(value, entry) => (
											<span style={{ color: entry.color, fontSize: '14px', fontWeight: '500' }}>
												{value}: {entry.payload.value}
											</span>
										)}
									/>
								</PieChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 2 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
				{/* Area Performance */}
				<Card className="bg-white border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-normal text-gray-900">
							Top Areas by Reports
						</CardTitle>
						<CardDescription className="text-green-600">Issues by location</CardDescription>
					</CardHeader>
					<CardContent>
						{areaLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-gray-500">Loading areas...</p>
							</div>
						) : areaError ? (
							<div className="h-[300px] flex items-center justify-center">
								<p className="text-red-500">Error loading areas: {areaError.message}</p>
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
									<Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[0, 8, 8, 0]} />
									<Bar dataKey="pending" fill="#ef4444" name="Pending" radius={[0, 8, 8, 0]} />
								</BarChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>

				{/* Performance Metrics */}
				<Card className="bg-white border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-normal text-gray-900">
							Performance Metrics
						</CardTitle>
						<CardDescription className="text-green-600">Key indicators this month</CardDescription>
					</CardHeader>
					<CardContent>
						<PerformanceMetrics />
					</CardContent>
				</Card>
			</div>
		</>
	);
};
