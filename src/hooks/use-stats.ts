import { useQuery } from '@tanstack/react-query';
import { issuesApi } from '@/lib/supabase-api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Fetch all stats from public endpoint (no auth required)
      const issueStats = await issuesApi.getIssueStatistics();

      return {
        issuesResolved: issueStats?.resolved_issues || 0,
        activeCitizens: issueStats?.active_citizens || 0,
        avgResponseTime: issueStats?.avg_response_time_hours || 0,
        totalIssues: issueStats?.total_issues || 0,
        openIssues: issueStats?.open_issues || 0,
        inProgressIssues: issueStats?.in_progress_issues || 0,
      };
    },
    staleTime: 10000, // 10 seconds - more responsive
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
