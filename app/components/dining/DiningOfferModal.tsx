"use client";

import Modal from "../offers/Modal";
import { effectiveDiscount, formatPrice } from "@/lib/format";
import type { Offer } from "@/lib/types";

interface DiningOfferModalProps {
  offer: Offer;
  onClose: () => void;
  onOrder: () => void;
  onReserve: () => void;
}

export default function DiningOfferModal({ offer, onClose, onOrder, onReserve }: DiningOfferModalProps) {
  const discount = effectiveDiscount(offer);
  const priceNow = formatPrice(offer.offerPrice ?? offer.originalPrice, offer.currency);
  const priceWas = formatPrice(offer.originalPrice, offer.currency);
  const canOrder = offer.slug === "signature-dining-menu";

  return (
    <Modal
      onClose={onClose}
      kicker="Dining Offer"
      title={offer.title}
      subtitle={discount ? `Save ${discount}%` : undefined}
      wide
    >
      <div className="dine-dish-modal-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={offer.image} alt={`${offer.title} — FESTHER dining offer`} />
      </div>
      <p className="dine-dish-modal-desc">{offer.description ?? offer.shortDescription}</p>
      <div className="dine-offer-price">
        {priceNow ? <span className="dine-offer-now">{priceNow}</span> : null}
        {priceWas && offer.offerPrice ? <span className="dine-offer-was">{priceWas}</span> : null}
      </div>
      {offer.startDate && offer.endDate ? (
        <p className="dine-offer-dates">
          Valid {offer.startDate.replaceAll("-", ".")} — {offer.endDate.replaceAll("-", ".")}
        </p>
      ) : null}
      <div className="dine-dish-modal-actions">
        {canOrder ? (
          <button type="button" className="of-btn" onClick={onOrder}>
            Order Now
          </button>
        ) : (
          <button type="button" className="of-btn" onClick={onReserve}>
            Reserve Table
          </button>
        )}
        <button type="button" className="of-btn of-btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
