import { EditableField } from "@/types/lead";
import { PaginationState } from "@tanstack/react-table";

export const AXIOS_TIMEOUT = 10000;

export const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 20,
};

export const DEBOUNCE_DELAY = 1000;

// Configuration
export const EDITABLE_FIELDS: EditableField[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email", validationType: "email" },
  { key: "mobile", label: "Mobile", validationType: "phone" },
  { key: "recentNote", label: "Recent Note" },
  { key: "course", label: "Course" },
  { key: "source", label: "Source" },
  { key: "leadType", label: "Lead Type" },
  { key: "leadStage", label: "Lead Stage" },
  { key: "intake", label: "Intake" },
];

export const LEAD_DETAILS_EDITABLE_FIELDS: any[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email", validationType: "email" },
  { key: "mobile", label: "Mobile", validationType: "phone" },
  { key: "mobileBackup", label: "Backup Mobile", validationType: "phone" },
  { key: "workPhone", label: "Work Phone", validationType: "phone" },
  { key: "officeMobile", label: "Office Mobile", validationType: "phone" },
  { key: "countryCode", label: "Country Code" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "nationality", label: "Nationality" },
  { key: "countryOfResidence", label: "Country of Residence" },
  { key: "cityPreferred", label: "City Preferred" },
  { key: "preferredCity", label: "Preferred City" },
  { key: "highestEducation", label: "Highest Education" },
  { key: "desiredStart", label: "Desired Start Date" },
  { key: "bestTimeToCall", label: "Best Time to Call" },
  { key: "comments", label: "Comments" },
  { key: "addlComment", label: "Additional Comment" },
  { key: "unsubscribeReason", label: "Unsubscribe Reason" },
  { key: "otherUnsubscribeReasons", label: "Other Unsubscribe Reasons" },
  { key: "lostReason", label: "Lost Reason" },
  { key: "feedback", label: "Feedback" },
  { key: "status", label: "Status" },
];

export const SIDEBAR_ITEMS = [
  { id: "details", label: "Lead Details" },
  { id: "activities", label: "Activities" },
  { id: "conversations", label: "Conversations" },
  { id: "files", label: "Files" },
  { id: "reminders", label: "Reminders" },
];
