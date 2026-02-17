import { ApiErrorResponse } from "./api";

export class ApiError extends Error {
  statusCode: number;
  error: string;
  constructor({ message, error, statusCode }: ApiErrorResponse) {
    super(typeof message === "string" ? message : message.join(", "));
    this.statusCode = statusCode;
    this.error = error;
  }
}
