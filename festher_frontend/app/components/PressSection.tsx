"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const articles = [
  {
    cat: ["Experiences", "Journeys", "Sri Lanka"],
    title: "Discover the Timeless Beauty of Sri Lanka",
    date: "17 Sep 2026",
    link: "/about",
    imgs: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    cat: ["Culinary", "Experiences", "Dining"],
    title: "A Taste of Sri Lanka: Flavours Inspired by the Island",
    date: "08 Sep 2026",
    link: "/#dine",
    imgs: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    cat: ["Wellbeing", "Wellness", "Experiences"],
    title: "Slow Down, Breathe Deeply and Rediscover Yourself",
    date: "30 Aug 2026",
    link: "/#experiences",
    imgs: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    cat: ["Celebrations", "Weddings", "Experiences"],
    title: "Celebrate Your Story in the Heart of Sri Lanka",
    date: "18 Aug 2026",
    link: "/#booking",
    imgs: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    cat: ["Family Travel", "Luxury Stays", "Experiences"],
    title: "Unforgettable Stays Made for Every Kind of Escape",
    date: "05 Aug 2026",
    link: "/#stay",
    imgs: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    cat: ["Nature", "Sustainability", "Wellbeing"],
    title: "Where Nature and Thoughtful Hospitality Come Together",
    date: "22 Jul 2026",
    link: "/#stay",
    imgs: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
    ],
  },
];

const press = [
  { key: "conde", logo: "/images/press/conde-nast-traveler.svg", name: "Condé Nast Traveler", note: "The best hotels in Sri Lanka" },
  { key: "destinasian", logo: "/images/press/destinasian.webp", name: "DestinAsian", note: "The pekoe trail with Teardrop Hotels" },
  { key: "tatler", logo: "/images/press/tatler.svg", name: "Tatler", note: "Travel Awards: Best cultural space 2023" },
  { key: "cna", logo: "/images/press/cna-luxury.svg", name: "CNA Luxury", note: "The best airport hotel in the world" },
  { key: "wallpaper", logo: "/images/press/wallpaper.svg", name: "Wallpaper*", note: "A remarkable preservation story" },
  { key: "forbes", logo: "/images/press/forbes.svg", name: "Forbes", note: "5 boutique luxury hotels you can't miss in Sri Lanka" },
];

const COUNT = press.length;
const REP = 3;
const SLIDES = Array.from({ length: REP }, () => press).flat();
const STEP_UNIT = 100 / (COUNT * REP);
const A = 5500;
const MOVE_MS = 600;

function windowCount() {
  if (typeof window === "undefined") return 5;
  const w = window.innerWidth;
  if (w >= 1200) return 5;
  if (w >= 900) return 4;
  if (w >= 640) return 3;
  if (w >= 480) return 2;
  return 1;
}

