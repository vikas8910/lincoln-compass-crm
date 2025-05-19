
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiLoader } from "react-icons/fi";
import TablePagination from "@/components/table/TablePagination";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

function DynamicTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found.",
  pagination,
}: DynamicTableProps<T>) {
  const getCellContent = (item: T, accessor: Column<T>["accessor"]) => {
    if (typeof accessor === "function") {
      return accessor(item);
    }
    // Explicitly cast the result to ReactNode to ensure type safety
    return String(item[accessor as keyof T]) as React.ReactNode;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <FiLoader className="h-6 w-6 mx-auto animate-spin" />
                <div className="mt-2">Loading data...</div>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, rowIndex) => (
              <TableRow key={item.id?.toString() || rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {getCellContent(item, column.accessor)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {pagination && data.length > 0 && (
        <TablePagination
          currentPage={pagination.currentPage + 1} // Add 1 for UI display (1-based)
          totalPages={pagination.totalPages}
          onPageChange={(page) => pagination.onPageChange(page - 1)} // Subtract 1 for API call (0-based)
          pageSize={pagination.pageSize}
          onPageSizeChange={pagination.onPageSizeChange}
          totalItems={pagination.totalItems}
        />
      )}
    </div>
  );
}

export default DynamicTable;
