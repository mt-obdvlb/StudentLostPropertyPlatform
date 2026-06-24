import axios, { type AxiosError, type AxiosInstance } from "axios";
import type { ApiResponse, ApiError } from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export const TOKEN_STORAGE_KEY = "lost-found.token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export const apiErrorFromAxios = (err: AxiosError<ApiResponse<unknown>>): ApiError => {
  const status = err.response?.status;
  const payload = err.response?.data;
  if (payload && typeof payload === "object" && "code" in payload) {
    return {
      code: payload.code ?? -1,
      message: payload.message ?? err.message,
      status,
    };
  }
  if (status === 401) {
    return { code: 401, message: "登录已过期，请重新登录", status };
  }
  if (err.code === "ECONNABORTED") {
    return { code: -1, message: "请求超时，请稍后再试", status };
  }
  if (!err.response) {
    return {
      code: -1,
      message: "网络异常，无法连接到服务器",
      status,
    };
  }
  return {
    code: status ?? -1,
    message: err.message || "请求失败",
    status,
  };
};

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>;
    if (payload && typeof payload === "object" && "code" in payload) {
      if (payload.code !== 0) {
        const error: ApiError = {
          code: payload.code,
          message: payload.message || "请求失败",
          status: response.status,
        };
        return Promise.reject(error);
      }
      return { ...response, data: payload.data };
    }
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const apiError = apiErrorFromAxios(error);
    if (apiError.status === 401) {
      setStoredToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(apiError);
  },
);

export function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  return promise.then((res) => res.data);
}
