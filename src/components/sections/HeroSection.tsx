import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import { useNavigate } from 'react-router-dom';
import StatsSection from './StatsSection';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/citizen');
    } else {
      navigate('/auth?mode=signup');
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
            <h1 className='mb-4 mt-4 text-3xl font-normal leading-tight tracking-tight text-white drop-shadow-lg sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl'>
              Empowering Nigerians to
              <span className='mt-1 block bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent'>
                Build Better Communities
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-base font-medium leading-relaxed text-white drop-shadow-lg sm:mb-8 sm:text-lg md:text-xl'>
              Your voice matters. Turn your observations into action and watch
              your community transform, one report at a time.
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
