import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Issue } from "@/lib/supabase-api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
	StatsCards,
	SearchAndFilters,
	ReportCard,
	ReportActions,
	Pagination,
	EmptyState,
} from "./MyReports/index";

interface MyReportsProps {
	reports: Issue[];
	isLoading: boolean;
	onReportIssue: () => void;
}

const ITEMS_PER_PAGE = 6;

export const MyReports = ({ reports, isLoading, onReportIssue }: MyReportsProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");
	const [currentPage, setCurrentPage] = useState(1);

	// Filter and search logic
	const filteredReports = useMemo(() => {
		let filtered = reports.filter((report) => {
			const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 report.address?.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesStatus = statusFilter === "all" || report.status === statusFilter;
			const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
			
			return matchesSearch && matchesStatus && matchesCategory;
		});

		// Sort logic
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case "oldest":
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case "priority":
					const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
					return (priorityOrder[b.severity as keyof typeof priorityOrder] || 0) - 
						   (priorityOrder[a.severity as keyof typeof priorityOrder] || 0);
				case "status":
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
	const paginatedReports = filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	// Reset to first page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchTerm, statusFilter, categoryFilter, sortBy]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleExport = () => {
		// TODO: Implement export functionality
		// Export functionality can be implemented here
	};

	const handleShare = () => {
		// TODO: Implement share functionality
		// Share functionality can be implemented here
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			{/* Header Section */}
			<div className="mb-8">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
							My Reports
						</h1>
						<p className="text-gray-600 text-lg">
							Track and manage all your submitted infrastructure reports
						</p>
					</div>
					<Button 
						onClick={onReportIssue} 
						className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
					>
						<Plus className="h-5 w-5 mr-2" />
						Report New Issue
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<StatsCards reports={reports} />

			{/* Search and Filter Section */}
			<Card className="mb-6">
				<CardContent className="p-6">
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
			<Card className="bg-white border-0 shadow-xl rounded-2xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl font-semibold text-gray-900">
								Your Reports
							</CardTitle>
							<CardDescription>
								{filteredReports.length} of {reports.length} reports
								{searchTerm && ` matching "${searchTerm}"`}
							</CardDescription>
						</div>
						<ReportActions onExport={handleExport} onShare={handleShare} />
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="py-12 text-center">
							<LoadingSpinner text="Loading your reports..." />
						</div>
					) : paginatedReports.length === 0 ? (
						<EmptyState 
							hasReports={reports.length > 0} 
							onReportIssue={onReportIssue} 
						/>
					) : (
						<>
							{/* Reports List */}
							<div className="space-y-4">
								{paginatedReports.map((report) => (
									<ReportCard key={report.id} report={report} />
								))}
							</div>

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
		</div>
	);
};
