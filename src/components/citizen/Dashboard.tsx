import { QuickStats } from './QuickStats';
import { ActionCards } from './ActionCards';
import { CommunityMap } from './CommunityMap';
import { RecentReports } from './RecentReports';
import { NotificationsDropdown } from './NotificationsDropdown';
import type { Issue } from '@/lib/supabase-api';

interface DashboardProps {
  myReports: Issue[];
  allIssues: Issue[];
  statistics: any;
  isLoading: boolean;
  userId?: string;
  onReportIssue: () => void;
  onExploreMap: () => void;
  onViewAnalytics: () => void;
  onShowMap: () => void;
}

export const Dashboard = ({
  myReports,
  allIssues,
  statistics,
  isLoading,
  userId,
  onReportIssue,
  onExploreMap,
  onViewAnalytics,
  onShowMap,
}: DashboardProps) => {

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8 lg:pt-8'>
      {/* Enhanced Welcome Section */}
      <div className='mb-6 flex items-center justify-between lg:mb-10'>
        <div>
          <h2 className='mb-2 text-xl font-bold text-gray-900 sm:text-2xl lg:mb-2'>
            Citizen Dashboard
          </h2>
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown userId={userId} />
      </div>

      {/* Enhanced Quick Stats with personal context */}
      <QuickStats
        myReportsCount={myReports.length}
        myResolvedCount={
          myReports.filter(report => report.status === 'resolved').length
        }
        myInProgressCount={
          myReports.filter(report => report.status === 'in_progress').length
        }
        myOpenCount={
          myReports.filter(report => report.status === 'open').length
        }
      />

      {/* Enhanced Action Cards */}
      <ActionCards
        onReportIssue={onReportIssue}
        onExploreMap={onExploreMap}
        onViewAnalytics={onViewAnalytics}
      />

      {/* Interactive Map Section */}
      <CommunityMap
        issues={allIssues}
        isLoading={isLoading}
        onShowMap={onShowMap}
        onMapClick={coordinates => {
          // Navigate to report now with pre-filled location
          window.location.href = `/report-now?lat=${coordinates.lat}&lng=${coordinates.lng}`;
        }}
      />

      {/* Enhanced My Recent Reports */}
      <RecentReports reports={myReports} />
    </div>
  );
};
