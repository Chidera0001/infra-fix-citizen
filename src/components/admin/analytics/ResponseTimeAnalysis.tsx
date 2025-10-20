import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const ResponseTimeAnalysis = () => {
	const { data: responseTimeData = [], isLoading: responseTimeLoading } = useQuery({
		queryKey: ['response-time-by-category'],
		queryFn: () => adminApi.getResponseTimeByCategory(),
	});

	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">Response Time Analysis</CardTitle>
				<CardDescription>Average time to first response by category</CardDescription>
			</CardHeader>
			<CardContent>
				{responseTimeLoading ? (
					<div className="h-[250px] flex items-center justify-center">
						<p className="text-gray-500">Loading response time data...</p>
					</div>
				) : responseTimeData.length === 0 ? (
					<div className="h-[250px] flex items-center justify-center">
						<p className="text-gray-500">No response time data available</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={responseTimeData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<XAxis dataKey="category" stroke="#6b7280" />
							<YAxis stroke="#6b7280" />
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#fff', 
									border: '1px solid #e5e7eb',
									borderRadius: '8px'
								}}
							/>
							<Bar dataKey="time" fill="#ef4444" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};
