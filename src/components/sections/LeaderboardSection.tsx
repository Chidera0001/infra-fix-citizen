import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

const LeaderboardSection = () => {
  return (
    <section className='py-4 sm:py-6 lg:py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <FadeInWhenVisible>
          <div className='mb-4 text-center sm:mb-6 lg:mb-8'>
            <Badge className='mb-4 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 sm:mb-6'>
              <Trophy className='h-4 w-4 fill-green-700' />
              Compete on the leaderboard
            </Badge>
            <h3 className='text-l mb-0 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
              Turn local issues into a community competition
            </h3>
          </div>
        </FadeInWhenVisible>

        {/* Leaderboard Video - Full Width and Height */}
        <FadeInWhenVisible delay={0.1}>
          <div className='mb-0 w-full'>
            {/* Mobile Video */}
            <video
              src='/Assets/Videos/Leaderboard-Mobile.mp4'
              autoPlay
              muted
              loop
              playsInline
              className='h-full w-full rounded-lg object-cover md:hidden'
            />
            {/* Desktop Video */}
            <video
              src='/Assets/Videos/Leaderboard-Video.mp4'
              autoPlay
              muted
              loop
              playsInline
              className='hidden h-full w-full rounded-lg object-cover md:block'
            />
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default LeaderboardSection;
