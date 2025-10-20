import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '@/lib/supabase-api';
import { useToast } from './use-toast';
import { offlineStorage } from '@/utils/offlineStorage';

// Separate hook for online-only reporting
export function useCreateOnlineIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      issueData,
      userId,
      photos,
    }: {
      issueData: any;
      userId?: string;
      photos?: File[];
    }) => {
      // Always make API call - this is for online only
      return issuesApi.createIssue(issueData, userId, photos);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      toast({
        title: 'Success!',
        description: 'Issue reported successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create issue',
        variant: 'destructive',
      });
    },
  });
}

// Separate hook for offline-only reporting
export function useCreateOfflineIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      issueData,
      userId,
      photos,
    }: {
      issueData: any;
      userId?: string;
      photos?: File[];
    }) => {
      // Always save to IndexedDB - this is for offline only
      const reportId = await offlineStorage.savePendingReport({
        issueData,
        userId,
        photos: photos || [],
      });

      return { id: reportId, offline: true };
    },
    onSuccess: data => {
      // Invalidate pending reports query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });

      toast({
        title: 'Report Saved Offline',
        description: "Your report will be submitted when you're back online",
      });
    },
    onError: (error: Error) => {
      console.error('📱 OFFLINE-CREATE: Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save offline report',
        variant: 'destructive',
      });
    },
  });
}
