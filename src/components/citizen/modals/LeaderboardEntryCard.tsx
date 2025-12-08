import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getRankIcon, generateAvatarUrl } from './leaderboardUtils';
import type { LeaderboardEntry } from './useLeaderboardData';

interface LeaderboardEntryCardProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  userName: string;
  avatarUrl: string;
  maxReportCount: number;
  rankChangeDirection: 'up' | 'down' | null;
  showCelebration: boolean;
}

export const LeaderboardEntryCard = ({
  entry,
  isCurrentUser,
  userName,
  avatarUrl,
  maxReportCount,
  rankChangeDirection,
  showCelebration,
}: LeaderboardEntryCardProps) => {
  const isRankUpAnimation = isCurrentUser && rankChangeDirection === 'up';
  const isRankDownAnimation = isCurrentUser && rankChangeDirection === 'down';
  const isFirstPlace = entry.rank === 1 && isCurrentUser && showCelebration;

  return (
    <motion.div
      key={entry.userId}
      initial={
        isRankUpAnimation
          ? { y: 100, opacity: 0 }
          : isRankDownAnimation
            ? { y: -50, opacity: 0.5 }
            : false
      }
      animate={
        isRankUpAnimation
          ? {
              y: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
              },
            }
          : isRankDownAnimation
            ? {
                y: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                },
              }
            : {}
      }
    >
      <Card
        className={`${
          isCurrentUser
            ? isFirstPlace
              ? 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 via-green-50 to-yellow-50 shadow-2xl'
              : 'border-2 border-green-500 bg-green-50'
            : 'border border-gray-200 bg-white'
        } transition-all hover:shadow-md ${
          isFirstPlace ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
        }`}
      >
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            {/* Rank */}
            <motion.div
              className='flex w-8 items-center justify-center'
              animate={
                isRankUpAnimation
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              {getRankIcon(entry.rank) || (
                <motion.span
                  className={`text-sm font-semibold ${
                    isCurrentUser
                      ? isFirstPlace
                        ? 'text-yellow-600'
                        : 'text-green-700'
                      : 'text-gray-500'
                  }`}
                  animate={
                    isRankUpAnimation
                      ? {
                          scale: [1, 1.5, 1],
                        }
                      : isRankDownAnimation
                        ? {
                            scale: [1, 0.8, 1],
                          }
                        : {}
                  }
                >
                  {entry.rank}
                </motion.span>
              )}
            </motion.div>

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
                        maxReportCount > 0
                          ? (entry.reportCount / maxReportCount) * 100
                          : 0
                      }%`,
                      backgroundColor: isCurrentUser ? '#16a34a' : '#22c55e',
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
    </motion.div>
  );
};
