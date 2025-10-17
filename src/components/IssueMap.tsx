import { ArrowLeft } from "lucide-react";
import { useIssues } from "@/hooks/use-issues";
import InteractiveMap from "./InteractiveMap";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface IssueMapProps {
	onBack: () => void;
	isAdmin?: boolean;
}

const IssueMap = ({ onBack, isAdmin = false }: IssueMapProps) => {
	const { data: issues = [], isLoading } = useIssues({ limit: 100 });
	
	return (
		<div className="h-screen w-full flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b flex-shrink-0">
				<div className="px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div>
								<h2 className="text-l sm:text-xl font-bold text-gray-900">
									{isAdmin ? "Admin Map View" : "Issue Map"}
								</h2>
								<p className="text-sm text-gray-600">
									{isAdmin
										? "Monitor all issues across the community"
										: "View all reported issues by location"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Full-Width Map */}
			<div className="flex-1 w-full">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<LoadingSpinner text="Loading map..." />
					</div>
				) : (
					<InteractiveMap
						issues={issues}
						isAdmin={isAdmin}
						className="h-full w-full"
					/>
				)}
			</div>
		</div>
	);
};

export default IssueMap;
