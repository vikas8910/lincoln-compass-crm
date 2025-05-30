import type { Dispatch, SetStateAction } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
} from "@tanstack/react-table";

export interface TableProps<TData, TValue> {
  isTableDataLoading: boolean;
  paginatedTableData?: UseGetTableResponseType<TData>;
  columns: ColumnDef<TData, TValue>[];
  pagination?: PaginationState;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  onTableInstanceChange?: (table: Table<TData>) => void; // Add this line
}

export interface UseGetTableResponseType<TData> {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: TData[];
}
