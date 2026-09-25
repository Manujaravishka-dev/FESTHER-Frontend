"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

const articles = [
  {
    cat: ["Experiences", "Journeys", "Sri Lanka"],
    title: "Discover the Timeless Beauty of Sri Lanka",
    date: "17 Sep 2026",
    link: "/about",
    imgs: [
      "/boburu/boburu_1.jpg",
      "/boburu/boburu_2.jpg",
      "/boburu/boburu_3.jpg",
    ],
  },
  {
    cat: ["Culinary", "Experiences", "Dining"],
    title: "A Taste of Sri Lanka: Flavours Inspired by the Island",
    date: "08 Sep 2026",
    link: "/#dine",
    imgs: [
      "/asapuwa/asapuwa_1.jpg",
      "/asapuwa/asapuwa_2.jpg",
      "/asapuwa/asapuwa_3.jpg",
    ],
  },
  {
    cat: ["Wellbeing", "Wellness", "Experiences"],
    title: "Slow Down, Breathe Deeply and Rediscover Yourself",
    date: "30 Aug 2026",
    link: "/#experiences",
    imgs: [
      "/horton_place/horton_3.png",
      "/horton_place/horton_2.png",
      "/horton_place/horton_4.png",
    ],
  },
  {
    cat: ["Celebrations", "Weddings", "Experiences"],
    title: "Celebrate Your Story in the Heart of Sri Lanka",
    date: "18 Aug 2026",
    link: "/#booking",
    imgs: [
       "/edison/edison_1.png",
      "/edison/edison_2.png",    
      "/edison/edison_3.png",
    ],
  },
  {
    cat: ["Family Travel", "Luxury Stays", "Experiences"],
    title: "Unforgettable Stays Made for Every Kind of Escape",
    date: "05 Aug 2026",
    link: "/#stay",
    imgs: [
      "/nine/nine_1.png",
      "/nine/nine_2.png",
      "/nine/nine_5.png",
    ],
  },
  {
    cat: ["Nature", "Sustainability", "Wellbeing"],
    title: "Where Nature and Thoughtful Hospitality Come Together",
    date: "22 Jul 2026",
    link: "/#stay",
    imgs: [
      "/flying/flying_2.png",
      "/flying/flying_1.png",
      "/flying/flying_3.png",
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
const ARTICLE_AUTO_MS = 6000;
const SNAP_MS = 600;
const DRIFT_MS = 3200;
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

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
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const itemPxRef = useRef(0);
  const copyPxRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef(false);
  const hoverRef = useRef(false);
  const startRef = useRef({ x: 0, offset: 0 });
  const swipeX = useRef<number | null>(null);
  const snapRef = useRef<ReturnType<typeof animate> | null>(null);

  const scroll = useMotionValue(0);
  const trackX = useTransform(scroll, (v) => -v);

  useEffect(() => {
    const measure = () => {
      const p = windowCount();
      setPerView(p);
      if (viewportRef.current) {
        const item = viewportRef.current.clientWidth / p;
        itemPxRef.current = item;
        copyPxRef.current = item * COUNT;
        velRef.current = item / DRIFT_MS;
        if (!initRef.current) {
          initRef.current = true;
          scroll.set(copyPxRef.current);
        }
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scroll]);

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      const s = scroll.get();
      const cp = copyPxRef.current;
      if (cp > 0) {
        if (s >= 2 * cp) scroll.set(s - cp);
        else if (s < cp) scroll.set(s + cp);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [scroll]);

  useAnimationFrame((_, delta) => {
    if (hoverRef.current || dragRef.current || snapRef.current) return;
    scroll.set(scroll.get() + velRef.current * Math.min(delta, 64));
  });

  const settleTo = useCallback(
    (steps: number, duration: number) => {
      const item = itemPxRef.current || 1;
      const banded = ((steps - COUNT) % COUNT + COUNT) % COUNT + COUNT;
      const target = banded * item;
      const done = (controls: ReturnType<typeof animate>) => {
        if (snapRef.current === controls) {
          snapRef.current = null;
          scroll.set(target);
        }
      };
      if (snapRef.current) {
        const prev = snapRef.current;
        snapRef.current = null;
        prev.stop();
      }
      const controls = animate(scroll, target, { duration, ease: EASE });
      snapRef.current = controls;
      controls.then(() => done(controls));
    },
    [scroll],
  );

  const pressStep = useCallback(
    (delta: number) => {
      const item = itemPxRef.current || 1;
      settleTo(Math.round(scroll.get() / item) + delta, SNAP_MS / 1000);
    },
    [scroll, settleTo],
  );

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

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % articles.length), ARTICLE_AUTO_MS);
    return () => clearInterval(t);
  }, [index]);

  const arrowPrev = () => pressStep(-1);
  const arrowNext = () => pressStep(1);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (snapRef.current) {
      snapRef.current.stop();
      snapRef.current = null;
    }
    dragRef.current = true;
    startRef.current = { x: e.clientX, offset: scroll.get() };
    setDragging(true);
    try {
      viewportRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    scroll.set(startRef.current.offset - (e.clientX - startRef.current.x));
  };

  const onPointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = false;
    const item = itemPxRef.current || 1;
    const offset = scroll.get();
    setDragging(false);
    settleTo(Math.round(offset / item), 0.3);
  };

  const a = articles[index];

  return (
    <section className="festher-press" id="press">
      <div
        className="press-article"
        onPointerDown={onArticleDown}
        onPointerUp={onArticleUp}
        onPointerCancel={onArticleUp}
        style={{ touchAction: "pan-y" }}
      >
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
        <span className="press-line" aria-hidden="true">
          <i style={{ width: `${((index + 1) / articles.length) * 100}%` }} />
        </span>
        <button className="press-arrow" type="button" aria-label="Previous article" onClick={articlePrev}>
          ←
        </button>
        <button className="press-arrow" type="button" aria-label="Next article" onClick={articleNext}>
          →
        </button>
      </div>

      <div className="press-carousel">
        <button className="press-arrow press-arrow--row" type="button" aria-label="Previous publication" onClick={arrowPrev}>
          ←
        </button>
        <div
          className={`press-carousel-viewport${dragging ? " is-dragging" : ""}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => {
            hoverRef.current = true;
          }}
          onPointerLeave={() => {
            hoverRef.current = false;
          }}
        >
          <motion.div className="press-carousel-track" style={{ x: trackX }}>
            {SLIDES.map((p, i) => (
              <div className="press-item" key={`${p.key}-${i}`} style={{ flex: `0 0 ${100 / perView}%` }}>
                <span className="press-logo-wrapper">
                  <img className={`press-logo press-logo--${p.key}`} src={p.logo} alt={p.name} draggable={false} />
                </span>
                <p>{p.note}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <button className="press-arrow press-arrow--row" type="button" aria-label="Next publication" onClick={arrowNext}>
          →
        </button>
      </div>
    </section>
  );
}