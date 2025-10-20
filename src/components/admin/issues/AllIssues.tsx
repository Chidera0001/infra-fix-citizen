import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid } from "lucide-react";
import { useIssues, useUpdateIssue, useDeleteIssue } from "@/hooks/use-issues";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Issue } from "@/types";
import { 
	IssueDetailsModal, 
	UpdateStatusModal, 
	DeleteConfirmationModal, 
	ShareReportModal 
} from "../modals";
import {
	AdminStatsCards,
	AdminIssueCard,
	AdminIssueGridCard,
	AdminIssueActions,
	AdminPagination,
	AdminEmptyState,
	AdminSearchAndFilters,
} from "./components";

const ITEMS_PER_PAGE = 6;

export const AllIssues = () => {
	const { data: issues = [], isLoading: issuesLoading } = useIssues({ limit: 100, sortBy: 'created_at', sortOrder: 'DESC' });
	const { mutate: updateIssue } = useUpdateIssue();
	const { mutate: deleteIssue } = useDeleteIssue();
	const { toast } = useToast();
	
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [locationFilter, setLocationFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

	// Modal states
	const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	// Filter and search logic
	const filteredIssues = useMemo(() => {
		let filtered = issues.filter((issue) => {
			// Enhanced search - includes title, description, address, category, and status
			const searchLower = searchTerm.toLowerCase();
			const matchesSearch = !searchTerm || (
				issue.title.toLowerCase().includes(searchLower) ||
				issue.description?.toLowerCase().includes(searchLower) ||
				issue.address?.toLowerCase().includes(searchLower) ||
				issue.category.toLowerCase().includes(searchLower) ||
				issue.status.toLowerCase().includes(searchLower)
			);
			
			const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
			const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
			
			// Location filter - check if the extracted location matches
			let matchesLocation = locationFilter === "all";
			if (locationFilter !== "all" && issue.address) {
				const fullAddress = issue.address;
				let extractedLocation = fullAddress;
				if (fullAddress.includes(',')) {
					extractedLocation = fullAddress.split(',')[0].trim();
				} else if (fullAddress.includes(' ')) {
					const parts = fullAddress.split(' ');
					extractedLocation = parts.slice(0, 2).join(' ');
				}
				extractedLocation = extractedLocation.replace(/^\d+\s*/, '');
				extractedLocation = extractedLocation.charAt(0).toUpperCase() + extractedLocation.slice(1).toLowerCase();
				matchesLocation = extractedLocation === locationFilter;
			}
			
			return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
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
				case "location":
					const getLocationName = (address: string) => {
						if (!address) return '';
						let location = address;
						if (address.includes(',')) {
							location = address.split(',')[0].trim();
						} else if (address.includes(' ')) {
							const parts = address.split(' ');
							location = parts.slice(0, 2).join(' ');
						}
						return location.replace(/^\d+\s*/, '').toLowerCase();
					};
					return getLocationName(a.address || '').localeCompare(getLocationName(b.address || ''));
				default:
					return 0;
			}
		});

		return filtered;
	}, [issues, searchTerm, statusFilter, categoryFilter, locationFilter, sortBy]);

	// Pagination logic
	const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedIssues = filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	// Reset to first page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchTerm, statusFilter, categoryFilter, locationFilter, sortBy]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleViewDetails = (issue: Issue) => {
		setSelectedIssue(issue);
		setDetailsModalOpen(true);
	};

	const handleUpdate = (issue: Issue) => {
		setSelectedIssue(issue);
		setUpdateModalOpen(true);
	};

	const handleDelete = (issue: Issue) => {
		setSelectedIssue(issue);
		setDeleteModalOpen(true);
	};

	const handleShare = (issue: Issue) => {
		setSelectedIssue(issue);
		setShareModalOpen(true);
	};

	const handleUpdateIssue = async (issueId: string, updates: { status: string; severity?: string; resolution_notes?: string }) => {
		updateIssue({ id: issueId, updates }, {
			onSuccess: () => {
				toast({
					title: "Success",
					description: "Issue updated successfully",
				});
			},
			onError: (error) => {
				toast({
					title: "Error",
					description: "Failed to update issue",
					variant: "destructive",
				});
			}
		});
	};

	const handleDeleteIssue = async (issueId: string) => {
		deleteIssue(issueId, {
			onSuccess: () => {
				toast({
					title: "Success",
					description: "Issue deleted successfully",
				});
			},
			onError: (error) => {
				toast({
					title: "Error",
					description: "Failed to delete issue",
					variant: "destructive",
				});
			}
		});
	};

	const handleExport = () => {
		// Export functionality can be implemented here
		// TODO: Implement export functionality
	};

	const handleAddIssue = () => {
		// Add issue functionality can be implemented here
		// TODO: Implement add issue functionality
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-16 lg:pt-8">
			{/* Header Section */}
			<div className="mb-6 sm:mb-8">
				<div className="text-xl sm:text-xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
					All Issues
				</div>
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
						locationFilter={locationFilter}
						setLocationFilter={setLocationFilter}
						sortBy={sortBy}
						setSortBy={setSortBy}
					/>
				</CardContent>
			</Card>

			{/* Results Section */}
			<Card className="bg-white border-0 shadow-xl rounded-2xl">
				<CardHeader>
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex-1">
							<CardTitle className="text-xl font-semibold text-gray-900">
								All Issues
							</CardTitle>
							<CardDescription>
								{filteredIssues.length} of {issues.length} issues
								{searchTerm && ` matching "${searchTerm}"`}
							</CardDescription>
						</div>
						<div className="flex items-center gap-3">
							{/* View Toggle */}
							<div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className={`px-3 ${viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""}`}
								>
									<LayoutList className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className={`px-3 ${viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""}`}
								>
									<LayoutGrid className="h-4 w-4" />
								</Button>
							</div>
							<AdminIssueActions 
								onExport={handleExport} 
								onShare={handleShare}
								onAddIssue={handleAddIssue}
							/>
						</div>
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
							{/* Issues List or Grid */}
							{viewMode === "list" ? (
								<div className="space-y-4">
									{paginatedIssues.map((issue) => (
										<AdminIssueCard 
											key={issue.id} 
											issue={issue}
											onViewDetails={handleViewDetails}
											onUpdate={handleUpdate}
											onDelete={handleDelete}
											onShare={handleShare}
										/>
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{paginatedIssues.map((issue) => (
										<AdminIssueGridCard 
											key={issue.id} 
											issue={issue}
											onViewDetails={handleViewDetails}
											onUpdate={handleUpdate}
											onDelete={handleDelete}
											onShare={handleShare}
										/>
									))}
								</div>
							)}

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

			{/* Modals */}
			<IssueDetailsModal
				issue={selectedIssue}
				isOpen={detailsModalOpen}
				onClose={() => setDetailsModalOpen(false)}
				onUpdate={handleUpdate}
				onDelete={handleDelete}
				onShare={handleShare}
			/>

			<UpdateStatusModal
				issue={selectedIssue}
				isOpen={updateModalOpen}
				onClose={() => setUpdateModalOpen(false)}
				onSave={handleUpdateIssue}
			/>

			<DeleteConfirmationModal
				issue={selectedIssue}
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteIssue}
			/>

			<ShareReportModal
				issue={selectedIssue}
				isOpen={shareModalOpen}
				onClose={() => setShareModalOpen(false)}
			/>
		</div>
	);
};
