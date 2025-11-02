import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '@/lib/supabase-api';
import { useToast } from './use-toast';
import { offlineStorage } from '@/utils/offlineStorage';
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
      const reportId = await offlineStorage.savePendingReport({
        issueData,
        userId,
        photos: photos || [],
      });

      // Step 2: Check if online and attempt immediate sync (only if truly online)
      // Use a more reliable online check that actually tests connectivity
      const isOnline = navigator.onLine;
      
      // Only attempt sync if online AND we have a userId
      // Don't block if sync fails - it will retry via background sync
      if (isOnline && userId) {
        // Attempt immediate sync in background (don't await - non-blocking)
        // This prevents the UI from getting stuck
        syncService.syncSingleReport(reportId.toString())
          .then((syncResult) => {
            if (syncResult.success) {
              // Successfully synced - invalidate queries to refresh UI
              queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
              queryClient.invalidateQueries({ queryKey: ['issues'] });
            }
          })
          .catch((error) => {
            // Silent failure - will retry via background sync
            console.warn('Immediate sync error (will retry via background sync):', error);
          });
      }
      
      // Always register background sync (safe to call even if already registered)
      // This ensures sync happens when connection is restored
      if ('serviceWorker' in navigator) {
        registerBackgroundSync('sync-pending-reports').catch(() => {
          // Silent failure - background sync might not be available
        });
      }

      return { id: reportId, offline: true };
    },
    onSuccess: (data) => {
      // Invalidate pending reports query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });

      if (data.synced) {
        toast({
          title: '✅ Report Submitted!',
          description: 'Your report has been successfully submitted',
        });
        // Also refresh issues list
        queryClient.invalidateQueries({ queryKey: ['issues'] });
      } else {
        toast({
          title: '📱 Report Saved Offline',
          description: "Your report will be submitted when you're back online",
        });
      }
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
