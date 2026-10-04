import type { MenuItem, Offer } from "@/lib/types";
import { effectiveDiscount } from "@/lib/format";

export interface CartLine {
  item: MenuItem;
  qty: number;
  notes?: string;
}

export interface CartSummary {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export function discountPercentFor(item: MenuItem, offers: Offer[]): number {
  const match = offers.find((o) => o.type === "DINING" && o.diningItemId === item.id);
  return match ? effectiveDiscount(match) ?? 0 : 0;
}

export function summarizeCart(lines: CartLine[], offers: Offer[]): CartSummary {
  let subtotal = 0;
  let discount = 0;
  for (const line of lines) {
    const lineTotal = (line.item.price ?? 0) * line.qty;
    subtotal += lineTotal;
    const pct = discountPercentFor(line.item, offers);
    if (pct > 0) discount += Math.round(lineTotal * (pct / 100));
  }
  return {
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    currency: lines[0]?.item.currency ?? "LKR",
  };
}
