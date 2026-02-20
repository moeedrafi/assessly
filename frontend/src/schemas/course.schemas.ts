import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(6, "Name should be at least 6 characters")
    .max(50, "Name too long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters")
    .max(500, "Description too long"),
  allowStudentJoin: z.boolean(),
  isActive: z.boolean(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
