import TanStackBasicTable from "@/components/tablec/TanStackBasicTable";
import { Button } from "@/components/ui/button";
import { useGetFiles } from "@/hooks/useGetFiles";
import { INITIAL_PAGINATION } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";

export const Files = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);
  const { allUsersData, isAllUsersDataLoading, error, refetch } = useGetFiles({
    sorting,
    columnFilters: columnFilters,
    pagination,
  });

  const userColumns: ColumnDef<File>[] = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => {
          return (
            <div className="py-3">
              <span
                className={
                  "whitespace-nowrap py-3 text-[#2c5cc5] font-bold cursor-pointer hover:text-[#1e3a8a] hover:underline transition-colors"
                }
              >
                {row.original?.fileName}
              </span>
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Owner",
        accessorKey: "fileType",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original?.uploadedBy}
          </span>
        ),
      },
      {
        header: "File Type",
        accessorKey: "fileType",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original.fileType}
          </span>
        ),
      },
      {
        header: "Added On",
        accessorKey: "fileType",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {formatDateTime(row.original.uploadedAt as string)}
          </span>
        ),
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: () => (
          <Button variant="outline" className="bg-gray-200">
            <FaDownload className="text-gray-500" />
          </Button>
        ),
      },
    ],
    [] // Add dependency for the click handler
  );

  return (
    <TanStackBasicTable
      isTableDataLoading={isAllUsersDataLoading}
      paginatedTableData={allUsersData}
      columns={userColumns}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
};
