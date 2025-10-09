import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
	myReportsCount: number;
	resolvedCount: number;
	inProgressCount: number;
	totalIssues: number;
}

export const QuickStats = ({ 
	myReportsCount, 
	resolvedCount, 
	inProgressCount, 
	totalIssues 
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
						Resolved
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{resolvedCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Community wide
					</p>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						In Progress
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{inProgressCount}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Being addressed
					</p>
				</CardContent>
			</Card>
			
			<Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
				<CardContent className="p-6 text-center">
					<p className="text-sm font-medium text-gray-600 mb-2">
						Community Impact
					</p>
					<p className="text-4xl font-normal text-gray-900 mb-2">
						{totalIssues}
					</p>
					<p className="text-xs text-green-600 font-medium">
						Total reports
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
