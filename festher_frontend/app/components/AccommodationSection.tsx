"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue } from "framer-motion";
import { accommodations } from "@/lib/data/accommodations";
import type { Accommodation } from "@/lib/types";
import { Icons } from "./AccommodationIcons";
import BookingModal from "./offers/BookingModal";

const rooms = accommodations.slice(0, 4);
const loopRooms = [rooms[rooms.length - 1], ...rooms, rooms[0]];

export default function AccommodationSection() {
  const [position, setPosition] = useState(1);
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Accommodation | null>(null);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const positionRef = useRef(1);
  const realIndex = (position - 1 + rooms.length) % rooms.length;

  const goTo = (next: number) => {
    positionRef.current = next;
    setPosition(next);
  };

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      if (!track || !first) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      const nextStep = first.getBoundingClientRect().width + gap;
      setStep(nextStep);
      x.set(-positionRef.current * nextStep);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [x]);

  useEffect(() => {
    if (!step || animating.current) return;
    animating.current = true;
    const controls = animate(x, -position * step, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        animating.current = false;
        if (position === 0) {
          goTo(rooms.length);
          x.set(-rooms.length * step);
        } else if (position === rooms.length + 1) {
          goTo(1);
          x.set(-step);
        }
      },
    });
    return () => controls.stop();
  }, [position, step, x]);

  const previous = () => {
    if (!animating.current) goTo(positionRef.current - 1);
  };
  const next = () => {
    if (!animating.current) goTo(positionRef.current + 1);
  };

  return (
    <section className="acc-section" id="stay">
      <div className="acc-head">
        <motion.h2
          className="acc-title"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Accommodation
        </motion.h2>
        <Link className="acc-viewall" href="/accommodation">
          View All
        </Link>
      </div>

      <div className="acc-viewport">
        <motion.div
          ref={trackRef}
          className="acc-track"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -step * (loopRooms.length - 1), right: 0 }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (!step) return;
            if (info.offset.x < -45) next();
            else if (info.offset.x > 45) previous();
            else animate(x, -position * step, { duration: 0.35 });
          }}
        >
          {loopRooms.map((room, i) => {
            const href = `/accommodation/${room.slug}`;
            return (
              <article className="acc-slide" key={`${room.slug}-${i}`}>
                <Link
                  className="acc-photo-link"
                  href={href}
                  aria-label={`View ${room.name} details`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="acc-photo"
                    src={room.heroImage}
                    alt={`${room.name} at FESTHER`}
                    draggable={false}
                    loading="lazy"
                  />
                </Link>
                <div className="acc-card">
                  <h3 className="acc-room-title">
                    <Link href={href}>{room.name}</Link>
                  </h3>
                  <p className="acc-room-size">Room Size: {room.roomSize}</p>
                  <p className="acc-room-desc">{room.shortDescription}</p>
                  <div className="acc-actions">
                    <Link className="acc-action" href={href}>
                      Explore
                    </Link>
                    <span className="acc-actions-sep" aria-hidden="true" />
                    <button
                      type="button"
                      className="acc-action"
                      onClick={() => setBooking(room)}
                    >
                      Check Availability
                    </button>
                  </div>
                  <div className="acc-divider" />
                  <ul className="acc-amenities">
                    {room.amenities.map(([key, label]) => (
                      <li key={label}>
                        {Icons[key]}
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </motion.div>
      </div>

      <div className="acc-nav">
        <button type="button" className="acc-arrow" onClick={previous} aria-label="Previous accommodation">
          ←
        </button>
        <span className="acc-counter" aria-live="polite">
          {realIndex + 1} / {rooms.length}
        </span>
        <button type="button" className="acc-arrow" onClick={next} aria-label="Next accommodation">
          →
        </button>
      </div>

      {booking ? (
        <BookingModal
          accommodation={booking}
          offer={null}
          onClose={() => setBooking(null)}
        />
      ) : null}
    </section>
  );
}