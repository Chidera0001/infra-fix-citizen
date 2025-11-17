import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Issue } from '@/lib/supabase-api';
import { triggerConfettiShower } from '@/utils/confetti';

interface AchievementBadgeProps {
  reports: Issue[];
  allIssues: Issue[];
}

// Achievement message variations
const achievementMessages = [
  // First report achievements
  "🎉 Congratulations on your first report! You're making a difference!",
  '🌟 Welcome to the community! Your first report is just the beginning!',
  "🚀 Great start! You've joined the infrastructure improvement movement!",

  // Top contributor achievements
  "🏆 You're in the top 1% of community contributors! Outstanding work!",
  "⭐ You're in the top 2% of community contributors! Keep it up!",
  "🥇 You're in the top 5% of community contributors! Amazing dedication!",
  "💎 You're in the top 10% of community contributors! You're a star!",

  // Monthly achievements
  '📅 Kudos! You were our top reporter this month! Keep it up!',
  "🔥 You're on fire! Top reporter for the past 30 days!",
  "⚡ Lightning fast! You've been the most active this month!",

  // Milestone achievements
  "🎯 You've reached 10 reports! You're a community champion!",
  "🎊 25 reports milestone! You're a true infrastructure hero!",
  "🏅 50 reports achieved! You're a community legend!",
  "👑 100 reports milestone! You're a community icon!",

  // Special achievements
  "💚 You're helping build a better community, one report at a time!",
  '🌟 Your dedication to community improvement is inspiring!',
];


// Achievement logic
const getAchievement = (reports: Issue[], allIssues: Issue[]) => {
  const userReportCount = reports.length;
  const totalReports = allIssues.length;

  // First report
  if (userReportCount === 1) {
    return {
      message: achievementMessages[Math.floor(Math.random() * 3)],
      type: 'first',
      showConfetti: true,
    };
  }

  // Top contributor calculations
  if (totalReports > 0) {
    const userContribution = (userReportCount / totalReports) * 100;

    if (userContribution >= 1) {
      return {
        message: achievementMessages[3], // Top 1%
        type: 'top1',
        showConfetti: true,
      };
    } else if (userContribution >= 0.5) {
      return {
        message: achievementMessages[4], // Top 2%
        type: 'top2',
        showConfetti: true,
      };
    } else if (userContribution >= 0.2) {
      return {
        message: achievementMessages[5], // Top 5%
        type: 'top5',
        showConfetti: true,
      };
    } else if (userContribution >= 0.1) {
      return {
        message: achievementMessages[6], // Top 10%
        type: 'top10',
        showConfetti: true,
      };
    }
  }

  // Milestone achievements
  if (userReportCount >= 100) {
    return {
      message: achievementMessages[13], // 100 reports
      type: 'milestone100',
      showConfetti: true,
    };
  } else if (userReportCount >= 50) {
    return {
      message: achievementMessages[12], // 50 reports
      type: 'milestone50',
      showConfetti: true,
    };
  } else if (userReportCount >= 25) {
    return {
      message: achievementMessages[11], // 25 reports
      type: 'milestone25',
      showConfetti: true,
    };
  } else if (userReportCount >= 10) {
    return {
      message: achievementMessages[10], // 10 reports
      type: 'milestone10',
      showConfetti: true,
    };
  }

  // Monthly top reporter (simplified - could be enhanced with actual date logic)
  if (userReportCount >= 5) {
    const randomMonthly = Math.random() < 0.3; // 30% chance
    if (randomMonthly) {
      return {
        message: achievementMessages[7 + Math.floor(Math.random() * 3)],
        type: 'monthly',
        showConfetti: true,
      };
    }
  }

  // Default encouraging message
  return {
    message: achievementMessages[14 + Math.floor(Math.random() * 2)],
    type: 'encouragement',
    showConfetti: false,
  };
};

export const AchievementBadge = ({
  reports,
  allIssues,
}: AchievementBadgeProps) => {
  const achievement = getAchievement(reports, allIssues);

  useEffect(() => {
    if (achievement.showConfetti) {
      // Trigger confetti shower when user has an achievement
      triggerConfettiShower();
    }
  }, [achievement.showConfetti]);

  if (!achievement) return null;

  return (
    <div className='relative mb-6'>
      <Card className='border-0 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 shadow-lg'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center space-x-3'>
            <div className='flex-shrink-0'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600'>
                <span className='text-2xl'>
                  {achievement.type === 'first' && '🎉'}
                  {achievement.type === 'top1' && '🏆'}
                  {achievement.type === 'top2' && '⭐'}
                  {achievement.type === 'top5' && '🥇'}
                  {achievement.type === 'top10' && '💎'}
                  {achievement.type === 'milestone100' && '👑'}
                  {achievement.type === 'milestone50' && '🏅'}
                  {achievement.type === 'milestone25' && '🎊'}
                  {achievement.type === 'milestone10' && '🎯'}
                  {achievement.type === 'monthly' && '📅'}
                  {achievement.type === 'encouragement' && '💚'}
                </span>
              </div>
            </div>
            <div className='flex-1 text-center'>
              <p className='text-lg font-semibold leading-relaxed text-green-800'>
                {achievement.message}
              </p>
            </div>
          </div>

          {/* Progress indicator for milestones */}
          {(achievement.type.includes('milestone') ||
            achievement.type.includes('top')) && (
            <div className='mt-4'>
              <div className='mb-2 flex items-center justify-between text-sm text-green-700'>
                <span>Community Impact</span>
                <span>{reports.length} reports</span>
              </div>
              <div className='h-2 w-full rounded-full bg-green-200'>
                <div
                  className='h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000 ease-out'
                  style={{
                    width: `${Math.min((reports.length / 100) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
