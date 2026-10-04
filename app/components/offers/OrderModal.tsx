"use client";

import { useMemo, useState } from "react";
import OrderCheckout from "../dining/OrderCheckout";
import { effectiveDiscount } from "@/lib/format";
import type { CheckoutLineSpec } from "@/lib/checkout";
import type { DiningItem, Offer } from "@/lib/types";

interface OrderModalProps {
  item: DiningItem;
  offer: Offer | null;
  onClose: () => void;
}

export default function OrderModal({ item, offer, onClose }: OrderModalProps) {
  const [qty, setQty] = useState(1);

  const spec: CheckoutLineSpec = useMemo(
    () => ({
      id: item.id,
      name: item.name,
      unitPrice: item.price ?? 0,
      qty,
      currency: item.currency,
      discountPct: offer ? effectiveDiscount(offer) ?? 0 : 0,
    }),
    [item, offer, qty],
  );

  return (
    <OrderCheckout
      lines={[spec]}
      offerIds={offer ? [offer.id] : undefined}
      kicker={offer ? offer.title : "Order"}
      title={item.name}
      subtitle={item.category ? `${item.category} — ordered from your table` : "Order from your table"}
      onUpdateLine={(_id, nextQty) => setQty(Math.max(1, nextQty))}
      onClose={onClose}
      onPlaced={() => undefined}
    />
  );
}