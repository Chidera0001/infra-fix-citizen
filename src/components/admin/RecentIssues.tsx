import { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, XCircle } from "lucide-react";
import { AdminIssueCard } from "./AllIssues/index";
import { useIssues } from "@/hooks/use-issues";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 5;

export const RecentIssues = () => {
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
	};

	const handleUpdate = (issue: any) => {
		// Update functionality can be implemented here
	};

	const handleDelete = (issue: any) => {
		// Delete functionality can be implemented here
	};

	return (
		<Card className="bg-white border-0 shadow-lg">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-normal text-gray-900">
							Recent Issues
						</CardTitle>
						<CardDescription className="text-green-600">
							Latest reports requiring attention
						</CardDescription>
					</div>
					<Badge className="bg-green-100 text-green-700 border-green-200">
						{filteredIssues.length} New
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{/* Search and Filter Section */}
				<div className="mb-6 space-y-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search issues..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
						/>
					</div>

					{/* Filters */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="border-gray-300 rounded-xl">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="open">Open</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
							</SelectContent>
						</Select>

						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="border-gray-300 rounded-xl">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="pothole">Pothole</SelectItem>
								<SelectItem value="street_lighting">Street Lighting</SelectItem>
								<SelectItem value="water_supply">Water Supply</SelectItem>
								<SelectItem value="traffic_signal">Traffic Signal</SelectItem>
								<SelectItem value="drainage">Drainage</SelectItem>
								<SelectItem value="sidewalk">Sidewalk</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="border-gray-300 rounded-xl">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest First</SelectItem>
								<SelectItem value="oldest">Oldest First</SelectItem>
								<SelectItem value="priority">Priority</SelectItem>
								<SelectItem value="status">Status</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Active Filters Display */}
					{(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
						<div className="flex flex-wrap gap-2">
							<span className="text-sm text-gray-600">Active filters:</span>
							{searchTerm && (
								<Badge variant="secondary" className="bg-blue-100 text-blue-800">
									Search: "{searchTerm}"
									<XCircle 
										className="h-3 w-3 ml-1 cursor-pointer" 
										onClick={() => setSearchTerm("")}
									/>
								</Badge>
							)}
							{statusFilter !== "all" && (
								<Badge variant="secondary" className="bg-green-100 text-green-800">
									Status: {statusFilter}
									<XCircle 
										className="h-3 w-3 ml-1 cursor-pointer" 
										onClick={() => setStatusFilter("all")}
									/>
								</Badge>
							)}
							{categoryFilter !== "all" && (
								<Badge variant="secondary" className="bg-purple-100 text-purple-800">
									Category: {categoryFilter.replace("_", " ")}
									<XCircle 
										className="h-3 w-3 ml-1 cursor-pointer" 
										onClick={() => setCategoryFilter("all")}
									/>
								</Badge>
							)}
						</div>
					)}
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
		</Card>
	);
};
