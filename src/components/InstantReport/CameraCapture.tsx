import { useState, useRef, useEffect } from 'react';
import { useCameraStream } from './hooks/useCameraStream';
import { CameraInterface } from './CameraInterface';
import { PhotoPreview } from './PhotoPreview';
import { CameraTrigger } from './CameraTrigger';

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => void;
  onCancel?: () => void;
}

export const CameraCapture = ({
  onPhotoCapture,
  onCancel,
}: CameraCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    cameraStream,
    isCameraActive,
    error,
    videoRef,
    hasCameraAPI,
    startCamera,
    stopCamera,
    switchCamera,
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
    canvas.toBlob(
      blob => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          stopCamera();
          onPhotoCapture(file);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  // Handle file input (for camera capture - fallback when camera API not available)
  const handleCameraFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onPhotoCapture(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle gallery file input (for upload photo button - opens gallery)
  const handleGalleryFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onPhotoCapture(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    if (hasCameraAPI) {
      startCamera();
    }
  };

  // Upload photo handler - opens gallery (no capture attribute)
  const handleUploadPhoto = () => {
    galleryInputRef.current?.click();
  };

  // Camera file input handler - for camera icon fallback (with capture attribute)
  const handleCameraFallback = () => {
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
    return (
      <PhotoPreview capturedImage={capturedImage} onRetakePhoto={retakePhoto} />
    );
  }

  // Render camera interface
  if (isCameraActive) {
    return (
      <CameraInterface
        videoRef={videoRef}
        canvasRef={canvasRef}
        onCapturePhoto={capturePhoto}
        onStopCamera={stopCamera}
        onSwitchCamera={switchCamera}
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
        onCameraFallback={handleCameraFallback}
        onCancel={onCancel}
        error={error}
      />

      {/* Hidden file input for camera fallback (with capture - opens camera) */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleCameraFileInput}
        className='hidden'
      />

      {/* Hidden file input for gallery upload (without capture - opens gallery) */}
      <input
        ref={galleryInputRef}
        type='file'
        accept='image/*'
        onChange={handleGalleryFileInput}
        className='hidden'
      />
    </>
  );
};
