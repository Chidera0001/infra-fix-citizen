import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, TrendingUp, PieChart } from "lucide-react";

interface ReportType {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	color: string;
}

const reportTypes: ReportType[] = [
	{
		id: "summary",
		name: "Summary Report",
		description: "High-level overview with key metrics and statistics",
		icon: <FileText className="h-5 w-5" />,
		color: "bg-green-50 text-green-700 border-green-200"
	},
	{
		id: "detailed",
		name: "Detailed Report",
		description: "Comprehensive analysis with full issue details and breakdowns",
		icon: <BarChart3 className="h-5 w-5" />,
		color: "bg-green-50 text-green-700 border-green-200"
	},
	{
		id: "performance",
		name: "Performance Report",
		description: "Response times, resolution rates, and efficiency metrics",
		icon: <TrendingUp className="h-5 w-5" />,
		color: "bg-green-50 text-green-700 border-green-200"
	},
	{
		id: "trends",
		name: "Trends Analysis",
		description: "Historical patterns and predictive insights",
		icon: <PieChart className="h-5 w-5" />,
		color: "bg-green-50 text-green-700 border-green-200"
	}
];

interface ReportTypesProps {
	selectedType: string;
	onTypeChange: (type: string) => void;
}

export const ReportTypes = ({ selectedType, onTypeChange }: ReportTypesProps) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
			{reportTypes.map((type) => (
				<Card
					key={type.id}
					className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
						selectedType === type.id
							? `${type.color} border-2`
							: "bg-white border border-gray-200 hover:border-gray-300"
					}`}
					onClick={() => onTypeChange(type.id)}
				>
					<CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
						<div className="flex items-center justify-between">
							<div className={`p-2 rounded-lg bg-green-50`}>
								{type.icon}
							</div>
							{selectedType === type.id && (
								<Badge variant="secondary" className="text-xs hidden sm:block">
									Selected
								</Badge>
							)}
						</div>
						<CardTitle className="text-sm font-medium text-gray-900 leading-tight">
							{type.name}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0 px-3 sm:px-4">
						<CardDescription className="text-xs text-gray-600 leading-relaxed">
							{type.description}
						</CardDescription>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
