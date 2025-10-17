import { useState } from 'react';
import { CameraCapture } from '@/components/InstantReport/CameraCapture';

interface PhotoUploadSectionProps {
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
}

export function PhotoUploadSection({ photo, onPhotoChange }: PhotoUploadSectionProps) {
  const handleCameraCapture = (file: File) => {
    onPhotoChange(file);
  };

  const handleCancelCamera = () => {
    // Do nothing - let user stay in camera mode
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Take Photo</label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
        <CameraCapture 
          onPhotoCapture={handleCameraCapture}
          onCancel={handleCancelCamera}
        />
      </div>
      
      {/* Photo Status Indicator */}
      {photo && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700 font-medium">Photo attached: {photo.name}</p>
            <button
              type="button"
              onClick={() => onPhotoChange(null)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2 px-2 py-1 rounded text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
