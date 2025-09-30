import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { issuesApi, profileApi, subscriptions, type Issue, type IssueInsert, type IssueUpdate } from '@/lib/supabase-api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: any) => [...issueKeys.lists(), filters] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  detail: (id: string) => [...issueKeys.details(), id] as const,
  statistics: (lat?: number, lng?: number, radius?: number) => 
    [...issueKeys.all, 'statistics', lat, lng, radius] as const,
};

// Hook to get issues with filters
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
    queryKey: issueKeys.list(filters),
    queryFn: () => issuesApi.getIssues(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single issue
export function useIssue(id: string) {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => issuesApi.getIssueById(id),
    enabled: !!id,
  });
}

// Hook to get issue statistics
export function useIssueStatistics(lat?: number, lng?: number, radius?: number) {
  return useQuery({
    queryKey: issueKeys.statistics(lat, lng, radius),
    queryFn: () => issuesApi.getIssueStatistics(lat, lng, radius),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to create a new issue
export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (issueData: Omit<IssueInsert, 'reporter_id'>) => {
      // Get or create user profile
      if (!user) throw new Error('User not authenticated');
      
      let profile = await profileApi.getProfile(user.id);
      if (!profile) {
        profile = await profileApi.createOrUpdateProfile(user.id, {
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName,
        });
      }

      return issuesApi.createIssue({
        ...issueData,
        reporter_id: profile.id,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.statistics() });
      toast({
        title: 'Issue Created',
        description: 'Your infrastructure issue has been reported successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create issue. Please try again.',
        variant: 'destructive',
      });
      console.error('Create issue error:', error);
    },
  });
}

// Hook to update an issue
export function useUpdateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: IssueUpdate }) =>
      issuesApi.updateIssue(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.setQueryData(issueKeys.detail(variables.id), data);
      toast({
        title: 'Issue Updated',
        description: 'The issue has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update issue. Please try again.',
        variant: 'destructive',
      });
      console.error('Update issue error:', error);
    },
  });
}

// Hook to delete an issue
export function useDeleteIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: issuesApi.deleteIssue,
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.removeQueries({ queryKey: issueKeys.detail(issueId) });
      toast({
        title: 'Issue Deleted',
        description: 'The issue has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete issue. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete issue error:', error);
    },
  });
}

// Hook to toggle upvote on an issue
export function useToggleUpvote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: issuesApi.toggleUpvote,
    onSuccess: (data, issueId) => {
      // Update the specific issue in cache
      queryClient.setQueryData(
        issueKeys.detail(issueId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            upvotes: data.upvote_count,
          };
        }
      );

      // Invalidate issues list to update upvote counts
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });

      const action = data.action === 'added' ? 'added' : 'removed';
      toast({
        title: `Upvote ${action}`,
        description: `Your upvote has been ${action}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update upvote. Please try again.',
        variant: 'destructive',
      });
      console.error('Toggle upvote error:', error);
    },
  });
}

// Hook for real-time issues subscription
export function useIssuesSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscriptions.subscribeToIssues((payload) => {
      console.log('Real-time issue update:', payload);
      
      // Invalidate and refetch issues
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      
      // If it's a specific issue update, invalidate that too
      if (payload.new?.id) {
        queryClient.invalidateQueries({ 
          queryKey: issueKeys.detail(payload.new.id) 
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
}
