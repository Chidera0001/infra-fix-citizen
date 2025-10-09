import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/hooks/use-issues";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
	AdminStatsCards,
	AdminSearchAndFilters,
	AdminIssueCard,
	AdminIssueActions,
	AdminPagination,
	AdminEmptyState,
} from "./AllIssues/index";

const ITEMS_PER_PAGE = 6;

export const AllIssues = () => {
	const { data: issues = [], isLoading: issuesLoading } = useIssues({ limit: 100, sortBy: 'created_at', sortOrder: 'DESC' });
	
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");
	const [currentPage, setCurrentPage] = useState(1);

	// Filter and search logic
	const filteredIssues = useMemo(() => {
		let filtered = issues.filter((issue) => {
			const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 issue.address?.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
			const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
			
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
	}, [issues, searchTerm, statusFilter, categoryFilter, sortBy]);

	// Pagination logic
	const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedIssues = filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	// Reset to first page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchTerm, statusFilter, categoryFilter, sortBy]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleViewDetails = (issue: any) => {
		// View details functionality can be implemented here
		// TODO: Implement view details functionality
	};

	const handleUpdate = (issue: any) => {
		// Update functionality can be implemented here
		// TODO: Implement update functionality
	};

	const handleDelete = (issue: any) => {
		// Delete functionality can be implemented here
		// TODO: Implement delete functionality
	};

	const handleExport = () => {
		// Export functionality can be implemented here
		// TODO: Implement export functionality
	};

	const handleShare = () => {
		// Share functionality can be implemented here
		// TODO: Implement share functionality
	};

	const handleAddIssue = () => {
		// Add issue functionality can be implemented here
		// TODO: Implement add issue functionality
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-16 lg:pt-8">
			{/* Header Section */}
			<div className="mb-6 sm:mb-8">
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
					All Issues
				</h1>
				<p className="text-gray-600 text-sm sm:text-lg">
					Manage and track all reported infrastructure issues
				</p>
			</div>

			{/* Stats Cards */}
			<AdminStatsCards issues={issues} />

			{/* Search and Filter Section */}
			<Card className="mb-4 sm:mb-6">
				<CardContent className="p-4 sm:p-6">
					<AdminSearchAndFilters
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
								All Issues
							</CardTitle>
							<CardDescription>
								{filteredIssues.length} of {issues.length} issues
								{searchTerm && ` matching "${searchTerm}"`}
							</CardDescription>
						</div>
						<AdminIssueActions 
							onExport={handleExport} 
							onShare={handleShare}
							onAddIssue={handleAddIssue}
						/>
					</div>
				</CardHeader>
				<CardContent>
					{issuesLoading ? (
						<div className="py-12 text-center">
							<LoadingSpinner text="Loading issues..." />
						</div>
					) : paginatedIssues.length === 0 ? (
						<AdminEmptyState 
							hasIssues={issues.length > 0}
							onAddIssue={handleAddIssue}
						/>
					) : (
						<>
							{/* Issues List */}
							<div className="space-y-4">
								{paginatedIssues.map((issue) => (
									<AdminIssueCard 
										key={issue.id} 
										issue={issue}
										onViewDetails={handleViewDetails}
										onUpdate={handleUpdate}
										onDelete={handleDelete}
									/>
								))}
							</div>

							{/* Pagination */}
							<AdminPagination
								currentPage={currentPage}
								totalPages={totalPages}
								startIndex={startIndex}
								totalItems={filteredIssues.length}
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
