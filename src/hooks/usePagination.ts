
import { useState, useEffect, useCallback } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export default function usePagination({
  initialPage = 0,
  initialPageSize = 10,
  onPageChange,
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Reset page when page size changes
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page when changing page size
    
    if (onPageChange) {
      onPageChange(0, newPageSize);
    }
  }, [onPageChange]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    
    if (onPageChange) {
      onPageChange(newPage, pageSize);
    }
  }, [onPageChange, pageSize]);

  // Update pagination state based on API response
  const updatePaginationState = useCallback((
    totalElements: number, 
    totalPages: number
  ) => {
    setTotalItems(totalElements);
    setTotalPages(totalPages);
  }, []);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    updatePaginationState
  };
}
