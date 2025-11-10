import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Send, RotateCcw } from 'lucide-react';
import type { LocationData } from '@/utils/exifExtractor';
import { useNavigate } from 'react-router-dom';
import { useCreateOnlineIssue } from '@/hooks/use-separate-issues';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fileToBase64, verifyReport } from '@/utils/aiVerification';
import { ISSUE_CATEGORIES } from '@/constants';

interface InstantReportFormProps {
  photo: File;
  initialLocation: LocationData | null;
  locationSource?: 'photo' | 'gps' | 'map';
  onRetake: () => void;
}

type IssueCategoryValue = (typeof ISSUE_CATEGORIES)[number]['value'];

export const InstantReportForm = ({
  photo,
  initialLocation,
  locationSource,
  onRetake,
}: InstantReportFormProps) => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const createOnlineIssueMutation = useCreateOnlineIssue();

  const [formData, setFormData] = useState({
    title: '',
    category: (ISSUE_CATEGORIES[0]?.value as IssueCategoryValue) ?? 'bad_roads',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
    address: initialLocation?.address || '',
    location_lat: initialLocation?.latitude || 6.5244,
    location_lng: initialLocation?.longitude || 3.3792,
  });

  // Character limits from backend validation
  const TITLE_MIN_LENGTH = 10;
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MIN_LENGTH = 20;
  const DESCRIPTION_MAX_LENGTH = 1000;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Create photo preview
  useState(() => {
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  });

  const getLocationBadgeText = () => {
    switch (locationSource) {
      case 'photo':
        return 'Auto-detected: Camera';
      case 'gps':
        return 'Auto-detected: Location';
      case 'map':
        return 'Auto-detected: Map';
      default:
        return 'Auto-detected: Location';
    }
  };

  // Validation functions
  const validateForm = () => {
    const errors: string[] = [];

    // Title validation
    if (!formData.title.trim()) {
      errors.push('Title is required');
    } else if (formData.title.trim().length < TITLE_MIN_LENGTH) {
      errors.push(`Title must be at least ${TITLE_MIN_LENGTH} characters long`);
    } else if (formData.title.trim().length > TITLE_MAX_LENGTH) {
      errors.push(
        `Title must be no more than ${TITLE_MAX_LENGTH} characters long`
      );
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.push('Description is required');
    } else if (formData.description.trim().length < DESCRIPTION_MIN_LENGTH) {
      errors.push(
        `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters long`
      );
    } else if (formData.description.trim().length > DESCRIPTION_MAX_LENGTH) {
      errors.push(
        `Description must be no more than ${DESCRIPTION_MAX_LENGTH} characters long`
      );
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.push('Address is required');
    }

    return errors;
  };

  // Helper functions for character count display
  const getTitleCountColor = () => {
    const length = formData.title.length;
    if (length < TITLE_MIN_LENGTH) return 'text-red-500';
    if (length > TITLE_MAX_LENGTH) return 'text-red-500';
    if (length > TITLE_MAX_LENGTH * 0.9) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getDescriptionCountColor = () => {
    const length = formData.description.length;
    if (length < DESCRIPTION_MIN_LENGTH) return 'text-red-500';
    if (length > DESCRIPTION_MAX_LENGTH) return 'text-red-500';
    if (length > DESCRIPTION_MAX_LENGTH * 0.9) return 'text-yellow-500';
    return 'text-green-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check photo size before validation
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (photo.size > maxSize) {
      const fileSizeMB = (photo.size / (1024 * 1024)).toFixed(2);
      toast({
        title: 'Photo Too Large',
        description: `The captured photo (${fileSizeMB}MB) exceeds the 4MB limit. Please retake with a smaller resolution.`,
        variant: 'destructive',
      });
      return;
    }

    // Validate form using the new validation function
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Convert photo to base64 for AI verification
      const base64DataUrl = await fileToBase64(photo);
      const mimeType = photo.type || 'image/jpeg';

      // Extract base64 data (remove 'data:image/jpeg;base64,' prefix)
      const base64Data = base64DataUrl.split(',')[1];

      // Step 2: Verify report using AI (pass session token to avoid race conditions)
      const verificationResult = await verifyReport(
        base64Data,
        mimeType,
        formData.category,
        formData.description.trim(),
        session?.access_token // Pass the session token from AuthContext
      );

      // Step 3: If verification fails, show error and return
      if (!verificationResult.success) {
        // Parse and format the error message with emojis
        let formattedMessage = 'Please update the following:\n\n';

        // Extract image error
        const imageErrorMatch = verificationResult.message.match(
          /Image Error:\s*(.+?)(?:\n|$)/i
        );
        if (imageErrorMatch) {
          formattedMessage += `📷 Image: ${imageErrorMatch[1].trim()}\n`;
        }

        // Extract description error
        const descriptionErrorMatch = verificationResult.message.match(
          /Description Error:\s*(.+?)(?:\n|$)/i
        );
        if (descriptionErrorMatch) {
          formattedMessage += `📝 Description: ${descriptionErrorMatch[1].trim()}\n`;
        }

        // If no specific errors found, use the original message
        if (!imageErrorMatch && !descriptionErrorMatch) {
          formattedMessage = verificationResult.message.replace(
            'Report failed verification. Please review the following issues:',
            'Please update the following:'
          );
        }

        toast({
          title: '⚠️ Please Review Your Report',
          description: formattedMessage.trim(),
          variant: 'warning',
          duration: 8000,
        });
        setIsSubmitting(false);
        return;
      }

      // Step 4: Verification successful, proceed with submission
      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        severity: formData.severity,
        address: formData.address.trim(),
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
      };

      // Pass the captured photo to be uploaded
      await createOnlineIssueMutation.mutateAsync({
        issueData,
        userId: user?.id,
        photos: [photo],
      });

      // Redirect immediately on success
      navigate('/citizen');
    } catch (error) {
      console.error('Error submitting instant report:', error);

      // Enhanced error handling for photo upload failures
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      if (errorMessage.includes('Failed to upload images')) {
        toast({
          title: 'Photo Upload Failed',
          description: 'Your photo could not be uploaded. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <Card className='overflow-hidden rounded-2xl border border-green-200/50 bg-white/95 shadow-2xl backdrop-blur-sm sm:rounded-3xl'>
        <CardContent className='px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
          {/* Photo Preview */}
          <div className='mb-6'>
            <div
              className={`relative ${photo.size > 4 * 1024 * 1024 ? 'ring-2 ring-red-300 ring-offset-2' : ''}`}
            >
              <img
                src={photoPreview}
                alt='Captured issue'
                className={`h-64 w-full rounded-xl border object-cover ${
                  photo.size > 4 * 1024 * 1024
                    ? 'border-red-300'
                    : 'border-gray-200'
                }`}
              />
              {photo.size > 4 * 1024 * 1024 && (
                <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/20'>
                  <div className='rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white'>
                    ⚠️ Photo too large (
                    {(photo.size / (1024 * 1024)).toFixed(2)}MB)
                  </div>
                </div>
              )}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={onRetake}
                className='absolute right-3 top-3 border-gray-300 bg-white/90 hover:bg-white'
              >
                <RotateCcw className='mr-2 h-4 w-4' />
                Retake
              </Button>
            </div>
            {photo.size > 4 * 1024 * 1024 && (
              <p className='mt-2 text-center text-sm text-red-600'>
                Please retake the photo with a smaller resolution to reduce file
                size.
              </p>
            )}
          </div>

          {/* Location Info */}
          {initialLocation && (
            <div className='mb-6 rounded-xl border border-green-200 bg-green-50 p-4'>
              <div className='flex items-start space-x-3'>
                <MapPin className='mt-0.5 h-5 w-5 text-green-600' />
                <div className='flex-1'>
                  <p className='mb-1 text-sm font-medium text-green-800'>
                    Location automatically detected from{' '}
                    {locationSource === 'photo'
                      ? 'photo'
                      : locationSource === 'gps'
                        ? 'GPS'
                        : 'map'}
                  </p>
                  <p className='text-sm text-green-700'>
                    Address: {initialLocation.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Validation Status */}
          {validateForm().length > 0 && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3'>
              <div className='flex items-start space-x-2'>
                <div className='mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100'>
                  <span className='text-xs font-bold text-red-600'>!</span>
                </div>
                <div>
                  <p className='mb-1 text-sm font-medium text-red-800'>
                    Please fix the following issues:
                  </p>
                  <ul className='space-y-1 text-xs text-red-700'>
                    {validateForm().map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='title' className='font-medium text-gray-900'>
                Issue Title *
              </Label>
              <Input
                id='title'
                placeholder='Brief description of the issue (minimum 10 characters)'
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`rounded-lg border-green-300 focus:border-green-500 focus:ring-green-500 ${
                  formData.title.length > 0 &&
                  (formData.title.length < TITLE_MIN_LENGTH ||
                    formData.title.length > TITLE_MAX_LENGTH)
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                required
                minLength={TITLE_MIN_LENGTH}
                maxLength={TITLE_MAX_LENGTH}
              />
              <div className='flex items-center justify-between text-xs'>
                <span className={`font-medium ${getTitleCountColor()}`}>
                  {formData.title.length}/{TITLE_MAX_LENGTH} characters
                </span>
                {formData.title.length > 0 &&
                  formData.title.length < TITLE_MIN_LENGTH && (
                    <span className='font-medium text-red-500'>
                      Minimum {TITLE_MIN_LENGTH} characters required
                    </span>
                  )}
              </div>
            </div>

            {/* Category */}
            <div className='space-y-2'>
              <Label htmlFor='category' className='font-medium text-gray-900'>
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: IssueCategoryValue) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className='rounded-lg border-green-300 focus:border-green-500'>
                  <SelectValue placeholder='Select category' />
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

            {/* Address */}
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Label htmlFor='address' className='font-medium text-gray-900'>
                  Address *
                </Label>
                {locationSource && (
                  <Badge className='border-green-200 bg-green-100 px-2 py-1 text-xs text-green-700'>
                    {getLocationBadgeText()}
                  </Badge>
                )}
              </div>
              <Input
                id='address'
                placeholder='Enter address'
                value={formData.address}
                readOnly
                className='rounded-lg border-green-300 bg-green-50 text-green-800'
                required
              />
            </div>

            {/* Severity (Optional) */}
            <div className='space-y-2'>
              <Label htmlFor='severity' className='font-medium text-gray-900'>
                Severity (Optional)
              </Label>
              <Select
                value={formData.severity}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, severity: value })
                }
              >
                <SelectTrigger className='rounded-lg border-green-300 focus:border-green-500'>
                  <SelectValue placeholder='Select severity' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='critical'>Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label
                htmlFor='description'
                className='font-medium text-gray-900'
              >
                Description *
              </Label>
              <Textarea
                id='description'
                placeholder='Detailed description of the issue (minimum 20 characters)'
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`rounded-lg border-green-300 focus:border-green-500 focus:ring-green-500 ${
                  formData.description.length > 0 &&
                  (formData.description.length < DESCRIPTION_MIN_LENGTH ||
                    formData.description.length > DESCRIPTION_MAX_LENGTH)
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                rows={4}
                minLength={DESCRIPTION_MIN_LENGTH}
                maxLength={DESCRIPTION_MAX_LENGTH}
                required
              />
              <div className='flex items-center justify-between text-xs'>
                <span className={`font-medium ${getDescriptionCountColor()}`}>
                  {formData.description.length}/{DESCRIPTION_MAX_LENGTH}{' '}
                  characters
                </span>
                {formData.description.length > 0 &&
                  formData.description.length < DESCRIPTION_MIN_LENGTH && (
                    <span className='font-medium text-red-500'>
                      Minimum {DESCRIPTION_MIN_LENGTH} characters required
                    </span>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={
                isSubmitting ||
                validateForm().length > 0 ||
                photo.size > 4 * 1024 * 1024
              }
              className='w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? (
                <div className='flex items-center space-x-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Send className='h-4 w-4' />
                  <span>Submit Report</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
