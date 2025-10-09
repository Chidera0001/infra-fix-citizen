import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ReportCard } from "./MyReports/index";
import type { Issue } from "@/lib/supabase-api";

interface RecentReportsProps {
	reports: Issue[];
}

const ITEMS_PER_PAGE = 3;

export const RecentReports = ({ reports }: RecentReportsProps) => {
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

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
			<CardHeader className="pb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className="text-xl font-normal">
							My Recent Reports
						</CardTitle>
						<CardDescription className="text-gray-600 text-m">
							Track the progress of your submitted issues
							in your Nigerian community
						</CardDescription>
					</div>
					<Badge
						variant="secondary"
						className="bg-green-50 text-green-700 border-green-200 self-start sm:self-center"
					>
						{filteredReports.length} Reports
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
							placeholder="Search reports..."
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

				{/* Reports List */}
				<div className="space-y-4">
					{paginatedReports.map((report) => (
						<ReportCard
							key={report.id}
							report={report}
						/>
					))}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex-col mt-6 gap-2 flex items-center justify-between">
						<div className="text-sm text-gray-500">
							Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} reports
						</div>
						<div className="flex items-center gap-2">
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
			</CardContent>
		</Card>
	);
};
