import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const ResolutionRateTrends = () => {
	const { data: monthlyTrends = [], isLoading: monthlyTrendsLoading } = useQuery({
		queryKey: ['monthly-resolution-trends'],
		queryFn: () => adminApi.getMonthlyResolutionTrends(),
	});

	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">Resolution Rate Trends</CardTitle>
				<CardDescription>Monthly resolution rates over time</CardDescription>
			</CardHeader>
			<CardContent>
				{monthlyTrendsLoading ? (
					<div className="h-[250px] flex items-center justify-center">
						<p className="text-gray-500">Loading resolution trends...</p>
					</div>
				) : monthlyTrends.length === 0 ? (
					<div className="h-[250px] flex items-center justify-center">
						<p className="text-gray-500">No resolution trend data available</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={monthlyTrends}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<XAxis dataKey="month" stroke="#6b7280" />
							<YAxis stroke="#6b7280" />
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#fff', 
									border: '1px solid #e5e7eb',
									borderRadius: '8px'
								}}
							/>
							<Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};
