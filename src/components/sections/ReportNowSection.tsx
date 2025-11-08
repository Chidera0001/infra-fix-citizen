import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, MapPin, Clock, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnlineStatus } from '@/hooks/use-online-status';
import {
  useCreateOnlineIssue,
  useCreateOfflineIssue,
} from '@/hooks/use-separate-issues';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import ReportNowBackground from '@/components/backgrounds/ReportNowBackground';

const ReportNowSection = () => {
  const navigate = useNavigate();
  const { user, isOfflineMode } = useAuth();
  const { isOnline } = useOnlineStatus();

  // Use separate hooks for online/offline reporting
  const createOnlineIssue = useCreateOnlineIssue();
  const createOfflineIssue = useCreateOfflineIssue();

  const handleReportNow = () => {
    if (user) {
      navigate('/report-now');
    } else {
      navigate('/auth');
    }
  };

  const handleOfflineReport = () => {
    navigate('/offline-report');
  };

  const features = [
    {
      icon: MapPin,
      svgIcon: '/Assets/icons/Location.svg',
      title: 'Auto-detect Location',
      description: 'GPS data extracted from your photo',
    },
    {
      icon: Clock,
      svgIcon: '/Assets/icons/Clock.svg',
      title: 'Submit in Seconds',
      description: 'Report issues faster than ever',
    },
    {
      icon: Sparkles,
      svgIcon: '/Assets/icons/Shield.svg',
      title: 'AI-Verified Reports',
      description: 'Smart AI validates your submission',
    },
  ];

  return (
    <section className='relative overflow-hidden py-12 sm:py-16 lg:py-24'>
      {/* Custom Background Component */}
      <ReportNowBackground />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible delay={0.1}>
          <div className='mb-12 text-center sm:mb-16'>
            <Badge className='mb-4 gap-2 border-green-200 bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 sm:mb-6'>
              <Sparkles className='h-4 w-4 fill-green-700' />
              Instant Reporting
            </Badge>
            <div className='text-l mb-2 font-semibold text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl lg:text-3xl'>
              Report in Seconds, Verified by AI
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Central Radial Layout */}
        <div className='relative mx-auto max-w-4xl'>
          {/* Central Camera Visual */}
          <FadeInWhenVisible delay={0.2}>
            <div className='mb-16 flex justify-center'>
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

          {/* Feature Steps - Horizontal Flow with Dotted Lines */}
          <FadeInWhenVisible delay={0.4}>
            <div className='relative'>
              {/* Desktop: Horizontal layout with dotted connections */}
              <div className='mx-auto hidden max-w-4xl items-center justify-center space-x-8 md:flex'>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isLast = index === features.length - 1;

                  return (
                    <div key={index} className='flex items-center'>
                      {/* Feature Step */}
                      <div className='group flex flex-col items-center transition-all duration-300 hover:scale-105'>
                        {/* Step Badge */}
                        <div className='relative mb-4'>
                          <div className='flex h-24 w-24 items-center justify-center rounded-2xl border border-green-200 bg-white shadow-lg transition-all duration-300 group-hover:shadow-xl'>
                            <div className='rounded-xl bg-green-200 p-4 transition-colors group-hover:bg-green-200'>
                              {feature.svgIcon ? (
                                <img
                                  src={feature.svgIcon}
                                  alt={feature.title}
                                  className='h-8 w-8'
                                  style={{
                                    filter:
                                      'brightness(0) saturate(100%) invert(40%) sepia(76%) saturate(1339%) hue-rotate(90deg) brightness(95%) contrast(91%)',
                                  }}
                                />
                              ) : (
                                <Icon className='h-8 w-8 text-green-600' />
                              )}
                            </div>
                          </div>

                          {/* Step Number */}
                          <div className='absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow-lg'>
                            {index + 1}
                          </div>
                        </div>

                        {/* Feature Text */}
                        <div className='max-w-40 text-center'>
                          <h4 className='mb-2 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700'>
                            {feature.title}
                          </h4>
                          <p className='text-sm leading-relaxed text-gray-600'>
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Dotted Connection Line */}
                      {!isLast && (
                        <div className='mx-4 mb-[3rem] flex items-center'>
                          <div className='h-0.5 w-12 border-t-2 border-dotted border-green-400'></div>
                          <div className='mx-1 h-2 w-2 rounded-full bg-green-400'></div>
                          <div className='mx-1 h-2 w-2 rounded-full bg-green-400'></div>
                          <div className='h-0.5 w-12 border-t-2 border-dotted border-green-400'></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Horizontal scrollable cards */}
              <div className='md:hidden'>
                <div className='flex snap-x snap-mandatory space-x-8 overflow-x-auto px-8 pb-4'>
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isLast = index === features.length - 1;

                    return (
                      <div
                        key={index}
                        className='flex flex-shrink-0 snap-center items-center'
                      >
                        {/* Feature Card */}
                        <div className='group w-[320px] flex-shrink-0 rounded-2xl border border-green-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl'>
                          {/* Step Number */}
                          <div className='mb-4 flex justify-center'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white shadow-lg'>
                              {index + 1}
                            </div>
                          </div>

                          {/* Feature Text */}
                          <div className='text-center'>
                            <h4 className='mb-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-green-700'>
                              {feature.title}
                            </h4>
                            <p className='text-xs leading-relaxed text-gray-600'>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Progress Indicator */}
                <div className='mt-6 flex justify-center space-x-2'>
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className='h-2 w-2 rounded-full bg-green-400 opacity-60'
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Centered CTA Button */}
          <FadeInWhenVisible delay={0.6}>
            <div className='mt-12 flex flex-col items-center space-y-4'>
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
      </div>
    </section>
  );
};

export default ReportNowSection;
