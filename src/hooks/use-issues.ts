import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi, type Issue } from '@/lib/supabase-api';
import { useToast } from './use-toast';
import { useOnlineStatus } from './use-online-status';
import { useAuth } from '@/contexts/AuthContext';
import { offlineStorage } from '@/utils/offlineStorage';
import { syncService } from '@/utils/syncService';
import type { PendingReport } from '@/types/offline';

export function useIssues(filters?: {
  status?: string;
  category?: string;
  severity?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['issues', user?.id, filters],
    queryFn: () => issuesApi.getIssues(filters),
    staleTime: 10000, // 10 seconds - more responsive
    enabled: !!user, // Only fetch when user is logged in
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => issuesApi.getIssueById(id),
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      issueData,
      userId,
      photos,
      isOnline,
    }: {
      issueData: any;
      userId?: string;
      photos?: File[];
      isOnline: boolean;
    }) => {
      if (isOnline) {
        // Online: Use existing API
        return issuesApi.createIssue(issueData, userId, photos);
      } else {
        // Offline: Save to IndexedDB - NO API CALLS
        const reportId = await offlineStorage.savePendingReport({
          issueData,
          userId,
          photos: photos || [],
        });
        return { id: reportId, offline: true };
      }
    },
    onSuccess: (data: any) => {
      if (data.offline) {
        // Offline success
        toast({
          title: 'Report Saved Offline',
          description: "Your report will be submitted when you're back online",
        });
      } else {
        // Online success - invalidate queries
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
        toast({
          title: 'Success!',
          description: 'Issue reported successfully',
        });
      }
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

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => {
      return issuesApi.updateIssue(id, updates);
    },
    onSuccess: () => {
      // Invalidate all related queries to refresh stats
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: 'Success!',
        description: 'Issue updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update issue',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: issuesApi.deleteIssue,
    onSuccess: () => {
      // Invalidate all related queries to refresh stats
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: 'Success!',
        description: 'Issue deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete issue',
        variant: 'destructive',
      });
    },
  });
}

export function useToggleUpvote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.toggleUpvote,
    onSuccess: () => {
      // Invalidate all related queries to refresh stats
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useIssueStatistics(
  lat?: number,
  lng?: number,
  radius?: number
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['issue-statistics', user?.id, lat, lng, radius],
    queryFn: () => issuesApi.getIssueStatistics(lat, lng, radius),
    staleTime: 10000, // 10 seconds - more responsive
  });
}

export function usePendingReports() {
  return useQuery({
    queryKey: ['pending-reports'],
    queryFn: () => offlineStorage.getPendingReports(),
    staleTime: 30000, // 30 seconds - data considered fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
    refetchOnMount: true, // Still refetch on mount to ensure fresh data when component loads
  });
}

