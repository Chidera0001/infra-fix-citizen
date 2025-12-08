import React from 'react';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const ProblemStatementSection: React.FC = () => {
  return (
    <section className='pt-12 sm:pt-16 lg:pt-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible>
          {/* Header */}
          <div className='mb-8 flex items-center gap-3 sm:mb-10 lg:mb-12'>
            <div className='h-4 w-4 rounded-full bg-green-700 sm:h-5 sm:w-5'></div>
            <h2 className='text-xl font-bold tracking-wide text-gray-900 sm:text-2xl'>
              The Problem
            </h2>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          {/* Problem Cards Container */}
          <div className='flex flex-col overflow-hidden rounded-3xl lg:flex-row'>
            {/* Dark Green Section - $8 Billion Annual Waste */}
            <div className='flex flex-1 flex-col justify-center bg-[#1B3B36] p-8 text-white sm:p-10 lg:py-16'>
              <h3 className='mb-4 text-2xl font-medium sm:text-3xl'>
                $8 Billion Waste
              </h3>
              <p className='text-lg leading-relaxed text-gray-200 sm:text-xl'>
                Every year, urban flooding and waste mismanagement cause over $8
                billion in economic losses across African cities
              </p>
            </div>

            {/* Light Green Section - Infrastructure Neglect */}
            <div className='flex flex-1 flex-col justify-center bg-[#95E68C] p-8 text-gray-900 sm:p-10 lg:py-16'>
              <h3 className='mb-4 text-2xl font-medium sm:text-3xl'>
                Infrastructure Neglect
              </h3>
              <p className='text-lg leading-relaxed text-gray-800 sm:text-xl'>
                Blocked drains, illegal dumpsites, and broken infrastructure go
                unreported until disaster strikes.
              </p>
            </div>

            {/* Grey Section - No Actionable Data */}
            <div className='flex flex-1 flex-col justify-center bg-[#DFE6E5] p-8 text-gray-900 sm:p-10 lg:py-16'>
              <h3 className='mb-4 text-2xl font-medium sm:text-3xl'>
                No Actionable Data
              </h3>
              <p className='text-lg leading-relaxed text-gray-800 sm:text-xl'>
                Governments & Agencies lack real-time, reliable data to act
                early.
              </p>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
