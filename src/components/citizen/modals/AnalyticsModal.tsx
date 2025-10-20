import { useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AchievementBadge } from './AchievementBadge';
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

interface AnalyticsModalProps {
  reports: Issue[];
  allIssues: Issue[];
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal = ({
  reports,
  allIssues,
  isOpen,
  onClose,
}: AnalyticsModalProps) => {
  if (!isOpen) return null;

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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between border-gray-200 p-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Your Analytics</h2>
            <p className='text-sm text-gray-600'>Track your community impact</p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='space-y-6 p-6'>
          {/* Achievement Badge */}
          <AchievementBadge reports={reports} allIssues={allIssues} />

          {/* Personal Stats */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Your Reports
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <StatCard
                title='Total Reports'
                value={userStats.totalReports}
                icon={AnalyticsIcon}
              />
              <StatCard
                title='Resolved'
                value={userStats.resolvedReports}
                icon={TickIcon}
              />
              <StatCard
                title='In Progress'
                value={userStats.inProgressReports}
                icon={ClockIcon}
              />
              <StatCard
                title='Open Issues'
                value={userStats.openReports}
                icon={AlertTriangleIcon}
              />
            </div>
          </div>

          {/* Community Impact */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Community Impact
            </h3>
            <div className='grid grid-cols-1 gap-4'>
              <Card className='border-0 bg-gradient-to-r from-green-50 to-green-100'>
                <CardContent className='p-4'>
                  <div className='flex flex-col items-center space-y-2 text-center'>
                    <p className='text-sm font-medium text-green-800'>
                      Your Contribution
                    </p>
                    <p className='text-2xl font-bold text-green-900'>
                      {communityStats.userContribution}%
                    </p>
                    <p className='text-xs text-green-700'>
                      of all community reports
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className='grid grid-cols-2 gap-4'>
                <Card className='border-0 bg-green-50'>
                  <CardContent className='p-4 text-center'>
                    <p className='text-sm font-medium text-green-600'>
                      Community Total
                    </p>
                    <p className='text-2xl font-bold text-green-900'>
                      {communityStats.totalCommunityReports}
                    </p>
                  </CardContent>
                </Card>
                <Card className='border-0 bg-green-50'>
                  <CardContent className='p-4 text-center'>
                    <p className='text-sm font-medium text-green-600'>
                      Community Resolved
                    </p>
                    <p className='text-2xl font-bold text-green-900'>
                      {communityStats.communityResolved}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Resolution Time */}
          {userStats.averageResolutionTime > 0 && (
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                Performance
              </h3>
              <Card className='border-0 bg-purple-50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-purple-800'>
                        Average Resolution Time
                      </p>
                      <p className='text-2xl font-bold text-purple-900'>
                        {userStats.averageResolutionTime} days
                      </p>
                    </div>
                    <div className='text-green-600'>
                      <ClockIcon className='h-8 w-8' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 p-6'>
          <Button
            onClick={onClose}
            className='w-full bg-green-600 text-white hover:bg-green-700'
          >
            Close
          </Button>
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
      <CardContent className='p-4'>
        <div className='flex flex-col items-center space-y-3 text-center'>
          <div className='rounded-lg bg-green-50 p-3'>
            <IconComponent className='h-8 w-8 text-green-600' />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-600'>{title}</p>
            <p className='text-xl font-bold text-gray-900'>{value}</p>
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