export function useSyncPendingReports() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => syncService.syncPendingReports(user?.id),
    onSuccess: results => {
      const successCount = results.filter(r => r.success).length;
      const failedResults = results.filter(r => !r.success);

      if (successCount > 0) {
        toast({
          title: '🎉 Offline Reports Synced!',
          description: `${successCount} offline report(s) have been successfully submitted to the system`,
        });
      }

      if (failedResults.length > 0) {
        // Show specific error messages from AI verification
        const errorMessages = failedResults
          .map(r => r.error)
          .filter((error): error is string => !!error);

        if (errorMessages.length > 0) {
          // If all failures have the same message, show it once
          const uniqueErrors = [...new Set(errorMessages)];

          if (uniqueErrors.length === 1) {
            // Format the error message with icons and line breaks (like AI error popup)
            let formattedMessage = 'Please review the following:\n\n';

            // Extract image and description errors if present
            const imageErrorMatch = uniqueErrors[0].match(
              /Image Error:\s*(.+?)(?:\n|$)/i
            );
            const descriptionErrorMatch = uniqueErrors[0].match(
              /Description Error:\s*(.+?)(?:\n|$)/i
            );

            // Also check for "Image:" and "Description:" patterns in the error message
            const imageErrorAltMatch = uniqueErrors[0].match(
              /Image:\s*(.+?)(?:\.|$)/i
            );
            const descriptionErrorAltMatch = uniqueErrors[0].match(
              /Description:\s*(.+?)(?:\.|$)/i
            );

            if (imageErrorMatch) {
              formattedMessage += `📷 Image: ${imageErrorMatch[1]}\n`;
            } else if (imageErrorAltMatch) {
              formattedMessage += `📷 Image: ${imageErrorAltMatch[1]}\n`;
            }

            if (descriptionErrorMatch) {
              formattedMessage += `📝 Description: ${descriptionErrorMatch[1]}\n`;
            } else if (descriptionErrorAltMatch) {
              formattedMessage += `📝 Description: ${descriptionErrorAltMatch[1]}\n`;
            }

            // If no specific errors found, use the original message without "Sync failed:" prefix
            if (
              !imageErrorMatch &&
              !descriptionErrorMatch &&
              !imageErrorAltMatch &&
              !descriptionErrorAltMatch
            ) {
              formattedMessage = uniqueErrors[0].replace(
                /Sync failed:\s*/i,
                ''
              );
            }

            toast({
              title: '⚠️ Offline Sync Failed',
              description: formattedMessage,
              variant: 'warning',
              duration: 8000,
            });
          } else {
            // Multiple different errors - format the first one with icons
            let formattedMessage = 'Please review the following:\n\n';

            const imageErrorMatch = uniqueErrors[0].match(
              /Image Error:\s*(.+?)(?:\n|$)/i
            );
            const descriptionErrorMatch = uniqueErrors[0].match(
              /Description Error:\s*(.+?)(?:\n|$)/i
            );
            const imageErrorAltMatch = uniqueErrors[0].match(
              /Image:\s*(.+?)(?:\.|$)/i
            );
            const descriptionErrorAltMatch = uniqueErrors[0].match(
              /Description:\s*(.+?)(?:\.|$)/i
            );

            if (imageErrorMatch) {
              formattedMessage += `📷 Image: ${imageErrorMatch[1]}\n`;
            } else if (imageErrorAltMatch) {
              formattedMessage += `📷 Image: ${imageErrorAltMatch[1]}\n`;
            }

            if (descriptionErrorMatch) {
              formattedMessage += `📝 Description: ${descriptionErrorMatch[1]}\n`;
            } else if (descriptionErrorAltMatch) {
              formattedMessage += `📝 Description: ${descriptionErrorAltMatch[1]}\n`;
            }

            if (
              !imageErrorMatch &&
              !descriptionErrorMatch &&
              !imageErrorAltMatch &&
              !descriptionErrorAltMatch
            ) {
              formattedMessage = `${failedResults.length} report(s) failed to sync. ${uniqueErrors[0].replace(/Sync failed:\s*/i, '')}`;
            }

            toast({
              title: `⚠️ Offline Sync Failed`,
              description: formattedMessage,
              variant: 'warning',
              duration: 8000,
            });
          }
        } else {
          // Fallback for errors without specific messages
          toast({
            title: `⚠️ Offline Sync Failed`,
            description:
              'Some reports failed to sync. Please check pending reports.',
            variant: 'warning',
            duration: 8000,
          });
        }
      }

      // Refresh pending reports and other queries
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: '⚠️ Offline Sync Failed',
        description: error.message || 'Failed to sync pending reports',
        variant: 'warning',
        duration: 8000,
      });
    },
  });
}

export function useDeletePendingReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reportId: string) => {
      await offlineStorage.deletePendingReport(reportId);
      return reportId;
    },
    onSuccess: reportId => {
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      toast({
        title: 'Report Deleted',
        description: 'Offline report has been removed',
      });
    },
    onError: (error: Error) => {
      console.error('🗑️ DELETE: Error deleting report:', error);
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete report',
        variant: 'destructive',
      });
    },
  });
}
