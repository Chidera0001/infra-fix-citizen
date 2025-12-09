import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '@/lib/supabase-api';
import { useToast } from './use-toast';
import { offlineStorage } from '@/utils/offlineStorage.client';
import { syncService } from '@/utils/syncService';
import { registerBackgroundSync } from '@/utils/serviceWorkerRegistration';

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

// Separate hook for offline-only reporting with offline-first capabilities
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
      // Step 1: Always save to Dexie immediately (offline-first)
      // NO AI verification here - that only happens during sync when coming back online
      const reportId = await offlineStorage.savePendingReport({
        issueData,
        userId,
        photos: photos || [],
      });

      // Register background sync for when connection is restored
      // AI verification will happen during sync, not here
      if ('serviceWorker' in navigator) {
        setTimeout(() => {
          registerBackgroundSync('sync-pending-reports').catch(() => {
            // Silent failure - background sync might not be available
          });
        }, 0);
      }

      return { id: reportId, offline: true };
    },
    onSuccess: data => {
      // Defer query invalidation to prevent blocking - run in next tick
      // This prevents hangs if invalidation triggers network requests when offline
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      }, 0);

      // Only show toast if report was synced (not for initial offline save)
      // Offline save toast is shown immediately in the form handler for better UX
      if (data.synced) {
        toast({
          title: '✅ Report Submitted!',
          description: 'Your report has been successfully submitted',
        });
        // Also refresh issues list
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['issues'] });
        }, 0);
      }
      // Note: Offline save toast is now shown in the form submission handler
      // to ensure it appears immediately, independent of mutation completion
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save offline report',
        variant: 'destructive',
      });
    },
  });
}
