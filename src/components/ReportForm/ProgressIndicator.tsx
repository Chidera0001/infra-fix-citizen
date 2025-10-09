import { Camera, MapPin, Upload, CheckCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
	const getStepIcon = (step: number) => {
		switch (step) {
			case 1:
				return <Camera className="h-5 w-5" />;
			case 2:
				return <MapPin className="h-5 w-5" />;
			case 3:
				return <Upload className="h-5 w-5" />;
			case 4:
				return <CheckCircle className="h-5 w-5" />;
			default:
				return <Star className="h-5 w-5" />;
		}
	};

	const getStepTitle = (step: number) => {
		switch (step) {
			case 1:
				return "Issue Details";
			case 2:
				return "Select Location";
			case 3:
				return "Photos & Address";
			case 4:
				return "Review & Submit";
			default:
				return "Step";
		}
	};

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-normal text-gray-900">
					Report New Issue
				</h2>
				<Badge
					variant="secondary"
					className="bg-green-50 text-green-700 border-green-200"
				>
					Step {currentStep} of {totalSteps}
				</Badge>
			</div>
			<div className="relative">
				{/* Connecting lines */}
				<div className="absolute top-5 left-0 right-0 flex items-center justify-between px-5">
					{Array.from({ length: totalSteps - 1 }, (_, i) => (
						<div
							key={i}
							className={`flex-1 h-1 ${
								i + 1 < currentStep
									? "bg-green-500"
									: "bg-gray-200"
							}`}
						></div>
					))}
				</div>
				
				{/* Steps */}
				<div className="flex items-center justify-between">
					{Array.from({ length: totalSteps }, (_, i) => (
						<div key={i} className="flex flex-col items-center relative z-10">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center ${
									i + 1 < currentStep
										? "bg-green-500 text-white"
										: i + 1 === currentStep
										? "bg-green-100 text-green-600 border-2 border-green-500"
										: "bg-gray-100 text-gray-400"
								}`}
							>
								{i + 1 < currentStep ? (
									<CheckCircle className="h-5 w-5" />
								) : (
									getStepIcon(i + 1)
								)}
							</div>
							<span
								className={`text-xs font-medium mt-2 text-center hidden sm:block ${
									i + 1 === currentStep
										? "text-green-600"
										: "text-gray-500"
								}`}
							>
								{getStepTitle(i + 1)}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProgressIndicator;
