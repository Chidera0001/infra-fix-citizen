import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCreateOnlineIssue } from '@/hooks/use-separate-issues';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentLocationWithAddress } from '@/utils/geocoding';
import { useFormValidation } from '@/hooks/useFormValidation';
import LocationSelectionMap from './ReportForm/LocationSelectionMap';
import { ISSUE_CATEGORIES } from '@/constants';

interface ReportFormProps {
  onBack: () => void;
}

type IssueCategoryValue = (typeof ISSUE_CATEGORIES)[number]['value'];

const ReportForm = ({ onBack }: ReportFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: (ISSUE_CATEGORIES[0]?.value as IssueCategoryValue) ?? 'bad_roads',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    address: '',
    location_lat: 6.5244, // Default Lagos coords
    location_lng: 3.3792,
    photos: [] as File[],
  });
  const [locationMethod, setLocationMethod] = useState<
    'current' | 'map' | null
  >(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [showLocationMap, setShowLocationMap] = useState(false);
  const { toast } = useToast();
  const createOnlineIssueMutation = useCreateOnlineIssue();
  const { validateForm, cleanTitle } = useFormValidation();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description:
          "Your browser doesn't support geolocation. Please select location from map.",
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);

    try {
      const { coordinates, address } = await getCurrentLocationWithAddress();

      setFormData(prev => ({
        ...prev,
        location_lat: coordinates.latitude,
        location_lng: coordinates.longitude,
        address: address, // Auto-populate the address field
      }));

      setLocationAddress(address);
      setLocationMethod('current');
      setIsGettingLocation(false);
      handleNext();

      toast({
        title: 'Location captured successfully!',
        description: `Found: ${address}`,
      });
    } catch (error) {
      let errorTitle = 'Location access denied';
      let errorDescription =
        'Please allow location access or select location from map.';

      // Handle specific geolocation error codes
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorTitle = 'Location permission denied';
            errorDescription =
              "Location access is blocked. Please follow these steps: 1) Click the lock icon in your browser's address bar 2) Set location to 'Allow' 3) Refresh the page and try again. Or use 'Select from Map' instead.";
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorTitle = 'Location unavailable';
            errorDescription =
              'Unable to determine your location. Please try again or select location from map.';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorTitle = 'Location timeout';
            errorDescription =
              'Location request timed out. Please try again or select location from map.';
            break;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorTitle = 'Location permission denied';
          errorDescription =
            "Location access is blocked. Please follow these steps: 1) Click the lock icon in your browser's address bar 2) Set location to 'Allow' 3) Refresh the page and try again. Or use 'Select from Map' instead.";
        }
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });
      setIsGettingLocation(false);
    }
  };

  const handleLocationFromMap = () => {
    setShowLocationMap(true);
  };

  const handleLocationSelected = (
    coordinates: { lat: number; lng: number },
    address: string
  ) => {
    setFormData(prev => ({
      ...prev,
      location_lat: coordinates.lat,
      location_lng: coordinates.lng,
      address: address,
    }));

    setLocationAddress(address);
    setLocationMethod('map');
    setShowLocationMap(false);
    handleNext();

    toast({
      title: 'Location selected successfully!',
      description: `Selected: ${address}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit if we're on the final step
    if (currentStep !== 4) {
      return;
    }

    // Validate form data
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean the title
      const cleanedTitle = cleanTitle(formData.title);

      // Ensure title is not empty after cleaning
      if (!cleanedTitle) {
        toast({
          title: 'Invalid title',
          description: 'Please provide a valid title with letters or numbers.',
          variant: 'destructive',
        });
        return;
      }

      const issueData = {
        title: cleanedTitle,
        description: formData.description.trim().replace(/\s+/g, ' '),
        category: formData.category,
        severity: formData.severity,
        address: formData.address.trim(),
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
      };

      // Create issue in Supabase with photos
      await createOnlineIssueMutation.mutateAsync({
        issueData,
        userId: user?.id,
        photos: formData.photos,
      });

      // The useCreateIssue hook already shows success toast
      onBack();
    } catch (error) {
      // The useCreateIssue hook already shows error toast, so we don't need to show another one
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      {/* Show location selection map if needed */}
      {showLocationMap ? (
        <LocationSelectionMap
          onLocationSelected={handleLocationSelected}
          initialLocation={{
            lat: formData.location_lat,
            lng: formData.location_lng,
          }}
        />
      ) : (
        <>
          {/* Enhanced Header */}
          <header className='border-b border-green-200/50 bg-white/95 shadow-lg backdrop-blur-md'>
            <div className='mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <h1 className='text-lg font-semibold text-gray-900 sm:text-xl'>
                    Report Infrastructure Issue
                  </h1>
                  <p className='text-xs text-gray-600 sm:text-sm'>
                    Help improve your community infrastructure
                  </p>
                </div>
                <div className='hidden sm:block'>
                  <div className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'>
                    Step {currentStep} of {totalSteps}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className='mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
            {/* Progress indicator removed - component doesn't exist */}

            <Card className='overflow-hidden rounded-2xl border border-green-200/50 bg-white/95 shadow-2xl backdrop-blur-sm sm:rounded-3xl'>
              <CardContent className='px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Form content removed - components don't exist */}
                  <div className='py-8 text-center'>
                    <p className='text-gray-600'>
                      Form components are being refactored...
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportForm;
