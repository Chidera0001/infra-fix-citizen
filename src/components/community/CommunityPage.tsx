import { useState, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityIssueCard } from './CommunityIssueCard';
import { CommunityFilters } from './CommunityFilters';
import { useCommunityIssues } from '@/hooks/use-community';

export function CommunityPage() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [radius, setRadius] = useState(5); // Default 5km
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('upvotes');

  // Automatically request location when component mounts
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsRequestingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsRequestingLocation(false);
        setLocationError('');
      },
      error => {
        setIsRequestingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              'Location access denied. Please enable location access in your browser settings.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError(
              'An error occurred while retrieving your location.'
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const {
    data: issues,
    isLoading,
    error,
  } = useCommunityIssues(
    userLocation?.lat,
    userLocation?.lng,
    radius,
    selectedCategory,
    undefined,
    sortBy,
    !!userLocation
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8 lg:pt-8'>
        {/* Header */}
        <div className='mb-6 lg:mb-10'>
          <h1 className='mb-2 text-2xl font-semibold text-gray-900 md:text-3xl'>
            Community Issues
          </h1>
          <p className='text-sm text-gray-600'>
            View issues reported around you and upvote them to show your support
          </p>
        </div>

        {/* Location Permission Required */}
        {!userLocation && locationError && (
          <div className='flex min-h-[60vh] items-center justify-center'>
            <div className='text-center'>
              <p className='mb-4 text-sm text-gray-700'>{locationError}</p>
              <Button
                onClick={requestLocation}
                disabled={isRequestingLocation}
                className='bg-green-600 hover:bg-green-700'
              >
                {isRequestingLocation ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Requesting Location...
                  </>
                ) : (
                  <>
                    <MapPin className='mr-2 h-4 w-4' />
                    Enable Location
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Loading Location */}
        {!userLocation && !locationError && isRequestingLocation && (
          <div className='mb-6 rounded-lg bg-green-50 p-6 text-center'>
            <Loader2 className='mx-auto mb-3 h-12 w-12 animate-spin text-green-600' />
            <p className='text-sm text-gray-700'>Requesting your location...</p>
            <p className='mt-2 text-xs text-gray-500'>
              Please allow location access in your browser
            </p>
          </div>
        )}

        {/* Filters */}
        {userLocation && (
          <CommunityFilters
            radius={radius}
            onRadiusChange={setRadius}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            maxRadius={10}
          />
        )}

        {/* Issues Grid */}
        <div className='mt-6'>
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-green-600' />
            </div>
          )}

          {error && (
            <div className='py-12 text-center'>
              <p className='mb-2 text-lg text-gray-600'>
                No issues found around you
              </p>
              <p className='text-sm text-gray-500'>
                Try increasing your search radius or check back later
              </p>
            </div>
          )}

          {issues && issues.length === 0 && !isLoading && (
            <div className='py-12 text-center'>
              <p className='mb-2 text-lg text-gray-600'>
                No issues found around you
              </p>
              <p className='text-sm text-gray-500'>
                Try increasing your search radius to see more issues
              </p>
            </div>
          )}

          {issues && issues.length > 0 && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {issues.map(issue => (
                <CommunityIssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
