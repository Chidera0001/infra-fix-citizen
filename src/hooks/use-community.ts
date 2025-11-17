import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '@/lib/supabase-api';
import { useToast } from './use-toast';

/**
 * Hook to check for duplicate issues before submission
 */
export function useCheckDuplicate() {
  return useMutation({
    mutationFn: ({
      category,
      lat,
      lng,
    }: {
      category: string;
      lat: number;
      lng: number;
    }) => issuesApi.checkDuplicateIssue(category, lat, lng),
  });
}

/**
 * Hook to fetch community issues based on location and filters
 */
export function useCommunityIssues(
  lat?: number,
  lng?: number,
  radiusKm: number = 5,
  category?: string,
  status?: string,
  sortBy: string = 'upvotes',
  enabled: boolean = true,
  excludeOwnIssues: boolean = true
) {
  return useQuery({
    queryKey: [
      'community-issues',
      lat,
      lng,
      radiusKm,
      category,
      status,
      sortBy,
      excludeOwnIssues,
    ],
    queryFn: () => {
      if (!lat || !lng) {
        throw new Error('Location is required');
      }
      return issuesApi.getCommunityIssues(
        lat,
        lng,
        radiusKm,
        category,
        status,
        sortBy,
        50,
        0,
        excludeOwnIssues
      );
    },
    enabled: enabled && !!lat && !!lng,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to toggle upvote on an issue with optimistic updates
 */
export function useToggleUpvoteWithOptimistic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: issuesApi.toggleUpvote,
    onMutate: async (issueId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['community-issues'] });

      // Snapshot the previous value
      const previousIssues = queryClient.getQueryData(['community-issues']);

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: ['community-issues'] },
        (old: any) => {
          if (!old) return old;
          return old.map((issue: any) => {
            if (issue.id === issueId) {
              return {
                ...issue,
                user_has_upvoted: !issue.user_has_upvoted,
                upvotes: issue.user_has_upvoted
                  ? issue.upvotes - 1
                  : issue.upvotes + 1,
              };
            }
            return issue;
          });
        }
      );

      return { previousIssues };
    },
    onError: (err, issueId, context: any) => {
      // Rollback to previous value on error
      queryClient.setQueryData(
        ['community-issues'],
        context?.previousIssues
      );
      toast({
        title: 'Error',
        description: 'Failed to update upvote. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['community-issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue-statistics'] });
    },
  });
}

