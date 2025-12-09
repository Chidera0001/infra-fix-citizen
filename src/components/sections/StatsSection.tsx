'use client';

import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import CountUp from '@/components/ui/CountUp';
import { useStats } from '@/hooks/use-stats';
import { Skeleton } from '@/components/ui/skeleton';

const StatsSection = () => {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <FadeInWhenVisible delay={0.2}>
        <div className='mt-8 px-4 sm:mt-16'>
          <div className='mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6'>
            {/* Loading skeletons */}
            <FadeInWhenVisible delay={0.3}>
              <div className='rounded-2xl border border-green-200/50 bg-white/70 p-4 shadow-xl backdrop-blur-sm sm:p-6'>
                <Skeleton className='mx-auto mb-2 h-8 w-20 sm:h-12' />
                <Skeleton className='mx-auto h-4 w-24' />
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className='rounded-2xl border border-green-200/50 bg-white/70 p-4 shadow-xl backdrop-blur-sm sm:p-6'>
                <Skeleton className='mx-auto mb-2 h-8 w-20 sm:h-12' />
                <Skeleton className='mx-auto h-4 w-24' />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </FadeInWhenVisible>
    );
  }

  if (error) {
    // Stats loading error
    // Fallback to default values if there's an error
  }

  return (
    <FadeInWhenVisible delay={0.2}>
      <div className='mt-8 px-4 sm:mt-16'>
        <div className='mx-auto grid max-w-xl grid-cols-2 gap-4 sm:gap-6'>
          {/* First two cards */}
          <div className='contents'>
            <FadeInWhenVisible delay={0.3}>
              <div className='transform rounded-2xl border border-none p-4 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-6'>
                <div className='mb-3 flex items-center justify-center sm:mb-4'>
                  <div className='rounded-xl bg-[#A6E6C1] p-2 sm:p-3'>
                    <div
                      className="mask-[url('/Assets/icons/Tick.svg')] mask-no-repeat mask-center mask-contain h-6 w-6 bg-[#0A6E2A] sm:h-8 sm:w-8"
                      style={{
                        WebkitMask:
                          "url('/Assets/icons/Tick.svg') no-repeat center / contain",
                      }}
                    />
                  </div>
                </div>
                <h3 className='mb-2 text-center text-xl font-normal text-white sm:text-3xl'>
                  <CountUp
                    end={stats?.totalIssues || 0}
                    duration={2000}
                    className='text-xl font-bold sm:text-3xl'
                  />
                </h3>
                <p className='text-center text-sm font-semibold text-white sm:text-base'>
                  Issues reported
                </p>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className='transform rounded-2xl border border-none p-4 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-6'>
                <div className='mb-3 flex items-center justify-center sm:mb-4'>
                  <div className='rounded-xl bg-[#A6E6C1] p-2 sm:p-3'>
                    <div
                      className="mask-[url('/Assets/icons/People.svg')] mask-no-repeat mask-center mask-contain h-6 w-6 bg-[#0A6E2A] sm:h-8 sm:w-8"
                      style={{
                        WebkitMask:
                          "url('/Assets/icons/People.svg') no-repeat center / contain",
                      }}
                    />
                  </div>
                </div>
                <h3 className='mb-2 text-center text-xl font-normal text-white sm:text-3xl'>
                  <CountUp
                    end={stats?.activeCitizens || 0}
                    duration={2000}
                    className='text-xl font-bold sm:text-3xl'
                  />
                </h3>
                <p className='text-center text-sm font-semibold text-white sm:text-base'>
                  Active Citizens
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

export default StatsSection;
