import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import InteractiveMapV2 from "@/components/InteractiveMapV2";
import type { Issue } from "@/lib/supabase-api";

interface CommunityMapProps {
	issues: Issue[];
	isLoading: boolean;
	onShowMap: () => void;
}

export const CommunityMap = ({ issues, isLoading, onShowMap }: CommunityMapProps) => {
	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-10">
			<CardHeader className="pb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className="text-xl font-normal flex items-center space-x-3">
							Community Issues Map
						</CardTitle>
						<CardDescription className="text-gray-600 text-m">
							See all reported issues in your area. Click
							on any location to report a new issue.
						</CardDescription>
					</div>
					<div className="flex items-center space-x-3">
						<Button
							variant="outline"
							size="sm"
							onClick={onShowMap}
							className="border-green-300 text-green-700 hover:bg-green-50"
						>
							<MapPin className="h-4 w-4 mr-2" />
							Full Map View
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div
					className="h-96 rounded-2xl overflow-hidden"
					style={{ width: "100%", height: "100%" }}
				>
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<p className="text-gray-500">Loading map...</p>
						</div>
					) : (
						<InteractiveMapV2
							issues={issues}
							isAdmin={false}
							className="h-full w-full"
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
