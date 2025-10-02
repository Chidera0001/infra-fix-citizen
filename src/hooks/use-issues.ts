import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi, type Issue } from '@/lib/supabase-api';
import { useToast } from './use-toast';

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
    staleTime: 30000, // 30 seconds
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
    mutationFn: issuesApi.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
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

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      issuesApi.updateIssue(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
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
      queryClient.invalidateQueries({ queryKey: ['issues'] });
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
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useIssueStatistics(lat?: number, lng?: number, radius?: number) {
  return useQuery({
    queryKey: ['issue-statistics', lat, lng, radius],
    queryFn: () => issuesApi.getIssueStatistics(lat, lng, radius),
    staleTime: 60000, // 1 minute
  });
}
