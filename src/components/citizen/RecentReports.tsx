import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, XCircle, LayoutList, LayoutGrid } from 'lucide-react';
import { ReportCard, ReportGridCard } from './MyReports/index';
import { ReportDetailsModal } from '@/components/citizen/modals/ReportDetailsModal';
import { generateReportPDF, shareReport } from '@/utils/pdfGenerator';
import type { Issue } from '@/lib/supabase-api';
import { ISSUE_CATEGORIES } from '@/constants';

interface RecentReportsProps {
  reports: Issue[];
}

const ITEMS_PER_PAGE = 3;

export const RecentReports = ({ reports }: RecentReportsProps) => {
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
    <Card className='border-0 bg-inherit shadow-none'>
      <CardHeader className='pb-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle className='text-xl font-normal'>
              My Recent Reports
            </CardTitle>
            <CardDescription className='text-m text-gray-600'>
              Track the progress of your submitted issues in your Nigerian
              community
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
            <Badge
              variant='secondary'
              className='border-green-200 bg-green-50 text-green-700'
            >
              {filteredReports.length} Reports
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Section */}
        <div className='mb-6 space-y-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Search reports...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='rounded-xl border-gray-300 pl-10 focus:border-green-500 focus:ring-green-500'
            />
          </div>

          {/* Filters */}
          <div className='flex flex-row gap-2 sm:gap-3'>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='rounded-xl border-gray-300'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='open'>Open</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
                <SelectItem value='resolved'>Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='rounded-xl border-gray-300'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {ISSUE_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='rounded-xl border-gray-300'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Newest First</SelectItem>
                <SelectItem value='oldest'>Oldest First</SelectItem>
                <SelectItem value='priority'>Priority</SelectItem>
                <SelectItem value='status'>Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            statusFilter !== 'all' ||
            categoryFilter !== 'all') && (
            <div className='flex flex-wrap gap-2'>
              <span className='text-sm text-gray-600'>Active filters:</span>
              {searchTerm && (
                <Badge
                  variant='secondary'
                  className='bg-blue-100 text-blue-800'
                >
                  Search: "{searchTerm}"
                  <XCircle
                    className='ml-1 h-3 w-3 cursor-pointer'
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-800'
                >
                  Status: {statusFilter}
                  <XCircle
                    className='ml-1 h-3 w-3 cursor-pointer'
                    onClick={() => setStatusFilter('all')}
                  />
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge
                  variant='secondary'
                  className='bg-purple-100 text-purple-800'
                >
                  Category: {categoryFilter.replace(/_/g, ' ')}
                  <XCircle
                    className='ml-1 h-3 w-3 cursor-pointer'
                    onClick={() => setCategoryFilter('all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

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
        {totalPages > 1 && (
          <div className='mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-center text-sm text-gray-500 sm:text-left'>
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of{' '}
              {filteredReports.length} reports
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className='rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <span className='hidden sm:inline'>Previous</span>
                <span className='sm:hidden'>Prev</span>
              </button>

              <div className='flex items-center gap-1'>
                {Array.from(
                  {
                    length: Math.min(
                      totalPages > 4 ? 3 : totalPages,
                      totalPages
                    ),
                  },
                  (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      // Show current page and surrounding pages
                      const start = Math.max(1, currentPage - 1);
                      pageNum = start + i;
                      if (pageNum > totalPages) return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[2.5rem] rounded-md px-3 py-1 text-sm ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className='px-2 text-gray-400'>...</span>
                )}
                {totalPages > 5 && currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className='min-w-[2.5rem] rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={detailsModalOpen}
        onClose={handleCloseModal}
        onShare={handleShareReport}
        onDownloadPDF={handleDownloadPDF}
      />
    </Card>
  );
};
