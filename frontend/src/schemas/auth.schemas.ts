import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password should be 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
