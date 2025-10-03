import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/supabase-api";

interface MyReportsProps {
	reports: Issue[];
	isLoading: boolean;
	onReportIssue: () => void;
}

export const MyReports = ({ reports, isLoading, onReportIssue }: MyReportsProps) => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
			{/* Header with Border */}
			<div className="mb-6 lg:mb-10 pb-4 border-b border-gray-200">
				<h1 className="text-l sm:text-xl lg:text-xl font-normal text-gray-900 mb-1 lg:mb-2">
					My Reports
				</h1>
				<p className="text-gray-700 text-base lg:text-sm font-medium">
					View and track all your submitted reports
				</p>
			</div>

			<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
				<CardHeader>
					<CardTitle className="text-l font-normal text-gray-900">Your Submitted Reports</CardTitle>
					<CardDescription>All reports you've submitted to the platform</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="py-8 text-center text-gray-500">Loading your reports...</div>
					) : reports.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-gray-500 mb-4">You haven't submitted any reports yet</p>
							<Button onClick={onReportIssue} className="bg-green-600 hover:bg-green-700">
								<Plus className="h-4 w-4 mr-2" />
								Report an Issue
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{reports.map((issue) => (
								<IssueCard
									key={issue.id}
									issue={issue}
									showActions={false}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
