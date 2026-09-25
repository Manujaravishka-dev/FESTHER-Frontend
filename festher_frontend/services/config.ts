import type { ApiResult } from "@/lib/types";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export function isBackendConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new Error("We could not reach the FESTHER service. Please try again.");
  }
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) {
    throw new Error(body?.message ?? "The FESTHER service returned an error. Please try again.");
  }
  return body as T;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function apiItems<T>(result: ApiResult<{ items: T[] }> | null | undefined): T[] {
  const items = result?.data?.items;
  return Array.isArray(items) ? items.filter((item) => item != null) : [];
}
