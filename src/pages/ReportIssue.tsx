import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateOnlineIssue } from '@/hooks/use-separate-issues';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentLocationWithAddress } from '@/utils/geocoding';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CitiznLogo from '@/components/CitiznLogo';
import { ISSUE_CATEGORIES } from '@/constants';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const createIssueMutation = useCreateOnlineIssue();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ISSUE_CATEGORIES[0]?.value ?? '',
    urgency: '',
    location: '',
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return null;
  }

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description:
          "Your browser doesn't support geolocation. Please enter location manually.",
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);

    try {
      const { address } = await getCurrentLocationWithAddress();

      setFormData(prev => ({
        ...prev,
        location: address,
      }));

      setIsGettingLocation(false);

      toast({
        title: 'Location captured successfully!',
        description: `Found: ${address}`,
      });
    } catch (error) {
      // Location error
      toast({
        title: 'Location access denied',
        description: 'Please allow location access.',
        variant: 'destructive',
      });
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        severity: formData.urgency || 'medium',
        address: formData.location.trim(),
        location_lat: 6.5244, // Default Lagos coords - would need geocoding in real implementation
        location_lng: 3.3792,
      };

      await createIssueMutation.mutateAsync({
        issueData,
        userId: user.id, // user is guaranteed to exist at this point
        photos: [], // No photo upload - use Report Now for photos
      });

      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    } catch (error) {
      // Enhanced error handling for photo upload failures
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      if (errorMessage.includes('Failed to upload images')) {
        toast({
          title: 'Photo Upload Failed',
          description:
            'Your photo could not be uploaded. Please try again or submit without a photo.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-md'>
        <div className='mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/citizen')}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
            <CitiznLogo size='sm' />
            <div>
              <h1 className='text-xl font-normal text-gray-900'>
                Report Infrastructure Issue
              </h1>
              <p className='text-sm text-gray-600'>
                Help improve your community
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
          <CardHeader>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>
              Provide details about the infrastructure issue you've encountered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Issue Title *</Label>
                  <Input
                    id='title'
                    placeholder='e.g., Large pothole on Main Street'
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select issue category' />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  placeholder='Provide detailed description of the issue...'
                  rows={4}
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='urgency'>Priority Level</Label>
                  <Select
                    onValueChange={value =>
                      setFormData({ ...formData, urgency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='low'>
                        Low - Minor inconvenience
                      </SelectItem>
                      <SelectItem value='medium'>
                        Medium - Moderate impact
                      </SelectItem>
                      <SelectItem value='high'>
                        High - Safety concern
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='location'>Location *</Label>
                  <div className='flex space-x-2'>
                    <Input
                      id='location'
                      placeholder='e.g., 123 Main Street, Lagos'
                      value={formData.location}
                      onChange={e =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                      className={formData.location ? 'bg-green-50' : ''}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className='flex-shrink-0'
                    >
                      {isGettingLocation ? (
                        <LoadingSpinner size='sm' />
                      ) : (
                        <MapPin className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  {formData.location && (
                    <p className='flex items-center space-x-1 text-xs text-green-600'>
                      <MapPin className='h-3 w-3' />
                      <span>Location automatically detected</span>
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-6'>
                  <div className='text-center'>
                    <Camera className='mx-auto h-12 w-12 text-blue-600' />
                    <div className='mt-4'>
                      <p className='text-sm font-medium text-blue-900'>
                        Photo Upload Not Available
                      </p>
                      <p className='mt-2 text-xs text-blue-700'>
                        To submit a report with photo verification, please use
                        the "Report Now" feature which captures photos directly
                        from your camera with location data.
                      </p>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => navigate('/report-now')}
                        className='mt-4 border-blue-300 bg-white text-blue-700 hover:bg-blue-50'
                      >
                        <Camera className='mr-2 h-4 w-4' />
                        Go to Report Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex space-x-4'>
                <Button
                  type='submit'
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                  disabled={createIssueMutation.isPending}
                >
                  {createIssueMutation.isPending
                    ? 'Submitting...'
                    : 'Submit Report'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate('/citizen')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
