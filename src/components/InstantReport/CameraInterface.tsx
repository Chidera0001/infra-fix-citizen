import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

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
  onStopCamera,
}: CameraInterfaceProps) => {
  return (
    <div className='space-y-4'>
      <div className='relative overflow-hidden rounded-lg bg-black'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='h-64 w-full object-cover'
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          }}
          onCanPlay={() => {
            // Video is ready to play
          }}
          onError={e => {
            console.error('Video error:', e);
          }}
        />
        <canvas ref={canvasRef} className='hidden' />
      </div>
      <div className='flex justify-center gap-3'>
        <Button
          type='button'
          variant='outline'
          onClick={onStopCamera}
          className='flex items-center gap-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        >
          <X className='h-4 w-4' />
          Cancel
        </Button>
        <Button
          type='button'
          onClick={onCapturePhoto}
          className='bg-gradient-to-r from-green-600 to-green-700 shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl'
        >
          <Camera className='mr-2 h-4 w-4' />
          Capture Photo
        </Button>
      </div>
    </div>
  );
};
