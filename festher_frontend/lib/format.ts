import type { Offer } from "./types";

export function formatPrice(n?: number, currency?: string): string | null {
  if (n == null) return null;
  const cur = currency || "LKR";
  return `${cur} ${n.toLocaleString("en-US")}`;
}

export function effectiveDiscount(offer: Offer): number | undefined {
  if (offer.discountPercentage != null) return offer.discountPercentage;
  if (offer.offerPrice != null && offer.originalPrice != null && offer.originalPrice > 0) {
    return Math.round((1 - offer.offerPrice / offer.originalPrice) * 100);
  }
  return undefined;
}