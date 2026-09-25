"use client";

import OrderCheckout from "./OrderCheckout";
import { discountPercentFor, type CartLine } from "./cart";
import type { CheckoutLineSpec } from "@/lib/checkout";
import type { Offer } from "@/lib/types";

interface CheckoutModalProps {
  lines: CartLine[];
  offers: Offer[];
  onClose: () => void;
  onPlaced: () => void;
}

export default function CheckoutModal({ lines, offers, onClose, onPlaced }: CheckoutModalProps) {
  const specs: CheckoutLineSpec[] = lines.map((line) => ({
    id: line.item.id,
    name: line.item.name,
    unitPrice: line.item.price ?? 0,
    qty: line.qty,
    currency: line.item.currency,
    discountPct: discountPercentFor(line.item, offers),
    notes: line.notes,
  }));

  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <OrderCheckout
      lines={specs}
      kicker="Order"
      title="Complete Your Order"
      subtitle={`${count} item${count === 1 ? "" : "s"} from your cart`}
      onClose={onClose}
      onPlaced={() => onPlaced()}
    />
  );
}