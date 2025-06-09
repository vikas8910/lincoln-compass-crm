import * as z from "zod";

// export const meetingFormSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   from: z.date({
//     required_error: "From date is required",
//   }),
//   to: z.date({
//     required_error: "To date is required",
//   }),
//   allDay: z.boolean().default(false),
//   timeZone: z.string().default("(GMT+04:00) Abu Dhabi"),
//   location: z.string().optional(),
//   description: z.string().optional(),
//   relatedTo: z
//     .array(
//       z.object({
//         id: z.number(),
//         name: z.string(),
//         email: z.string(),
//         avatar: z.string(),
//         color: z.string(),
//       })
//     )
//     .default([]),
//   attendees: z
//     .array(
//       z.object({
//         id: z.number(),
//         name: z.string(),
//         email: z.string(),
//         avatar: z.string(),
//         color: z.string(),
//       })
//     )
//     .default([]),
//   videoConferencing: z.enum(["zoom", "teams", ""]).default(""),
//   outcome: z.string().optional(),
//   meetingNotes: z.string().optional(),
//   calendarIntegration: z.enum(["google", "office365", ""]).default(""),
// });

// export type MeetingFormData = z.infer<typeof meetingFormSchema>;

export const meetingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeZone: z.string(),
  location: z.string().optional(),
  fromDate: z.union(
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
  toDate: z.union(
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
  meetingNotes: z.string().optional(),
  relatedTo: z.array(z.any()).min(1, "At least one related record is required"),
  collaboratorsId: z.array(z.any()).optional(),
  allDay: z.boolean().optional(),
  videoConferencing: z.enum(["zoom", "teams", ""]).default(""),
});

// Type inference for TypeScript
export type MeetingFormData = z.infer<typeof meetingFormSchema>;
