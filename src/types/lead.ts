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
  appliedFilters?: Record<string, string>; // Add this line
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
  disabled?: boolean;
}

export interface SidebarItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  Icon?: LucideIcon;
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

  mobileBackup?: string;
  workPhone?: string;
  officeMobile?: string;
  otherPhoneNumbers?: string;
  countryCode?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  countryOfResidence?: string;
  cityPreferred?: string;
  preferredCity?: string;
  university?: string;
  highestEducation?: string;
  desiredStart?: string;
  bestTimeToCall?: string;
  comments?: string;
  addlComment?: string;
  message?: string;
  queries?: string;
  references?: string;
  unsubscribeReason?: string;
  otherUnsubscribeReasons?: string;
  lostReason?: string;
  feedback?: string;
  status?: string;
  salesOwner?: string;
  lifecycleStage?: string;
  subscriptionStatus?: string;
  subscriptionTypes?: string;
  smsSubscriptionStatus?: string;
  whatsappSubscriptionStatus?: string;
  activeSalesSequences?: string;
  accounts?: string;
  lastContactedTime?: string;
  lastActivityType?: string;
  lastAssignAt?: string;
  lastActivityTime?: string;

  originalFirstName?: string;
  originalLastName?: string;
  originalEmail?: string;
  originalMobile?: string;
  originalSource?: string;
  originalMedium?: string;
  originalCampaign?: string;
  mostRecentSource?: string;
  mostRecentMedium?: string;
  mostRecentCampaign?: string;
  createdFromSource?: string;
  createdFromMedium?: string;
  createdThroughCampaign?: string;
  externalId?: string;
  submissionDate?: string;
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
