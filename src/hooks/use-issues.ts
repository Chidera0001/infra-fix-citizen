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
        // Helper function to format error message for a single report
        const formatErrorMessage = (errorMessage: string): string => {
          let formattedMessage = 'Please review the following:\n\n';

          // Pattern 1: "Image Error: ..." or "Description Error: ..." (from AI response)
          const imageErrorMatch = errorMessage.match(
            /Image Error:\s*(.+?)(?:\n|$)/i
          );
          const descriptionErrorMatch = errorMessage.match(
            /Description Error:\s*(.+?)(?:\n|$)/i
          );

          // Pattern 2: "Image: ..." or "Description: ..." (from formatted error with both)
          const imageErrorAltMatch = errorMessage.match(
            /Image:\s*(.+?)(?:\.|$)/i
          );
          const descriptionErrorAltMatch = errorMessage.match(
            /Description:\s*(.+?)(?:\.|$)/i
          );

          // Pattern 3: "Image does not match issue category: ..." (most specific)
          const imageCategoryMatch = errorMessage.match(
            /Image does not match issue category:\s*(.+?)(?:\.|$|Description:|Description Error:)/i
          );

          // Pattern 4: "The image does not match... {any error text}"
          const imageOnlyMatch = errorMessage.match(
            /(?:Sync failed:)?\s*The image does not match the selected category\.\s*((?!Description:|Description Error:).+?)(?:\.|$|Description:|Description Error:)/is
          );

          // Pattern 5: "The description does not match..."
          const descriptionOnlyMatch = errorMessage.match(
            /(?:Sync failed:)?\s*The description does not match the selected category\.\s*(.+?)(?:\.|$)/is
          );

          // Pattern 6: "Please use keywords related to..."
          const descriptionKeywordsMatch = errorMessage.match(
            /Please use keywords related to.*?(?:\.|$)/i
          );

          // Extract image error
          if (imageErrorMatch) {
            formattedMessage += `📷 Image: ${imageErrorMatch[1].trim()}\n`;
          } else if (imageErrorAltMatch) {
            formattedMessage += `📷 Image: ${imageErrorAltMatch[1].trim()}\n`;
          } else if (imageCategoryMatch) {
            formattedMessage += `📷 Image: ${imageCategoryMatch[1].trim()}\n`;
          } else if (imageOnlyMatch) {
            formattedMessage += `📷 Image: ${imageOnlyMatch[1].trim()}\n`;
          }

          // Extract description error
          if (descriptionErrorMatch) {
            formattedMessage += `📝 Description: ${descriptionErrorMatch[1].trim()}\n`;
          } else if (descriptionErrorAltMatch) {
            formattedMessage += `📝 Description: ${descriptionErrorAltMatch[1].trim()}\n`;
          } else if (descriptionOnlyMatch) {
            formattedMessage += `📝 Description: ${descriptionOnlyMatch[1].trim()}\n`;
          } else if (descriptionKeywordsMatch) {
            formattedMessage += `📝 Description: ${descriptionKeywordsMatch[0].trim()}\n`;
          }

          // If no specific errors found, use the original message
          if (
            !imageErrorMatch &&
            !descriptionErrorMatch &&
            !imageErrorAltMatch &&
            !descriptionErrorAltMatch &&
            !imageCategoryMatch &&
            !imageOnlyMatch &&
            !descriptionOnlyMatch &&
            !descriptionKeywordsMatch
          ) {
            formattedMessage = errorMessage.replace(/Sync failed:\s*/i, '');
          }

          return formattedMessage;
        };

        // Get error messages with report IDs for tracking
        const errorReports = failedResults
          .map(r => ({
            error: r.error || 'Unknown error',
            reportId: r.reportId,
          }))
          .filter(r => r.error);

        if (errorReports.length > 0) {
          // Show reports sequentially: first one immediately, then update every 5-6 seconds
          const firstError = formatErrorMessage(errorReports[0].error);
          const toastController = toast({
            title: `⚠️ Offline Sync Failed (1/${errorReports.length})`,
            description: firstError,
            variant: 'warning',
            duration: 6000, // 6 seconds per report
          });

          // If multiple reports, update toast sequentially
          if (errorReports.length > 1) {
            let currentIndex = 0;
            const showNextReport = () => {
              currentIndex++;
              if (currentIndex < errorReports.length) {
                const nextError = formatErrorMessage(
                  errorReports[currentIndex].error
                );
                toastController.update({
                  title: `⚠️ Offline Sync Failed (${currentIndex + 1}/${errorReports.length})`,
                  description: nextError,
                  variant: 'warning',
                  duration: 6000,
                } as any);
                // Schedule next update after 5.5 seconds (slight overlap for smooth transition)
                setTimeout(showNextReport, 5500);
              }
            };
            // Start showing next report after 5.5 seconds
            setTimeout(showNextReport, 5500);
          }
        } else {
          // Fallback for errors without specific messages
          toast({
            title: '⚠️ Offline Sync Failed',
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
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete report',
        variant: 'destructive',
      });
    },
  });
}
