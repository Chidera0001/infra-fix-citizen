import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateOfflineIssue } from '@/hooks/use-separate-issues';
import { OfflineHeader } from '@/components/offline/OfflineHeader';
import { OfflineNotice } from '@/components/offline/OfflineNotice';
import { ReportForm } from '@/components/offline/ReportForm';
import { ISSUE_CATEGORIES } from '@/constants';

interface ReportFormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  location: string;
  photo: File | null;
}

const OfflineReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createOfflineIssueMutation = useCreateOfflineIssue();

  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: ISSUE_CATEGORIES[0]?.value ?? 'bad_roads',
    urgency: '',
    location: '',
    photo: null,
  });

  const handleFormDataChange = (updates: Partial<ReportFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
        location_lat: 6.5244, // Default Lagos coords - will be geocoded during sync
        location_lng: 3.3792,
      };

      // Show toast immediately - independent of mutation completion
      // This ensures toast appears even if mutation hangs in DevTools offline mode
      toast({
        title: '📱 Report Saved Offline',
        description: "Your report will be submitted when you're back online",
      });

      // Start mutation but don't wait for it - navigate independently
      // This ensures form closes even if mutation hangs in DevTools offline mode
      const mutationPromise = createOfflineIssueMutation.mutateAsync({
        issueData,
        userId: 'offline-user', // Use a placeholder for offline users
        photos: formData.photo ? [formData.photo] : [],
      });

      // Set up timeout to navigate even if mutation hangs
      // Navigation happens independently of mutation completion
      const navigationTimeout = setTimeout(() => {
        navigate('/');
      }, 1500); // Delay to ensure toast is visible before navigation

      // If mutation completes quickly, navigate normally
      mutationPromise
        .then(() => {
          clearTimeout(navigationTimeout);
          // Brief delay to show toast before navigating
          setTimeout(() => {
            navigate('/');
          }, 500);
        })
        .catch(() => {
          // Clear timeout but don't navigate on error - let user see error message
          clearTimeout(navigationTimeout);
        });
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <OfflineHeader />

      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        <OfflineNotice />

        <ReportForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          isSubmitting={createOfflineIssueMutation.isPending}
          isOnline={false} // Force offline mode
        />

        <div className='mt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/')}
            className='w-full'
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfflineReportIssue;
