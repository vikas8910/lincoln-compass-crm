import { type Table } from "@tanstack/react-table";
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
}

export default function TanStackBasicTablePaginationComponent<TData>({
  table,
}: TanStackBasicTablePaginationComponentProps<TData>) {
  const currentPageSize = table.getState().pagination.pageSize;
  const currentPageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-row-reverse items-center justify-between w-full">
      <TanStackBasicTablePaginationNavigationComponent table={table} />
      <div className="flex flex-row items-center gap-4 justify-start mt-4 w-full">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Items per page
        </p>

        <Select
          value={currentPageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
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
