import { z } from "zod";
import { commonValidationSchemas } from "./common";

export const leadSchema = z
  .object({
    // Required fields
    firstName: commonValidationSchemas.textOnly,
    lastName: commonValidationSchemas.textOnly,
    countryCode: z.string().min(1, { message: "Country code is required" }), // New required field
    mobile: z
      .string()
      .regex(/^\d{10}$/, { message: "Mobile must be exactly 10 digits" }),
    email: z.string().email({ message: "Invalid email address" }),

    // Optional fields
    backupMobileNumber: z
      .string()
      .regex(/^\d{10}$/, { message: "Mobile must be exactly 10 digits" })
      .optional()
      .or(z.literal("")),
    sourceId: z.string().optional(),
    courseId: z.string().optional(),
    leadTypeId: z.string().optional(),
    externalId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Only validate different mobile numbers if backup number is provided
      if (data.backupMobileNumber && data.backupMobileNumber !== "") {
        return data.mobile !== data.backupMobileNumber;
      }
      return true;
    },
    {
      message: "Primary and backup mobile numbers must be different",
      path: ["backupMobileNumber"],
    }
  );

export type createLeadFormValues = z.infer<typeof leadSchema>;

const createSocialUrlSchema = (platform) =>
  z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const trimmed = val.trim();
        if (trimmed === "") return false;

        const usernamePattern = /^[a-zA-Z0-9._-]+$/;
        const isUrl =
          trimmed.startsWith("http://") || trimmed.startsWith("https://");

        if (isUrl) {
          try {
            new URL(trimmed);
            return true;
          } catch {
            return false;
          }
        } else {
          return usernamePattern.test(trimmed) && trimmed.length >= 2;
        }
      },
      {
        message: `Please enter a valid ${platform} URL or username (min 2 characters, alphanumeric with dots, underscores, hyphens), or leave it empty`,
      }
    )
    .transform((val) => val?.trim() || "");

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s\-']+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s\-']+$/, "Last name must contain only letters"),
  facebookUrl: createSocialUrlSchema("Facebook"),
  twitterUrl: createSocialUrlSchema("Twitter"),
  linkedInUrl: createSocialUrlSchema("LinkedIn"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
