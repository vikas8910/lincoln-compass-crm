import { z } from "zod";
import { commonValidationSchemas } from "./common";

export const leadSchema = z
  .object({
    firstName: commonValidationSchemas.textOnly,

    lastName: commonValidationSchemas.textOnly,

    email: z.string().email({ message: "Invalid email address" }),

    mobile: z
      .string()
      .regex(/^\d{10,15}$/, { message: "Mobile must be 10–15 digits" }),

    backupMobileNumber: z
      .string()
      .regex(/^\d{10,15}$/, { message: "Mobile must be 10–15 digits" }),

    source: commonValidationSchemas.textOnly,

    course: commonValidationSchemas.course,

    leadType: commonValidationSchemas.textOnly,

    externalId: commonValidationSchemas.numberOnly,
  })
  .refine((data) => data.mobile !== data.backupMobileNumber, {
    message: "Primary and backup mobile numbers must be different",
    path: ["backupMobileNumber"], // You can also use ["mobile"] or both
  });

export type createLeadFormValues = z.infer<typeof leadSchema>;
