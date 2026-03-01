import { api } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryFnOptions<T, M> = Omit<
  UseQueryOptions<ApiResponse<T, M>, unknown, ApiResponse<T, M>>,
  "queryKey" | "queryFn"
>;

export const useApiQuery = <
  T,
  M = PaginationMeta,
  K extends QueryKey = QueryKey,
>(
  key: K,
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options?: QueryFnOptions<T, M>,
) => {
  // Build query string
  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  return useQuery<ApiResponse<T, M>, unknown>({
    queryKey: key,
    queryFn: () => api.get<T, M>(`${endpoint}${queryString}`),
    ...options,
  });
};
