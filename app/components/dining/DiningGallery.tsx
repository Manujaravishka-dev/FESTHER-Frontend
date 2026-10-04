"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface DiningGalleryItem {
  id: string;
  src: string;
  title: string;
  w: number;
  h: number;
}

interface DiningGalleryProps {
  items: DiningGalleryItem[];
}

export default function DiningGallery({ items }: DiningGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback(
    (dir: number) => {
      setLightbox((v) => (v === null ? v : (v + dir + items.length) % items.length));
    },
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, step]);

  const current = lightbox === null ? null : items[lightbox];

  return (
    <section className="fg-masonry dine-gallery-mason" aria-label="From our table">
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          className="fg-item"
          onClick={() => setLightbox(i)}
          aria-label={`Open image: ${item.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.title} loading="lazy" />
        </button>
      ))}

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.title} />
          </figure>
          <button className="fg-lb-btn fg-lb-next" type="button" onClick={() => step(1)} aria-label="Next image">
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
