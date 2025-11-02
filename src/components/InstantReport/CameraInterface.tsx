import { X, RotateCw } from 'lucide-react';

interface CameraInterfaceProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCapturePhoto: () => void;
  onStopCamera: () => void;
  onSwitchCamera: () => void;
}

export const CameraInterface = ({
  videoRef,
  canvasRef,
  onCapturePhoto,
  onStopCamera,
  onSwitchCamera,
}: CameraInterfaceProps) => {
  return (
    <div className='fixed inset-0 z-50 bg-black'>
      {/* Full screen video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className='h-full w-full object-cover'
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

      {/* Close button at the top right */}
      <button
        type='button'
        onClick={onStopCamera}
        className='absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/50 active:scale-95'
        aria-label='Close camera'
      >
        <X className='h-6 w-6' />
      </button>

      {/* Capture controls at the bottom */}
      <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6'>
        {/* Flip camera button */}
        <button
          type='button'
          onClick={onSwitchCamera}
          className='flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/50 active:scale-95'
          aria-label='Switch camera'
        >
          <RotateCw className='h-7 w-7' />
        </button>

        {/* Capture circle button */}
        <button
          type='button'
          onClick={onCapturePhoto}
          className='flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent shadow-lg transition-transform hover:scale-105 active:scale-95'
          aria-label='Capture photo'
        >
          <div className='h-16 w-16 rounded-full bg-white'></div>
        </button>
      </div>
    </div>
  );
};
