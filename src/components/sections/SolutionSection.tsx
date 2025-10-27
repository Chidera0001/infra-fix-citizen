import React from 'react';
import { CheckCircle, ArrowRight, Shield, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const SolutionSection: React.FC = () => {
  const navigate = useNavigate();

  const handleExplorePlatform = () => {
    navigate('/auth');
  };

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

        {/* Main Content - Two Column Layout */}
        <div className='grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-5 lg:gap-16'>
          {/* Left Column - Text Content */}
          <div className='space-y-4 sm:space-y-6 lg:col-span-2'>
            {/* Digital Reporting Platform */}
            <div className='rounded-2xl border border-green-200/30 bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6'>
              {/* Icon at the top */}
              <div className='mb-4 flex justify-start'>
                <div className='rounded-xl bg-[#A6E6C1] p-2'>
                  <div
                    className="mask-[url('/Assets/icons/Shield.svg')] mask-no-repeat mask-center mask-contain h-6 w-6 bg-[#0A6E2A]"
                    style={{
                      WebkitMask:
                        "url('/Assets/icons/Shield.svg') no-repeat center / contain",
                    }}
                  />
                </div>
              </div>
              <h4 className='mb-3 text-left text-[14px] font-semibold text-gray-900 sm:mb-4'>
                Digital Reporting Platform
              </h4>
              <p className='mb-3 text-xs leading-relaxed text-black sm:mb-4 sm:text-sm'>
                Citizn provides an intuitive mobile and web platform where
                citizens can easily report infrastructure issues with photos,
                precise location data, and detailed descriptions.
              </p>
              <div className='space-y-2'>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Easy photo and location capture
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Real-time issue tracking
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Direct communication with authorities
                  </span>
                </div>
              </div>
            </div>

            {/* Efficient Resolution Process */}
            <div className='rounded-2xl border border-green-200/30 bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6'>
              {/* Icon at the top */}
              <div className='mb-4 flex justify-start'>
                <div className='rounded-xl bg-[#A6E6C1] p-2'>
                  <div
                    className="mask-[url('/Assets/icons/People.svg')] mask-no-repeat mask-center mask-contain h-6 w-6 bg-[#0A6E2A]"
                    style={{
                      WebkitMask:
                        "url('/Assets/icons/People.svg') no-repeat center / contain",
                    }}
                  />
                </div>
              </div>
              <h4 className='mb-3 text-left text-[14px] font-semibold text-gray-900 sm:mb-4'>
                Efficient Resolution Process
              </h4>
              <p className='mb-3 text-xs leading-relaxed text-black sm:mb-4 sm:text-sm'>
                Our platform streamlines the resolution process by connecting
                citizens directly with the right government departments for
                faster response times.
              </p>
              <div className='space-y-2'>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Direct routing to appropriate departments
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Progress tracking and updates
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2'></div>
                  <span className='text-xs text-black sm:text-sm'>
                    Accountability and transparency
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action - Left aligned */}
            <div className='pt-2 sm:pt-4'>
              <Button
                onClick={handleExplorePlatform}
                className='w-fit transform rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-[14px] text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-green-600 hover:to-green-700 hover:shadow-xl sm:text-base'
                size='lg'
              >
                Explore Our Platform
              </Button>
            </div>
          </div>

          {/* Right Column - Image Background */}
          <div className='relative lg:col-span-3'>
            <div className='relative h-[300px] w-full rounded-2xl shadow-xl sm:h-[400px] lg:h-[600px]'>
              {/* Background Image */}
              <img
                src='/Assets/Images/LoginSignUp.jpg'
                alt='Citizn platform interface and resolution process'
                className='h-full w-full object-contain'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
