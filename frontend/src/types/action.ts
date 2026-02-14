export interface ActionResponse<T> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
}
