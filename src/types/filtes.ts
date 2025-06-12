import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";

export interface UseFilesInput {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  pagination: PaginationState;
}

export interface File {
  id: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  storageType: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface UseFilesResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: File[];
  appliedFilters?: Record<string, string>;
}
