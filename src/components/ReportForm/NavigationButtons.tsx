import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface NavigationButtonsProps {
	currentStep: number;
	totalSteps: number;
	onPrevious: () => void;
	onNext: () => void;
	onSubmit: (e: React.FormEvent) => void;
	isSubmitting: boolean;
}

const NavigationButtons = ({
	currentStep,
	totalSteps,
	onPrevious,
	onNext,
	onSubmit,
	isSubmitting,
}: NavigationButtonsProps) => {
	return (
		<div className="flex items-center justify-between pt-6">
			<Button
				type="button"
				variant="outline"
				onClick={onPrevious}
				disabled={currentStep === 1}
				className="border-green-300 text-green-700 hover:bg-green-50"
			>
				Previous
			</Button>

			{currentStep < totalSteps ? (
				<Button
					type="button"
					onClick={onNext}
					className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
				>
					Next Step
				</Button>
			) : (
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
					onClick={onSubmit}
				>
					{isSubmitting ? (
						<div className="flex items-center space-x-2">
							<LoadingSpinner size="sm" text="" />
							<span>
								Submitting Report...
							</span>
						</div>
					) : (
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-5 w-5" />
							<span>Submit Report</span>
						</div>
					)}
				</Button>
			)}
		</div>
	);
};

export default NavigationButtons;
