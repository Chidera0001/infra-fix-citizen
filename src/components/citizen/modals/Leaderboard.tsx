import { useMemo } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentProfile } from '@/hooks/use-profile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';
import type { Issue } from '@/lib/supabase-api';

interface LeaderboardEntry {
  userId: string;
  reportCount: number;
  rank: number;
}

interface LeaderboardProps {
  allIssues: Issue[];
  currentUserId?: string; // Auth user ID - will be converted to profile ID
}

// Generate a DiceBear avatar URL from user ID (consistent for same user)
// Using bigSmile style for fun, colorful characters with big smiles (similar to Kahoot)
const generateAvatarUrl = (userId: string): string => {
  const avatar = createAvatar(bigSmile, {
    seed: userId, // Use userId as seed for consistency
    size: 128,
    // Fun, vibrant background colors similar to Kahoot
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'a8e6cf', 'ffd3b6', 'ffaaa5', 'c7ceea', 'ffb3ba'],
  });
  
  return avatar.toDataUri();
};

// Cool username generators
const coolAdjectives = [
  'Swift', 'Bold', 'Noble', 'Brave', 'Wise', 'Bright', 'Sharp', 'Quick',
  'Mighty', 'Clever', 'Fierce', 'Calm', 'Wild', 'Smooth', 'Rapid', 'Steady',
  'Vivid', 'Crisp', 'Neon', 'Cosmic', 'Stellar', 'Lunar', 'Solar', 'Aurora',
  'Thunder', 'Storm', 'Blaze', 'Frost', 'Shadow', 'Light', 'Crystal', 'Diamond'
];

const coolNouns = [
  'Phoenix', 'Eagle', 'Wolf', 'Lion', 'Tiger', 'Dragon', 'Falcon', 'Hawk',
  'Panther', 'Jaguar', 'Raven', 'Fox', 'Bear', 'Shark', 'Orca', 'Leopard',
  'Warrior', 'Guardian', 'Champion', 'Hero', 'Legend', 'Master', 'Ace', 'Pro',
  'Nova', 'Comet', 'Star', 'Planet', 'Galaxy', 'Nebula', 'Quasar', 'Pulsar',
  'Blade', 'Arrow', 'Shield', 'Sword', 'Spear', 'Axe', 'Bow', 'Crossbow'
];

// Generate a consistent cool username from user ID
const generateCoolUsername = (userId: string): string => {
  // Create a hash from the user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use hash to pick consistent adjective and noun
  const adjIndex = Math.abs(hash) % coolAdjectives.length;
  const nounIndex = Math.abs(hash >> 8) % coolNouns.length;
  
  // Sometimes add a number for variety
  const number = Math.abs(hash >> 16) % 999;
  const useNumber = Math.abs(hash >> 24) % 3 === 0; // 33% chance
  
  if (useNumber && number > 0) {
    return `${coolAdjectives[adjIndex]}${coolNouns[nounIndex]}${number}`;
  }
  
  return `${coolAdjectives[adjIndex]}${coolNouns[nounIndex]}`;
};

// Get rank icon based on position
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className='h-5 w-5 text-yellow-500' />;
    case 2:
      return <Medal className='h-5 w-5 text-gray-400' />;
    case 3:
      return <Award className='h-5 w-5 text-amber-600' />;
    default:
      return null;
  }
};

