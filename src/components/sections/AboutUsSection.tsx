import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const AboutUsSection = () => {
  return (
    <section className=''>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Mission Statement Text */}
        <FadeInWhenVisible>
          <div className='mb-2 space-y-1 sm:mb-3 lg:mb-4'>
            <p className='mx-auto w-full text-left text-xl leading-relaxed text-gray-700 sm:text-lg md:text-justify md:leading-relaxed lg:text-3xl lg:leading-relaxed'>
              Our Mission Is To Establish A Bridge Of Data Trust, Empowering
              Citizens With A Collective Voice And Equipping Governments And
              Agencies With Verified, Actionable Intelligence. This Ensures
              Small Infrastructure Failures Are Fixed Quickly, Strengthening
              Community Safety And Urban Resilience.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* About Us Image - Full Width and Height */}
        <FadeInWhenVisible delay={0.1}>
          <div className='w-full py-20'>
            <img
              src='/Assets/Images/Dashboard.png'
              alt='Citizn Dashboard'
              className='hidden h-full w-full rounded-lg object-cover md:block'
            />
            <img
              src='/Assets/Images/Phone-Dashboard.png'
              alt='Citizn Dashboard'
              className='block h-full w-full rounded-lg object-cover md:hidden'
            />
          </div>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <div className='text-center'>
            <p className='mx-auto w-full text-left text-xl leading-relaxed text-gray-700 sm:text-lg md:text-justify md:leading-relaxed lg:text-3xl lg:leading-relaxed'>
              The larger picture is much more than just reporting issues. A
              report of a blocked drainage today could prevent a flood tomorrow.
              A report of a broken street light could prevent a crime. A report
              of a pothole could prevent a car accident. A report of a water
              supply issue could prevent a water shortage.
            </p>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default AboutUsSection;
