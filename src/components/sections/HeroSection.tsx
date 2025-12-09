'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import { useRouter } from 'next/navigation';
import StatsSection from './StatsSection';

const ISSUE_TYPES = [
  'bad roads',
  'broken streetlights',
  'dump sites',
  'floods',
  'water supply issues',
  'bad traffic signals',
  'poor drainages',
  'erosion sites',
  'collapsed bridges',
  'open manholes',
  'unsafe crossings',
  'construction debris',
];

const HeroSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [issueIndex, setIssueIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssueIndex(prev => (prev + 1) % ISSUE_TYPES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/citizen');
    } else {
      router.push('/auth?mode=signup');
    }
  };

  return (
    <section className='relative flex min-h-screen flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-8 lg:px-8'>
      {/* Video Background */}
      <div className='absolute inset-0 h-full w-full'>
        <video
          src='/Assets/Videos/Hero-2.mp4'
          autoPlay
          loop
          muted
          playsInline
          className='h-full w-full object-cover'
        >
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better text readability */}
        <div className='absolute inset-0 bg-black/30'></div>
        {/* Subtle gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-green-700/30 via-green-600/20 to-blue-700/30'></div>
      </div>

      {/* Navbar positioned inside hero section */}
      <Navbar />

      <div className='relative z-10 mx-auto flex max-w-7xl flex-1 items-center'>
        {/* Single column centered layout for better video background experience */}
        <FadeInWhenVisible>
          <div className='mx-auto max-w-4xl px-4 text-center'>
            <h1 className='mb-4 mt-4 flex flex-col items-center gap-2 font-["Manrope"] text-3xl font-semibold leading-tight tracking-tight text-white drop-shadow-lg sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl'>
              <span className='relative inline-flex flex-col items-center'>
                Capture photos, Report{' '}
                <span className='sm:h-13 lg:h-18 relative inline-flex h-10 items-center justify-center overflow-hidden text-center md:h-16'>
                  <AnimatePresence mode='wait'>
                    <motion.span
                      key={ISSUE_TYPES[issueIndex]}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className='inline-block text-emerald-200'
                    >
                      {ISSUE_TYPES[issueIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className='pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-0 font-["Allura","cursive"] text-2xl text-emerald-200 drop-shadow-lg sm:text-3xl md:text-3xl lg:text-3xl'>
                  and
                </span>
              </span>
              <span className='mt-6 block bg-gradient-to-r from-green-300 via-emerald-300 to-green-500 bg-clip-text text-center font-bold text-transparent'>
                Monitor resolutions
              </span>
            </h1>
            <p className='hidden font-["Manrope"] text-base font-medium leading-relaxed text-white/95 drop-shadow-lg sm:mx-auto sm:mb-8 sm:block sm:max-w-3xl sm:text-lg md:text-xl'>
              Citizn helps you document infrastructure problems, notify the
              right agencies, and track progress until the work is done
            </p>
            {/* Call-to-Action Button */}
            <Button
              onClick={handleGetStarted}
              className='w-fit border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-2xl sm:w-auto sm:text-base'
              size='lg'
            >
              Start Reporting Now
            </Button>

            {/* Stats Section - Below button on mobile, separate on desktop */}
            <StatsSection />
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default HeroSection;
