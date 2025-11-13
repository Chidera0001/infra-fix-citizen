import { Card, CardContent } from '@/components/ui/card';

interface ActionCardsProps {
  onReportIssue: () => void;
  onExploreMap: () => void;
  onViewAnalytics: () => void;
}

export const ActionCards = ({
  onReportIssue,
  onExploreMap,
  onViewAnalytics,
}: ActionCardsProps) => {
  return (
    <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
      <Card
        className='group cursor-pointer overflow-hidden rounded-2xl border-0 bg-white transition-all duration-300 hover:shadow-2xl'
        onClick={onReportIssue}
      >
        <CardContent className='p-8 text-center'>
          <div className='mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 transition-transform duration-300 group-hover:scale-110'>
            <img
              src='/Assets/icons/Plus.svg'
              alt='Plus'
              className='h-10 w-10 brightness-0 invert'
            />
          </div>
          <h3 className='mb-2 text-xl font-normal text-gray-900'>
            Report New Issue
          </h3>
          <p className='text-sm text-gray-600'>
            Report infrastructure problems in your community
          </p>
        </CardContent>
      </Card>

      <Card
        className='group cursor-pointer overflow-hidden rounded-2xl border-0 bg-white transition-all duration-300 hover:shadow-2xl'
        onClick={onExploreMap}
      >
        <CardContent className='p-8 text-center'>
          <div className='mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 transition-transform duration-300 group-hover:scale-110'>
            <img
              src='/Assets/icons/Location.svg'
              alt='Location'
              className='h-10 w-10 brightness-0 invert'
            />
          </div>
          <h3 className='mb-2 text-xl font-normal text-gray-900'>
            Explore Map
          </h3>
          <p className='text-sm text-gray-600'>
            Click on the location on the map to report a new issue
          </p>
        </CardContent>
      </Card>

      <Card
        className='group cursor-pointer overflow-hidden rounded-2xl border-0 bg-white transition-all duration-300 hover:shadow-2xl'
        onClick={onViewAnalytics}
      >
        <CardContent className='p-8 text-center'>
          <div className='mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 transition-transform duration-300 group-hover:scale-110'>
            <img
              src='/Assets/icons/Analytics.svg'
              alt='Analytics'
              className='h-10 w-10 brightness-0 invert'
            />
          </div>
          <h3 className='mb-2 text-xl font-normal text-gray-900'>
            View Analytics
          </h3>
          <p className='text-sm text-gray-600'>
            Track your community impact and statistics
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
