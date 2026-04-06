import { UserRole } from "@/types/user";
import { createCourseHook } from "./index";

export const useStudentCourses = createCourseHook(UserRole.USER, "/courses");
