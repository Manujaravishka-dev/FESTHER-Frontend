import type { OrderItem, OrderItemInput, OrderRequest, RestaurantOrder } from "./types";

// Frontend-only view of a cart/offer line. Prices shown here are for display
// only — the backend recalculates every monetary value from its own data.
export interface CheckoutLineSpec {
  id: string; // menuItemId (MenuItem.id / DiningItem.id)
  name: string;
  unitPrice: number;
  qty: number;
  currency?: string;
  discountPct?: number; // 0..100, applied to this line
  notes?: string;
}

export interface CheckoutCustomer {
  customerName: string;
  email: string;
  phone: string;
  specialInstructions?: string;
}

export interface CheckoutTotals {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export function summarizeCheckoutLines(
  lines: CheckoutLineSpec[],
): CheckoutTotals {
  let subtotal = 0;
  let discount = 0;
  for (const line of lines) {
    const lineTotal = line.unitPrice * line.qty;
    subtotal += lineTotal;
    if (line.discountPct && line.discountPct > 0) {
      discount += Math.round((lineTotal * line.discountPct) / 100);
    }
  }
  return {
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    currency: lines.find((l) => l.currency)?.currency ?? "LKR",
  };
}

export function checkoutItems(lines: CheckoutLineSpec[]): OrderItemInput[] {
  return lines.map((line) => ({
    menuItemId: line.id,
    quantity: line.qty,
    ...(line.notes?.trim() ? { notes: line.notes.trim() } : {}),
  }));
}

export function orderRequest(
  lines: CheckoutLineSpec[],
  customer: CheckoutCustomer,
  orderMethod: OrderRequest["orderMethod"],
  offerIds?: string[],
): OrderRequest {
  return {
    offerIds,
    items: checkoutItems(lines),
    customerName: customer.customerName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    specialInstructions: customer.specialInstructions?.trim() || undefined,
    orderMethod,
  };
}

export function orderItemsFromLines(lines: CheckoutLineSpec[]): OrderItem[] {
  return lines.map((line) => ({
    menuItemId: line.id,
    name: line.name,
    quantity: line.qty,
    unitPrice: line.unitPrice,
    ...(line.notes?.trim() ? { notes: line.notes.trim() } : {}),
  }));
}

const ORDER_STORAGE_KEY = "festher.checkout.key";
const ORDER_REFS_KEY = "festher.checkout.orderRefs";

export function getCheckoutKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
  if (!key) {
    key = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ck-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, key);
  }
  return key;
}

export function rememberOrderRef(orderId: string, accessToken: string): void {
  if (typeof window === "undefined") return;
  try {
    const refs = JSON.parse(window.sessionStorage.getItem(ORDER_REFS_KEY) ?? "{}") as Record<string, string>;
    refs[orderId] = accessToken;
    window.sessionStorage.setItem(ORDER_REFS_KEY, JSON.stringify(refs));
  } catch {
    // Non-critical — users can still prove access to their own order.
  }
}

export function orderAccessToken(orderId: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const refs = JSON.parse(window.sessionStorage.getItem(ORDER_REFS_KEY) ?? "{}") as Record<string, string>;
    return refs[orderId];
  } catch {
    return undefined;
  }
}

// Local (demo / no-backend) record used to preview the admin panel and the
// payment status screens. It never marks a PayHere payment as paid.
export function localOrderNumber(): string {
  const digits = String(Math.floor(10000 + Math.random() * 89999));
  return `FES-${digits}`;
}

export function buildLocalOrder(
  lines: CheckoutLineSpec[],
  customer: CheckoutCustomer,
  orderMethod: RestaurantOrder["orderMethod"],
  paymentMethod: RestaurantOrder["paymentMethod"],
  totals?: CheckoutTotals,
): RestaurantOrder {
  const summary = totals ?? summarizeCheckoutLines(lines);
  return {
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    orderNumber: localOrderNumber(),
    customerName: customer.customerName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    items: orderItemsFromLines(lines),
    specialInstructions: customer.specialInstructions?.trim() || undefined,
    subtotal: summary.subtotal,
    discount: summary.discount,
    total: summary.total,
    currency: summary.currency,
    orderMethod,
    paymentMethod,
    orderStatus: "PENDING",
    paymentStatus: orderMethod === "WHATSAPP" ? "UNPAID" : "PENDING",
    createdAt: new Date().toISOString(),
    version: 1,
    canRetryPayment: orderMethod === "ONLINE",
  };
}