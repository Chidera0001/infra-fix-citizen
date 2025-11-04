import { useQuery } from '@tanstack/react-query';
import { issuesApi, adminApi } from '@/lib/supabase-api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Get issue statistics
      const issueStats = await issuesApi.getIssueStatistics();

      // Get user statistics
      const userStats = await adminApi.getAllUsers({ limit: 1000 });

      // Get performance metrics
      const performanceMetrics = await adminApi.getPerformanceMetrics();

      return {
        issuesResolved: issueStats?.resolved_issues || 0,
        activeCitizens: userStats?.length || 0,
        avgResponseTime: performanceMetrics?.avgResponseTime || 0,
        totalIssues: issueStats?.total_issues || 0,
        openIssues: issueStats?.open_issues || 0,
        inProgressIssues: issueStats?.in_progress_issues || 0,
      };
    },
    staleTime: 10000, // 10 seconds - more responsive
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
