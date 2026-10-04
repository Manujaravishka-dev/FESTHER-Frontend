import type { ApiResult, DiningItem, MenuItem } from "@/lib/types";
import { diningItems, menuItems } from "@/lib/data/dining";
import { apiRequest, apiItems, delay, isBackendConfigured } from "./config";

export async function getDiningItems(): Promise<DiningItem[]> {
  if (!isBackendConfigured()) {
    await delay(300);
    return diningItems.filter((d) => d != null && d.available);
  }
  const result = await apiRequest<ApiResult<{ items: DiningItem[] }>>("/api/dining");
  return apiItems(result).filter((d) => d.available);
}

export async function getDiningItem(id: string): Promise<DiningItem | undefined> {
  if (!isBackendConfigured()) {
    await delay(200);
    return diningItems.find((d) => d.id === id && d.available);
  }
  const result = await apiRequest<ApiResult<{ item: DiningItem }>>(`/api/dining/${encodeURIComponent(id)}`);
  return result?.data?.item;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isBackendConfigured()) {
    await delay(300);
    return menuItems.filter((m) => m != null && m.available);
  }
  const result = await apiRequest<ApiResult<{ items: MenuItem[] }>>("/api/menu");
  return apiItems(result).filter((m) => m.available);
}

export async function getMenuItem(slug: string): Promise<MenuItem | undefined> {
  if (!isBackendConfigured()) {
    await delay(200);
    return menuItems.find((m) => m.slug === slug && m.available);
  }
  const result = await apiRequest<ApiResult<{ item: MenuItem }>>(`/api/menu/${encodeURIComponent(slug)}`);
  return result?.data?.item;
}