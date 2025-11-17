import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminCommunityFilters } from './AdminCommunityFilters';
import { AdminCommunityIssueCard } from './AdminCommunityIssueCard';
import { useCommunityIssues } from '@/hooks/use-community';

export function AdminCommunityDashboard() {
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(true);
  const [radius, setRadius] = useState(10); // Default 10km for admin
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('upvotes');

  // Get admin's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.log('Could not get location:', error);
          // Don't set error, just leave it null
        }
      );
    }
  }, []);

  const {
    data: issues,
    isLoading,
    error,
  } = useCommunityIssues(
    searchLocation?.lat,
    searchLocation?.lng,
    radius,
    selectedCategory,
    undefined,
    sortBy,
    !!searchLocation,
    false // Admin can see their own issues
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='mb-2 text-2xl font-normal text-gray-900 md:text-3xl'>
            Community Dashboard
          </h1>
          <p className='text-sm text-gray-600'>
            View and monitor highly-upvoted issues by location
          </p>
        </div>

        {/* Filters */}
        <AdminCommunityFilters
          radius={radius}
          onRadiusChange={setRadius}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchLocation={searchLocation}
          onLocationChange={location => {
            setSearchLocation(location);
            setUsingCurrentLocation(false);
          }}
          usingCurrentLocation={usingCurrentLocation}
        />

        {/* Issues Grid */}
        <div className='mt-6'>
          {!searchLocation && (
            <div className='py-12 text-center'>
              <p className='mb-2 text-lg text-gray-600'>
                Getting your location...
              </p>
              <p className='text-sm text-gray-500'>
                Or search for a specific area above
              </p>
            </div>
          )}

          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-green-600' />
            </div>
          )}

          {error && (
            <div className='py-12 text-center'>
              <p className='mb-2 text-lg text-gray-600'>
                No issues found in this area
              </p>
              <p className='text-sm text-gray-500'>
                Try a different location or increase the search radius
              </p>
            </div>
          )}

          {issues && issues.length === 0 && !isLoading && searchLocation && (
            <div className='py-12 text-center'>
              <p className='mb-2 text-lg text-gray-600'>
                No issues found in this area
              </p>
              <p className='text-sm text-gray-500'>
                Try increasing the search radius or select a different location
              </p>
            </div>
          )}

          {issues && issues.length > 0 && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {issues.map(issue => (
                <AdminCommunityIssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
