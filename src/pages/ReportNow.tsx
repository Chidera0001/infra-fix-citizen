import React, { useState, useEffect } from 'react';
import { CameraCapture, InstantReportForm } from '@/components/InstantReport';
import { getLocationFromPhoto, type LocationData } from '@/utils/exifExtractor';
import {
  getCurrentLocationWithAddress,
  reverseGeocode,
} from '@/utils/geocoding';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CitizenSidebar } from '@/components/layout/CitizenSidebar';

const ReportNow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isExtractingLocation, setIsExtractingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('report-now');
  const [locationSource, setLocationSource] = useState<'photo' | 'gps' | 'map'>(
    'gps'
  );
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);

  // Handle URL parameters for map-click scenarios
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng) {
      // Scenario 3: Clicking Map to Report
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      // Set location data immediately with coordinates
      setLocationData({
        latitude,
        longitude,
        address: `Loading address...`, // Temporary placeholder
      });
      setLocationSource('map');

      // Reverse geocode to get proper address
      reverseGeocode(latitude, longitude)
        .then(address => {
          setLocationData(prev => ({
            ...prev!,
            address: address,
          }));
        })
        .catch(() => {
          // Fallback to coordinates if reverse geocoding fails
          setLocationData(prev => ({
            ...prev!,
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }));
        });

      toast({
        title: 'Location Pre-filled!',
        description: 'Location selected from map',
      });
    }
    // Note: We don't automatically get current location on page load
    // Location will only be obtained when user takes a photo without GPS data
  }, [searchParams, toast]);

  const getCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    try {
      const location = await getCurrentLocationWithAddress();
      if (location) {
        setLocationData({
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          address: location.address,
        });
        setLocationSource('gps');
      }
    } catch {
      // Silently handle location errors
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  const handlePhotoCapture = async (file: File) => {
    setCapturedPhoto(file);
    setIsExtractingLocation(true);

    try {
      // Location Priority Hierarchy:
      // 1. Map-selected location (highest priority) - NEVER overwrite
      // 2. Photo GPS data (medium priority)
      // 3. Current GPS location (lowest priority)

      // If user already selected location from map, preserve it regardless of photo GPS data
      if (locationSource === 'map' && locationData) {
        toast({
          title: 'Location Preserved',
          description:
            'Using the location you selected from the map (overriding photo GPS)',
          variant: 'default',
        });
      } else {
        // Try to extract location from photo GPS data
        const photoLocation = await getLocationFromPhoto(file);

        if (photoLocation) {
          // Scenario 1: Photo has GPS data - use it (unless map location exists)
          setLocationData(photoLocation);
          setLocationSource('photo');
          toast({
            title: 'Location Detected!',
            description: 'Address automatically extracted from photo GPS data',
          });
        } else {
          // Scenario 2: Photo has no GPS data
          // Only get current GPS location if no location was previously selected
          if (!locationData || locationSource !== 'map') {
            try {
              const currentLocation = await getCurrentLocationWithAddress();
              if (currentLocation) {
                setLocationData({
                  latitude: currentLocation.coordinates.latitude,
                  longitude: currentLocation.coordinates.longitude,
                  address: currentLocation.address,
                });
                setLocationSource('gps');
                toast({
                  title: 'Using Current Location',
                  description: 'Will use your current GPS location instead',
                  variant: 'default',
                });
              } else {
                setLocationData(null);
                toast({
                  title: 'No Location Data',
                  description:
                    'Photo has no GPS data. Please allow location access, or retake the photo to capture GPS data',
                  variant: 'default',
                });
              }
            } catch (locationError: any) {
              setLocationData(null);

              // Provide specific error messages based on error type
              let errorMessage =
                'Please allow location access in your browser settings, or retake the photo to capture GPS data';
              if (locationError?.code === 1) {
                errorMessage =
                  'Location permission denied. Please allow location access in your browser settings, or retake the photo to capture GPS data';
              } else if (locationError?.code === 2) {
                errorMessage =
                  'Location unavailable. Please retake the photo to capture GPS data, or allow location access';
              } else if (locationError?.code === 3) {
                errorMessage =
                  'Location request timed out. Please try again or retake the photo';
              }

              toast({
                title: 'Location Not Available',
                description: errorMessage,
                variant: 'default',
              });
            }
          } else {
            // User had already selected a location from the map, keep it
            toast({
              title: 'Location Preserved',
              description: 'Using the location you selected from the map',
              variant: 'default',
            });
          }
        }
      }
    } catch {
      // Don't overwrite existing location data if there was an error
      if (!locationData) {
        setLocationData(null);
        toast({
          title: 'Location Extraction Failed',
          description:
            'Please allow location access in your browser settings, or retake the photo to capture GPS data',
          variant: 'default',
        });
      }
    } finally {
      setIsExtractingLocation(false);
    }
  };

  const handleRetake = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(URL.createObjectURL(capturedPhoto));
    }
    setCapturedPhoto(null);
    // Only clear location data if it wasn't selected from map
    if (locationSource !== 'map') {
      setLocationData(null);
      setLocationSource('gps');
    }
  };

  const getLocationBadge = () => {
    switch (locationSource) {
      case 'photo':
        return {
          text: 'Auto-detected: Camera',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'gps':
        return {
          text: 'Auto-detected: Location',
          color: 'bg-green-100 text-green-700 border-green-200',
        };
      case 'map':
        return {
          text: 'Auto-detected: Map',
          color: 'bg-green-100 text-green-700 border-green-200',
        };
      default:
        return {
          text: 'Auto-detected: Location',
          color: 'bg-green-100 text-green-700 border-green-200',
        };
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleTabChange = (tab: 'dashboard' | 'reports' | 'map') => {
    setActiveTab(tab);
    // Navigate to the citizen dashboard with the selected tab
    navigate(`/citizen?tab=${tab}`);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      <CitizenSidebar activeTab='report-now' onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <div className='flex-1'>
        {/* Main Content */}
        <main className='px-4 py-8 sm:px-6 lg:px-8'>
          {isExtractingLocation || isGettingCurrentLocation ? (
            <div className='mx-auto max-w-2xl'>
              <div className='rounded-2xl border border-green-200/30 bg-white p-8 shadow-lg sm:p-12'>
                <div className='space-y-6 text-center'>
                  <div className='relative'>
                    <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
                      <LoadingSpinner size='lg' text='' />
                    </div>
                    <div className='absolute inset-0 mx-auto h-20 w-20 animate-ping rounded-full bg-green-200 opacity-20'></div>
                  </div>
                  <div>
                    <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                      {isExtractingLocation
                        ? 'Detecting Location...'
                        : 'Getting Current Location...'}
                    </h3>
                    <p className='text-gray-600'>
                      {isExtractingLocation
                        ? 'Extracting GPS data from your photo'
                        : 'Accessing your current GPS location'}
                    </p>
                  </div>
                  <div className='rounded-lg bg-green-50 p-4'>
                    <p className='text-sm text-green-700'>
                      📍 This usually takes just a few seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : capturedPhoto ? (
            <div className='mx-auto max-w-4xl'>
              <InstantReportForm
                photo={capturedPhoto}
                initialLocation={locationData}
                locationSource={locationSource}
                onRetake={handleRetake}
              />
            </div>
          ) : (
            <div className='mx-auto max-w-4xl'>
              {/* Camera Capture - Full Width */}
              <CameraCapture
                onPhotoCapture={handlePhotoCapture}
                onCancel={handleBack}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportNow;
