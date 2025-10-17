import { useState, useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/supabase-api";

interface AdminSearchAndFiltersProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	categoryFilter: string;
	setCategoryFilter: (category: string) => void;
	locationFilter: string;
	setLocationFilter: (location: string) => void;
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
	locationFilter,
	setLocationFilter,
	sortBy,
	setSortBy,
}: AdminSearchAndFiltersProps) => {
	const { data: locations = [], isLoading: locationsLoading } = useQuery({
		queryKey: ['unique-locations'],
		queryFn: () => adminApi.getUniqueLocations(),
	});

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					placeholder="Search by title, location, category, or status..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
				/>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="border-gray-300 rounded-xl">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="open">Open</SelectItem>
						<SelectItem value="in_progress">In Progress</SelectItem>
						<SelectItem value="resolved">Resolved</SelectItem>
						<SelectItem value="closed">Closed</SelectItem>
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

				<Select value={locationFilter} onValueChange={setLocationFilter}>
					<SelectTrigger className="border-gray-300 rounded-xl">
						<SelectValue placeholder={locationsLoading ? "Loading..." : "Location"} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Locations</SelectItem>
						{locations.map((location: string) => (
							<SelectItem key={location} value={location}>
								{location}
							</SelectItem>
						))}
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
						<SelectItem value="location">Location</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Active Filters Display */}
			{(searchTerm || statusFilter !== "all" || categoryFilter !== "all" || locationFilter !== "all") && (
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
							Status: {statusFilter.replace("_", " ")}
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
					{locationFilter !== "all" && (
						<Badge variant="secondary" className="bg-orange-100 text-orange-800">
							Location: {locationFilter}
							<XCircle 
								className="h-3 w-3 ml-1 cursor-pointer" 
								onClick={() => setLocationFilter("all")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
};
