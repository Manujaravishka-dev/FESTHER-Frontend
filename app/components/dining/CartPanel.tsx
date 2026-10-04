"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/format";
import { summarizeCart, type CartLine } from "./cart";
import type { Offer } from "@/lib/types";

interface CartPanelProps {
  lines: CartLine[];
  offers: Offer[];
  open: boolean;
  onClose: () => void;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartPanel({ lines, offers, open, onClose, onQty, onRemove, onCheckout }: CartPanelProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const summary = summarizeCart(lines, offers);
  const empty = lines.length === 0;

  return createPortal(
    <>
      <div
        className={`dine-cart-overlay${open ? " dine-cart-overlay--open" : ""}`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        className={`dine-cart${open ? " dine-cart--open" : ""}`}
        aria-label="Your order"
        aria-hidden={!open}
      >
        <div className="dine-cart-head">
          <h2 className="dine-cart-title">Your Order</h2>
          <button className="dine-cart-close" type="button" onClick={onClose} aria-label="Close order">
            ×
          </button>
        </div>

        {empty ? (
          <div className="dine-cart-empty">
            <p>Your order is empty. Add a dish from the menu to begin.</p>
          </div>
        ) : (
          <div className="dine-cart-lines">
            {lines.map((line) => {
              const currency = line.item.currency ?? "LKR";
              const unit = line.item.price ?? 0;
              return (
                <div className="dine-cart-line" key={line.item.id}>
                  <div className="dine-cart-line-info">
                    <h3 className="dine-cart-line-name">{line.item.name}</h3>
                    <p className="dine-cart-line-unit">{formatPrice(unit, currency)} each</p>
                    {line.notes ? <p className="dine-cart-line-note">{line.notes}</p> : null}
                    <div className="dine-cart-line-controls">
                      <div className="of-qty">
                        <button
                          type="button"
                          onClick={() => onQty(line.item.id, -1)}
                          aria-label={`Decrease ${line.item.name}`}
                        >
                          −
                        </button>
                        <span className="of-qty-value">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => onQty(line.item.id, 1)}
                          aria-label={`Increase ${line.item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="dine-cart-remove" onClick={() => onRemove(line.item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="dine-cart-line-sub">{formatPrice(unit * line.qty, currency)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="dine-cart-foot">
          <div className="of-totals">
            <div className="of-totals-row">
              <span>Subtotal</span>
              <span>{formatPrice(summary.subtotal, summary.currency)}</span>
            </div>
            {summary.discount > 0 ? (
              <div className="of-totals-row of-totals-row--discount">
                <span>Offer discount</span>
                <span>{formatPrice(-summary.discount, summary.currency)}</span>
              </div>
            ) : null}
            <div className="of-totals-row of-totals-row--total">
              <span>Total</span>
              <span>{formatPrice(summary.total, summary.currency)}</span>
            </div>
          </div>
          <button type="button" className="of-btn" onClick={onCheckout} disabled={empty}>
            Proceed to Order
          </button>
          <p className="dine-cart-note">Prices are indicative and confirmed by our team. No payment is taken here.</p>
        </div>
      </aside>
    </>,
    document.body,
  );
}
