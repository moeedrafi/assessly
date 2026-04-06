import { UserRole } from "@/types/user";
import { createCourseSnapshotHook } from "./index";

export const useStudentCourseSnapshot = createCourseSnapshotHook(
  UserRole.USER,
  "/analytics/course-snapshot",
);
