import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import type { Issue } from '@/lib/supabase-api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ReportDetailsModal } from '@/components/citizen/modals/ReportDetailsModal';
import { generateReportPDF, shareReport } from '@/utils/pdfGenerator';
import {
  StatsCards,
  SearchAndFilters,
  ReportCard,
  ReportGridCard,
  Pagination,
  EmptyState,
} from './MyReports/index';

interface MyReportsProps {
  reports: Issue[];
  isLoading: boolean;
  onReportIssue: () => void;
}

const ITEMS_PER_PAGE = 6;

export const MyReports = ({
  reports,
  isLoading,
  onReportIssue,
}: MyReportsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Modal states
  const [selectedReport, setSelectedReport] = useState<Issue | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Filter and search logic
  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || report.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'oldest':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          return (
            (priorityOrder[b.severity as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.severity as keyof typeof priorityOrder] || 0)
          );
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reports, searchTerm, statusFilter, categoryFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Action handlers
  const handleViewDetails = (report: Issue) => {
    setSelectedReport(report);
    setDetailsModalOpen(true);
  };

  const handleShareReport = (report: Issue) => {
    shareReport(report);
  };

  const handleDownloadPDF = (report: Issue) => {
    generateReportPDF(report);
  };

  const handleCloseModal = () => {
    setDetailsModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 pt-16 sm:px-6 lg:px-8 lg:pt-8'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2 className='mb-2 text-xl font-bold text-gray-900 sm:text-2xl'>
              My Reports
            </h2>
          </div>
          <Button
            onClick={onReportIssue}
            className='rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
          >
            <Plus className='mr-2 h-5 w-5' />
            Report New Issue
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards reports={reports} />

      {/* Search and Filter Section */}
      <Card className='mb-6'>
        <CardContent className='p-6'>
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className='rounded-2xl border-0 bg-inherit'>
        <CardHeader>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='flex-1'>
              <CardTitle className='text-xl font-semibold text-gray-900'>
                Your Reports
              </CardTitle>
              <CardDescription>
                {filteredReports.length} of {reports.length} reports
                {searchTerm && ` matching "${searchTerm}"`}
              </CardDescription>
            </div>
            <div className='flex items-center gap-3'>
              {/* View Toggle */}
              <div className='flex items-center gap-1 rounded-lg border border-gray-200 p-1'>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className={`px-3 ${viewMode === 'list' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <LayoutList className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className={`px-3 ${viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='py-12 text-center'>
              <LoadingSpinner text='Loading your reports...' />
            </div>
          ) : paginatedReports.length === 0 ? (
            <EmptyState
              hasReports={reports.length > 0}
              onReportIssue={onReportIssue}
            />
          ) : (
            <>
              {/* Reports List or Grid */}
              {viewMode === 'list' ? (
                <div className='space-y-4'>
                  {paginatedReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onViewDetails={handleViewDetails}
                      onShare={handleShareReport}
                      onDownloadPDF={handleDownloadPDF}
                    />
                  ))}
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {paginatedReports.map(report => (
                    <ReportGridCard key={report.id} report={report} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                totalItems={filteredReports.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={detailsModalOpen}
        onClose={handleCloseModal}
        onShare={handleShareReport}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
};
