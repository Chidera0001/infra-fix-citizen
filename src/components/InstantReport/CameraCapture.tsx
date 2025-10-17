import { useState, useRef, useEffect } from "react";
import { useCameraStream } from "./hooks/useCameraStream";
import { CameraInterface } from "./CameraInterface";
import { PhotoPreview } from "./PhotoPreview";
import { CameraTrigger } from "./CameraTrigger";

interface CameraCaptureProps {
	onPhotoCapture: (file: File) => void;
	onCancel?: () => void;
}

export const CameraCapture = ({ onPhotoCapture, onCancel }: CameraCaptureProps) => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		cameraStream,
		isCameraActive,
		error,
		videoRef,
		hasCameraAPI,
		startCamera,
		stopCamera
	} = useCameraStream();

	// Capture photo from video stream
	const capturePhoto = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		if (!context) return;

		// Set canvas dimensions to match video
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		// Draw current video frame to canvas
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Convert canvas to blob
		canvas.toBlob((blob) => {
			if (blob) {
				const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
				const imageUrl = URL.createObjectURL(blob);
				setCapturedImage(imageUrl);
				stopCamera();
				onPhotoCapture(file);
			}
		}, 'image/jpeg', 0.95);
	};

	// Handle file input (fallback for mobile or no camera access)
	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setCapturedImage(imageUrl);
			onPhotoCapture(file);
		}
	};

	// Retake photo
	const retakePhoto = () => {
		setCapturedImage(null);
		if (hasCameraAPI) {
			startCamera();
		}
	};

	// Upload photo handler
	const handleUploadPhoto = () => {
		fileInputRef.current?.click();
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (capturedImage) {
				URL.revokeObjectURL(capturedImage);
			}
		};
	}, [capturedImage]);

	// Render captured photo preview
	if (capturedImage) {
		return <PhotoPreview capturedImage={capturedImage} onRetakePhoto={retakePhoto} />;
	}

	// Render camera interface
	if (isCameraActive) {
		return (
			<CameraInterface
				videoRef={videoRef}
				canvasRef={canvasRef}
				onCapturePhoto={capturePhoto}
				onStopCamera={stopCamera}
			/>
		);
	}

	// Render initial camera trigger
	return (
		<>
			<CameraTrigger
				hasCameraAPI={hasCameraAPI}
				onStartCamera={startCamera}
				onUploadPhoto={handleUploadPhoto}
				onCancel={onCancel}
				error={error}
			/>
			
			{/* Hidden file input for fallback */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleFileInput}
				className="hidden"
			/>
		</>
	);
};

