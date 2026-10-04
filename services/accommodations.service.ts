import type { Accommodation, ApiResult } from "@/lib/types";
import { accommodations } from "@/lib/data/accommodations";
import { apiRequest, apiItems, delay, isBackendConfigured } from "./config";

export async function getAccommodations(): Promise<Accommodation[]> {
  if (!isBackendConfigured()) {
    await delay(300);
    return accommodations;
  }
  const result = await apiRequest<ApiResult<{ items: Accommodation[] }>>("/api/accommodations");
  return apiItems(result);
}

export async function getAccommodation(id: string): Promise<Accommodation | undefined> {
  if (!isBackendConfigured()) {
    await delay(200);
    return accommodations.find((a) => a.id === id);
  }
  const result = await apiRequest<ApiResult<{ accommodation: Accommodation }>>(
    `/api/accommodations/${encodeURIComponent(id)}`,
  );
  return result?.data?.accommodation;
}

export async function getAccommodationBySlug(slug: string): Promise<Accommodation | undefined> {
  if (!isBackendConfigured()) {
    await delay(250);
    return accommodations.find((a) => a.slug === slug);
  }
  const result = await apiRequest<ApiResult<{ accommodation: Accommodation }>>(
    `/api/accommodations/slug/${encodeURIComponent(slug)}`,
  );
  return result?.data?.accommodation;
}