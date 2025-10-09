import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InteractiveMap from "@/components/InteractiveMap";
import { reverseGeocode } from "@/utils/geocoding";

interface LocationSelectionMapProps {
	onLocationSelected: (coordinates: { lat: number; lng: number }, address: string) => void;
	initialLocation?: { lat: number; lng: number };
}

const LocationSelectionMap = ({
	onLocationSelected,
	initialLocation = { lat: 6.5244, lng: 3.3792 }, // Default Lagos coordinates
}: LocationSelectionMapProps) => {
	const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<string>("");
	const [isGettingAddress, setIsGettingAddress] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		// Set initial location if provided
		if (initialLocation) {
			setSelectedLocation(initialLocation);
		}
	}, [initialLocation]);

	const handleMapClick = async (coordinates: { lat: number; lng: number }) => {
		setSelectedLocation(coordinates);
		setIsGettingAddress(true);

		try {
			const address = await reverseGeocode(coordinates.lat, coordinates.lng);
			setSelectedAddress(address);
			
			toast({
				title: "Location selected",
				description: `Found: ${address}`,
			});
		} catch (error) {
			setSelectedAddress(`${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`);
			toast({
				title: "Location selected",
				description: "Address lookup failed, using coordinates",
				variant: "destructive",
			});
		} finally {
			setIsGettingAddress(false);
		}
	};

	const handleConfirmLocation = () => {
		if (selectedLocation) {
			onLocationSelected(selectedLocation, selectedAddress);
		}
	};

	return (
		<div className="h-screen w-full flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b flex-shrink-0">
				<div className="px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-semibold text-gray-900">
								Select Location on Map
							</h1>
							<p className="text-sm text-gray-600">
								Click anywhere on the map to select the issue location
							</p>
						</div>
						
						{selectedLocation && (
							<Button
								onClick={handleConfirmLocation}
								className="bg-green-600 hover:bg-green-700 text-white"
							>
								<Check className="h-4 w-4 mr-2" />
								Confirm Location
							</Button>
						)}
					</div>
				</div>
			</header>

			{/* Map Container */}
			<div className="flex-1 w-full relative">
				<InteractiveMap
					issues={[]} // No issues to display, just for location selection
					isAdmin={false}
					className="h-full w-full"
					onLocationSelect={handleMapClick}
					showLocationSelector={true}
					selectedLocation={selectedLocation}
				/>
				
				{/* Location Info Overlay */}
				{selectedLocation && (
					<div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0">
								<MapPin className="h-5 w-5 text-green-600" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-sm font-medium text-gray-900">
									Selected Location
								</h3>
								<p className="text-sm text-gray-600 mt-1">
									{isGettingAddress ? (
										<span className="text-blue-600">Getting address...</span>
									) : (
										selectedAddress || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
									)}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LocationSelectionMap;
