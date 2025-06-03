import { z } from "zod";

// Task form validation schema
// Zod Schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  taskType: z.string().min(1, "Task type is required"),
  dueDate: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  dueTime: z.date().optional(),
  outcome: z.string().optional(),
  owner: z.string().min(1, "Owner is required"),
  relatedTo: z.array(z.any()).optional(),
  collaborators: z.array(z.any()).optional(),
  markAsCompleted: z.boolean().optional(),
});

// Type inference for TypeScript
export type TaskFormData = z.infer<typeof taskFormSchema>;

// Predefined options (can be moved to constants file)
export const TASK_TYPE_OPTIONS = [
  "Call",
  "Email",
  "Meeting",
  "Follow up",
  "Task",
  "Presentation",
  "Demo",
  "Proposal",
];

export const OUTCOME_OPTIONS = [
  "Open House Invitation",
  "Office Visit",
  "Set Meetings",
  "Follow up Call",
  "Send Proposal",
  "Demo Scheduled",
  "Meeting Scheduled",
  "Call Back Later",
  "Not Interested",
  "Converted to Customer",
];
