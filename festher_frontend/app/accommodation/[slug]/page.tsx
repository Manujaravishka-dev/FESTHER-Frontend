"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import BookingModal from "../../components/offers/BookingModal";
import { AmenityIcon } from "../../components/AccommodationIcons";
import { getAccommodationBySlug } from "@/services/accommodations.service";
import type { Accommodation } from "@/lib/types";
import "../../offers.css";
import "../../accommodation.css";

type Status = "loading" | "ready" | "notfound" | "error";

export default function AccommodationDetailPage() {
  const params = useParams<{ slug: string }>();
  const [room, setRoom] = useState<Accommodation | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [booking, setBooking] = useState(false);

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
        const found = await getAccommodationBySlug(params.slug);
        if (cancelled) return;
        if (!found) {
          setStatus("notfound");
          return;
        }
        setRoom(found);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "We could not load this room. Please try again.");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const metaRows = (): [string, string][] => {
    if (!room) return [];
    const rows: [string, string][] = [["Room size", room.roomSize]];
    if (room.capacity) rows.push(["Sleeps", `Up to ${room.capacity} guests`]);
    if (room.bedType) rows.push(["Bed", room.bedType]);
    return rows;
  };

  const galleryImages = (): string[] => {
    if (!room) return [];
    const unique = [room.heroImage, ...room.images.filter((img) => img !== room.heroImage)];
    return unique.length > 0 ? unique : [room.heroImage];
  };

  const body = () => {
    switch (status) {
      case "loading":
        return <p className="of-state">Loading {params.slug}…</p>;
      case "error":
        return (
          <div className="of-state">
            <p className="of-error-banner">{error}</p>
            <button type="button" className="of-btn of-btn--ghost" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        );
      case "notfound":
        return (
          <div className="of-state">
            <p>We could not find that room. It may have been moved or renamed.</p>
            <Link href="/accommodation" className="of-btn">
              View All Accommodation
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  const detail = () => {
    if (!room) return null;
    const gallery = galleryImages();
    return (
      <>
        <section className="fg-head">
          <nav className="fg-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">•</span>
            <Link href="/accommodation">Accommodation</Link>
            <span aria-hidden="true">•</span>
            <span>{room.name}</span>
          </nav>
        </section>

        <div className="accd-body">
          <div className="accd-main">
            <p className="accd-kicker">Stay</p>
            <h2 className="accd-title">
              {room.name}
              <strong>{room.roomSize}</strong>
            </h2>
            <p className="accd-lead">{room.fullDescription}</p>

            {room.highlights && room.highlights.length > 0 ? (
              <section className="accd-block">
                <h3 className="accd-block-title">Highlights</h3>
                <ul className="accd-highlights">
                  {room.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {room.details && room.details.length > 0 ? (
              <section className="accd-block">
                <h3 className="accd-block-title">Good to know</h3>
                <dl className="accd-details">
                  {room.details.map(([label, value]) => (
                    <div className="accd-details-row" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section className="accd-block">
              <h3 className="accd-block-title">In the room</h3>
              <div className="accd-gallery">
                {gallery.map((src, i) => (
                  <figure
                    key={`${src}-${i}`}
                    className={i === 0 ? "accd-gallery--lead" : "accd-gallery--rest"}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${room.name} — view ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
                  </figure>
                ))}
              </div>
            </section>
          </div>

          <aside className="accd-side">
            <div className="accd-side-card">
              <p className="accd-kicker">Overview</p>
              <div className="accd-meta-rows">
                {metaRows().map(([label, value]) => (
                  <div className="accd-meta-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <ul className="accd-amenities">
                {room.amenities.map(([key, label]) => (
                  <li key={label}>
                    <AmenityIcon kind={key} />
                    {label}
                  </li>
                ))}
              </ul>
              <button type="button" className="of-btn of-btn--block accd-side-cta" onClick={() => setBooking(true)}>
                Check Availability
              </button>
              <p className="accd-side-note">No prepayment needed. Cancellation free up to 24h before arrival.</p>
            </div>
          </aside>
        </div>
      </>
    );
  };

  return (
    <main className={`gallery-page offers-page acc-page${scrolled ? " gallery-page--scrolled" : ""}`}>
      <section className="fg-hero">
        <Navbar />
        {room ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={room.heroImage} alt={`${room.name} at FESTHER`} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/festher-hero.jpg" alt="FESTHER" />
        )}
        <h1>{room ? room.name : "Accommodation"}</h1>
      </section>

      {status === "ready" ? detail() : body()}

      {room && booking ? (
        <BookingModal accommodation={room} offer={null} onClose={() => setBooking(false)} />
      ) : null}
    </main>
  );
}