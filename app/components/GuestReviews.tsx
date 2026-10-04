"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GuestReview } from "@/lib/types";
import { getApprovedReviews } from "@/services/reviews.service";
import ReviewCard from "./ReviewCard";
import { useHorizontalScroll } from "./useHorizontalScroll";
import "./horizontal-scroll.css";

const AUTO_MS = 6500;
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function viewCount(): number {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 700) return 2;
  return 1;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export default function GuestReviews() {
  const [reviews, setReviews] = useState<GuestReview[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [perView, setPerView] = useState(3);

  const pausedRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { ref, dragging, prev, next, onPointerDown, onPointerMove, endDrag } =
    useHorizontalScroll();

  useEffect(() => {
    let alive = true;
    getApprovedReviews()
      .then((items) => {
        if (!alive) return;
        setReviews(items);
        setLoadState("ready");
      })
      .catch(() => {
        if (alive) setLoadState("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const measure = () => setPerView(viewCount());
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const count = reviews.length;
  const canSlide = count > perView;

  // Auto-advance via native scroll. Pauses on hover and while the user interacts.
  useEffect(() => {
    if (!canSlide) return;
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      const el = ref.current;
      if (!el || pausedRef.current || document.hidden) return;
      const first = el.querySelector<HTMLElement>(":scope > *");
      const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
      const step = first
        ? first.getBoundingClientRect().width + gap
        : el.clientWidth / perView;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollBy({ left: atEnd ? -el.scrollWidth : step, behavior: "smooth" });
    }, AUTO_MS);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [count, canSlide, perView, ref]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return (
    <section className="guest-reviews" id="guest-stories">
      <div className="gr-head">
        <motion.p className="gold-label" {...rise(0)}>
          Guest Stories
        </motion.p>
        <motion.h2 {...rise(0.1)}>
          Moments shared by our guests.
        </motion.h2>
        <motion.p className="gr-desc" {...rise(0.2)}>
          Real words from guests who slowed down, stayed a while and found their favourite moments at FESTHER.
        </motion.p>
      </div>

      {loadState === "loading" ? (
        <div className="gr-skeleton-row" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="rv-sk" key={i}>
              <div className="rv-sk-line gr-sk-stars" />
              <div className="rv-sk-line gr-sk-wide" />
              <div className="rv-sk-line" />
              <div className="rv-sk-line gr-sk-mid" />
              <div className="rv-sk-line gr-sk-short" />
            </div>
          ))}
        </div>
      ) : loadState === "error" ? (
        <p className="gr-note">We couldn&rsquo;t load guest stories right now. Please try again later.</p>
      ) : count === 0 ? (
        <p className="gr-note">Stories from our guests are on the way.</p>
      ) : (
        <div className="gr-carousel">
          <button
            className="gr-arrow"
            type="button"
            aria-label="Previous reviews"
            onClick={prev}
            disabled={!canSlide}
          >
            ←
          </button>
          <div
            className={`gr-viewport horizontal-scroll horizontal-scroll--snap${dragging ? " is-dragging" : ""}`}
            ref={ref}
            onPointerDown={(e) => {
              pause();
              onPointerDown(e);
            }}
            onPointerMove={onPointerMove}
            onPointerUp={() => {
              endDrag();
              resume();
            }}
            onPointerCancel={() => {
              endDrag();
              resume();
            }}
            onPointerEnter={pause}
            onPointerLeave={() => {
              endDrag();
              resume();
            }}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            <div className="gr-track gr-track--native">
              {reviews.map((review) => (
                <div
                  className="gr-slide"
                  key={review.id}
                  style={{ flex: `0 0 ${100 / perView}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
          <button
            className="gr-arrow"
            type="button"
            aria-label="Next reviews"
            onClick={next}
            disabled={!canSlide}
          >
            →
          </button>
        </div>
      )}

    </section>
  );
}
