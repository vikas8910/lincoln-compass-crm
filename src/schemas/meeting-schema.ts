import * as z from "zod";

export const meetingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  from: z.date({
    required_error: "From date is required",
  }),
  to: z.date({
    required_error: "To date is required",
  }),
  allDay: z.boolean().default(false),
  timeZone: z.string().default("(GMT+04:00) Abu Dhabi"),
  location: z.string().optional(),
  description: z.string().optional(),
  relatedTo: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    color: z.string(),
  })).default([]),
  attendees: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    color: z.string(),
  })).default([]),
  videoConferencing: z.enum(["zoom", "teams", ""]).default(""),
  outcome: z.string().optional(),
  meetingNotes: z.string().optional(),
  calendarIntegration: z.enum(["google", "office365", ""]).default(""),
});

export type MeetingFormData = z.infer<typeof meetingFormSchema>;