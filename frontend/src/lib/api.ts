import { ApiError } from "./error";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type PaginationMeta = {
  page: number;
  totalPages: number;
  rpp: number;
  totalItems: number;
};

type ApiResponse<T, M = PaginationMeta> = {
  data: T;
  message: string;
  meta?: M;
};

// Error response from Backend
export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error: string;
};

const handleResponse = async <T, M = PaginationMeta>(
  response: Response,
): Promise<ApiResponse<T, M>> => {
  const responseBody: ApiResponse<T, M> | ApiErrorResponse =
    await response.json();

  if (!response.ok) {
    const error = responseBody as ApiErrorResponse;
    throw new ApiError(error);
  }

  return responseBody as ApiResponse<T, M>;
};

const makeApiCall = async <T, M = PaginationMeta>(
  endpoint: string,
  options: RequestInit,
): Promise<ApiResponse<T, M>> => {
  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, {
      credentials: "include",
      ...options,
    });
    return handleResponse<T, M>(response);
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const api = {
  get: async <T, M = PaginationMeta>(
    endpoint: string,
    headers?: Record<string, string>,
  ) => makeApiCall<T, M>(endpoint, { method: "GET", headers }),

  post: async <T, D, M = PaginationMeta>(
    endpoint: string,
    data: D,
    headers?: Record<string, string>,
  ) =>
    makeApiCall<T, M>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    }),

  put: async <T, D, M = PaginationMeta>(
    endpoint: string,
    data: D,
    headers?: Record<string, string>,
  ) =>
    makeApiCall<T, M>(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    }),

  patch: async <T, D, M = PaginationMeta>(
    endpoint: string,
    data: D,
    headers?: Record<string, string>,
  ) =>
    makeApiCall<T, M>(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    }),

  delete: async <T, M = PaginationMeta>(
    endpoint: string,
    headers?: Record<string, string>,
  ) => makeApiCall<T, M>(endpoint, { method: "DELETE", headers }),
};
