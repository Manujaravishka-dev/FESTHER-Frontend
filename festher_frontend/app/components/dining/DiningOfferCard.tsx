"use client";

import { effectiveDiscount, formatPrice } from "@/lib/format";
import type { Offer } from "@/lib/types";

interface DiningOfferCardProps {
  offer: Offer;
  onView: () => void;
  onOrder: () => void;
  onReserve: () => void;
}

export default function DiningOfferCard({ offer, onView, onOrder, onReserve }: DiningOfferCardProps) {
  const discount = effectiveDiscount(offer);
  const priceNow = formatPrice(offer.offerPrice ?? offer.originalPrice, offer.currency);
  const priceWas = formatPrice(offer.originalPrice, offer.currency);
  const canOrder = offer.slug === "signature-dining-menu";

  return (
    <article className="dine-offer">
      <div className="dine-offer-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={offer.image} alt={`${offer.title} — FESTHER dining offer`} loading="lazy" />
      </div>
      <div className="dine-offer-body">
        <div className="dine-offer-kicker">
          <span className="dine-offer-cat">Dining Offer</span>
          {discount ? <span className="dine-offer-badge">Save {discount}%</span> : null}
        </div>
        <h3 className="dine-offer-title">{offer.title}</h3>
        <p className="dine-offer-desc">{offer.shortDescription}</p>
        {priceNow || priceWas ? (
          <div className="dine-offer-price">
            {priceNow ? <span className="dine-offer-now">{priceNow}</span> : null}
            {priceWas && offer.offerPrice ? <span className="dine-offer-was">{priceWas}</span> : null}
          </div>
        ) : null}
        {offer.startDate && offer.endDate ? (
          <p className="dine-offer-dates">
            Valid {offer.startDate.replaceAll("-", ".")} — {offer.endDate.replaceAll("-", ".")}
          </p>
        ) : null}
        <div className="dine-offer-actions">
          <button type="button" className="of-btn of-btn--ghost" onClick={onView}>
            View Offer
          </button>
          {canOrder ? (
            <button type="button" className="of-btn" onClick={onOrder}>
              Order Now
            </button>
          ) : (
            <button type="button" className="of-btn" onClick={onReserve}>
              Reserve Table
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
