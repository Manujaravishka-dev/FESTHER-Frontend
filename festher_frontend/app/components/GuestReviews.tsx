"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import type { GuestReview } from "@/lib/types";
import { getApprovedReviews } from "@/services/reviews.service";
import ReviewCard from "./ReviewCard";

const AUTO_MS = 6500;
const SWIPE_PX = 48;
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
  const [itemWidth, setItemWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const swipeStartRef = useRef<number | null>(null);

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
    const measure = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const p = viewCount();
      setPerView(p);
      setItemWidth(vp.clientWidth / p);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [loadState]);

  const count = reviews.length;
  const maxIndex = Math.max(0, count - 1);
  const canSlide = count > perView;
  const slideIndex = Math.min(index, maxIndex);

  useEffect(() => {
    if (!canSlide) return;
    const t = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((v) => (v + 1) % count);
      }
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [count, canSlide]);

  const next = () => { if (canSlide) setIndex((v) => (v + 1) % count); };
  const prev = () => { if (canSlide) setIndex((v) => (v - 1 + count) % count); };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide || (e.pointerType === "mouse" && e.button !== 0)) return;
    swipeStartRef.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const endSwipe = (x: number) => {
    if (swipeStartRef.current == null) return;
    const dx = x - swipeStartRef.current;
    swipeStartRef.current = null;
    setDragging(false);
    if (Math.abs(dx) >= SWIPE_PX) {
      if (dx < 0) next();
      else prev();
    }
  };

  const trackItems = canSlide ? [...reviews, ...reviews] : reviews;

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
            className={`gr-viewport${dragging ? " is-dragging" : ""}`}
            ref={viewportRef}
            style={{ touchAction: "pan-y" }}
            onPointerDown={onPointerDown}
            onPointerUp={(e) => endSwipe(e.clientX)}
            onPointerCancel={(e) => endSwipe(e.clientX)}
            onPointerEnter={() => {
              pausedRef.current = true;
            }}
            onPointerLeave={() => {
              pausedRef.current = false;
              swipeStartRef.current = null;
              setDragging(false);
            }}
          >
            <motion.div
              className="gr-track"
              animate={{ x: canSlide ? -slideIndex * itemWidth : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {trackItems.map((review, i) => (
                <div
                  className="gr-slide"
                  key={`${review.id}-${i}`}
                  style={{ flex: `0 0 ${100 / perView}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </motion.div>
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