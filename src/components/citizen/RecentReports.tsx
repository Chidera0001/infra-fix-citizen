import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/supabase-api";

interface RecentReportsProps {
	reports: Issue[];
}

export const RecentReports = ({ reports }: RecentReportsProps) => {
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
						{reports.length} Reports
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{reports.map((issue) => (
						<IssueCard
							key={issue.id}
							issue={issue}
							showActions={false}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
