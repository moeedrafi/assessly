import { UserRole } from "@/types/user";
import { commonKeys } from "@/lib/query-key";
import { useQuery } from "@tanstack/react-query";
import { getCourseSnapshot } from "@/services/common";

export const createCourseSnapshotHook = <T extends UserRole>(
  role: T,
  endpoint: string,
) => {
  return (params: { page: number; rpp: number }) =>
    useQuery({
      queryKey: commonKeys.courseSnapshot(params.page, params.rpp, role),
      queryFn: () =>
        getCourseSnapshot<T>({
          endpoint,
          ...params,
        }),
    });
};
