import { Clock, Users } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer
      className='flex items-center justify-center py-12 sm:py-16 lg:py-20'
      style={{
        background:
          'linear-gradient(180deg, #0F3A2A 0%, #0F3A2A 33.33%, #1A4D2E 66.67%)',
      }}
    >
      <div className='mx-auto max-w-7xl space-y-6 px-4 text-center sm:space-y-8 sm:px-6 lg:px-8'>
        {/* Logo and Brand Name */}
        <div className='flex items-center justify-center space-x-3'>
          <img
            src='/Assets/logo/Trademark.png'
            alt='Citizn Logo'
            className='h-8 w-auto sm:h-10'
          />
        </div>

        {/* Tagline */}
        <p className='px-4 text-sm font-normal text-[#D9D9D9] sm:text-[15px]'>
          Empowering citizens to build better communities.
        </p>

        {/* Feature Pills */}
        <div className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
          <div className='flex items-center space-x-2 rounded-full border border-[#1A4D2E] bg-[#0F3A2A] px-3 py-2 text-gray-300 sm:px-4'>
            <img
              src='/Assets/icons/Rotate.svg'
              alt='Rotate'
              className='h-3 w-3 sm:h-4 sm:w-4'
            />
            <span className='text-xs sm:text-sm'>Enterprise Security</span>
          </div>
          <div className='flex items-center space-x-2 rounded-full border border-[#1A4D2E] bg-[#0F3A2A] px-3 py-2 text-gray-300 sm:px-4'>
            <img
              src='/Assets/icons/Rotate.svg'
              alt='Rotate'
              className='h-3 w-3 sm:h-4 sm:w-4'
            />
            <span className='text-xs sm:text-sm'>24/7 Monitoring</span>
          </div>
          <div className='flex items-center space-x-2 rounded-full border border-[#1A4D2E] bg-[#0F3A2A] px-3 py-2 text-gray-300 sm:px-4'>
            <img
              src='/Assets/icons/People.svg'
              alt='Rotate'
              className='h-3 w-3 brightness-0 invert sm:h-4 sm:w-4'
            />
            <span className='text-xs sm:text-sm'>Community Driven</span>
          </div>
        </div>

        {/* Copyright */}
        <p className='px-4 text-xs text-[#D9D9D9] sm:text-sm'>
          © 2024 Citizn. Building better communities together.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
