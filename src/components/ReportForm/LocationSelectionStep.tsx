import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSelectionStepProps {
	onGetCurrentLocation: () => void;
	onLocationFromMap: () => void;
	isGettingLocation: boolean;
	locationMethod: "current" | "map" | null;
	onNext: () => void;
}

const LocationSelectionStep = ({
	onGetCurrentLocation,
	onLocationFromMap,
	isGettingLocation,
	locationMethod,
	onNext,
}: LocationSelectionStepProps) => {
	return (
		<div className="space-y-6">
			<div className="text-center space-y-4">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-gray-900">
						How would you like to provide the location?
					</h3>
					<p className="text-gray-600">
						Choose the most convenient method for you
					</p>
				</div>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
					<Button
						type="button"
						onClick={onGetCurrentLocation}
						disabled={isGettingLocation}
						className="h-24 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700"
					>
						<MapPin className="h-8 w-8" />
						<span className="font-medium">
							{isGettingLocation ? "Getting Location..." : "Use Current Location"}
						</span>
					</Button>
					
					<Button
						type="button"
						onClick={onLocationFromMap}
						className="h-24 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700"
					>
						<MapPin className="h-8 w-8" />
						<span className="font-medium">Select from Map</span>
					</Button>
				</div>
				
				{locationMethod && (
					<div className="flex justify-center mt-6">
						<Button
							type="button"
							onClick={onNext}
							className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
						>
							Continue to Next Step
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default LocationSelectionStep;
