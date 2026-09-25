"use client";

import { useState } from "react";
import Modal from "../offers/Modal";
import Field from "../offers/Field";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

interface DishModalProps {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, notes: string) => void;
  onViewCart: () => void;
  cartCount: number;
}

export default function DishModal({ item, onClose, onAdd, onViewCart, cartCount }: DishModalProps) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const price = formatPrice(item.price, item.currency);

  return (
    <Modal onClose={onClose} kicker={item.category} title={item.name} subtitle={price ?? undefined} wide>
      <div className="dine-dish-modal-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={`${item.name} at FESTHER`} />
      </div>
      <p className="dine-dish-modal-desc">{item.description}</p>
      {item.highlights && item.highlights.length > 0 ? (
        <ul className="dine-dish-modal-tags">
          {item.highlights.map((tag) => (
            <li key={tag} className="dine-tag">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {item.dietary && item.dietary.length > 0 ? (
        <ul className="dine-dish-modal-tags">
          {item.dietary.map((tag) => (
            <li key={tag} className="dine-tag">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="dine-dish-modal-order">
        <span className="dine-dish-modal-price">{price ?? "—"}</span>
        <div className="dine-dish-modal-qty">
          <span className="of-label">Quantity</span>
          <div className="of-qty">
            <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} aria-label="Decrease quantity">
              −
            </button>
            <span className="of-qty-value">{qty}</span>
            <button type="button" onClick={() => setQty((v) => v + 1)} aria-label="Increase quantity">
              +
            </button>
          </div>
        </div>

        <Field id="dine-dish-notes" label="Special requests (optional)" span>
          <textarea
            id="dine-dish-notes"
            className="of-textarea"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, preferences…"
          />
        </Field>

        <div className="dine-dish-modal-actions">
          <button type="button" className="of-btn" onClick={() => onAdd(item, qty, notes)} disabled={!item.available}>
            {item.available ? "Add to Order" : "Currently Unavailable"}
          </button>
          {cartCount > 0 ? (
            <button type="button" className="of-btn of-btn--ghost" onClick={onViewCart}>
              View Order ({cartCount})
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
