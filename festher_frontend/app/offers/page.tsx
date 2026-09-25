"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import OfferCard from "../components/offers/OfferCard";
import BookingModal from "../components/offers/BookingModal";
import ReservationModal from "../components/offers/ReservationModal";
import OrderModal from "../components/offers/OrderModal";
import PackageDetailsModal from "../components/offers/PackageDetailsModal";
import { getOffers } from "@/services/offers.service";
import { getAccommodations } from "@/services/accommodations.service";
import { getDiningItems } from "@/services/dining.service";
import type { Accommodation, DiningItem, Offer } from "@/lib/types";
import "../offers.css";
import "../checkout.css";

const FILTERS = ["ALL", "STAY", "DINING"] as const;
type Filter = (typeof FILTERS)[number];

interface BookTarget {
  offer: Offer;
  accommodation: Accommodation;
}

interface OrderTarget {
  item: DiningItem;
  offer: Offer;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [diningItems, setDiningItems] = useState<DiningItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const [bookTarget, setBookTarget] = useState<BookTarget | null>(null);
  const [reserveOffer, setReserveOffer] = useState<Offer | null>(null);
  const [orderTarget, setOrderTarget] = useState<OrderTarget | null>(null);
  const [pkgOffer, setPkgOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      setError("");
      try {
        const [o, a, d] = await Promise.all([getOffers(), getAccommodations(), getDiningItems()]);
        if (cancelled) return;
        setOffers(o);
        setAccommodations(a);
        setDiningItems(d);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "We could not load the offers. Please try again.");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const accommodationFor = (offer: Offer) => accommodations.find((x) => x.id === offer.accommodationId);
  const diningItemFor = (offer: Offer) => diningItems.find((x) => x.id === offer.diningItemId);

  const handleBook = (offer: Offer) => {
    const accommodation = accommodationFor(offer);
    if (!accommodation) return;
    setBookTarget({ offer, accommodation });
  };

  const handleOrder = (offer: Offer) => {
    const item = diningItemFor(offer);
    if (!item) return;
    setOrderTarget({ item, offer });
  };

  const handleBookPackage = (offer: Offer) => {
    const accommodation = accommodationFor(offer);
    if (!accommodation) return;
    setPkgOffer(null);
    setBookTarget({ offer, accommodation });
  };

  const shown =
    activeFilter === "ALL"
      ? offers
      : offers.filter((o) => (activeFilter === "STAY" ? o.type === "STAY" || o.type === "PACKAGE" : o.type === "DINING"));

  return (
    <main className={`gallery-page offers-page${scrolled ? " gallery-page--scrolled" : ""}`}>
      <section className="fg-hero">
        <Navbar />
        <img src="/festher-hero.jpg" alt="FESTHER — offers at golden hour" />
        <h1>Offers</h1>
      </section>

      <section className="fg-head">
        <nav className="fg-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">•</span>
          <span>Offers</span>
        </nav>
        <p className="of-tagline">Exceptional stays, thoughtfully offered.</p>
        <p className="of-intro">
          Handpicked accommodation packages and dining experiences — quiet escapes, tables to remember and the island,
          offered together.
        </p>
      </section>

      <nav className="fg-filters of-filters" aria-label="Offer categories">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "is-active" : undefined}
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </nav>

      {status === "loading" ? (
        <p className="of-state">Loading offers…</p>
      ) : status === "error" ? (
        <div className="of-state">
          <p className="of-error-banner">{error}</p>
          <button type="button" className="of-btn of-btn--ghost" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <section className="of-grid" key={activeFilter} aria-label="Offers">
          {shown.length === 0 ? (
            <p className="of-empty">No offers in this category right now. Please check back soon.</p>
          ) : (
            shown.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onBook={() => handleBook(offer)}
                onReserve={() => setReserveOffer(offer)}
                onOrder={() => handleOrder(offer)}
                onViewPackage={() => setPkgOffer(offer)}
              />
            ))
          )}
        </section>
      )}

      {bookTarget ? (
        <BookingModal
          accommodation={bookTarget.accommodation}
          offer={bookTarget.offer}
          onClose={() => setBookTarget(null)}
        />
      ) : null}

      {reserveOffer ? (
        <ReservationModal offer={reserveOffer} onClose={() => setReserveOffer(null)} />
      ) : null}

      {orderTarget ? (
        <OrderModal item={orderTarget.item} offer={orderTarget.offer} onClose={() => setOrderTarget(null)} />
      ) : null}

      {pkgOffer ? (
        <PackageDetailsModal
          offer={pkgOffer}
          accommodation={accommodationFor(pkgOffer)}
          diningItem={diningItemFor(pkgOffer)}
          onBook={() => handleBookPackage(pkgOffer)}
          onClose={() => setPkgOffer(null)}
        />
      ) : null}
    </main>
  );
}