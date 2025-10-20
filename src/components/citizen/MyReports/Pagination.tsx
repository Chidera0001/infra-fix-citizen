import { Button } from '@/components/ui/button';

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
    <div className='mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row'>
      <div className='text-center text-sm text-gray-500 sm:text-left'>
        Showing {startIndex + 1} to {endIndex} of {totalItems} reports
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className='border-gray-300'
        >
          <span className='hidden sm:inline'>Previous</span>
          <span className='sm:hidden'>Prev</span>
        </Button>

        <div className='flex items-center gap-1'>
          {Array.from(
            { length: Math.min(totalPages > 4 ? 3 : totalPages, totalPages) },
            (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                // Show current page and surrounding pages
                const start = Math.max(1, currentPage - 1);
                pageNum = start + i;
                if (pageNum > totalPages) return null;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => onPageChange(pageNum)}
                  className={`${
                    currentPage === pageNum
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'border-gray-300'
                  } min-w-[2.5rem]`}
                >
                  {pageNum}
                </Button>
              );
            }
          )}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className='px-2 text-gray-400'>...</span>
          )}
          {totalPages > 5 && currentPage < totalPages && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(totalPages)}
              className='min-w-[2.5rem] border-gray-300'
            >
              {totalPages}
            </Button>
          )}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='border-gray-300'
        >
          <span className='hidden sm:inline'>Next</span>
          <span className='sm:hidden'>Next</span>
        </Button>
      </div>
    </div>
  );
};
