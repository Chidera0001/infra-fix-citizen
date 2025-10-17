import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface PhotoPreviewProps {
	capturedImage: string;
	onRetakePhoto: () => void;
}

export const PhotoPreview = ({ capturedImage, onRetakePhoto }: PhotoPreviewProps) => {
	return (
		<Card className="border-0 shadow-xl">
			<CardContent className="p-6">
				<div className="space-y-4">
					<div className="relative">
						<img
							src={capturedImage}
							alt="Captured photo"
							className="w-full h-auto rounded-lg"
						/>
					</div>
					<div className="flex gap-3 justify-center">
						<Button
							type="button"
							variant="outline"
							onClick={onRetakePhoto}
							className="flex items-center gap-2"
						>
							<RotateCcw className="h-4 w-4" />
							Retake Photo
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
