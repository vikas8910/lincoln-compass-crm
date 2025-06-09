import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Table,
} from "@tanstack/react-table";
import { useEffect } from "react";
import type { TableProps } from "../../types/Table";
import TanStackBasicTablePaginationComponent from "./TanStackBasicTablePaginationComponent";
import TanStackBasicTableSortingComponent from "./TanStackBasicTableSortingComponent";
import TanStackBasicTableFilterComponent from "./TanStackBasicTableFilterComponent";
import TanStackBasicTableTableComponent from "./TanStackBasicTableTableComponent";
import TanStackBasicTablePaginationNavigationComponent from "./TanStackBasicTablePaginationNavigationComponent";
import { CircleDashed } from "lucide-react";

// Update the TableProps interface to include the new prop
interface ExtendedTableProps<TData, TValue> extends TableProps<TData, TValue> {
  onTableInstanceChange?: (table: Table<TData>) => void;
}

export default function TanStackBasicTable<TData, TValue>({
  isTableDataLoading,
  paginatedTableData,
  columns,
  pagination = {
    pageIndex: 0,
    pageSize: 20,
  },
  sorting = [],
  setSorting,
  setPagination,
  columnFilters = [],
  setColumnFilters,
  onTableInstanceChange,
}: ExtendedTableProps<TData, TValue>) {
  const table = useReactTable({
    data: paginatedTableData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),

    // sort config
    onSortingChange: setSorting,
    enableMultiSort: true,
    manualSorting: true,
    sortDescFirst: true,

    // filter config
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,

    // pagination config
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    rowCount: paginatedTableData?.total_filtered,
    pageCount: Math.ceil(
      (paginatedTableData?.total_filtered || 0) /
        (paginatedTableData?.limit || 1)
    ),
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  });

  // Pass the table instance to parent component
  useEffect(() => {
    if (onTableInstanceChange) {
      onTableInstanceChange(table);
    }
  }, [table, onTableInstanceChange]);

  // to reset page index to first page
  useEffect(() => {
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize,
      }));
    }
  }, [columnFilters, setPagination]);

  return (
    <div className="w-full min-w-0">
      {/* <div className="flex flex-col md:flex-row justify-evenly gap-4 mb-8">
    <div className="bg-indigo-100 p-4 rounded-xl w-full">
      <TanStackBasicTableFilterComponent table={table} />
    </div>
    <div className="w-full flex flex-col gap-4 justify-between">
      <TanStackBasicTableSortingComponent sorting={sorting} />
      <TanStackBasicTablePaginationComponent table={table} />
    </div>
  </div> */}

      {isTableDataLoading ? (
        <div>
          <div className="h-52 flex items-center justify-center">
            <CircleDashed className="animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border mb-8 w-full overflow-hidden">
            <TanStackBasicTableTableComponent table={table} />
          </div>
          <TanStackBasicTablePaginationComponent table={table} />
        </>
      )}
    </div>
  );
}
