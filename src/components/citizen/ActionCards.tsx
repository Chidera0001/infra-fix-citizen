import { Card, CardContent } from "@/components/ui/card";

interface ActionCardsProps {
	onReportIssue: () => void;
	onExploreMap: () => void;
	onViewAnalytics: () => void;
}

export const ActionCards = ({ 
	onReportIssue, 
	onExploreMap, 
	onViewAnalytics 
}: ActionCardsProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
			<Card
				className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden"
				onClick={onReportIssue}
			>
				<CardContent className="p-8 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
						<img src="/Assets/icons/Plus.svg" alt="Plus" className="h-10 w-10 brightness-0 invert" />
					</div>
					<h3 className="text-xl font-normal text-gray-900 mb-2">
						Report New Issue
					</h3>
					<p className="text-sm text-gray-600">
						Report infrastructure problems in your community
					</p>
				</CardContent>
			</Card>
			
			<Card
				className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden"
				onClick={onExploreMap}
			>
				<CardContent className="p-8 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
						<img src="/Assets/icons/Location.svg" alt="Location" className="h-10 w-10 brightness-0 invert" />
					</div>
					<h3 className="text-xl font-normal text-gray-900 mb-2">
						Explore Map
					</h3>
					<p className="text-sm text-gray-600">
						View all reported issues on an interactive map
					</p>
				</CardContent>
			</Card>
			
			<Card 
				className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl overflow-hidden"
				onClick={onViewAnalytics}
			>
				<CardContent className="p-8 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
						<img src="/Assets/icons/Analytics.svg" alt="Analytics" className="h-10 w-10 brightness-0 invert" />
					</div>
					<h3 className="text-xl font-normal text-gray-900 mb-2">
						View Analytics
					</h3>
					<p className="text-sm text-gray-600">
						Track your community impact and statistics
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
