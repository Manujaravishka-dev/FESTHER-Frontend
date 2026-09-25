"use client";

import Link from "next/link";
import Modal from "./Modal";
import { effectiveDiscount, formatPrice } from "@/lib/format";
import type { Accommodation, DiningItem, Offer } from "@/lib/types";

interface PackageDetailsModalProps {
  offer: Offer;
  accommodation?: Accommodation;
  diningItem?: DiningItem;
  onBook: () => void;
  onClose: () => void;
}

export default function PackageDetailsModal({
  offer,
  accommodation,
  diningItem,
  onBook,
  onClose,
}: PackageDetailsModalProps) {
  const discount = effectiveDiscount(offer);
  const priceNow = formatPrice(offer.offerPrice ?? offer.originalPrice, offer.currency);
  const priceWas = formatPrice(offer.originalPrice, offer.currency);

  return (
    <Modal onClose={onClose} kicker="Stay + Dining Package" title={offer.title} subtitle="The island, in one offer">
      {offer.description ? <p className="of-package-desc">{offer.description}</p> : null}

      <div className="of-package-list">
        {accommodation ? (
          <div className="of-package-item">
            <span className="of-package-tag">Stay</span>
            <p className="of-package-name">{accommodation.name}</p>
            <p className="of-package-meta">
              {accommodation.roomSize} · {accommodation.shortDescription}
            </p>
          </div>
        ) : null}
        {diningItem ? (
          <div className="of-package-item">
            <span className="of-package-tag">Dining</span>
            <p className="of-package-name">{diningItem.name}</p>
            <p className="of-package-meta">{diningItem.description}</p>
          </div>
        ) : null}
      </div>

      {priceNow || priceWas ? (
        <div className="of-card-price of-package-price">
          {priceNow ? <span className="of-price-now">{priceNow}</span> : null}
          {priceWas && offer.offerPrice ? <span className="of-price-was">{priceWas}</span> : null}
          {discount ? <span className="of-badge">Save {discount}%</span> : null}
        </div>
      ) : null}

      {offer.startDate && offer.endDate ? (
        <p className="of-card-dates">
          Valid {offer.startDate.replaceAll("-", ".")} — {offer.endDate.replaceAll("-", ".")}
        </p>
      ) : null}

      <div className="of-form-actions">
        <button type="button" className="of-btn of-btn--block" onClick={onBook}>
          Book Package
        </button>
        <Link
          href="/#stay"
          className="of-btn of-btn--ghost of-btn--block"
          onClick={onClose}
        >
          Explore Stay
        </Link>
      </div>
      <p className="of-form-note">
        This is a request — availability and final pricing are confirmed by our team by email.
      </p>
    </Modal>
  );
}