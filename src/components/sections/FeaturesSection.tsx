'use client';

import { Camera, AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOnlineStatus } from '@/hooks/use-online-status';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import ReportNowBackground from '@/components/backgrounds/ReportNowBackground';

const FeaturesSection = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isOnline } = useOnlineStatus();

  const handleReportNow = () => {
    if (user) {
      router.push('/report-now');
    } else {
      router.push('/auth');
    }
  };

  const handleOfflineReport = () => {
    router.push('/offline-report');
  };

  return (
    <section className='relative overflow-hidden py-12 sm:py-16 lg:py-24'>
      {/* Custom Background Component */}
      <ReportNowBackground />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
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

        {/* Central Camera Visual */}
        <FadeInWhenVisible delay={0.1}>
          <div className='mb-16 flex justify-center sm:mb-20 lg:mb-24'>
            <div className='relative'>
              {/* Animated pulse rings - Always green */}
              <div className='absolute inset-0 scale-150 animate-ping rounded-full bg-green-400 opacity-20'></div>
              <div className='absolute inset-0 scale-125 animate-pulse rounded-full bg-green-300 opacity-30'></div>

              {/* Camera Icon Container - Always green */}
              <div
                className='hover:shadow-3xl relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-2xl transition-all duration-500 hover:scale-105 sm:h-48 sm:w-48 lg:h-56 lg:w-56'
                onClick={isOnline ? handleReportNow : handleOfflineReport}
              >
                <img
                  src='/Assets/icons/camera.svg'
                  alt='Camera'
                  className='h-20 w-20 brightness-0 invert sm:h-24 sm:w-24 lg:h-28 lg:w-28'
                />
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Report, Track, Resolve Steps */}
        <FadeInWhenVisible delay={0.4}>
          <div className='relative'>
            {/* Desktop: Horizontal layout with dotted connections */}
            <div className='mx-auto hidden max-w-4xl items-center justify-center space-x-4 md:flex lg:space-x-8'>
              {[
                {
                  icon: 'camera',
                  title: 'Report',
                  description: 'See an issue? Snap a photo, send it in.',
                  gradient: 'from-green-400 to-green-500',
                },
                {
                  icon: 'Alert-triangle',
                  title: 'Track',
                  description: 'Watch status updates roll in as agencies act.',
                  gradient: 'from-green-500 to-green-600',
                },
                {
                  icon: 'Tick',
                  title: 'Confirm',
                  description: 'Get the fix confirmation.',
                  gradient: 'from-green-600 to-green-700',
                },
              ].map((feature, index) => {
                const isLast = index === 2;

                return (
                  <div key={index} className='flex items-center'>
                    {/* Feature Step */}
                    <div className='group flex flex-col items-center transition-all duration-300 hover:scale-105'>
                      {/* Icon Container */}
                      <div className='relative mb-4'>
                        <div
                          className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r ${feature.gradient} p-3 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24 sm:p-6`}
                        >
                          <div
                            className='mask-no-repeat mask-center mask-contain h-8 w-8 bg-white'
                            style={{
                              mask: `url('/Assets/icons/${feature.icon}.svg') no-repeat center / contain`,
                              WebkitMask: `url('/Assets/icons/${feature.icon}.svg') no-repeat center / contain`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Feature Text */}
                      <div className='max-w-40 text-center'>
                        <h4 className='mb-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-green-700 sm:mb-3 sm:text-[18px]'>
                          {feature.title}
                        </h4>
                        <p className='text-xs leading-relaxed text-black sm:text-sm'>
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Dotted Connection Line */}
                    {!isLast && (
                      <div className='mx-2 mb-[3rem] flex items-center lg:mx-4'>
                        <div className='h-0.5 w-8 border-t-2 border-dotted border-green-400 lg:w-12'></div>
                        <div className='mx-1 h-2 w-2 rounded-full bg-green-400'></div>
                        <div className='mx-1 h-2 w-2 rounded-full bg-green-400'></div>
                        <div className='h-0.5 w-8 border-t-2 border-dotted border-green-400 lg:w-12'></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile/Small screens: Horizontal layout with dotted connections */}
            <div className='mx-auto flex max-w-4xl items-center justify-center space-x-2 sm:space-x-4 md:hidden'>
              {[
                {
                  icon: 'camera',
                  title: 'Report',
                  description: 'See an issue? Snap a photo, send it in.',
                  gradient: 'from-green-400 to-green-500',
                },
                {
                  icon: 'Alert-triangle',
                  title: 'Track',
                  description: 'Watch status updates roll in as agencies act.',
                  gradient: 'from-green-500 to-green-600',
                },
                {
                  icon: 'Tick',
                  title: 'Confirm',
                  description: 'Get the fix confirmation.',
                  gradient: 'from-green-600 to-green-700',
                },
              ].map((feature, index) => {
                const isLast = index === 2;

                return (
                  <div key={index} className='flex items-center'>
                    {/* Feature Step */}
                    <div className='group flex flex-col items-center transition-all duration-300'>
                      {/* Icon Container */}
                      <div className='relative mb-3'>
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} p-2 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 sm:p-3`}
                        >
                          <div
                            className='mask-no-repeat mask-center mask-contain h-6 w-6 bg-white sm:h-7 sm:w-7'
                            style={{
                              mask: `url('/Assets/icons/${feature.icon}.svg') no-repeat center / contain`,
                              WebkitMask: `url('/Assets/icons/${feature.icon}.svg') no-repeat center / contain`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Feature Text */}
                      <div className='max-w-24 text-center sm:max-w-32'>
                        <h4 className='mb-1 text-xs font-semibold text-gray-900 transition-colors group-hover:text-green-700 sm:mb-2 sm:text-sm'>
                          {feature.title}
                        </h4>
                        <p className='text-[10px] leading-tight text-black sm:text-xs'>
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Dotted Connection Line */}
                    {!isLast && (
                      <div className='mx-1 mb-[2.5rem] flex items-center sm:mx-2'>
                        <div className='h-0.5 w-4 border-t-2 border-dotted border-green-400 sm:w-6'></div>
                        <div className='mx-0.5 h-1.5 w-1.5 rounded-full bg-green-400 sm:mx-1 sm:h-2 sm:w-2'></div>
                        <div className='mx-0.5 h-1.5 w-1.5 rounded-full bg-green-400 sm:mx-1 sm:h-2 sm:w-2'></div>
                        <div className='h-0.5 w-4 border-t-2 border-dotted border-green-400 sm:w-6'></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Centered CTA Button - Below Report, Track, Resolve */}
        <FadeInWhenVisible delay={1.0}>
          <div className='mt-12 flex flex-col items-center space-y-4 sm:mt-16'>
            {/* Show appropriate button based on online status */}
            {isOnline ? (
              <Button
                onClick={handleReportNow}
                className='rounded-2xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-2xl'
                size='lg'
              >
                <img
                  src='/Assets/icons/camera.svg'
                  alt='Camera'
                  className='mr-2 h-4 w-4 brightness-0 invert'
                />
                Report Now
              </Button>
            ) : (
              <Button
                onClick={handleOfflineReport}
                variant='outline'
                className='rounded-2xl border-orange-300 px-6 py-5 text-base font-bold text-orange-700 shadow-lg transition-all duration-300 hover:scale-105 hover:border-orange-400 hover:bg-orange-50 hover:shadow-xl'
                size='lg'
              >
                <WifiOff className='mr-2 h-4 w-4' />
                Report Offline
              </Button>
            )}
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default FeaturesSection;
