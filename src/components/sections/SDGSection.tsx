import React from 'react';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const sdgImages = [
  {
    src: '/Assets/Images/SDG-9.jpg',
    alt: 'SDG 9: Industry, Innovation and Infrastructure',
  },
  {
    src: '/Assets/Images/SDG-11.jpg',
    alt: 'SDG 11: Sustainable Cities and Communities',
  },
  { src: '/Assets/Images/SDG-13.jpg', alt: 'SDG 13: Climate Action' },
  {
    src: '/Assets/Images/SDG-16.jpg',
    alt: 'SDG 16: Peace, Justice and Strong Institutions',
  },
  {
    src: '/Assets/Images/SDG-17.jpg',
    alt: 'SDG 17: Partnerships for the Goals',
  },
];

const SDGSection: React.FC = () => {
  return (
    <section className='bg-white py-12 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible>
          <div className='mb-12 flex flex-col items-center text-center'>
            <Badge className='mb-6 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700'>
              SDG Alignment
            </Badge>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Contributing to Global Goals
            </h2>
          </div>
        </FadeInWhenVisible>

        <div className='flex flex-wrap justify-center gap-8 lg:gap-12'>
          {sdgImages.map((image, index) => (
            <FadeInWhenVisible
              key={index}
              delay={index * 0.1}
              className='flex items-center justify-center'
            >
              <div className='w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px]'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className='h-auto w-full rounded-lg object-contain transition-transform duration-300 hover:scale-105'
                />
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SDGSection;
