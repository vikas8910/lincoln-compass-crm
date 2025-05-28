import { z } from "zod";

export const commonValidationSchemas = {
  text: z.string().min(1, "This field is required").max(100, "Too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  required: z.string().min(1, "This field is required"),
  textOnly: z
    .string()
    .min(1, "This field is required")
    .regex(
      /^[A-Za-z\s.,'-]+$/,
      "Only letters and basic punctuation (.,'-) are allowed"
    ),
  course: z
    .string()
    .min(1, "Course name is required")
    .regex(
      /^[A-Za-z\s.,'-]+$/,
      "Course name can only include letters, spaces, and basic punctuation"
    ),
  countryCode: z
    .string()
    .min(2, "Country code is required")
    .regex(/^\+[1-9]\d{0,3}$/, "Enter a valid country code like +1 or +91"),
  leadScore: z
    .string()
    .min(1, "Score is required")
    .regex(/^([1-9]?[0-9]|100)$/, "Score must be a number between 1 and 100"),
} as const;
