import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/IssueCard";
import { useIssues } from "@/hooks/use-issues";

export const RecentIssues = () => {
	const { data: issues = [], isLoading: issuesLoading } = useIssues({ limit: 5, sortBy: 'created_at', sortOrder: 'DESC' });

	return (
		<Card className="bg-white border-0 shadow-lg">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-normal text-gray-900">
							Recent Issues
						</CardTitle>
						<CardDescription className="text-green-600">
							Latest reports requiring attention
						</CardDescription>
					</div>
					<Badge className="bg-green-100 text-green-700 border-green-200">
						{issues.slice(0, 5).length} New
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{issuesLoading ? (
					<div className="py-8 text-center text-gray-500">
						Loading issues...
					</div>
				) : issues.slice(0, 5).length === 0 ? (
					<div className="py-8 text-center text-gray-500">
						No recent issues
					</div>
				) : (
					<div className="space-y-4">
						{issues.slice(0, 5).map((issue) => (
							<IssueCard
								key={issue.id}
								issue={issue}
								showActions={true}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
