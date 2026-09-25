"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { effectiveDiscount, formatPrice } from "@/lib/format";
import type { Offer } from "@/lib/types";

interface OfferCardProps {
  offer: Offer;
  onBook: () => void;
  onReserve: () => void;
  onOrder: () => void;
  onViewPackage: () => void;
}

export default function OfferCard({ offer, onBook, onReserve, onOrder, onViewPackage }: OfferCardProps) {
  const discount = effectiveDiscount(offer);
  const priceNow = formatPrice(offer.offerPrice ?? offer.originalPrice, offer.currency);
  const priceWas = formatPrice(offer.originalPrice, offer.currency);

  let secondary: ReactNode = null;
  let primary: ReactNode = null;
  if (offer.type === "STAY") {
    secondary = (
      <Link href="/#stay" className="of-btn of-btn--ghost">
        View Stay
      </Link>
    );
    primary = (
      <button type="button" className="of-btn of-btn--block" onClick={onBook}>
        Book Now
      </button>
    );
  } else if (offer.type === "DINING") {
    const menuLabel =
      offer.slug === "signature-dining-menu" ? "View Menu" : offer.slug === "dinner-for-two" ? "View Offer" : "Explore Dining";
    secondary = (
      <Link href="/#dine" className="of-btn of-btn--ghost">
        {menuLabel}
      </Link>
    );
    primary =
      offer.slug === "signature-dining-menu" ? (
        <button type="button" className="of-btn of-btn--block" onClick={onOrder}>
          Order Now
        </button>
      ) : (
        <button type="button" className="of-btn of-btn--block" onClick={onReserve}>
          Reserve Table
        </button>
      );
  } else {
    secondary = (
      <button type="button" className="of-btn of-btn--ghost" onClick={onViewPackage}>
        View Package
      </button>
    );
    primary = (
      <button type="button" className="of-btn of-btn--block" onClick={onBook}>
        Book Package
      </button>
    );
  }

  const category = offer.type === "STAY" ? "Stay Offer" : offer.type === "DINING" ? "Dining Offer" : "Stay + Dining";

  return (
    <article className="of-card">
      <div className="of-card-media">
        <img src={offer.image} alt={`${offer.title} — FESTHER offer`} loading="lazy" />
      </div>
      <div className="of-card-body">
        <div className="of-card-kicker">
          <span className="of-card-cat">{category}</span>
          {discount ? <span className="of-badge">Save {discount}%</span> : null}
        </div>
        <h3 className="of-card-title">{offer.title}</h3>
        <p className="of-card-desc">{offer.shortDescription}</p>
        {priceNow || priceWas ? (
          <div className="of-card-price">
            {priceNow ? <span className="of-price-now">{priceNow}</span> : null}
            {priceWas && offer.offerPrice ? <span className="of-price-was">{priceWas}</span> : null}
          </div>
        ) : null}
        {offer.startDate && offer.endDate ? (
          <p className="of-card-dates">
            Valid {offer.startDate.replaceAll("-", ".")} — {offer.endDate.replaceAll("-", ".")}
          </p>
        ) : null}
        <div className="of-card-actions">
          {secondary}
          {primary}
        </div>
      </div>
    </article>
  );
}