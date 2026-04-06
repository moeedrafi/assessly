import { UserRole } from "@/types/user";
import { createCourseHook } from "./index";

export const useAdminCourses = createCourseHook(
  UserRole.ADMIN,
  "/admin/courses",
);
