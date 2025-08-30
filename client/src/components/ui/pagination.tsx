import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center space-x-1 bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 h-7 text-xs"
      >
        <ChevronLeft className="h-3 w-3" />
        <span className="hidden sm:inline">Prev</span>
      </Button>

      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 py-1 text-gray-500 text-xs">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={cn(
                  "min-w-[32px] h-7 text-xs",
                  currentPage === page
                    ? "bg-blue-600 text-white border-none hover:bg-blue-700"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                )}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center space-x-1 bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 h-7 text-xs"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}
