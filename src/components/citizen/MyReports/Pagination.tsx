import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	startIndex: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({
	currentPage,
	totalPages,
	startIndex,
	totalItems,
	itemsPerPage,
	onPageChange,
}: PaginationProps) => {
	if (totalPages <= 1) return null;

	const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

	return (
		<div className="mt-8 flex items-center justify-between">
			<div className="text-sm text-gray-500">
				Showing {startIndex + 1} to {endIndex} of {totalItems} reports
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
					disabled={currentPage === 1}
					className="border-gray-300"
				>
					Previous
				</Button>
				
				<div className="flex items-center gap-1">
					{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const pageNum = i + 1;
						return (
							<Button
								key={pageNum}
								variant={currentPage === pageNum ? "default" : "outline"}
								size="sm"
								onClick={() => onPageChange(pageNum)}
								className={currentPage === pageNum 
									? "bg-green-600 hover:bg-green-700" 
									: "border-gray-300"
								}
							>
								{pageNum}
							</Button>
						);
					})}
				</div>
				
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
					disabled={currentPage === totalPages}
					className="border-gray-300"
				>
					Next
				</Button>
			</div>
		</div>
	);
};
