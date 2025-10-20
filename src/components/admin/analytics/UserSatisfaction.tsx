import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

export const UserSatisfaction = () => {
	const { data: satisfactionData, isLoading: satisfactionLoading } = useQuery({
		queryKey: ['user-satisfaction-breakdown'],
		queryFn: () => adminApi.getUserSatisfactionBreakdown(),
	});

	return (
		<Card className="bg-white border-0 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-normal text-gray-900">User Satisfaction</CardTitle>
				<CardDescription>Community feedback trends</CardDescription>
			</CardHeader>
			<CardContent>
				{satisfactionLoading ? (
					<div className="h-[200px] flex items-center justify-center">
						<p className="text-gray-500">Loading satisfaction data...</p>
					</div>
				) : !satisfactionData ? (
					<div className="h-[200px] flex items-center justify-center">
						<p className="text-gray-500">No satisfaction data available</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Overall Rating</span>
							<span className="text-xl font-normal text-green-600">{satisfactionData.overallRating}/5</span>
						</div>
						{satisfactionData.breakdown.map((item, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>{item.label}</span>
									<span>{item.percentage}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div 
										className="h-2 rounded-full" 
										style={{ 
											width: `${item.percentage}%`,
											backgroundColor: item.color
										}}
									></div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
