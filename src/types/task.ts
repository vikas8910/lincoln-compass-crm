import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";

export interface UseTasksInput {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  pagination: PaginationState;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  taskType: string;
  dueDate: string | Date; // ISO 8601 date string (e.g., "2025-06-05T19:54:12.866Z")
  outcome: string;
  completed: boolean;
  completedDate: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  ownerId: number;
  relatedLeads: number[];
  collaboratorsId: number[];
}

export interface UseTasksResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: Task[];
  appliedFilters?: Record<string, string>; // Add this line
  allCount: number;
  upcomingCount: number;
  overdueCount: number;
  completedCount: number;
}
