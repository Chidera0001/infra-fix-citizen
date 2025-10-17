import { useState } from "react";
import { CameraCapture, InstantReportForm } from "@/components/InstantReport";
import { getLocationFromPhoto, type LocationData } from "@/utils/exifExtractor";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CitizenSidebar } from "@/components/layout/CitizenSidebar";

const ReportNow = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
	const [locationData, setLocationData] = useState<LocationData | null>(null);
	const [isExtractingLocation, setIsExtractingLocation] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("report-now");

	const handlePhotoCapture = async (file: File) => {
		setCapturedPhoto(file);
		setIsExtractingLocation(true);

		try {
			// Extract location from photo EXIF
			const location = await getLocationFromPhoto(file);
			
			if (location) {
				setLocationData(location);
				toast({
					title: "Location Detected!",
					description: "Address automatically extracted from photo",
				});
			} else {
				setLocationData(null);
				toast({
					title: "No Location Data",
					description: "Please enter the address manually",
					variant: "default"
				});
			}
		} catch (error) {
			console.error("Error extracting location:", error);
			setLocationData(null);
			toast({
				title: "Location Extraction Failed",
				description: "Please enter the address manually",
				variant: "default"
			});
		} finally {
			setIsExtractingLocation(false);
		}
	};

	const handleRetake = () => {
		if (capturedPhoto) {
			URL.revokeObjectURL(URL.createObjectURL(capturedPhoto));
		}
		setCapturedPhoto(null);
		setLocationData(null);
	};

	const handleBack = () => {
		navigate("/citizen");
	};

	const handleTabChange = (tab: "dashboard" | "reports" | "map") => {
		setActiveTab(tab);
		// Navigate to the citizen dashboard with the selected tab
		navigate(`/citizen?tab=${tab}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex">
			{/* Sidebar */}
			<CitizenSidebar
				activeTab="report-now"
				onTabChange={handleTabChange}
			/>

			{/* Main Content Area */}
			<div className="flex-1">
				{/* Header */}
				{/* <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-green-200/50 sticky top-0 z-40">
					<div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
						<div className="flex items-center gap-4 justify-around">
							<div className="flex-1">
								<div className="flex items-center gap-3">
									<div>
										<h1 className="text-l sm:text-xl font-bold text-gray-900">
											Instant Report
										</h1>
										<p className="text-sm text-gray-600">
											Snap, Report, Done - In seconds
										</p>
									</div>
								</div>
							</div>
							<Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
								<Zap className="h-3 w-3 mr-1" />
								Quick Action
							</Badge>
						</div>
					</div>
				</header> */}

				{/* Main Content */}
				<main className="px-4 sm:px-6 lg:px-8 py-8">
					{isExtractingLocation ? (
						<div className="max-w-2xl mx-auto">
							<div className="bg-white rounded-2xl shadow-lg border border-green-200/30 p-8 sm:p-12">
								<div className="text-center space-y-6">
									<div className="relative">
										<div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
											<LoadingSpinner size="lg" text="" />
										</div>
										<div className="absolute inset-0 w-20 h-20 mx-auto bg-green-200 rounded-full animate-ping opacity-20"></div>
									</div>
									<div>
										<h3 className="text-xl font-semibold text-gray-900 mb-2">
											Detecting Location...
										</h3>
										<p className="text-gray-600">
											Extracting GPS data from your photo
										</p>
									</div>
									<div className="bg-green-50 rounded-lg p-4">
										<p className="text-sm text-green-700">
											📍 This usually takes just a few seconds
										</p>
									</div>
								</div>
							</div>
						</div>
					) : capturedPhoto ? (
						<div className="max-w-4xl mx-auto">
							<InstantReportForm
								photo={capturedPhoto}
								initialLocation={locationData}
								onRetake={handleRetake}
							/>
						</div>
					) : (
						<div className="max-w-4xl mx-auto space-y-8">
							{/* Hero Section */}
							<div className="text-center space-y-6 mt-4">
								<div className="space-y-4">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
										Take a Photo of the Issue
									</h2>
									<p className="text-sm text-black max-w-2xl mx-auto">
										Capture the infrastructure problem and we'll automatically detect the location
										from your photo's GPS data
									</p>
								</div>

								{/* Feature Pills */}
								<div className="flex flex-wrap justify-center gap-3">
									<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-sm">
										<MapPin className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium text-black">Auto-detect Location</span>
									</div>
									<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-sm">
										<Clock className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium text-black">Submit in Seconds</span>
									</div>
									<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-sm">
										<Zap className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium text-black">No Complex Forms</span>
									</div>
								</div>
							</div>

							{/* Camera Capture Card */}
							<div className="bg-white rounded-2xl shadow-lg border border-green-200/30 overflow-hidden">
								<div className="p-6 sm:p-8">
									<CameraCapture
										onPhotoCapture={handlePhotoCapture}
										onCancel={handleBack}
									/>
								</div>
							</div>

							{/* Alternative Option */}
							<div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
								<p className="text-gray-600 mb-3">
									Need more details or want to provide additional information?
								</p>
								<Button
									variant="outline"
									onClick={() => navigate("/citizen")}
									className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
								>
									Use Full Report Form
								</Button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default ReportNow;

