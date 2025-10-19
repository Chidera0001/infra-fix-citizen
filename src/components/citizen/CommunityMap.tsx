import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import InteractiveMap from "@/components/InteractiveMap";

interface CommunityMapProps {
	issues: Issue[];
	isLoading: boolean;
	onShowMap: () => void;
	onMapClick?: (coordinates: { lat: number; lng: number }) => void;
}

export const CommunityMap = ({ issues, isLoading, onShowMap, onMapClick }: CommunityMapProps) => {
	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-10">
			<CardHeader className="pb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className="text-xl font-normal flex items-center space-x-3">
							Community Issues Map
						</CardTitle>
						<CardDescription className="text-gray-600 text-m">
							Click anywhere on the map to report a new issue at that location.
						</CardDescription>
					</div>
					<div className="flex items-center space-x-3">
						<Button
							variant="outline"
							size="sm"
							onClick={onShowMap}
							className="bg-gradient-to-r from-green-400 to-green-300 border-green-200 shadow-lg text-white"
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
							<LoadingSpinner text="Loading map..." />
						</div>
					) : (
						<InteractiveMap
							issues={issues}
							isAdmin={false}
							className="h-full w-full"
							onLocationSelect={onMapClick}
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
