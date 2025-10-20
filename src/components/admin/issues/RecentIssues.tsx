import { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, XCircle, LayoutList, LayoutGrid } from "lucide-react";
import { AdminIssueCard, AdminIssueGridCard } from "./components";
import { AdminSearchAndFilters } from "./components";
import { useIssues, useUpdateIssue, useDeleteIssue } from "@/hooks/use-issues";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
	IssueDetailsModal, 
	UpdateStatusModal, 
	DeleteConfirmationModal, 
	ShareReportModal 
} from "../modals";
import type { Issue } from "@/lib/supabase-api";

const ITEMS_PER_PAGE = 5;

export const RecentIssues = () => {
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

	return (
		<Card className="bg-white border-0 shadow-lg">
			<CardHeader>
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-xl font-normal text-gray-900">
							Recent Issues
						</CardTitle>
						<CardDescription className="text-green-600">
							Latest reports requiring attention
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
						<Badge className="bg-green-100 text-green-700 border-green-200">
							{filteredIssues.length} New
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{/* Search and Filter Section */}
				<div className="mb-6">
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
				</div>

				{issuesLoading ? (
					<div className="py-8 text-center">
						<LoadingSpinner text="Loading issues..." />
					</div>
				) : paginatedIssues.length === 0 ? (
					<div className="py-8 text-center text-gray-500">
						No recent issues
					</div>
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
						{totalPages > 1 && (
							<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="text-sm text-gray-500 text-center sm:text-left">
									Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredIssues.length)} of {filteredIssues.length} issues
								</div>
								<div className="flex items-center justify-center sm:justify-end gap-2">
									<button
										onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
										disabled={currentPage === 1}
										className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Previous
									</button>
									
									<div className="flex items-center gap-1">
										{Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
											const pageNum = i + 1;
											return (
												<button
													key={pageNum}
													onClick={() => handlePageChange(pageNum)}
													className={`px-3 py-1 text-sm rounded-md ${
														currentPage === pageNum 
															? "bg-green-600 text-white" 
															: "border border-gray-300 hover:bg-gray-50"
													}`}
												>
													{pageNum}
												</button>
											);
										})}
									</div>
									
									<button
										onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
										disabled={currentPage === totalPages}
										className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</CardContent>

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
		</Card>
	);
};
