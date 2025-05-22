
import { z } from "zod";

export const roleSchema = z.object({
  name: z.string()
    .min(1, { message: "Role name is required" })
    .max(50, { message: "Role name must be 50 characters or less" }),
  description: z.string()
    .min(1, { message: "Role description is required" })
    .max(200, { message: "Description must be 200 characters or less" })
});

export type RoleFormValues = z.infer<typeof roleSchema>;
