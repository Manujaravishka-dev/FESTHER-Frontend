"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import BookingModal from "../components/offers/BookingModal";
import { getAccommodations } from "@/services/accommodations.service";
import type { Accommodation } from "@/lib/types";
import "../offers.css";
import "../accommodation.css";

export default function AccommodationListingPage() {
  const [accommodationsData, setAccommodationsData] = useState<Accommodation[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [bookRoom, setBookRoom] = useState<Accommodation | null>(null);

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
        const rooms = await getAccommodations();
        if (cancelled) return;
        setAccommodationsData(rooms);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "We could not load the rooms. Please try again.");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={`gallery-page offers-page acc-page${scrolled ? " gallery-page--scrolled" : ""}`}>
      <section className="fg-hero">
        <Navbar />
        <img src="/festher-hero.jpg" alt="FESTHER — accommodation at golden hour" />
        <h1>Accommodation</h1>
      </section>

      <section className="fg-head">
        <nav className="fg-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">•</span>
          <span>Accommodation</span>
        </nav>
        <p className="of-tagline">Rooms made for slow stays.</p>
        <p className="of-intro">
          Four distinct stays across the estate — garden, family, deluxe and premier — each with its own character,
          its own view of the gardens, and the same unhurried welcome.
        </p>
      </section>

      {status === "loading" ? (
        <p className="of-state">Loading accommodation…</p>
      ) : status === "error" ? (
        <div className="of-state">
          <p className="of-error-banner">{error}</p>
          <button type="button" className="of-btn of-btn--ghost" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <section className="of-grid accl-grid-bottom" aria-label="Accommodation">
          {accommodationsData.map((room) => {
            const href = `/accommodation/${room.slug}`;
            return (
              <article className="of-card" key={room.id}>
                <div className="of-card-media">
                  <Link href={href} aria-label={`View ${room.name} details`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={room.heroImage} alt={`${room.name} at FESTHER`} loading="lazy" />
                  </Link>
                </div>
                <div className="of-card-body">
                  <div className="of-card-kicker">
                    <span className="of-card-cat">Stay</span>
                    <span className="of-badge">{room.roomSize}</span>
                  </div>
                  <h2 className="of-card-title">
                    <Link href={href}>{room.name}</Link>
                  </h2>
                  <p className="of-card-desc">{room.shortDescription}</p>
                  <p className="accp-card-meta">
                    {room.capacity ? <span>Sleeps {room.capacity}</span> : null}
                    {room.bedType ? <span>{room.bedType}</span> : null}
                  </p>
                  <div className="of-card-actions">
                    <Link href={href} className="of-btn of-btn--block">
                      Explore
                    </Link>
                    <button
                      type="button"
                      className="of-btn of-btn--ghost of-btn--block"
                      onClick={() => setBookRoom(room)}
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {bookRoom ? (
        <BookingModal accommodation={bookRoom} offer={null} onClose={() => setBookRoom(null)} />
      ) : null}
    </main>
  );
}