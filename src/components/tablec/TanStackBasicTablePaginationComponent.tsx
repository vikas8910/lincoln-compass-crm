import { type Table } from "@tanstack/react-table";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TanStackBasicTablePaginationNavigationComponent from "./TanStackBasicTablePaginationNavigationComponent";

interface TanStackBasicTablePaginationComponentProps<TData> {
  table: Table<TData>;
  storageKey?: string; // Optional key for localStorage, defaults to "table-page-size"
}

export default function TanStackBasicTablePaginationComponent<TData>({
  table,
  storageKey = "table-page-size",
}: TanStackBasicTablePaginationComponentProps<TData>) {
  const currentPageSize = table.getState().pagination.pageSize;
  const currentPageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  // Load saved page size from localStorage on component mount
  useEffect(() => {
    try {
      const savedPageSize = localStorage.getItem(storageKey);
      if (savedPageSize) {
        const parsedPageSize = parseInt(savedPageSize, 10);
        // Validate that the saved page size is one of the allowed values
        if ([10, 20, 50, 100].includes(parsedPageSize)) {
          table.setPageSize(parsedPageSize);
        }
      }
    } catch (error) {
      console.warn("Failed to load page size from localStorage:", error);
    }
  }, [table, storageKey]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      console.warn("Failed to save page size to localStorage:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <TanStackBasicTablePaginationNavigationComponent table={table} />
      <div className="flex flex-row items-center gap-4 justify-center mt-4">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Items per page
        </p>

        <Select
          value={currentPageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-20 h-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {[10, 20, 50, 100].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={pageSize.toString()}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Page {currentPageIndex + 1} of {totalPages}
        </p>
      </div>
    </div>
  );
}
