import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import type { Issue } from '@/lib/supabase-api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InteractiveMap from '@/components/maps/InteractiveMap';

interface CommunityMapProps {
  issues: Issue[];
  isLoading: boolean;
  onShowMap: () => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
}

export const CommunityMap = ({
  issues,
  isLoading,
  onShowMap,
  onMapClick,
}: CommunityMapProps) => {
  return (
    <Card className='mb-10 rounded-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
      <CardHeader className='pb-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle className='flex items-center space-x-3 text-xl font-normal'>
              Community Issues Map
            </CardTitle>
            <CardDescription className='text-m text-gray-600'>
              Click anywhere on the map to report a new issue at that location.
            </CardDescription>
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={onShowMap}
              className='bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-105'
            >
              Full Map View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className='h-96 overflow-hidden rounded-2xl'
          style={{ width: '100%', height: '100%' }}
        >
          {isLoading ? (
            <div className='flex h-full items-center justify-center'>
              <LoadingSpinner text='Loading map...' />
            </div>
          ) : (
            <InteractiveMap
              issues={issues}
              isAdmin={false}
              className='h-full w-full'
              onLocationSelect={onMapClick}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
