import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateOfflineIssue } from '@/hooks/use-separate-issues';
import { OfflineHeader } from '@/components/offline/OfflineHeader';
import { OfflineNotice } from '@/components/offline/OfflineNotice';
import { ReportForm } from '@/components/offline/ReportForm';

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
    category: '',
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

      await createOfflineIssueMutation.mutateAsync({
        issueData,
        userId: 'offline-user', // Use a placeholder for offline users
        photos: formData.photo ? [formData.photo] : [],
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
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
