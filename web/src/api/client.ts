import type { ApiResponse } from "./types";
import { getToken } from "../auth/session";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3002";

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    try {
      return (await res.json()) as ApiResponse<T>;
    } catch {
      return { data: null, error: `HTTP ${res.status}` };
    }
  }

  return (await res.json()) as ApiResponse<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    try {
      return (await res.json()) as ApiResponse<T>;
    } catch {
      return { data: null, error: `HTTP ${res.status}` };
    }
  }

  return (await res.json()) as ApiResponse<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    try {
      return (await res.json()) as ApiResponse<T>;
    } catch {
      return { data: null, error: `HTTP ${res.status}` };
    }
  }

  return (await res.json()) as ApiResponse<T>;
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    try {
      return (await res.json()) as ApiResponse<T>;
    } catch {
      return { data: null, error: `HTTP ${res.status}` };
    }
  }

  return (await res.json()) as ApiResponse<T>;
}

