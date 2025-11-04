import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Tag } from "lucide-react";

interface Category {
	id: string;
	name: string;
	description: string;
	color: string;
	count?: number;
}

const categories: Category[] = [
	{
		id: "all",
		name: "All Categories",
		description: "Include all issue categories",
		color: "bg-gray-100 text-gray-700"
	},
	{
		id: "pothole",
		name: "Pothole",
		description: "Road surface damage and holes",
		color: "bg-blue-100 text-blue-700"
	},
	{
		id: "street_lighting",
		name: "Street Lighting",
		description: "Street lights and illumination",
		color: "bg-yellow-100 text-yellow-700"
	},
	{
		id: "water_supply",
		name: "Water Supply",
		description: "Water pipes, leaks, and supply issues",
		color: "bg-blue-100 text-blue-700"
	},
	{
		id: "traffic_signal",
		name: "Traffic Signal",
		description: "Traffic lights and signals",
		color: "bg-red-100 text-red-700"
	},
	{
		id: "drainage",
		name: "Drainage",
		description: "Blocked drains, flooding issues, and water management impacting climate resilience",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "sidewalk",
		name: "Sidewalk",
		description: "Pedestrian walkways and paths",
		color: "bg-purple-100 text-purple-700"
	},
	{
		id: "flooding",
		name: "Flooding",
		description: "Flooding and water overflow issues posing climate adaptation challenges",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "erosion",
		name: "Erosion",
		description: "Coastal, riverbank, or soil erosion from extreme weather affecting infrastructure",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "urban_heat",
		name: "Urban Heat",
		description: "Heat island effects, lack of green spaces impacting climate resilience",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "storm_damage",
		name: "Storm Damage",
		description: "Wind, storm, and extreme weather damage requiring climate adaptation",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "green_infrastructure",
		name: "Green Infrastructure",
		description: "Lack of trees, parks, permeable surfaces needed for climate mitigation",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "water_contamination",
		name: "Water Contamination",
		description: "Post-flooding contamination and water quality issues affecting public health",
		color: "bg-green-100 text-green-700"
	},
	{
		id: "other",
		name: "Other",
		description: "Other infrastructure issues",
		color: "bg-gray-100 text-gray-700"
	}
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
