import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CurrentUserRankCardProps {
  currentUserRank: number;
  reportCount: number;
  rankChangeDirection: 'up' | 'down' | null;
  showCelebration: boolean;
  userCardRef: React.RefObject<HTMLDivElement>;
}

export const CurrentUserRankCard = ({
  currentUserRank,
  reportCount,
  rankChangeDirection,
  showCelebration,
  userCardRef,
}: CurrentUserRankCardProps) => {
  const isRankUp = rankChangeDirection === 'up';
  const isRankDown = rankChangeDirection === 'down';

  return (
    <motion.div
      ref={userCardRef}
      initial={false}
      animate={{
        scale:
          isRankUp || showCelebration
            ? [1, 1.05, 1]
            : isRankDown
              ? [1, 0.98, 1]
              : 1,
        y:
          isRankUp || showCelebration
            ? [0, -10, 0]
            : isRankDown
              ? [0, 10, 0]
              : 0,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <Card
        className={`border-2 ${
          currentUserRank === 1 || showCelebration
            ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 via-green-50 to-yellow-50 shadow-2xl'
            : 'border-green-500 bg-gradient-to-r from-green-50 to-green-100'
        } transition-all duration-500 ${
          showCelebration ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
        }`}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <motion.div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                  currentUserRank === 1 || showCelebration
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : 'bg-green-500'
                }`}
                animate={
                  showCelebration
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }
                    : isRankUp
                      ? {
                          scale: [1, 1.1, 1],
                        }
                      : isRankDown
                        ? {
                            scale: [1, 0.9, 1],
                          }
                        : {}
                }
                transition={{
                  duration: 0.6,
                  repeat: showCelebration ? 3 : isRankUp || isRankDown ? 1 : 0,
                }}
              >
                {currentUserRank === 1 || showCelebration ? (
                  <Trophy className='h-6 w-6 text-yellow-900' />
                ) : (
                  <span className='text-lg font-bold'>{currentUserRank}</span>
                )}
              </motion.div>
              <div>
                <p className='text-sm font-medium text-green-800'>
                  {showCelebration
                    ? "🏆 You're #1!"
                    : currentUserRank === 1
                      ? "🏆 You're #1!"
                      : 'Your Rank'}
                </p>
                <p className='text-xs text-green-600'>{reportCount} reports</p>
              </div>
            </div>
            <div className='text-right'>
              <motion.p
                className={`text-2xl font-bold ${
                  currentUserRank === 1 || showCelebration
                    ? 'text-yellow-600'
                    : 'text-green-900'
                }`}
                animate={
                  showCelebration
                    ? {
                        scale: [1, 1.3, 1],
                      }
                    : isRankUp
                      ? {
                          scale: [1, 1.2, 1],
                        }
                      : isRankDown
                        ? {
                            scale: [1, 0.9, 1],
                          }
                        : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: showCelebration ? 5 : isRankUp || isRankDown ? 1 : 0,
                }}
              >
                #{showCelebration ? 1 : currentUserRank}
              </motion.p>
              {(isRankUp || showCelebration) && (
                <motion.p
                  className='text-xs font-semibold text-green-600'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ⬆️ Rank Up!
                </motion.p>
              )}
              {isRankDown && (
                <motion.p
                  className='text-xs font-semibold text-orange-600'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ⬇️ Rank Down
                </motion.p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
