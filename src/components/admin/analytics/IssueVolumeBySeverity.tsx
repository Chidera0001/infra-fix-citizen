import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const IssueVolumeBySeverity = () => {
	const { data: severityData = [], isLoading: severityLoading } = useQuery({
		queryKey: ['issue-volume-by-severity'],
		queryFn: () => adminApi.getIssueVolumeBySeverity(),
	});

	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">Issue Volume</CardTitle>
				<CardDescription>Issues by severity level</CardDescription>
			</CardHeader>
			<CardContent>
				{severityLoading ? (
					<div className="h-[200px] flex items-center justify-center">
						<p className="text-gray-500">Loading severity data...</p>
					</div>
				) : severityData.length === 0 ? (
					<div className="h-[200px] flex items-center justify-center">
						<p className="text-gray-500">No severity data available</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={severityData}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{severityData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};