export const Leaderboard = ({ allIssues, currentUserId }: LeaderboardProps) => {
  // Get current user's profile to get profile ID
  const { data: currentProfile } = useCurrentProfile();
  const currentProfileId = currentProfile?.id;

  // Calculate leaderboard entries
  const leaderboard = useMemo(() => {
    // Group issues by reporter_id and count
    const reportCounts = new Map<string, number>();

    allIssues.forEach(issue => {
      if (issue.reporter_id) {
        const currentCount = reportCounts.get(issue.reporter_id) || 0;
        reportCounts.set(issue.reporter_id, currentCount + 1);
      }
    });

    // Convert to array and sort by count (descending)
    const entries: LeaderboardEntry[] = Array.from(reportCounts.entries())
      .map(([userId, reportCount]) => ({
        userId,
        reportCount,
        rank: 0, // Will be set after sorting
      }))
      .sort((a, b) => b.reportCount - a.reportCount)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return entries;
  }, [allIssues]);

  // Find current user's position (using profile ID)
  const currentUserRank = useMemo(() => {
    if (!currentProfileId) return null;
    return (
      leaderboard.findIndex(entry => entry.userId === currentProfileId) + 1
    );
  }, [leaderboard, currentProfileId]);

  // Show top 10 entries, or more if user is not in top 10
  const displayEntries = useMemo(() => {
    const topEntries = leaderboard.slice(0, 10);

    // If current user is not in top 10, add them to the list
    if (currentUserRank && currentUserRank > 10) {
      const currentUserEntry = leaderboard[currentUserRank - 1];
      return [...topEntries, currentUserEntry];
    }

    return topEntries;
  }, [leaderboard, currentUserRank]);

  // Fetch profiles for all leaderboard entries
  const profileIds = useMemo(
    () => {
      const ids = displayEntries.map(entry => entry.userId).filter(Boolean);
      return [...new Set(ids)]; // Remove duplicates
    },
    [displayEntries]
  );

  const { data: profiles = [], isLoading: isLoadingProfiles, error: profilesError } = useQuery({
    queryKey: ['leaderboard-profiles', profileIds.sort().join(',')],
    queryFn: async () => {
      if (profileIds.length === 0) return [];
      
      // Fetch profiles in batches if needed (Supabase has a limit on .in() queries)
      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < profileIds.length; i += batchSize) {
        const batch = profileIds.slice(i, i + batchSize);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

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

  // Generate avatar URLs for all display entries (memoized)
  const avatarUrlsMap = useMemo(() => {
    const map = new Map<string, string>();
    displayEntries.forEach(entry => {
      if (!map.has(entry.userId)) {
        map.set(entry.userId, generateAvatarUrl(entry.userId));
      }
    });
    return map;
  }, [displayEntries]);

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

  return (
    <div className='space-y-4'>
      {/* Current User Rank Card */}
      {currentUserRank && currentProfileId && (
        <Card className='border-2 border-green-500 bg-gradient-to-r from-green-50 to-green-100'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white'>
                  <span className='text-lg font-bold'>{currentUserRank}</span>
                </div>
                <div>
                  <p className='text-sm font-medium text-green-800'>
                    Your Rank
                  </p>
                  <p className='text-xs text-green-600'>
                    {leaderboard[currentUserRank - 1]?.reportCount || 0} reports
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-green-900'>
                  #{currentUserRank}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard List */}
      <div className='space-y-2'>
        {profilesError && (
          <div className='text-center py-2 text-xs text-red-500'>
            Error loading user information
          </div>
        )}
        {isLoadingProfiles && (
          <div className='text-center py-4 text-sm text-gray-500'>
            Loading user information...
          </div>
        )}
        {displayEntries.map(entry => {
          const isCurrentUser = entry.userId === currentProfileId;
          const profile = profilesMap.get(entry.userId);
          
          // For privacy: only show real name for current user, use cool username for others
          let userName: string;
          if (isCurrentUser) {
            // Current user sees their real name
            if (profile) {
              if (profile.full_name && profile.full_name.trim()) {
                userName = profile.full_name.trim();
              } else if (profile.email) {
                userName = profile.email.split('@')[0];
              } else {
                userName = 'You';
              }
            } else {
              userName = 'You';
            }
          } else {
            // Other users get cool generated usernames
            userName = generateCoolUsername(entry.userId);
          }
          
          // Get avatar URL from memoized map
          const avatarUrl = avatarUrlsMap.get(entry.userId) || generateAvatarUrl(entry.userId);

          return (
            <Card
              key={entry.userId}
              className={`${
                isCurrentUser
                  ? 'border-2 border-green-500 bg-green-50'
                  : 'border border-gray-200 bg-white'
              } transition-all hover:shadow-md`}
            >
              <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                  {/* Rank */}
                  <div className='flex w-8 items-center justify-center'>
                    {getRankIcon(entry.rank) || (
                      <span
                        className={`text-sm font-semibold ${
                          isCurrentUser ? 'text-green-700' : 'text-gray-500'
                        }`}
                      >
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className='h-10 w-10 border-2 border-gray-200'>
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback className='bg-gray-100 text-gray-500'>
                      {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Name and Report Count */}
                  <div className='flex-1'>
                    <div className='mb-1'>
                      <p
                        className={`text-sm font-semibold ${
                          isCurrentUser ? 'text-green-700' : 'text-gray-900'
                        }`}
                      >
                        {userName}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 flex-1 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full transition-all'
                          style={{
                            width: `${
                              leaderboard[0]?.reportCount > 0
                                ? (entry.reportCount /
                                    leaderboard[0].reportCount) *
                                  100
                                : 0
                            }%`,
                            backgroundColor: isCurrentUser
                              ? '#16a34a'
                              : '#22c55e',
                          }}
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          isCurrentUser ? 'text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {entry.reportCount}
                      </span>
                      <span className='text-xs text-gray-500'>reports</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
