import { useState, useRef, useEffect } from 'react';
import { useCameraStream } from './hooks/useCameraStream';
import { CameraInterface } from './CameraInterface';
import { PhotoPreview } from './PhotoPreview';

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

  // Handle camera stop and navigate back
  const handleStopCamera = () => {
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  // Capture photo from video stream (desktop)
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

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

  // Handle file input from mobile camera
  const handleCameraFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onPhotoCapture(file);
    }
    e.target.value = '';
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    if (hasCameraAPI) {
      startCamera();
    } else {
      // Mobile: trigger camera again
      fileInputRef.current?.click();
    }
  };

  // Mobile: trigger camera on button click
  const handleMobileCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-start camera on mount
  useEffect(() => {
    if (!capturedImage) {
      if (hasCameraAPI && !isCameraActive) {
        // Desktop: Start camera stream API
        startCamera();
      } else if (!hasCameraAPI && fileInputRef.current) {
        // Mobile: Try to auto-trigger file input
        // Add small delay to ensure DOM is fully ready
        const timer = setTimeout(() => {
          if (fileInputRef.current) {
            console.log('Attempting to trigger camera...');
            fileInputRef.current.click();
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [hasCameraAPI, isCameraActive, capturedImage, startCamera]);

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

  // Render camera interface (Desktop)
  if (isCameraActive) {
    return (
      <CameraInterface
        videoRef={videoRef}
        canvasRef={canvasRef}
        onCapturePhoto={capturePhoto}
        onStopCamera={handleStopCamera}
        onSwitchCamera={switchCamera}
      />
    );
  }

  // Show loading state while desktop camera is starting
  if (!error && hasCameraAPI && !isCameraActive) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4'>
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-green-200 border-t-green-600'></div>
        <p className='text-gray-600'>Starting camera...</p>
      </div>
    );
  }

  // Mobile: Show large tap-to-open button (auto-trigger often blocked by browsers)
  if (!hasCameraAPI) {
    return (
      <div className='fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
        {/* Large tap area - takes most of screen */}
        <button
          type='button'
          onClick={handleMobileCameraClick}
          className='flex w-full flex-1 flex-col items-center justify-center space-y-8 p-8 text-center focus:outline-none'
        >
          {/* Animated camera icon */}
          <div className='relative'>
            <div className='flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-2xl transition-transform active:scale-95'>
              <img
                src='/Assets/icons/camera.svg'
                alt='Camera'
                className='h-20 w-20 brightness-0 invert'
              />
            </div>
            <div className='pointer-events-none absolute inset-0 h-40 w-40 animate-ping rounded-full bg-green-400 opacity-20'></div>
          </div>

          {/* Visual cue */}
          <h2 className='rounded-full bg-green-100 px-6 py-2 text-sm font-medium text-green-700'>
            📸 Tap anywhere to continue
          </h2>
        </button>

        {/* Cancel button - below the tap message */}
        {onCancel && (
          <div className='pb-8'>
            <button
              type='button'
              onClick={onCancel}
              className='rounded-lg border border-gray-200 bg-white px-6 py-3 text-gray-700 shadow-lg hover:bg-gray-50'
            >
              Cancel
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          capture='environment'
          onChange={handleCameraFileInput}
          className='hidden'
        />
      </div>
    );
  }

  // Error state (Desktop)
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center'>
      <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
        <p className='text-sm text-red-600'>
          {error || 'Unable to access camera. Please check permissions.'}
        </p>
      </div>
      {onCancel && (
        <button
          type='button'
          onClick={onCancel}
          className='rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50'
        >
          Cancel
        </button>
      )}
    </div>
  );
};
