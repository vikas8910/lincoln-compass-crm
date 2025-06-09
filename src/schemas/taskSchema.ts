import { z } from "zod";

// Task form validation schema
// Zod Schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  taskType: z.string().optional(),
  dueDate: z.union(
    [
      z.string().min(1, "Date is required"),
      z.coerce.date({
        required_error: "Date is required",
        invalid_type_error: "Invalid date format",
      }),
    ],
    {
      required_error: "Date is required",
      invalid_type_error: "Invalid date format",
    }
  ),
  dueTime: z.date().optional(),
  outcome: z.string().optional(),
  ownerId: z.number({
    required_error: "Owner is required",
  }),
  relatedLeadIds: z
    .array(z.number())
    .min(1, "At least one related record is required"),
  collaboratorsId: z.array(z.number()).optional(),
  completed: z.boolean().optional(),
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
