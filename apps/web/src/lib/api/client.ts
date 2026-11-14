import { ApiError } from "./errors";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

type QueryValue = string | number | boolean | string[] | null | undefined;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function apiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${apiPath(path)}`;
}

export function photoUrl(photoId: string) {
  return apiUrl(`/photos/${encodeURIComponent(photoId)}`);
}

export function toQueryString(params: Record<string, QueryValue>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      search.set(key, value.join(","));
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function toApiError(payload: unknown, response: Response) {
  if (
    isRecord(payload) &&
    isRecord(payload.error) &&
    typeof payload.error.code === "string" &&
    typeof payload.error.message === "string"
  ) {
    return new ApiError(response.status, payload.error.code, payload.error.message);
  }

  return new ApiError(
    response.status,
    "http_error",
    response.statusText || `Request failed with status ${response.status}`,
  );
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (options.body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body:
      options.body === undefined
        ? undefined
        : isFormData
          ? (options.body as FormData)
          : JSON.stringify(options.body),
    signal: options.signal,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw toApiError(payload, response);
  }

  return payload as T;
}

export const api = {
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "POST", body });
  },
  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T = void>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};
