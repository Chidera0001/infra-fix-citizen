import { useMemo, useEffect, useState, useRef } from 'react';
import { Play, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentProfile } from '@/hooks/use-profile';
import type { Issue } from '@/lib/supabase-api';
import {
  useCalculateLeaderboard,
  useLeaderboardProfiles,
  useDisplayEntries,
  type LeaderboardEntry,
} from './useLeaderboardData';
import { useLeaderboardSimulation } from './useLeaderboardSimulation';
import { generateAvatarUrl, generateCoolUsername } from './leaderboardUtils';
import { LeaderboardEntryCard } from './LeaderboardEntryCard';
import { CurrentUserRankCard } from './CurrentUserRankCard';

interface LeaderboardProps {
  allIssues: Issue[];
  currentUserId?: string;
}

export const Leaderboard = ({ allIssues, currentUserId }: LeaderboardProps) => {
  const { data: currentProfile } = useCurrentProfile();
  const currentProfileId = currentProfile?.id;

  // Calculate leaderboard from issues
  const leaderboard = useCalculateLeaderboard(allIssues);

  // Animation state
  const [showCelebration, setShowCelebration] = useState(false);
  const [rankChangeDirection, setRankChangeDirection] = useState<
    'up' | 'down' | null
  >(null);
  const userCardRef = useRef<HTMLDivElement>(null);

  // Simulation hook (can be easily disabled by not using it)
  const {
    simulatedRank,
    simulatedLeaderboard,
    simulateReachingFirst,
    simulateRankDown,
    previousRankRef,
    isSimulationEnabled,
  } = useLeaderboardSimulation({
    leaderboard,
    currentProfileId,
    userCardRef,
  });

  // Find current user's position
  const currentUserRank = useMemo(() => {
    if (!currentProfileId) return null;
    if (simulatedRank !== null) return simulatedRank;
    const index = leaderboard.findIndex(
      entry => entry.userId === currentProfileId
    );
    return index >= 0 ? index + 1 : null;
  }, [leaderboard, currentProfileId, simulatedRank]);

  // Get display entries (top 10 + current user if not in top 10)
  const displayEntries = useDisplayEntries(
    leaderboard,
    currentUserRank,
    simulatedLeaderboard
  );

  // Fetch profiles for all leaderboard entries
  const profileIds = useMemo(() => {
    const ids = displayEntries.map(entry => entry.userId).filter(Boolean);
    return [...new Set(ids)];
  }, [displayEntries]);

  const {
    data: profiles = [],
    isLoading: isLoadingProfiles,
    error: profilesError,
  } = useLeaderboardProfiles(profileIds);

  // Create a map of profile ID to profile data
  const profilesMap = useMemo(() => {
    const map = new Map();
    profiles.forEach(profile => {
      if (profile?.id) {
        map.set(profile.id, profile);
      }
    });
    return map;
  }, [profiles]);

  // Generate avatar URLs for all display entries
  const avatarUrlsMap = useMemo(() => {
    const map = new Map<string, string>();
    displayEntries.forEach(entry => {
      if (!map.has(entry.userId)) {
        map.set(entry.userId, generateAvatarUrl(entry.userId));
      }
    });
    return map;
  }, [displayEntries]);

  // Detect rank changes and trigger animations
  useEffect(() => {
    if (!currentUserRank || !currentProfileId) {
      previousRankRef.current = null;
      return;
    }

    const previousRank = previousRankRef.current;

    // Skip on initial load
    if (previousRank === null) {
      previousRankRef.current = currentUserRank;
      return;
    }

    // Detect rank change
    if (previousRank !== currentUserRank) {
      const rankDiff = previousRank - currentUserRank;

      if (rankDiff > 0) {
        // Rank improved (moved up)
        setRankChangeDirection('up');

        // Special celebration for reaching #1
        if (currentUserRank === 1) {
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
          }, 5000);
        }
      } else {
        // Rank decreased (moved down)
        setRankChangeDirection('down');
        // Keep the down indicator visible longer for better UX
        setTimeout(() => setRankChangeDirection(null), 2000);
      }

      previousRankRef.current = currentUserRank;
    }
  }, [currentUserRank, currentProfileId, previousRankRef]);

  if (leaderboard.length === 0) {
    return (
      <Card className='border-0 bg-green-50'>
        <CardContent className='p-6 text-center'>
          <p className='text-sm text-gray-600'>
            No reports yet. Be the first to make a difference!
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxReportCount = leaderboard[0]?.reportCount || 0;

  return (
    <div className='relative space-y-4'>
      {/* Test Buttons - Only show if simulation is enabled */}
      {isSimulationEnabled && currentProfileId && (
        <div className='mb-4 flex justify-end gap-2'>
          <Button
            onClick={simulateReachingFirst}
            size='sm'
            variant='outline'
            className='border-green-500 text-green-700 hover:bg-green-50'
          >
            <Play className='mr-2 h-4 w-4' />
            Test #1 Animation
          </Button>
          <Button
            onClick={simulateRankDown}
            size='sm'
            variant='outline'
            className='border-orange-500 text-orange-700 hover:bg-orange-50'
          >
            <ArrowDown className='mr-2 h-4 w-4' />
            Test Rank Down
          </Button>
        </div>
      )}

      {/* Current User Rank Card */}
      {currentUserRank && currentProfileId && (
        <CurrentUserRankCard
          currentUserRank={currentUserRank}
          reportCount={leaderboard[currentUserRank - 1]?.reportCount || 0}
          rankChangeDirection={rankChangeDirection}
          showCelebration={showCelebration}
          userCardRef={userCardRef}
        />
      )}

      {/* Leaderboard List */}
      <div className='space-y-2'>
        {profilesError && (
          <div className='py-2 text-center text-xs text-red-500'>
            Error loading user information
          </div>
        )}
        {isLoadingProfiles && (
          <div className='py-4 text-center text-sm text-gray-500'>
            Loading user information...
          </div>
        )}
        {displayEntries.map(entry => {
          const isCurrentUser = entry.userId === currentProfileId;
          const profile = profilesMap.get(entry.userId);

          // Determine user name
          let userName: string;
          if (isCurrentUser) {
            userName = 'You';
          } else {
            if (profile?.user_nickname?.trim()) {
              userName = profile.user_nickname.trim();
            } else {
              userName = generateCoolUsername(entry.userId);
            }
          }

          const avatarUrl =
            avatarUrlsMap.get(entry.userId) || generateAvatarUrl(entry.userId);

          return (
            <LeaderboardEntryCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={isCurrentUser}
              userName={userName}
              avatarUrl={avatarUrl}
              maxReportCount={maxReportCount}
              rankChangeDirection={rankChangeDirection}
              showCelebration={showCelebration}
            />
          );
        })}
      </div>

      {/* Total Participants */}
      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          {leaderboard.length} active contributor
          {leaderboard.length !== 1 ? 's' : ''} in the community
        </p>
      </div>
    </div>
  );
};
