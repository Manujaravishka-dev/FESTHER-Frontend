// Admin-facing restaurant order service.
// Uses the real backend when configured (NEXT_PUBLIC_API_URL), otherwise falls
// back to the in-memory demo store — same pattern as the other admin services.
import type { OrderStatus, RestaurantOrder } from "@/lib/types";
import { isBackendConfigured } from "@/services/config";
import {
  getRestaurantOrders as getApiRestaurantOrders,
  updateRestaurantOrder as updateApiRestaurantOrder,
} from "@/services/orders.service";
import {
  getRestaurantOrderById,
  listRestaurantOrders,
  patchRestaurantOrder,
} from "./store";

export async function getRestaurantOrders(): Promise<RestaurantOrder[]> {
  return isBackendConfigured() ? getApiRestaurantOrders() : listRestaurantOrders();
}

export async function updateRestaurantOrder(
  order: RestaurantOrder,
  orderStatus: OrderStatus,
): Promise<RestaurantOrder> {
  return isBackendConfigured()
    ? updateApiRestaurantOrder(order, orderStatus)
    : patchRestaurantOrder(order.id, orderStatus);
}

// Demo-mode access for payment status pages (no backend running yet).
export async function getRestaurantOrderByIdLocal(id: string): Promise<RestaurantOrder> {
  return getRestaurantOrderById(id);
}