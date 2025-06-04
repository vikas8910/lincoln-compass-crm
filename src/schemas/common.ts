import { z } from "zod";

export const commonValidationSchemas = {
  text: z.string().min(1, "This field is required").max(100, "Too long"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+\d{8,15}$/,
      "Phone number must start with country code (e.g., +91, +1, +44, +971)"
    )
    .refine((val) => {
      // Remove the + and get digits only
      const digitsOnly = val.substring(1);

      // Check for common country codes and validate accordingly
      // India (+91): should have 10 digits after country code
      if (digitsOnly.startsWith("91")) {
        return digitsOnly.length === 12; // 91 + 10 digits
      }
      // US/Canada (+1): should have 10 digits after country code
      if (digitsOnly.startsWith("1")) {
        return digitsOnly.length === 11; // 1 + 10 digits
      }
      // UK (+44): variable length, typically 10-11 digits total
      if (digitsOnly.startsWith("44")) {
        return digitsOnly.length >= 10 && digitsOnly.length <= 13;
      }
      // UAE (+971): should have 9 digits after country code
      if (digitsOnly.startsWith("971")) {
        return digitsOnly.length === 12; // 971 + 9 digits
      }

      // For other country codes, ensure reasonable length
      // Country code (1-4 digits) + phone number (at least 4 digits)
      return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    }, "Enter a valid phone number with country code (e.g., +919876543210, +15551234567, +971501234567)"),
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
  numberOnly: z
    .string()
    .min(1, "This field is required")
    .regex(/^\d+$/, "Only numbers are allowed"),
} as const;
