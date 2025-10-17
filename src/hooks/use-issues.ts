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
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => issuesApi.getIssues(filters),
    staleTime: 10000, // 10 seconds - more responsive
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
    mutationFn: async ({ issueData, userId, photos, isOnline }: { issueData: any; userId?: string; photos?: File[]; isOnline: boolean }) => {
      if (isOnline) {
        // Online: Use existing API
        return issuesApi.createIssue(issueData, userId, photos);
      } else {
        // Offline: Save to IndexedDB - NO API CALLS
        const reportId = await offlineStorage.savePendingReport({
          issueData,
          userId,
          photos: photos || []
        });
        return { id: reportId, offline: true };
      }
    },
    onSuccess: (data: any) => {
      if (data.offline) {
        // Offline success
        toast({
          title: 'Report Saved Offline',
          description: 'Your report will be submitted when you\'re back online',
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

export function useIssueStatistics(lat?: number, lng?: number, radius?: number) {
  return useQuery({
    queryKey: ['issue-statistics', lat, lng, radius],
    queryFn: () => issuesApi.getIssueStatistics(lat, lng, radius),
    staleTime: 10000, // 10 seconds - more responsive
  });
}

export function usePendingReports() {
  return useQuery({
    queryKey: ['pending-reports'],
    queryFn: () => offlineStorage.getPendingReports(),
    staleTime: 10000, // 10 seconds - more responsive
    refetchOnWindowFocus: true, // Refetch on window focus to catch new reports
    refetchOnMount: true, // Refetch on mount to ensure fresh data
  });
}

export function useSyncPendingReports() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => syncService.syncPendingReports(user?.id),
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast({
          title: '🎉 Offline Reports Synced!',
          description: `${successCount} offline report(s) have been successfully submitted to the system`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: '⚠️ Some Reports Failed',
          description: `${failCount} report(s) failed to sync. Check pending reports for details.`,
          variant: 'destructive',
        });
      }
      
      // Refresh pending reports and other queries
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync pending reports',
        variant: 'destructive',
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
    onSuccess: (reportId) => {
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
