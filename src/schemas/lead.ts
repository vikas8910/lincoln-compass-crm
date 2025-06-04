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
