import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Tag } from "lucide-react";
import { ISSUE_CATEGORIES } from "@/constants";

interface Category {
	id: string;
	name: string;
	description: string;
	color: string;
	count?: number;
}

const categoryDescriptions: Record<string, string> = {
	bad_roads: "Road damage, potholes, and surface wear",
	broken_streetlights: "Faulty or missing street lighting",
	dump_sites: "Illegal or overflowing waste dumps",
	floods: "Flooded streets and neighborhoods",
	water_supply_issues: "Leaks, burst pipes, or disrupted supply",
	bad_traffic_signals: "Malfunctioning or missing traffic signals",
	poor_drainages: "Blocked gutters and drainage failures",
	erosion_sites: "Erosion hotspots threatening infrastructure",
	collapsed_bridges: "Damaged or unsafe bridges and culverts",
	open_manholes: "Exposed or damaged manhole covers",
	unsafe_crossings: "Unsafe pedestrian crossings and walkways",
	construction_debris: "Debris or materials obstructing public areas"
};

const categoryStyles: Record<string, string> = {
	bad_roads: "bg-red-100 text-red-700",
	broken_streetlights: "bg-yellow-100 text-yellow-700",
	dump_sites: "bg-emerald-100 text-emerald-700",
	floods: "bg-blue-100 text-blue-700",
	water_supply_issues: "bg-sky-100 text-sky-700",
	bad_traffic_signals: "bg-orange-100 text-orange-700",
	poor_drainages: "bg-teal-100 text-teal-700",
	erosion_sites: "bg-purple-100 text-purple-700",
	collapsed_bridges: "bg-amber-100 text-amber-700",
	open_manholes: "bg-pink-100 text-pink-700",
	unsafe_crossings: "bg-lime-100 text-lime-700",
	construction_debris: "bg-slate-100 text-slate-700"
};

const categories: Category[] = [
	{
		id: "all",
		name: "All Categories",
		description: "Include all issue categories",
		color: "bg-gray-100 text-gray-700"
	},
	...ISSUE_CATEGORIES.map((category) => ({
		id: category.value,
		name: category.label,
		description: categoryDescriptions[category.value] ?? "Infrastructure issue",
		color: categoryStyles[category.value] ?? "bg-gray-100 text-gray-700"
	}))
];

interface CategoryFilterProps {
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	categoryCounts?: Record<string, number>;
}

export const CategoryFilter = ({
	selectedCategory,
	onCategoryChange,
	categoryCounts = {}
}: CategoryFilterProps) => {
	return (
		<Card className="bg-white border-0 shadow-sm rounded-lg">
			<CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
				<CardTitle className="text-sm font-medium text-gray-900 flex items-center">
					<Filter className="h-4 w-4 mr-2 text-green-600" />
					Category Filter
				</CardTitle>
				<CardDescription className="text-xs text-gray-600">
					Filter issues by category type
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4">
				<Select value={selectedCategory} onValueChange={onCategoryChange}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem key={category.id} value={category.id}>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center">
										<Tag className="h-3 w-3 mr-2 text-gray-500" />
										<span className="font-medium">{category.name}</span>
									</div>
									{categoryCounts[category.id] !== undefined && (
										<Badge variant="secondary" className="ml-2 text-xs">
											{categoryCounts[category.id]}
										</Badge>
									)}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{selectedCategory !== "all" && (
					<div className="pt-2 border-t border-gray-100">
						<div className="text-xs text-gray-600 mb-2">Selected Category:</div>
						<div className="flex flex-col sm:flex-row sm:items-center gap-2">
							<Badge className={`${categories.find(c => c.id === selectedCategory)?.color} text-xs`}>
								{categories.find(c => c.id === selectedCategory)?.name}
							</Badge>
							<span className="text-xs text-gray-500">
								{categories.find(c => c.id === selectedCategory)?.description}
							</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
