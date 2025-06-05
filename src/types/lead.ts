import { validationSchemas } from "@/components/tablec/EditableCell";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
import { z } from "zod";

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
  onSave?: (key: string, value: string | string[] | Date) => void;
  disabled?: boolean;
  textColor?: string;
}

export interface SidebarItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  Icon?: LucideIcon;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  source: string;
  course: string;
  leadType: string;
  leadStage: {
    id: number;
    name: string;
    sequenceOrder: number;
  };
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
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;

  leadAddress?: string;
  leadAddrCity?: string;
  leadAddrState?: string;
  leadAddrCountry?: string;
  leadAddrZipCode?: string;
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

export interface StageOption {
  id: number;
  name: string;
  type: "leadStage" | "prospectOutcome";
  sequenceOrder: number;
}

export interface LeadStagingFormData {
  lifecycleStage: string;
  statusId: string;
  lostReason?: string;
}

export interface LeadStagingProps {
  statusId?: string;
}

export interface Option {
  [key: string]: any;
}

// Field mapping configuration for dropdown
export interface FieldMapping {
  value: string; // field name to use as value (e.g., 'id', 'userId', 'code')
  label: string; // field name to use as display label (e.g., 'name', 'title', 'displayName')
}

// Custom component props interface
export interface CustomComponentProps {
  onSave: (value: any) => void;
  onCancel: () => void;
  currentValue?: any;
  [key: string]: any; // Allow additional props
}

export interface EditableCellProps {
  value: string | string[] | Date | null | undefined;
  onSave: (value: string | string[] | Date | any) => void;
  placeholder?: string;
  validationType?: keyof typeof validationSchemas;
  customValidation?: z.ZodSchema<string>;
  className?: string;
  disabled?: boolean;
  textColor?: string;

  // Component type - added 'custom' type
  type?: "input" | "dropdown" | "multiselect" | "date" | "radio" | "custom";
  options?: Option[];
  fieldMapping?: FieldMapping;
  allowEmpty?: boolean; // Whether to show "Select..." or empty option
  emptyOptionLabel?: string;

  // Multiselect specific props
  maxSelections?: number; // Maximum number of selections allowed
  chipColors?: {
    background: string;
    text: string;
    border?: string;
  };

  // Date specific props
  dateFormat?: string;

  // Radio specific props
  radioLayout?: "horizontal" | "vertical";

  // Custom component props
  customComponent?: React.ComponentType<CustomComponentProps>;
  customComponentProps?: Record<string, any>; // Additional props to pass to custom component
  customDisplayValue?: (value: any) => string; // Function to determine display value for custom component
  sendCompleteObject?: boolean;
}
