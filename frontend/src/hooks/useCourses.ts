import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useCourses = <T>(url: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get<T>(url);
      return res.data;
    },
    staleTime: Infinity,
  });

  return { data, isLoading };
};
