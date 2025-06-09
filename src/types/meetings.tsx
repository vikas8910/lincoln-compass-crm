import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";

export interface UseMeetingInput {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  pagination: PaginationState;
}

export interface Meeting {
  id: number;
  title: string;
  description: string;
  timeZone: string;
  fromDate: string | Date; // ISO 8601 date string (e.g., "2025-06-05T19:54:12.866Z")
  toDate: string | Date;
  outcome: string;
  completed: boolean;
  completedDate: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  relatedTo: number[];
  collaboratorsId: number[];
  location: string;
  meetingNotes: string;
  allDay: boolean;
  videoConferencing: string;
}

export interface UseMeetingsResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: Meeting[];
  appliedFilters?: Record<string, string>; // Add this line
  allCount: number;
  upcomingCount: number;
  overdueCount: number;
  completedCount: number;
}
