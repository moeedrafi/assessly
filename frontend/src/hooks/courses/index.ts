import { UserRole } from "@/types/user";
import { commonKeys } from "@/lib/query-key";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/common";

export const createCourseHook = <T extends UserRole>(
  role: T,
  endpoint: string,
) => {
  return (params: { page: number; rpp: number }) =>
    useQuery({
      queryKey: commonKeys.courses(params.page, params.rpp, role),
      queryFn: () =>
        getCourses<T>({
          endpoint,
          ...params,
        }),
    });
};
