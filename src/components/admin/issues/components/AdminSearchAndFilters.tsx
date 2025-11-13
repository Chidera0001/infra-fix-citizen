import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, XCircle } from "lucide-react";
import { ISSUE_CATEGORIES } from "@/constants";

interface AdminSearchAndFiltersProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	categoryFilter: string;
	setCategoryFilter: (category: string) => void;
	sortBy: string;
	setSortBy: (sort: string) => void;
}

export const AdminSearchAndFilters = ({
	searchTerm,
	setSearchTerm,
	statusFilter,
	setStatusFilter,
	categoryFilter,
	setCategoryFilter,
	sortBy,
	setSortBy,
}: AdminSearchAndFiltersProps) => {
	return (
		<div className="mb-4 sm:mb-6">
			<div className="flex flex-col gap-3 sm:gap-4">
				{/* Search */}
				<div className="w-full">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search issues..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl text-sm sm:text-base"
						/>
					</div>
				</div>

				{/* Filters */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full border-gray-300 rounded-xl text-sm">
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
						<SelectTrigger className="w-full border-gray-300 rounded-xl text-sm">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{ISSUE_CATEGORIES.map((category) => (
								<SelectItem key={category.value} value={category.value}>
									{category.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-full border-gray-300 rounded-xl text-sm">
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
			</div>

			{/* Active Filters Display */}
			{(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
				<div className="mt-4 flex flex-wrap gap-2">
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
							Category: {categoryFilter.replace(/_/g, " ")}
							<XCircle 
								className="h-3 w-3 ml-1 cursor-pointer" 
								onClick={() => setCategoryFilter("all")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
};
