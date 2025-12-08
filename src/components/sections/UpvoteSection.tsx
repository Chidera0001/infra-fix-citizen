import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp } from 'lucide-react';
import UpvoteFeatureCards from './UpvoteFeatureCards';

const UpvoteSection = () => {
  return (
    <section className='py-12 sm:py-14 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible>
          <div className='mb-12 text-center sm:mb-16 lg:mb-20'>
            <Badge className='mb-6 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 sm:mb-8'>
              <ThumbsUp className='h-4 w-4 fill-green-700' />
              Upvote issues around you
            </Badge>
            <h3 className='text-l mb-0 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
              Support issues that matter
            </h3>
          </div>
        </FadeInWhenVisible>

        {/* Upvote Video - Full Width and Height */}
        <FadeInWhenVisible delay={0.1}>
          <div className='mb-12 w-full sm:mb-16 lg:mb-20'>
            {/* Mobile Video */}
            <video
              src='/Assets/Videos/Upvote-Mobile.mp4'
              autoPlay
              loop
              muted
              playsInline
              className='h-full w-full object-cover md:hidden'
            >
              Your browser does not support the video tag.
            </video>
            {/* Desktop Video */}
            <video
              src='/Assets/Videos/Upvote-Video.mp4'
              autoPlay
              loop
              muted
              playsInline
              className='hidden h-full w-full object-cover md:block'
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </FadeInWhenVisible>
        {/* <UpvoteFeatureCards /> */}
      </div>
    </section>
  );
};

export default UpvoteSection;
