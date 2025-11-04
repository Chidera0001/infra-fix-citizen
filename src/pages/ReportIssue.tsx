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
import { ArrowLeft, Camera, MapPin, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateOnlineIssue } from '@/hooks/use-separate-issues';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentLocationWithAddress } from '@/utils/geocoding';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CitiznLogo from '@/components/CitiznLogo';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const createIssueMutation = useCreateOnlineIssue();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: '',
    location: '',
    photo: null as File | null,
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

    // Check photo size before submission
    if (formData.photo) {
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (formData.photo.size > maxSize) {
        const fileSizeMB = (formData.photo.size / (1024 * 1024)).toFixed(2);
        toast({
          title: 'File Too Large',
          description: `The selected photo (${fileSizeMB}MB) exceeds the 4MB limit. Please choose a smaller file.`,
          variant: 'destructive',
        });
        return;
      }
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
        photos: formData.photo ? [formData.photo] : [],
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size before setting it
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast({
          title: 'File Too Large',
          description: `The selected file (${fileSizeMB}MB) exceeds the 4MB limit. Please choose a smaller file.`,
          variant: 'destructive',
        });
        // Clear the input
        e.target.value = '';
        return;
      }

      setFormData({ ...formData, photo: file });

      // Show success message
      toast({
        title: 'Photo Selected',
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) ready for upload`,
      });
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
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select issue category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='pothole'>Pothole</SelectItem>
                      <SelectItem value='street_lighting'>Street Lighting</SelectItem>
                      <SelectItem value='water_supply'>Water Supply</SelectItem>
                      <SelectItem value='traffic_signal'>Traffic Signal</SelectItem>
                      <SelectItem value='drainage'>Drainage (Flood Prevention)</SelectItem>
                      <SelectItem value='sidewalk'>Sidewalk</SelectItem>
                      <SelectItem value='flooding'>Flooding</SelectItem>
                      <SelectItem value='erosion'>Erosion</SelectItem>
                      <SelectItem value='urban_heat'>Urban Heat</SelectItem>
                      <SelectItem value='storm_damage'>Storm Damage</SelectItem>
                      <SelectItem value='green_infrastructure'>Green Infrastructure</SelectItem>
                      <SelectItem value='water_contamination'>Water Contamination</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
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
                <Label htmlFor='photo'>Upload Photo</Label>
                <div
                  className={`rounded-lg border-2 border-dashed p-6 ${
                    formData.photo && formData.photo.size > 4 * 1024 * 1024
                      ? 'border-red-300 bg-red-50'
                      : formData.photo
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                  }`}
                >
                  <div className='text-center'>
                    <Upload
                      className={`mx-auto h-12 w-12 ${
                        formData.photo && formData.photo.size > 4 * 1024 * 1024
                          ? 'text-red-400'
                          : formData.photo
                            ? 'text-green-400'
                            : 'text-gray-400'
                      }`}
                    />
                    <div className='mt-4'>
                      <label htmlFor='photo' className='cursor-pointer'>
                        <span
                          className={`mt-2 block text-sm font-medium ${
                            formData.photo &&
                            formData.photo.size > 4 * 1024 * 1024
                              ? 'text-red-900'
                              : formData.photo
                                ? 'text-green-900'
                                : 'text-gray-900'
                          }`}
                        >
                          {formData.photo
                            ? `${formData.photo.name} (${(formData.photo.size / (1024 * 1024)).toFixed(2)}MB)`
                            : 'Click to upload photo'}
                        </span>
                        <input
                          id='photo'
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <p
                        className={`mt-1 text-xs ${
                          formData.photo &&
                          formData.photo.size > 4 * 1024 * 1024
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        PNG, JPG up to 4MB
                        {formData.photo &&
                          formData.photo.size > 4 * 1024 * 1024 && (
                            <span className='block font-medium'>
                              ⚠️ File exceeds size limit
                            </span>
                          )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex space-x-4'>
                <Button
                  type='submit'
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                  disabled={
                    createIssueMutation.isPending ||
                    (formData.photo && formData.photo.size > 4 * 1024 * 1024)
                  }
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
