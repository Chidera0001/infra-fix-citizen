import { useState, useRef, useEffect } from "react";

export const useCameraStream = () => {
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
	const videoRef = useRef<HTMLVideoElement>(null);

	// Check if device supports camera API
	const hasCameraAPI = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

	// Set video stream when camera becomes active and video ref is available
	useEffect(() => {
		if (isCameraActive && cameraStream && videoRef.current) {
			videoRef.current.srcObject = cameraStream;
			
			// Ensure video plays on desktop
			videoRef.current.onloadedmetadata = () => {
				videoRef.current?.play().catch(console.error);
			};
		}
	}, [isCameraActive, cameraStream]);

	// Start camera stream with specific facing mode
	const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
		try {
			setError(null);
			
			// Stop existing stream if any
			if (cameraStream) {
				cameraStream.getTracks().forEach(track => track.stop());
			}
			
			// Try different camera configurations for better desktop compatibility
			let stream;
			const constraints = [
				// First try: Requested facing mode with specific resolution
				{
					video: { 
						facingMode: facing,
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				},
				// Second try: Other facing mode with specific resolution
				{
					video: { 
						facingMode: facing === 'user' ? 'environment' : 'user',
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				},
				// Third try: Any camera without facingMode constraint (desktop fallback)
				{
					video: { 
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				},
				// Final fallback: Basic video constraint
				{
					video: true,
					audio: false
				}
			];

			for (let i = 0; i < constraints.length; i++) {
				try {
					stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
					// Try to detect which facing mode we got
					const track = stream.getVideoTracks()[0];
					const settings = track.getSettings();
					if (settings.facingMode) {
						setFacingMode(settings.facingMode as 'user' | 'environment');
					}
					break;
				} catch (constraintError) {
					continue;
				}
			}

			if (!stream) {
				throw new Error('No camera available with any constraint');
			}
			
			setCameraStream(stream);
			setIsCameraActive(true);
		} catch (err) {
			if (err instanceof Error) {
				if (err.name === 'NotAllowedError') {
					setError('Camera permission denied. Please allow camera access and try again.');
				} else if (err.name === 'NotFoundError') {
					setError('No camera found on this device.');
				} else if (err.name === 'NotSupportedError') {
					setError('Camera not supported on this device.');
				} else {
					setError(`Camera error: ${err.message}`);
				}
			} else {
				setError('Unable to access camera. Please check your device settings.');
			}
		}
	};

	// Switch between front and back camera
	const switchCamera = async () => {
		if (!isCameraActive) return;
		
		const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
		await startCamera(newFacingMode);
	};

	// Stop camera stream
	const stopCamera = () => {
		if (cameraStream) {
			cameraStream.getTracks().forEach(track => track.stop());
			setCameraStream(null);
			setIsCameraActive(false);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	return {
		cameraStream,
		isCameraActive,
		error,
		videoRef,
		hasCameraAPI,
		facingMode,
		startCamera,
		stopCamera,
		switchCamera
	};
};
