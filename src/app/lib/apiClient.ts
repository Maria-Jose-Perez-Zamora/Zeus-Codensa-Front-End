import axios, { AxiosError, AxiosHeaders } from "axios";
import type { ApiErrorResponse } from "../types/api";
import { clearAuthToken, getAuthToken } from "./tokenStorage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:8443/api";

export class ApiError extends Error {
  status?: number;
  data?: ApiErrorResponse | unknown;
  path?: string;
  timestamp?: string;
  isApiError = true;

  constructor(message: string, details: Partial<ApiError> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = details.status;
    this.data = details.data;
    this.path = details.path;
    this.timestamp = details.timestamp;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError || Boolean((error as ApiError | undefined)?.isApiError);
}

function normalizeAxiosError(error: AxiosError): ApiError {
  const responseData = error.response?.data as ApiErrorResponse | undefined;
  const message = responseData?.message || error.message || "Unexpected API error";

  return new ApiError(message, {
    status: error.response?.status,
    data: responseData,
    path: responseData?.path || error.config?.url,
    timestamp: responseData?.timestamp,
  });
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  if (config.data instanceof FormData) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      config.headers = {
        ...(config.headers ?? {}),
        "Content-Type": "multipart/form-data",
      };
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const normalizedError = normalizeAxiosError(error);

      if (normalizedError.status === 401) {
        clearAuthToken();
      }

      return Promise.reject(normalizedError);
    }

    return Promise.reject(new ApiError("Unexpected API error"));
  },
);
