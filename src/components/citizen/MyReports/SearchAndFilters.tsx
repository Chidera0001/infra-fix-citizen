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

interface SearchAndFiltersProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	categoryFilter: string;
	setCategoryFilter: (category: string) => void;
	sortBy: string;
	setSortBy: (sort: string) => void;
}

export const SearchAndFilters = ({
	searchTerm,
	setSearchTerm,
	statusFilter,
	setStatusFilter,
	categoryFilter,
	setCategoryFilter,
	sortBy,
	setSortBy,
}: SearchAndFiltersProps) => {
	return (
		<div className="mb-6">
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Search */}
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search reports by title, description, or address..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
						/>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-3">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full sm:w-[140px] border-gray-300 rounded-xl">
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
						<SelectTrigger className="w-full sm:w-[160px] border-gray-300 rounded-xl">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							<SelectItem value="road_infrastructure">Road Infrastructure</SelectItem>
							<SelectItem value="street_lighting">Street Lighting</SelectItem>
							<SelectItem value="water_systems">Water Systems</SelectItem>
							<SelectItem value="traffic_management">Traffic Management</SelectItem>
							<SelectItem value="drainage_systems">Drainage Systems</SelectItem>
							<SelectItem value="public_facilities">Public Facilities</SelectItem>
						</SelectContent>
					</Select>

					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-full sm:w-[140px] border-gray-300 rounded-xl">
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
	);
};
