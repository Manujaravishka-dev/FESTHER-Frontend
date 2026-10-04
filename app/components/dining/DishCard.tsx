"use client";

import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

interface DishCardProps {
  item: MenuItem;
  onView: () => void;
  onOrder: () => void;
}

export default function DishCard({ item, onView, onOrder }: DishCardProps) {
  const price = formatPrice(item.price, item.currency);

  return (
    <article className="dine-dish">
      <div className="dine-dish-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={`${item.name} at FESTHER`} loading="lazy" />
        {item.featured ? <span className="dine-dish-badge">Signature</span> : null}
      </div>
      <div className="dine-dish-body">
        <div className="dine-dish-top">
          <span className="dine-dish-cat">{item.category}</span>
          <span className="dine-dish-price">{price ?? "—"}</span>
        </div>
        <h3 className="dine-dish-name">{item.name}</h3>
        <p className="dine-dish-desc">{item.description}</p>
        {item.dietary && item.dietary.length > 0 ? (
          <ul className="dine-dish-tags">
            {item.dietary.map((tag) => (
              <li key={tag} className="dine-tag">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="dine-dish-actions">
          <button type="button" className="of-btn of-btn--ghost" onClick={onView}>
            View Dish
          </button>
          <button type="button" className="of-btn" onClick={onOrder} disabled={!item.available}>
            Order Now
          </button>
        </div>
      </div>
    </article>
  );
}
