"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const U = (id: string, w: number, h: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const categories = ["ALL", "ROOMS", "VIEWS", "DINING", "SPACES", "WELLNESS"] as const;
type Category = (typeof categories)[number];

interface GalleryItem {
  id: string;
  cat: Exclude<Category, "ALL">;
  title: string;
  w: number;
  h: number;
}

const items: GalleryItem[] = [
  { id: "photo-1590490360182-c33d57733427", cat: "ROOMS", title: "A room made for unhurried mornings", w: 900, h: 1200 },
  { id: "photo-1571003123894-1f0594d2b5d9", cat: "ROOMS", title: "Quiet corners, warm light", w: 1400, h: 950 },
  { id: "photo-1582719471384-894fbb16e074", cat: "ROOMS", title: "Thoughtful details of the stay", w: 900, h: 1500 },
  { id: "photo-1618773928121-c32242e63f39", cat: "ROOMS", title: "Slow mornings in bed", w: 1100, h: 1100 },
  { id: "photo-1546708973-b339540b5162", cat: "VIEWS", title: "Journeys through the island", w: 1700, h: 820 },
  { id: "photo-1469474968028-56623f02e42e", cat: "VIEWS", title: "The island below", w: 1400, h: 950 },
  { id: "photo-1507525428034-b723cf961d3e", cat: "VIEWS", title: "Warm sand, calm sea", w: 1600, h: 900 },
  { id: "photo-1448375240586-882707db888b", cat: "VIEWS", title: "Green that goes on and on", w: 900, h: 1300 },
  { id: "photo-1501785888041-af3ef285b470", cat: "VIEWS", title: "Still mornings, open skies", w: 1400, h: 950 },
  { id: "photo-1414235077428-338989a2e8c0", cat: "DINING", title: "A table set just for you", w: 1400, h: 950 },
  { id: "photo-1504674900247-0877df9cc836", cat: "DINING", title: "Flavours of the island", w: 1100, h: 1100 },
  { id: "photo-1533089860892-a7c6f0a88666", cat: "DINING", title: "Breakfast, unhurried", w: 1400, h: 950 },
  { id: "photo-1424847651672-bf20a4b0982b", cat: "DINING", title: "Gatherings around the table", w: 900, h: 1500 },
  { id: "photo-1517248135467-4c7edcad34c4", cat: "DINING", title: "Evenings in good company", w: 900, h: 1200 },
  { id: "photo-1600585154340-be6161a56a0c", cat: "SPACES", title: "Indoor and outdoor, together", w: 1600, h: 900 },
  { id: "photo-1512917774080-9991f1c4c750", cat: "SPACES", title: "Architecture in the landscape", w: 1100, h: 1100 },
  { id: "photo-1416879595882-3373a0480b5b", cat: "SPACES", title: "Gardens in bloom", w: 900, h: 1200 },
  { id: "photo-1466781783364-36c955e42a7f", cat: "SPACES", title: "Paths into the green", w: 1400, h: 950 },
  { id: "photo-1544161515-4ab6ce6db874", cat: "WELLNESS", title: "Time to slow the breath", w: 900, h: 1200 },
  { id: "photo-1540555700478-4be289fbecef", cat: "WELLNESS", title: "Quiet, unhurried care", w: 900, h: 1500 },
  { id: "photo-1519823551278-64ac92734fb1", cat: "WELLNESS", title: "Breathe, stretch, rest", w: 1400, h: 950 },
  { id: "photo-1611892440504-42a792e24d32", cat: "WELLNESS", title: "The pool at golden hour", w: 1700, h: 820 },
  { id: "photo-1520250497591-112f2f40a3f4", cat: "WELLNESS", title: "Cool water, warm days", w: 1400, h: 950 },
];

const hero = U("photo-1611892440504-42a792e24d32", 2400, 1250);

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("ALL");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = active === "ALL" ? items : items.filter((i) => i.cat === active);

  const step = useCallback(
    (dir: number) => {
      setLightbox((v) => (v === null ? v : (v + dir + shown.length) % shown.length));
    },
    [shown.length],
  );

  useEffect(() => {
    document.body.style.overflow = lightbox === null ? "" : "hidden";
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step]);

  const current = lightbox === null ? null : shown[lightbox];

  return (
    <main className={`gallery-page${scrolled ? " gallery-page--scrolled" : ""}`}>
      <section className="fg-hero">
        <Navbar />
        <img src={hero} alt="FESTHER — tropical mornings" />
        <h1>Gallery</h1>
      </section>

      <section className="fg-head">
        <nav className="fg-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">•</span>
          <span>Gallery</span>
        </nav>
        <p className="fg-intro">
          Moments of FESTHER, beautifully captured. Stays, tables, gardens and golden hours — a glimpse of the island
          at our own pace.
        </p>
      </section>

      <nav className="fg-filters" aria-label="Gallery categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={active === cat ? "is-active" : undefined}
            aria-pressed={active === cat}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <section className="fg-masonry" key={active} aria-label="Photo gallery">
        {shown.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className="fg-item"
            onClick={() => setLightbox(i)}
            aria-label={`Open image: ${item.title}`}
          >
            <img src={U(item.id, item.w, item.h)} alt={item.title} loading="lazy" />
          </button>
        ))}
      </section>

      {current ? (
        <div
          className="fg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (dx < -40) step(1);
            else if (dx > 40) step(-1);
          }}
        >
          <button className="fg-lb-close" type="button" onClick={() => setLightbox(null)} aria-label="Close">
            ×
          </button>
          <button className="fg-lb-btn fg-lb-prev" type="button" onClick={() => step(-1)} aria-label="Previous image">
            ←
          </button>
          <figure>
            <img src={U(current.id, current.w * 2, current.h * 2)} alt={current.title} />
          </figure>
          <button className="fg-lb-btn fg-lb-next" type="button" onClick={() => step(1)} aria-label="Next image">
            →
          </button>
        </div>
      ) : null}
    </main>
  );
}