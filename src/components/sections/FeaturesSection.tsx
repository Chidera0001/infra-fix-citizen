import { Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const FeaturesSection = () => {
  return (
    <section className='bg-white/60 py-12 backdrop-blur-sm sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible>
          <div className='mb-12 text-center sm:mb-16 lg:mb-20'>
            <Badge className='mb-6 gap-2 border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 sm:mb-8'>
              <div
                className="mask-[url('/Assets/icons/info.svg')] mask-no-repeat mask-center mask-contain h-4 w-4 bg-[#0A6E2A]"
                style={{
                  WebkitMask:
                    "url('/Assets/icons/info.svg') no-repeat center / contain",
                }}
              />
              How Citizn Works
            </Badge>
            <h3 className='text-l mb-4 font-semibold text-gray-900 sm:mb-6 sm:text-2xl md:text-3xl lg:mb-8 lg:text-4xl'>
              Simple, Effective, Transparent
            </h3>
          </div>
        </FadeInWhenVisible>

        <div className='grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3 lg:gap-12'>
          <FadeInWhenVisible delay={0.2}>
            <div className='group text-center'>
              <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-green-400 to-green-500 p-3 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:mb-8 sm:h-24 sm:w-24'>
                <div
                  className="mask-[url('/Assets/icons/camera.svg')] mask-no-repeat mask-center mask-contain h-8 w-8 bg-white"
                  style={{
                    WebkitMask:
                      "url('/Assets/icons/camera.svg') no-repeat center / contain",
                  }}
                />
              </div>
              <h4 className='mb-3 text-[18px] font-semibold text-gray-900 sm:mb-4'>
                Report
              </h4>
              <p className='px-4 text-xs leading-relaxed text-black sm:text-sm'>
                See an issue? Snap a photo, send it in.
              </p>
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.4}>
            <div className='group text-center'>
              <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-green-600 p-6 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:mb-8 sm:h-24 sm:w-24 sm:p-8'>
                <div
                  className="mask-[url('/Assets/icons/Alert-triangle.svg')] mask-no-repeat mask-center mask-contain h-8 w-8 bg-white"
                  style={{
                    WebkitMask:
                      "url('/Assets/icons/Alert-triangle.svg') no-repeat center / contain",
                  }}
                />
              </div>
              <h4 className='mb-3 text-[18px] font-semibold text-gray-900 sm:mb-4'>
                Track
              </h4>
              <p className='px-4 text-xs leading-relaxed text-black sm:text-sm'>
                Watch status updates roll in as agencies act.
              </p>
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.6}>
            <div className='group text-center'>
              <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:mb-8 sm:h-24 sm:w-24 sm:p-8'>
                <div
                  className="mask-[url('/Assets/icons/Tick.svg')] mask-no-repeat mask-center mask-contain h-8 w-8 bg-white"
                  style={{
                    WebkitMask:
                      "url('/Assets/icons/Tick.svg') no-repeat center / contain",
                  }}
                />
              </div>
              <h4 className='mb-3 text-[18px] font-semibold text-gray-900 sm:mb-4'>
                Resolve
              </h4>
              <p className='px-4 text-xs leading-relaxed text-black sm:text-sm'>
                Get the fix confirmation.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
