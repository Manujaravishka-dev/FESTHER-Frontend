"use client";

import Modal from "../offers/Modal";
import { cartWhatsAppMessage } from "@/lib/restaurant-order";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { summarizeCart, type CartLine } from "./cart";
import type { Offer } from "@/lib/types";

interface OrderMethodModalProps {
  lines: CartLine[];
  offers: Offer[];
  onClose: () => void;
  onCardPayment: () => void;
}

export default function OrderMethodModal({ lines, offers, onClose, onCardPayment }: OrderMethodModalProps) {
  const summary = summarizeCart(lines, offers);

  const openWhatsApp = () => {
    if (lines.length === 0) return;
    const message = cartWhatsAppMessage({
      items: lines.map((line) => ({
        name: line.item.name,
        quantity: line.qty,
        unitPrice: line.item.price ?? 0,
        ...(line.notes ? { notes: line.notes } : {}),
      })),
      subtotal: summary.subtotal,
      discount: summary.discount,
      total: summary.total,
      currency: summary.currency,
    });
    // Opening WhatsApp only starts a conversation — the cart is intentionally
    // left untouched and no order is marked as placed.
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      kicker="Order"
      title="Complete Your Order"
      subtitle="Choose how you would like to place your order."
    >
      <div className="ck-methods ck-methods--choice">
        <button
          type="button"
          className="ck-method"
          onClick={openWhatsApp}
          disabled={lines.length === 0}
        >
          <span className="ck-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
            </svg>
          </span>
          <span className="ck-method-copy">
            <strong>WhatsApp Order</strong>
            <em>Continue on WhatsApp</em>
          </span>
          <span className="ck-method-go" aria-hidden="true">
            →
          </span>
        </button>

        <button type="button" className="ck-method ck-method--pay" onClick={onCardPayment}>
          <span className="ck-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="13" rx="1" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <line x1="6" y1="14.5" x2="10" y2="14.5" />
            </svg>
          </span>
          <span className="ck-method-copy">
            <strong>Card Payment</strong>
            <em>Secure card payment powered by PayHere</em>
          </span>
          <span className="ck-method-go" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <div className="ck-actions">
        <button type="button" className="ck-btn ck-btn--ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
