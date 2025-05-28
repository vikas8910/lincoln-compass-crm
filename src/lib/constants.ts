import { EditableField } from "@/types/lead";
import { PaginationState } from "@tanstack/react-table";
import {
  UserIcon,
  Activity,
  MessageSquareMore,
  Paperclip,
  Hand,
} from "lucide-react";

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
  { key: "salesOwner", label: "Sales Owner", disabled: true },
  { key: "firstName", label: "First Name", validationType: "textOnly" },
  { key: "lastName", label: "Last Name", validationType: "textOnly" },
  { key: "email", label: "Email", validationType: "email" },
  { key: "mobile", label: "Mobile", validationType: "phone" },
  { key: "mobileBackup", label: "Backup Mobile", validationType: "phone" },
  { key: "workPhone", label: "Work Phone", validationType: "phone" },
  { key: "officeMobile", label: "Office Mobile", validationType: "phone" },
  {
    key: "otherPhoneNumbers",
    label: "Other Phone Numbers",
    validationType: "phone",
  },
  { key: "countryCode", label: "Country Code", validationType: "countryCode" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "nationality", label: "Nationality" },
  { key: "countryOfResidence", label: "Country of Residence" },
  { key: "preferredCity", label: "Preferred City" },
  { key: "university", label: "University" },
  { key: "highestEducation", label: "Highest Education" },
  { key: "desiredStart", label: "Desired Start Date" },
  { key: "bestTimeToCall", label: "Best Time to Call" },
  { key: "comments", label: "Comments" },
  { key: "addlComment", label: "Additional Comment" },
  { key: "message", label: "Message" },
  { key: "queries", label: "Queries" },
  { key: "references", label: "References" },
  { key: "unsubscribeReason", label: "Unsubscribe Reason" },
  { key: "otherUnsubscribeReasons", label: "Other Unsubscribe Reasons" },
  { key: "lostReason", label: "Lost Reason" },
  { key: "feedback", label: "Feedback" },
  { key: "status", label: "Status" },
  { key: "leadScore", label: "Lead Score", validationType: "leadScore" },
  { key: "lifecycleStage", label: "Lifecycle Stage" },
  { key: "subscriptionStatus", label: "Subscription Status" },
  { key: "subscriptionTypes", label: "Subscription Types" },
  { key: "smsSubscriptionStatus", label: "SMS Subscription Status" },
  { key: "whatsappSubscriptionStatus", label: "WhatsApp Subscription Status" },
  { key: "activeSalesSequences", label: "Active Sales Sequences" },
  { key: "accounts", label: "Accounts" },

  {
    key: "originalFirstName",
    label: "Original First Name (O)",
    disabled: true,
  },
  { key: "originalLastName", label: "Original Last Name (O)", disabled: true },
  {
    key: "originalEmail",
    label: "Original Email (O)",
    validationType: "email",
    disabled: true,
  },
  {
    key: "originalMobile",
    label: "Original Mobile (O)",
    validationType: "phone",
    disabled: true,
  },
  { key: "originalSource", label: "Original Source (O)", disabled: true },
  { key: "originalMedium", label: "Original Medium (O)", disabled: true },
  { key: "originalCampaign", label: "Original Campaign (O)", disabled: true },
  { key: "mostRecentSource", label: "Most Recent Source (O)", disabled: true },
  { key: "mostRecentMedium", label: "Most Recent Medium (O)", disabled: true },
  {
    key: "mostRecentCampaign",
    label: "Most Recent Campaign (O)",
    disabled: true,
  },
  {
    key: "createdFromSource",
    label: "Created From Source (O)",
    disabled: true,
  },
  {
    key: "createdFromMedium",
    label: "Created From Medium (O)",
    disabled: true,
  },
  {
    key: "createdThroughCampaign",
    label: "Created Through Campaign (O)",
    disabled: true,
  },
  { key: "externalId", label: "External ID (O)", disabled: true },
  { key: "submissionDate", label: "Submission Date (O)", disabled: true },
];

export const SIDEBAR_ITEMS = [
  { id: "details", label: "Lead Details", Icon: UserIcon },
  { id: "activities", label: "Activities", Icon: Activity },
  { id: "conversations", label: "Conversations", Icon: MessageSquareMore },
  { id: "files", label: "Files", Icon: Paperclip },
  { id: "reminders", label: "Reminders", Icon: Hand },
];
