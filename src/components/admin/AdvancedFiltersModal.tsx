import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Filter, X, Plus } from "lucide-react";

interface AdvancedFilters {
	status?: string[];
	severity?: string[];
	priority?: string[];
	assignedTo?: string;
	location?: {
		radius?: number;
		lat?: number;
		lng?: number;
	};
	tags?: string[];
	dateRange?: {
		start?: string;
		end?: string;
	};
}

interface AdvancedFiltersModalProps {
	onFiltersChange: (filters: AdvancedFilters) => void;
	currentFilters?: AdvancedFilters;
}

const statusOptions = [
	{ id: "open", label: "Open", color: "bg-red-100 text-red-700" },
	{ id: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
	{ id: "resolved", label: "Resolved", color: "bg-green-100 text-green-700" },
	{ id: "closed", label: "Closed", color: "bg-gray-100 text-gray-700" }
];

const severityOptions = [
	{ id: "low", label: "Low", color: "bg-green-100 text-green-700" },
	{ id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
	{ id: "high", label: "High", color: "bg-orange-100 text-orange-700" },
	{ id: "critical", label: "Critical", color: "bg-red-100 text-red-700" }
];

const priorityOptions = [
	{ id: "low", label: "Low Priority", color: "bg-blue-100 text-blue-700" },
	{ id: "normal", label: "Normal Priority", color: "bg-green-100 text-green-700" },
	{ id: "high", label: "High Priority", color: "bg-orange-100 text-orange-700" },
	{ id: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" }
];

export const AdvancedFiltersModal = ({
	onFiltersChange,
	currentFilters = {}
}: AdvancedFiltersModalProps) => {
	const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);
	const [newTag, setNewTag] = useState("");

	const updateFilter = (key: keyof AdvancedFilters, value: any) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
	};

	const addStatus = (status: string) => {
		const currentStatuses = filters.status || [];
		if (!currentStatuses.includes(status)) {
			updateFilter("status", [...currentStatuses, status]);
		}
	};

	const removeStatus = (status: string) => {
		const currentStatuses = filters.status || [];
		updateFilter("status", currentStatuses.filter(s => s !== status));
	};

	const addSeverity = (severity: string) => {
		const currentSeverities = filters.severity || [];
		if (!currentSeverities.includes(severity)) {
			updateFilter("severity", [...currentSeverities, severity]);
		}
	};

	const removeSeverity = (severity: string) => {
		const currentSeverities = filters.severity || [];
		updateFilter("severity", currentSeverities.filter(s => s !== severity));
	};

	const addTag = () => {
		if (newTag.trim()) {
			const currentTags = filters.tags || [];
			if (!currentTags.includes(newTag.trim())) {
				updateFilter("tags", [...currentTags, newTag.trim()]);
				setNewTag("");
			}
		}
	};

	const removeTag = (tag: string) => {
		const currentTags = filters.tags || [];
		updateFilter("tags", currentTags.filter(t => t !== tag));
	};

	const applyFilters = () => {
		onFiltersChange(filters);
	};

	const clearAllFilters = () => {
		const emptyFilters: AdvancedFilters = {};
		setFilters(emptyFilters);
		onFiltersChange(emptyFilters);
	};

	const hasActiveFilters = () => {
		return (
			(filters.status && filters.status.length > 0) ||
			(filters.severity && filters.severity.length > 0) ||
			(filters.priority && filters.priority.length > 0) ||
			(filters.tags && filters.tags.length > 0) ||
			filters.assignedTo ||
			filters.location?.radius
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
					<Settings className="h-4 w-4 mr-2" />
					Advanced Filters
					{hasActiveFilters() && (
						<Badge variant="secondary" className="ml-2 text-xs">
							Active
						</Badge>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-0">
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<Filter className="h-5 w-5 mr-2 text-green-600" />
						Advanced Filters
					</DialogTitle>
					<DialogDescription>
						Configure detailed filters for your report generation
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Status Filter */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Status Filter</CardTitle>
							<CardDescription className="text-xs">
								Select issue statuses to include
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{filters.status?.map(status => (
									<Badge
										key={status}
										variant="secondary"
										className="cursor-pointer hover:bg-red-100"
										onClick={() => removeStatus(status)}
									>
										{statusOptions.find(s => s.id === status)?.label}
										<X className="h-3 w-3 ml-1" />
									</Badge>
								))}
							</div>
							<Select onValueChange={addStatus}>
								<SelectTrigger>
									<SelectValue placeholder="Add status filter" />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map(option => (
										<SelectItem key={option.id} value={option.id}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{/* Severity Filter */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Severity Filter</CardTitle>
							<CardDescription className="text-xs">
								Select issue severities to include
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{filters.severity?.map(severity => (
									<Badge
										key={severity}
										variant="secondary"
										className="cursor-pointer hover:bg-red-100"
										onClick={() => removeSeverity(severity)}
									>
										{severityOptions.find(s => s.id === severity)?.label}
										<X className="h-3 w-3 ml-1" />
									</Badge>
								))}
							</div>
							<Select onValueChange={addSeverity}>
								<SelectTrigger>
									<SelectValue placeholder="Add severity filter" />
								</SelectTrigger>
								<SelectContent>
									{severityOptions.map(option => (
										<SelectItem key={option.id} value={option.id}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{/* Tags Filter */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Tags Filter</CardTitle>
							<CardDescription className="text-xs">
								Add custom tags to filter by
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{filters.tags?.map(tag => (
									<Badge
										key={tag}
										variant="secondary"
										className="cursor-pointer hover:bg-red-100"
										onClick={() => removeTag(tag)}
									>
										{tag}
										<X className="h-3 w-3 ml-1" />
									</Badge>
								))}
							</div>
							<div className="flex gap-2">
								<Input
									placeholder="Enter tag name"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && addTag()}
								/>
								<Button size="sm" onClick={addTag}>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Location Filter */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Location Filter</CardTitle>
							<CardDescription className="text-xs">
								Filter by geographic area
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div>
									<Label htmlFor="radius" className="text-xs">Radius (km)</Label>
									<Input
										id="radius"
										type="number"
										placeholder="10"
										value={filters.location?.radius || ''}
										onChange={(e) => updateFilter("location", {
											...filters.location,
											radius: parseInt(e.target.value) || undefined
										})}
									/>
								</div>
								<div>
									<Label htmlFor="lat" className="text-xs">Latitude</Label>
									<Input
										id="lat"
										type="number"
										step="any"
										placeholder="40.7128"
										value={filters.location?.lat || ''}
										onChange={(e) => updateFilter("location", {
											...filters.location,
											lat: parseFloat(e.target.value) || undefined
										})}
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="lng" className="text-xs">Longitude</Label>
								<Input
									id="lng"
									type="number"
									step="any"
									placeholder="-74.0060"
									value={filters.location?.lng || ''}
									onChange={(e) => updateFilter("location", {
										...filters.location,
										lng: parseFloat(e.target.value) || undefined
									})}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col sm:flex-row justify-between pt-4 border-t gap-3">
					<Button variant="outline" onClick={clearAllFilters} className="w-full sm:w-auto">
						Clear All
					</Button>
					<div className="flex flex-col sm:flex-row gap-2">
						<Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
						<Button onClick={applyFilters} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
							Apply Filters
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
