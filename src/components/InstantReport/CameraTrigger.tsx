import { Button } from '@/components/ui/button';

interface CameraTriggerProps {
  hasCameraAPI: boolean;
  onStartCamera: () => void;
  onCameraFallback?: () => void;
  onCancel?: () => void;
  error: string | null;
}

export const CameraTrigger = ({
  hasCameraAPI,
  onStartCamera,
  onCameraFallback,
  onCancel,
  error,
}: CameraTriggerProps) => {
  return (
    <div className='space-y-6 text-center'>
      <div className='relative'>
        <div
          className='hover:shadow-3xl mx-auto flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-2xl transition-all duration-300 hover:scale-105'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (hasCameraAPI) {
              onStartCamera();
            } else if (onCameraFallback) {
              onCameraFallback();
            }
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <img
            src='/Assets/icons/camera.svg'
            alt='Camera'
            className='h-16 w-16 brightness-0 invert'
          />
        </div>
        {/* Pulse animation */}
        <div className='pointer-events-none absolute inset-0 mx-auto h-32 w-32 animate-ping rounded-full bg-green-400 opacity-20'></div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-gray-900'>Take a Photo</h3>
        <p className='text-sm text-gray-600'>
          {hasCameraAPI
            ? 'Click the camera to start capturing'
            : 'Click the camera to select a photo'}
        </p>
      </div>

      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      {onCancel && (
        <div className='flex justify-center'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
