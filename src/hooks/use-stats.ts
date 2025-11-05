import { useQuery } from '@tanstack/react-query';
import { issuesApi, adminApi } from '@/lib/supabase-api';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['stats', user?.id || 'public'],
    queryFn: async () => {
      // Always fetch public issue statistics (no auth required)
      const issueStats = await issuesApi.getIssueStatistics();

      // Initialize with public stats
      let activeCitizens = 0;
      let avgResponseTime = 0;

      // Calculate average response time from public data (resolved issues)
      try {
        const { data: resolvedIssues, error: issuesError } = await supabase
          .from('issues')
          .select('created_at, resolved_at, updated_at, status')
          .in('status', ['resolved', 'closed'])
          .not('resolved_at', 'is', null)
          .order('resolved_at', { ascending: false })
          .limit(100); // Limit to recent 100 resolved issues for performance

        if (!issuesError && resolvedIssues && resolvedIssues.length > 0) {
          // Calculate average response time from resolved issues
          const issuesWithResponseTime = resolvedIssues.filter(
            issue => issue.resolved_at && issue.created_at
          );

          if (issuesWithResponseTime.length > 0) {
            const totalResponseTime = issuesWithResponseTime.reduce((sum, issue) => {
              const responseTime =
                new Date(issue.resolved_at!).getTime() -
                new Date(issue.created_at).getTime();
              return sum + responseTime;
            }, 0);

            // Convert to hours and round to 1 decimal
            avgResponseTime = Math.round(
              (totalResponseTime / issuesWithResponseTime.length / (1000 * 60 * 60)) * 10
            ) / 10;
          }
        }
      } catch (error) {
        console.warn('Failed to calculate avg response time from public data:', error);
        // Fallback to 0 if calculation fails
        avgResponseTime = 0;
      }

      // Only fetch admin stats if user is authenticated
      if (user) {
        try {
          // Get user statistics (requires auth)
          const userStats = await adminApi.getAllUsers({ limit: 1000 });
          activeCitizens = userStats?.length || 0;

          // Use admin performance metrics if available (more accurate)
          const performanceMetrics = await adminApi.getPerformanceMetrics();
          if (performanceMetrics?.avgResponseTime) {
            avgResponseTime = performanceMetrics.avgResponseTime;
          }
        } catch (error) {
          // If admin API fails, fallback to estimates from issue stats
          console.warn('Failed to fetch admin stats, using estimates:', error);
          // Estimate active citizens from total issues (rough approximation)
          // Assume ~30% of issues are from unique users as active citizens
          activeCitizens = Math.max(1, Math.floor((issueStats?.total_issues || 0) * 0.3));
          // avgResponseTime already calculated from public data above
        }
      } else {
        // For public users (landing page), estimate from issue statistics
        // Estimate active citizens from total issues (rough approximation)
        // Assume ~30% of issues are from unique users as active citizens
        activeCitizens = Math.max(1, Math.floor((issueStats?.total_issues || 0) * 0.3));
        // avgResponseTime already calculated from public data above
      }

      return {
        issuesResolved: issueStats?.resolved_issues || 0,
        activeCitizens,
        avgResponseTime,
        totalIssues: issueStats?.total_issues || 0,
        openIssues: issueStats?.open_issues || 0,
        inProgressIssues: issueStats?.in_progress_issues || 0,
      };
    },
    staleTime: 10000, // 10 seconds - more responsive
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
