import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
	currentPage: number;
	totalPages: number;
	startIndex: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export const AdminPagination = ({
	currentPage,
	totalPages,
	startIndex,
	totalItems,
	itemsPerPage,
	onPageChange,
}: AdminPaginationProps) => {
	if (totalPages <= 1) return null;

	const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

	return (
		<div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div className="text-sm text-gray-500 text-center sm:text-left">
				Showing {startIndex + 1} to {endIndex} of {totalItems} issues
			</div>
			<div className="flex items-center justify-center sm:justify-end gap-2">
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
