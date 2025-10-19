import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface ExportFormat {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	mimeType: string;
	extension: string;
}

const exportFormats: ExportFormat[] = [
	{
		id: "pdf",
		name: "PDF",
		description: "Portable Document Format",
		icon: <FileText className="h-4 w-4" />,
		mimeType: "application/pdf",
		extension: "pdf"
	},
	{
		id: "csv",
		name: "CSV",
		description: "Comma Separated Values",
		icon: <FileSpreadsheet className="h-4 w-4" />,
		mimeType: "text/csv",
		extension: "csv"
	},
	{
		id: "excel",
		name: "Excel",
		description: "Microsoft Excel Format",
		icon: <FileSpreadsheet className="h-4 w-4" />,
		mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		extension: "xlsx"
	},
	{
		id: "json",
		name: "JSON",
		description: "JavaScript Object Notation",
		icon: <File className="h-4 w-4" />,
		mimeType: "application/json",
		extension: "json"
	}
];

interface ExportFormatSelectorProps {
	selectedFormat: string;
	onFormatChange: (format: string) => void;
}

export const ExportFormatSelector = ({
	selectedFormat,
	onFormatChange
}: ExportFormatSelectorProps) => {
	return (
		<Card className="bg-white border-0 shadow-sm rounded-lg">
			<CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4">
				<CardTitle className="text-sm font-medium text-gray-900 flex items-center">
					<Download className="h-4 w-4 mr-2 text-green-600" />
					Export Format
				</CardTitle>
				<CardDescription className="text-xs text-gray-600">
					Choose the file format for your report
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4">
				<Select value={selectedFormat} onValueChange={onFormatChange}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select export format" />
					</SelectTrigger>
					<SelectContent>
						{exportFormats.map((format) => (
							<SelectItem key={format.id} value={format.id}>
								<div className="flex items-center">
									<div className="mr-3 text-gray-600">
										{format.icon}
									</div>
									<div className="flex flex-col">
										<span className="font-medium">{format.name}</span>
									</div>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
};
