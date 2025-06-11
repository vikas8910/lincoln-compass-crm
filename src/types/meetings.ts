import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";

export interface UseMeetingInput {
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  pagination: PaginationState;
  leadId: string;
}

export interface Meeting {
  id: number;
  title: string;
  description: string;
  timeZone: string;
  from: string | Date; // ISO 8601 date string (e.g., "2025-06-05T19:54:12.866Z")
  to: string | Date;
  outcome: string;
  completed: boolean;
  completedDate: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  relatedLeadsIds: number[];
  attendees: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  location: string;
  meetingNotes: string;
  allDay: boolean;
  videoConferencing: string;
  relatedLeads: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  }>;
  userName: string;
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
