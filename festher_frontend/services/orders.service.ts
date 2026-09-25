import type { ApiResult, OrderRequest, OrderStatus, PreparedOrder, RestaurantOrder } from "@/lib/types";
import { orderPayload } from "@/lib/restaurant-order";
import { apiRequest, isBackendConfigured } from "./config";
import { getRestaurantOrderById } from "@/services/admin/store";

function requireBackend() {
  if (!isBackendConfigured()) throw new Error("Online ordering is not available yet. Please order via WhatsApp.");
}

function dataOf<T>(result: ApiResult<T>): T {
  if (!result?.success || !result.data) throw new Error(result?.message || "The order service could not complete this request.");
  return result.data;
}

export function assertOrder(order: RestaurantOrder): RestaurantOrder {
  if (!order?.id || !order.orderNumber || !Array.isArray(order.items) || !order.items.length ||
      order.items.some((item) => !item || typeof item.name !== "string" || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0) ||
      ![order.subtotal, order.discount, order.total].every((n) => Number.isFinite(n) && n >= 0) ||
      !["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED"].includes(order.paymentStatus) ||
      !["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"].includes(order.orderStatus)) {
    throw new Error("The order service returned incomplete order information. Please check your order again.");
  }
  return order;
}

export async function createOrder(request: OrderRequest, idempotencyKey: string): Promise<PreparedOrder> {
  if (!isBackendConfigured()) {
    // Demo mode: there is no secure backend to sign PayHere values, so an
    // online payment cannot be started here. No payment is faked.
    throw new Error("Online card payments require the FESTHER payment service to be connected. Please order via WhatsApp.");
  }
  const data = dataOf(await apiRequest<ApiResult<PreparedOrder>>("/api/orders", {
    method: "POST", headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(orderPayload(request)),
  }));
  assertOrder(data.order);
  if (!data.accessToken) throw new Error("Order access was not provided. Retry this request to recover your order.");
  return data;
}

export async function getOrder(id: string, accessToken: string, signal?: AbortSignal): Promise<RestaurantOrder> {
  if (!isBackendConfigured()) return assertOrder(await getRestaurantOrderById(id));
  return assertOrder(dataOf(await apiRequest<ApiResult<{ order: RestaurantOrder }>>(`/api/orders/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store", signal,
  })).order);
}

export async function retryOrderPayment(id: string, accessToken: string, key: string): Promise<PreparedOrder> {
  if (!isBackendConfigured()) {
    const order = assertOrder(await getRestaurantOrderById(id));
    // No backend means no freshly-signed PayHere values. Payment stays pending.
    return { order, accessToken: accessToken || "demo", payment: undefined };
  }
  const data = dataOf(await apiRequest<ApiResult<PreparedOrder>>(`/api/orders/${encodeURIComponent(id)}/payment`, {
    method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Idempotency-Key": key },
  }));
  assertOrder(data.order);
  if (data.order.id !== id) throw new Error("Payment retry did not match your existing order.");
  return { ...data, accessToken: data.accessToken || accessToken };
}

// Authentication, authorization, CSRF/origin checks and transitions are enforced by the backend.
export async function getRestaurantOrders(): Promise<RestaurantOrder[]> {
  requireBackend();
  const data = dataOf(await apiRequest<ApiResult<{ items: RestaurantOrder[] }>>("/api/admin/orders", {
    credentials: "include", cache: "no-store",
  }));
  if (!Array.isArray(data.items)) throw new Error("The order list could not be loaded.");
  return data.items.map(assertOrder);
}

export async function updateRestaurantOrder(order: RestaurantOrder, orderStatus: OrderStatus): Promise<RestaurantOrder> {
  requireBackend();
  return assertOrder(dataOf(await apiRequest<ApiResult<{ order: RestaurantOrder }>>(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
    method: "PATCH", credentials: "include", headers: { "X-Requested-With": "FESTHER", "If-Match": String(order.version) },
    body: JSON.stringify({ orderStatus }),
  })).order);
}
