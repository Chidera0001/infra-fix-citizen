import { Card, CardContent } from '@/components/ui/card';
import { AchievementBadge } from './modals/AchievementBadge';
import { Leaderboard } from './modals/Leaderboard';
import type { Issue } from '@/lib/supabase-api';

// SVG Icons as React components
const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' />
  </svg>
);

const TickIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' />
    <path d='M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z' />
  </svg>
);

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
  </svg>
);

interface AnalyticsProps {
  reports: Issue[];
  allIssues: Issue[];
  currentUserId?: string;
}

export const Analytics = ({
  reports,
  allIssues,
  currentUserId,
}: AnalyticsProps) => {
  // Calculate user statistics
  const userStats = {
    totalReports: reports.length,
    openReports: reports.filter(r => r.status === 'open').length,
    inProgressReports: reports.filter(r => r.status === 'in_progress').length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    averageResolutionTime: calculateAverageResolutionTime(reports),
  };

  // Calculate community statistics
  const communityStats = {
    totalCommunityReports: allIssues.length,
    communityResolved: allIssues.filter(r => r.status === 'resolved').length,
    userContribution:
      reports.length > 0
        ? ((reports.length / allIssues.length) * 100).toFixed(1)
        : '0',
  };

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8 lg:pt-8'>
      {/* Header */}
      <div className='mb-6 lg:mb-10'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 sm:text-3xl'>
          Your Analytics
        </h2>
        <p className='text-sm text-gray-600 sm:text-base'>
          Track your community impact and see where you rank
        </p>
      </div>

      {/* Content */}
      <div className='space-y-6 lg:space-y-8'>
        {/* Achievement Badge */}
        <AchievementBadge reports={reports} allIssues={allIssues} />

        {/* Community Impact */}
        <div>
          <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
            Community Impact
          </h3>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <Card className='border-2 border-gray-200 shadow-md transition-transform duration-200 hover:scale-105'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex flex-col items-center space-y-2 text-center'>
                  <p className='text-sm font-medium text-green-800 sm:text-base'>
                    Your Contribution
                  </p>
                  <p className='text-2xl font-bold text-green-900 sm:text-3xl'>
                    {communityStats.userContribution}%
                  </p>
                  <p className='text-xs text-green-700 sm:text-sm'>
                    of all community reports
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-2 border-gray-200 shadow-md transition-transform duration-200 hover:scale-105'>
              <CardContent className='p-4 text-center sm:p-6'>
                <p className='mb-4 text-sm font-medium text-green-600 sm:text-base'>
                  Community Total
                </p>
                <p className='text-2xl font-bold text-green-900 sm:text-3xl'>
                  {communityStats.totalCommunityReports}
                </p>
              </CardContent>
            </Card>
            <Card className='border-2 border-gray-200 shadow-md transition-transform duration-200 hover:scale-105'>
              <CardContent className='p-4 text-center sm:p-6'>
                <p className='mb-4 text-sm font-medium text-green-600 sm:text-base'>
                  Your Personal Total
                </p>
                <p className='text-2xl font-bold text-green-900 sm:text-3xl'>
                  {userStats.totalReports}
                </p>
              </CardContent>
            </Card>
            <Card className='border-2 border-gray-200 shadow-md transition-transform duration-200 hover:scale-105'>
              <CardContent className='gap-4 p-4 text-center sm:p-6'>
                <p className='mb-4 text-sm font-medium text-green-600 sm:text-base'>
                  Your Personal Resolved
                </p>
                <p className='text-2xl font-bold text-green-900 sm:text-3xl'>
                  {userStats.resolvedReports}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resolution Time */}
        {userStats.averageResolutionTime > 0 && (
          <div>
            <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
              Performance
            </h3>
            <Card className='border-0 bg-purple-50'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-800 sm:text-base'>
                      Average Resolution Time
                    </p>
                    <p className='text-2xl font-bold text-purple-900 sm:text-3xl'>
                      {userStats.averageResolutionTime} days
                    </p>
                  </div>
                  <div className='text-green-600'>
                    <ClockIcon className='h-8 w-8 sm:h-10 sm:w-10' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
            Community Leaderboard
          </h3>
          <Leaderboard allIssues={allIssues} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
};

// Helper component for stat cards
const StatCard = ({
  title,
  value,
  icon: IconComponent,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) => {
  return (
    <Card className='border-2 border-gray-200 shadow-md'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col items-center space-y-3 text-center'>
          <div className='rounded-lg bg-green-50 p-3'>
            <IconComponent className='h-8 w-8 text-green-600 sm:h-10 sm:w-10' />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-600 sm:text-base'>
              {title}
            </p>
            <p className='text-xl font-bold text-gray-900 sm:text-2xl'>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate average resolution time
const calculateAverageResolutionTime = (reports: Issue[]): number => {
  const resolvedReports = reports.filter(
    r => r.status === 'resolved' && r.resolved_at && r.created_at
  );

  if (resolvedReports.length === 0) return 0;

  const totalDays = resolvedReports.reduce((sum, report) => {
    const created = new Date(report.created_at);
    const resolved = new Date(report.resolved_at!);
    const diffTime = Math.abs(resolved.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return Math.round(totalDays / resolvedReports.length);
};
