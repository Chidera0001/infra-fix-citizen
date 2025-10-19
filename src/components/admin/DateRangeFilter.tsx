import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface DateRange {
	id: string;
	label: string;
	description: string;
	days?: number;
}

const dateRanges: DateRange[] = [
	{
		id: "7d",
		label: "Last 7 days",
		description: "Past week",
		days: 7
	},
	{
		id: "30d",
		label: "Last 30 days",
		description: "Past month",
		days: 30
	},
	{
		id: "90d",
		label: "Last 90 days",
		description: "Past quarter",
		days: 90
	},
	{
		id: "1y",
		label: "Last year",
		description: "Past 12 months",
		days: 365
	},
	{
		id: "custom",
		label: "Custom range",
		description: "Select specific dates"
	}
];

interface DateRangeFilterProps {
	selectedRange: string;
	onRangeChange: (range: string) => void;
	customStartDate?: string;
	customEndDate?: string;
	onCustomDateChange?: (startDate: string, endDate: string) => void;
}

export const DateRangeFilter = ({
	selectedRange,
	onRangeChange,
	customStartDate,
	customEndDate,
	onCustomDateChange
}: DateRangeFilterProps) => {
	const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
		if (onCustomDateChange) {
			if (field === 'start') {
				onCustomDateChange(value, customEndDate || '');
			} else {
				onCustomDateChange(customStartDate || '', value);
			}
		}
	};

	return (
		<Card className="bg-white border-0 shadow-sm rounded-lg">
			<CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
				<CardTitle className="text-sm font-medium text-gray-900 flex items-center">
					<Calendar className="h-4 w-4 mr-2 text-green-600" />
					Date Range
				</CardTitle>
				<CardDescription className="text-xs text-gray-600">
					Select the time period for your report
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4">
				<Select value={selectedRange} onValueChange={onRangeChange}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select date range" />
					</SelectTrigger>
					<SelectContent>
						{dateRanges.map((range) => (
							<SelectItem key={range.id} value={range.id}>
								<div className="flex flex-col">
									<span className="font-medium">{range.label}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{selectedRange === "custom" && (
					<div className="space-y-3 pt-2 border-t border-gray-100">
						<div className="flex items-center text-xs text-gray-600 mb-2">
							<Clock className="h-3 w-3 mr-1" />
							Custom Date Range
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									Start Date
								</label>
								<input
									type="date"
									value={customStartDate || ''}
									onChange={(e) => handleCustomDateChange('start', e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									End Date
								</label>
								<input
									type="date"
									value={customEndDate || ''}
									onChange={(e) => handleCustomDateChange('end', e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
								/>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
