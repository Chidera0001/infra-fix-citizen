import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportForm from '@/components/forms/ReportForm';
import IssueMap from '@/components/maps/IssueMap';
import { useIssues, useIssueStatistics } from '@/hooks/use-issues';
import { useCurrentProfile } from '@/hooks/use-profile';
import { useAutoSync } from '@/hooks/use-auto-sync';
import { useOfflineUserManager } from '@/hooks/use-offline-user-manager';
import { CitizenSidebar } from '@/components/layout/CitizenSidebar';
import { Dashboard, MyReports, Analytics } from '@/components/citizen';
import { CommunityPage } from '@/components/community/CommunityPage';
// import { OfflineDebugger } from "@/components/debug/OfflineDebugger";

const CitizenDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'map' | 'analytics' | 'community'>(
    'dashboard'
  );
  const [showReportForm, setShowReportForm] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Fetch real data from Supabase
  const { data: allIssues = [], isLoading } = useIssues({ limit: 50 });
  const { data: statistics } = useIssueStatistics();

  // Trigger profile update with Clerk data
  const { data: profile } = useCurrentProfile();

  // Enable auto-sync for offline reports (with performance optimizations)
  useAutoSync();

  // Enable offline user manager to link offline reports to authenticated user
  useOfflineUserManager();

  // Filter user's own reports based on reporter_id
  const myReports = allIssues.filter(
    issue => profile?.id && issue.reporter_id === profile.id
  );

  useEffect(() => {
    document.title = 'Citizn';
  }, []);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'reports', 'map', 'analytics', 'community'].includes(tabParam)) {
      setActiveTab(tabParam as 'dashboard' | 'reports' | 'map' | 'analytics' | 'community');
      if (tabParam === 'map') {
        setShowMap(true);
      } else {
        setShowMap(false);
      }
    }
  }, [searchParams]);

  const handleBackToDashboard = () => {
    setShowReportForm(false);
    setShowMap(false);
    setActiveTab('dashboard');
  };

  // Handle tab changes
  const handleTabChange = (tab: 'dashboard' | 'reports' | 'map' | 'analytics' | 'community') => {
    setActiveTab(tab);
    setShowReportForm(false); // Close report form when changing tabs
    if (tab === 'map') {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  // If showing report form, render it with sidebar
  if (showReportForm) {
    return (
      <div className='flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
        <CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className='flex-1 overflow-y-auto'>
          <ReportForm onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  // If showing map, render it with sidebar
  if (showMap) {
    return (
      <div className='flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
        <CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className='flex-1 overflow-y-auto'>
          <IssueMap
            onBack={handleBackToDashboard}
            isAdmin={false}
            onLocationSelect={coordinates => {
              // Navigate to report now with pre-filled location
              window.location.href = `/report-now?lat=${coordinates.lat}&lng=${coordinates.lng}`;
            }}
          />
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'reports') {
      return (
        <MyReports
          reports={myReports}
          isLoading={isLoading}
          onReportIssue={() => (window.location.href = '/report-now')}
        />
      );
    }

    if (activeTab === 'analytics') {
      return (
        <Analytics
          reports={myReports}
          allIssues={allIssues}
          currentUserId={profile?.id}
        />
      );
    }

    if (activeTab === 'community') {
      return <CommunityPage />;
    }

    // Default dashboard view
    return (
      <Dashboard
        myReports={myReports}
        allIssues={allIssues}
        statistics={statistics}
        isLoading={isLoading}
        userId={profile?.id}
        onReportIssue={() => (window.location.href = '/report-now')}
        onExploreMap={() => setShowMap(true)}
        onViewAnalytics={() => setActiveTab('analytics')}
        onShowMap={() => setShowMap(true)}
      />
    );
  };

  return (
    <div className='flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      {/* Sidebar */}
      <CitizenSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto'>{renderContent()}</div>

      {/* Debug Component */}
      {/* <OfflineDebugger /> */}
    </div>
  );
};

export default CitizenDashboard;
