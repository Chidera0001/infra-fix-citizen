import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import IssueCard from "@/components/IssueCard";
import { useIssues } from "@/hooks/use-issues";

export const AllIssues = () => {
	const { data: issues = [], isLoading: issuesLoading } = useIssues({ limit: 5, sortBy: 'created_at', sortOrder: 'DESC' });

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
				<h1 className="text-xl sm:text-xl lg:text-3xl font-normal text-gray-900 mb-2 lg:mb-3">
					All Issues
				</h1>
				<p className="text-gray-700 text-base lg:text-sm font-medium">
					Manage and track all reported issues
				</p>
			</div>

			<Card className="bg-white border-0 shadow-xl rounded-2xl">
				<CardHeader>
					<CardTitle className="text-xl font-normal text-gray-900">All Reported Issues</CardTitle>
					<CardDescription>View and manage all issues in the system</CardDescription>
				</CardHeader>
				<CardContent>
					{issuesLoading ? (
						<div className="py-8 text-center text-gray-500">Loading issues...</div>
					) : issues.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-gray-500">No issues found</p>
						</div>
					) : (
						<div className="space-y-4">
							{issues.map((issue) => (
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
		</div>
	);
};
