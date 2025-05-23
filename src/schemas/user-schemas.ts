
import { z } from "zod";

// Define the Zod schema for new user
export const newUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(/^[\w-.]+@lincoln-edu\.ae$/, "Email must be from the domain lincoln-edu.ae"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 characters")
    .regex(/^[0-9]*$/, "Mobile number can only contain digits"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Edit user schema without password fields
export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(/^[\w-.]+@lincoln-edu\.ae$/, "Email must be from the domain lincoln-edu.ae"),
  contactNumber: z.string()
    .min(10, "Mobile number must be at least 10 characters")
    .regex(/^[0-9]*$/, "Mobile number can only contain digits")
    .max(10, "Mobile number must be at least 10 characters"),
});

// Type inferred from Zod schema
export type NewUserFormValues = z.infer<typeof newUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;
