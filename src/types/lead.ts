import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

export interface UseUsersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseLeadsResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: Lead[];
}

export interface EditableField {
  key: keyof Lead;
  label: string;
  validationType?: string;
}

export interface InfoCardProps {
  title: string;
  value: string;
  validationType?: string;
  fieldKey: string;
  isEditable?: boolean;
  onSave?: (key: string, value: string) => void;
}

export interface SidebarItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  source: string;
  course: string;
  leadType: string;
  leadStage: string;
  intake: string;
  assignedTo: string | null;
  assignedCounselorName: string | null;
  recentNote: string;
  leadScore: number;
  createdAt: string;
  updatedAt: string;
}

// Define the Lead status type to match the constraint
export type LeadStatus =
  | "New"
  | "In Contact"
  | "Follow up"
  | "Set Meeting"
  | "Negotiation"
  | "Enrolled"
  | "Junk/Lost"
  | "On Campus"
  | "Customer";

// Define the Lead type
