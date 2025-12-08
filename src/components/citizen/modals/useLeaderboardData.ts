import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Issue } from '@/lib/supabase-api';

export interface LeaderboardEntry {
  userId: string;
  reportCount: number;
  rank: number;
}

/**
 * Calculate leaderboard from issues data
 */
export const useCalculateLeaderboard = (
  allIssues: Issue[]
): LeaderboardEntry[] => {
  return useMemo(() => {
    const reportCounts = new Map<string, number>();

    allIssues.forEach(issue => {
      if (issue.reporter_id) {
        const currentCount = reportCounts.get(issue.reporter_id) || 0;
        reportCounts.set(issue.reporter_id, currentCount + 1);
      }
    });

    const entries: LeaderboardEntry[] = Array.from(reportCounts.entries())
      .map(([userId, reportCount]) => ({
        userId,
        reportCount,
        rank: 0,
      }))
      .sort((a, b) => b.reportCount - a.reportCount)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return entries;
  }, [allIssues]);
};

/**
 * Fetch profiles for leaderboard entries
 */
export const useLeaderboardProfiles = (profileIds: string[]) => {
  return useQuery({
    queryKey: ['leaderboard-profiles', profileIds.sort().join(',')],
    queryFn: async () => {
      if (profileIds.length === 0) return [];

      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < profileIds.length; i += batchSize) {
        const batch = profileIds.slice(i, i + batchSize);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, user_nickname')
          .in('id', batch);

        if (error) {
          console.error('Error fetching profiles batch:', error);
          throw error;
        }

        if (data) {
          batches.push(...data);
        }
      }

      return batches;
    },
    enabled: profileIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Get display entries (top 10 + current user if not in top 10)
 */
export const useDisplayEntries = (
  leaderboard: LeaderboardEntry[],
  currentUserRank: number | null,
  simulatedLeaderboard: LeaderboardEntry[] | null = null
): LeaderboardEntry[] => {
  return useMemo(() => {
    const boardToUse = simulatedLeaderboard || leaderboard;
    const topEntries = boardToUse.slice(0, 10);

    if (currentUserRank && currentUserRank > 10) {
      const currentUserEntry = boardToUse[currentUserRank - 1];
      return [...topEntries, currentUserEntry];
    }

    return topEntries;
  }, [leaderboard, currentUserRank, simulatedLeaderboard]);
};
