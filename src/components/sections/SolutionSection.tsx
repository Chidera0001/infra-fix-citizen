import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Shield, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const SolutionSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const cardContents = [
    {
      icon: "url('/Assets/icons/Shield.svg')",
      title: 'Digital Reporting Platform',
      description:
        'Citizn provides an intuitive mobile and web platform where citizens can easily report infrastructure issues with photos, precise location data, and detailed descriptions.',
      features: [
        'Easy photo and location capture',
        'Real-time issue tracking',
        'Direct communication with authorities',
      ],
    },
    {
      icon: "url('/Assets/icons/People.svg')",
      title: 'Efficient Resolution Process',
      description:
        'Our platform streamlines the resolution process by connecting citizens directly with the right government departments for faster response times.',
      features: [
        'Direct routing to appropriate departments',
        'Progress tracking and updates',
        'Accountability and transparency',
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % cardContents.length);
        setFade(true);
      }, 600); // Wait for fade out to complete
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [cardContents.length]);

  const handleExplorePlatform = () => {
    navigate('/auth');
  };

  const currentContent = cardContents[currentIndex];

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-24'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute left-10 top-20 h-32 w-32 rounded-full bg-green-300 blur-3xl'></div>
        <div className='absolute bottom-20 right-10 h-24 w-24 rounded-full bg-blue-300 blur-3xl'></div>
        <div className='absolute left-1/3 top-1/2 h-16 w-16 rounded-full bg-green-200 blur-2xl'></div>
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center sm:mb-16 lg:mb-20'>
          <Badge className='mb-6 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 sm:mb-8'>
            <div
              className="mask-[url('/Assets/icons/Tick.svg')] mask-no-repeat mask-center mask-contain h-4 w-4 bg-[#0A6E2A]"
              style={{
                WebkitMask:
                  "url('/Assets/icons/Tick.svg') no-repeat center / contain",
              }}
            />
            Our Solution
          </Badge>
          <h3 className='text-l mb-6 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
            Citizn: Bridging Citizens & Government
          </h3>
        </div>

        {/* Main Content - Video and Card Side by Side on Desktop */}
        <div className='grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[2fr_3fr] lg:items-stretch lg:gap-8'>
          {/* Single Card with Rotating Content */}
          <div className='relative order-2 flex w-full flex-col lg:order-1'>
            <div className='flex h-full w-full flex-col rounded-2xl border border-green-200/30 bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6'>
              <div
                className={`flex flex-1 flex-col transition-opacity duration-700 ease-in-out ${
                  fade ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Icon at the top */}
                <div className='mb-4 flex justify-start'>
                  <div className='rounded-xl bg-[#A6E6C1] p-2'>
                    <div
                      className='mask-no-repeat mask-center mask-contain h-6 w-6 bg-[#0A6E2A]'
                      style={{
                        mask: `${currentContent.icon} no-repeat center / contain`,
                        WebkitMask: `${currentContent.icon} no-repeat center / contain`,
                      }}
                    />
                  </div>
                </div>
                <h4 className='mb-3 text-left text-[14px] font-semibold text-gray-900 sm:mb-4'>
                  {currentContent.title}
                </h4>
                <p className='mb-3 text-xs leading-relaxed text-black sm:mb-4 sm:text-sm'>
                  {currentContent.description}
                </p>
                <div className='space-y-2'>
                  {currentContent.features.map((feature, index) => (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                      <span className='text-xs text-black sm:text-sm'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Button - Static (not affected by fade) */}
              <div className='mt-4 flex justify-start pt-4 sm:mt-6 sm:pt-6'>
                <Button
                  onClick={handleExplorePlatform}
                  className='w-fit transform rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-[14px] text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-green-600 hover:to-green-700 hover:shadow-xl sm:text-base'
                  size='lg'
                >
                  Explore Our Platform
                </Button>
              </div>
            </div>
          </div>

          {/* YouTube Video */}
          <div className='relative order-1 w-full lg:order-2'>
            <div className='relative h-full w-full overflow-hidden rounded-2xl shadow-xl lg:aspect-video'>
              {/* Responsive YouTube Video Embed */}
              <div className='relative aspect-video w-full lg:absolute lg:inset-0 lg:h-full'>
                <iframe
                  src='https://www.youtube.com/embed/EDwHl3e-CwU'
                  title='Citizn platform interface and resolution process'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='absolute inset-0 h-full w-full rounded-2xl'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
