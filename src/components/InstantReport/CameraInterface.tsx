import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X } from "lucide-react";

interface CameraInterfaceProps {
	videoRef: React.RefObject<HTMLVideoElement>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	onCapturePhoto: () => void;
	onStopCamera: () => void;
}

export const CameraInterface = ({ 
	videoRef, 
	canvasRef, 
	onCapturePhoto, 
	onStopCamera 
}: CameraInterfaceProps) => {
	return (
		<Card className="border-0 shadow-xl">
			<CardContent className="p-6">
				<div className="space-y-4">
					<div className="relative bg-black rounded-lg overflow-hidden">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-64 object-cover"
							onLoadedMetadata={() => {
								if (videoRef.current) {
									videoRef.current.play().catch(console.error);
								}
							}}
							onCanPlay={() => {
								// Video is ready to play
							}}
							onError={(e) => {
								console.error('Video error:', e);
							}}
						/>
						<canvas ref={canvasRef} className="hidden" />
					</div>
					<div className="flex gap-3 justify-center">
						<Button
							type="button"
							variant="outline"
							onClick={onStopCamera}
							className="flex items-center gap-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
						>
							<X className="h-4 w-4" />
							Cancel
						</Button>
						<Button
							type="button"
							onClick={onCapturePhoto}
							className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
						>
							<Camera className="h-4 w-4 mr-2" />
							Capture Photo
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
