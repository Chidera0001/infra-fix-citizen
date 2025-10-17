import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
	myReportsCount: number;
	myResolvedCount: number;
	myInProgressCount: number;
	myOpenCount: number;
}

export const QuickStats = ({ 
	myReportsCount, 
	myResolvedCount, 
	myInProgressCount, 
	myOpenCount 
}: QuickStatsProps) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						My Reports
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{myReportsCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Recent reports
					</p>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						My Resolved
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{myResolvedCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Issues resolved
					</p>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						In Progress
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{myInProgressCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Being addressed
					</p>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						Open Issues
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{myOpenCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Awaiting response
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