export default function PressSection() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(5);
  const [pos, setPos] = useState(COUNT);
  const [dragging, setDragging] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bump, setBump] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(COUNT);
  const dragRef = useRef(false);
  const startRef = useRef({ x: 0, p: COUNT });
  const itemPxRef = useRef(0);
  const wrapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeX = useRef<number | null>(null);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const measure = () => {
      const p = windowCount();
      setPerView(p);
      if (viewportRef.current) itemPxRef.current = viewportRef.current.clientWidth / p;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    const onResize = () => setBump((b) => b + 1);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      if (wrapTimer.current) clearTimeout(wrapTimer.current);
    };
  }, []);

  const articlePrev = () => setIndex((v) => (v - 1 + articles.length) % articles.length);
  const articleNext = () => setIndex((v) => (v + 1) % articles.length);

  const onArticleDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    swipeX.current = e.clientX;
  };

  const onArticleUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeX.current == null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (dx < -54) articleNext();
    else if (dx > 54) articlePrev();
  };

  const wrap = useCallback(() => {
    const p = posRef.current;
    if (p >= 2 * COUNT) setPos(p - COUNT);
    else if (p < COUNT) setPos(p + COUNT);
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      const max = SLIDES.length - perView;
      const t = Math.max(0, Math.min(max, target));
      setDragging(false);
      setDragDx(0);
      setPos(t);
      if (wrapTimer.current) clearTimeout(wrapTimer.current);
      wrapTimer.current = setTimeout(wrap, MOVE_MS + 40);
    },
    [perView, wrap],
  );

  const prevSlide = useCallback(() => {
    setBump((b) => b + 1);
    animateTo(posRef.current - 1);
  }, [animateTo]);

  const nextSlide = useCallback(() => {
    setBump((b) => b + 1);
    animateTo(posRef.current + 1);
  }, [animateTo]);

  useEffect(() => {
    if (paused || perView === 0) return;
    const t = setTimeout(() => animateTo(posRef.current + 1), A);
    return () => clearTimeout(t);
  }, [paused, pos, bump, perView, animateTo]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = true;
    startRef.current = { x: e.clientX, p: posRef.current };
    setDragging(true);
    setPaused(true);
    try {
      viewportRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setDragDx(e.clientX - startRef.current.x);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = false;
    const dx = e.clientX - startRef.current.x;
    const item = itemPxRef.current || 1;
    const steps = Math.round(dx / item);
    const target = startRef.current.p - steps;
    setPaused(false);
    setBump((b) => b + 1);
    animateTo(target);
  };

  const base = -pos * STEP_UNIT;
  const transform = dragging ? `translateX(calc(${base}% + ${dragDx}px))` : `translateX(${base}%)`;
  const transition = dragging ? "none" : `transform ${MOVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  const a = articles[index];

  return (
    <section className="festher-press" id="press">
      <div className="press-article" onPointerDown={onArticleDown} onPointerUp={onArticleUp} style={{ touchAction: "pan-y" }}>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="article-images">
            {a.imgs.map((src, i) => (
              <div key={i} className={`article-image article-image--${i === 0 ? "left" : i === 1 ? "center" : "right"}`}>
                <img src={src} alt={a.title} draggable={false} />
              </div>
            ))}
          </div>
          <p className="article-cats">
            {a.cat.map((c) => (
              <a key={c} href="#press">
                {c}
              </a>
            ))}
          </p>
          <h3>{a.title}</h3>
          <p className="press-date">{a.date}</p>
          <Link className="press-read" href={a.link}>
            Read More
          </Link>
        </motion.div>
      </div>

      <div className="press-nav">
        <span className="press-count">
          <strong>{index + 1}</strong> / {articles.length}
        </span>
        <i className="press-line" aria-hidden="true" />
        <button className="press-arrow" type="button" aria-label="Previous article" onClick={articlePrev}>
          ←
        </button>
        <button className="press-arrow" type="button" aria-label="Next article" onClick={articleNext}>
          →
        </button>
      </div>

      <div className="press-carousel">
        <button className="press-arrow press-arrow--row" type="button" aria-label="Previous publication" onClick={prevSlide}>
          ←
        </button>
        <div
          className={`press-carousel-viewport${dragging ? " is-dragging" : ""}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => {
            if (!dragRef.current) {
              setPaused(false);
              setBump((b) => b + 1);
            }
          }}
        >
          <div className="press-carousel-track" style={{ transform, transition }}>
            {SLIDES.map((p, i) => (
              <div className="press-item" key={`${p.key}-${i}`} style={{ flex: `0 0 ${100 / perView}%` }}>
                <span className="press-logo-wrapper">
                  <img className={`press-logo press-logo--${p.key}`} src={p.logo} alt={p.name} draggable={false} />
                </span>
                <p>{p.note}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="press-arrow press-arrow--row" type="button" aria-label="Next publication" onClick={nextSlide}>
          →
        </button>
      </div>
    </section>
  );
}