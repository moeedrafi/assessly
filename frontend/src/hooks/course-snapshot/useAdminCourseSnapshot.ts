import { UserRole } from "@/types/user";
import { createCourseSnapshotHook } from "./index";

export const useAdminCourseSnapshot = createCourseSnapshotHook(
  UserRole.ADMIN,
  "/admin/analytics/course-snapshot",
);
