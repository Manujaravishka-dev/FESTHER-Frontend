"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { motion } from "framer-motion";
import { useHorizontalScroll } from "./useHorizontalScroll";
import { directionsUrl } from "@/lib/directions";
import "./horizontal-scroll.css";

interface Article {
  cat: string[];
  title: string;
  description: string;
  location: string;
  // Google Maps place query for directions from FESTHER. Well-known place
  // names only — never invented coordinates.
  destinationQuery: string;
  // Optional — populated only with verified values. Never invent distances.
  distance?: string;
  travelTime?: string;
  date: string;
  link: string;
  imgs: string[];
}

const articles: Article[] = [
  {
    cat: ["Experiences", "Journeys", "Sri Lanka"],
    title: "Discover the Timeless Beauty of Sri Lanka",
    description:
      "Ancient cities, misted hills and golden shores — journey through an island where every road leads somewhere unforgettable.",
    location: "Cultural Triangle",
    destinationQuery: "Sigiriya Rock Fortress, Sri Lanka",
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
    description:
      "From fragrant spices to ocean-fresh catch, savour island flavours thoughtfully crafted into every plate at our table.",
    location: "Southern Coast",
    destinationQuery: "Galle Fort, Sri Lanka",
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
    description:
      "Quiet mornings, cool highland air and unhurried rituals — space to rest, restore and simply be.",
    location: "Hill Country",
    destinationQuery: "Horton Plains National Park, Sri Lanka",
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
    description:
      "Weddings and milestones beneath open skies — gather the people you love for a day that feels entirely yours.",
    location: "FESTHER Estate",
    destinationQuery: "Kandy, Sri Lanka",
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
    description:
      "Slow mornings, garden suites and room to roam — stays shaped around families, couples and friends alike.",
    location: "Ella Highlands",
    destinationQuery: "Nine Arch Bridge, Ella, Sri Lanka",
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
    description:
      "Lush gardens, mindful details and warm welcomes — experience hospitality rooted in the island itself.",
    location: "Island Gardens",
    destinationQuery: "Sinharaja Forest Reserve, Sri Lanka",
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
  { key: "wallpaper", logo: "/images/press/wallpaper.svg", name: "Wallpaper*", note: "A remarkable preservation story" },
  { key: "forbes", logo: "/images/press/forbes.svg", name: "Forbes", note: "5 boutique luxury hotels you can't miss in Sri Lanka" },
];

const ARTICLE_AUTO_MS = 6000;
const MARQUEE_COPIES = 3;
const MARQUEE_SECONDS = 32;

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

  const swipeX = useRef<number | null>(null);
  const wheelLock = useRef(0);
  const { ref, dragging, onPointerDown, onPointerMove, endDrag } =
    useHorizontalScroll();

  useEffect(() => {
    const measure = () => setPerView(windowCount());
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const articlePrev = useCallback(
    () => setIndex((v) => (v - 1 + articles.length) % articles.length),
    [],
  );
  const articleNext = useCallback(
    () => setIndex((v) => (v + 1) % articles.length),
    [],
  );

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

  // Touchpad two-finger horizontal swipe navigates the featured article
  // without hijacking vertical page scroll: only dominant horizontal
  // deltas trigger navigation, vertical deltas are ignored entirely.
  const onArticleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - wheelLock.current < 900) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    wheelLock.current = now;
    if (e.deltaX > 0) articleNext();
    else articlePrev();
  };

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % articles.length), ARTICLE_AUTO_MS);
    return () => clearInterval(t);
  }, [index]);

  const goToCategory = useCallback((cat: string) => {
    const i = articles.findIndex((item) => item.cat.includes(cat));
    if (i >= 0) setIndex(i);
  }, []);

  const a = articles[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="festher-press" id="press">
      <div className="press-explore-head">
        <p className="press-explore-eyebrow">Discover Sri Lanka</p>
        <h2 className="press-explore-title">Explore Nearby</h2>
        <p className="press-explore-desc">
          Discover remarkable attractions, cultural landmarks and scenic destinations within easy reach of
          FESTHER, perfect for memorable day trips and effortless exploration during your stay.
        </p>
      </div>
      <div
        className="press-article"
        onPointerDown={onArticleDown}
        onPointerUp={onArticleUp}
        onPointerCancel={onArticleUp}
        onWheel={onArticleWheel}
        style={{ touchAction: "pan-x pan-y" }}
      >
        <motion.div
          key={index}
          className="press-feature-slide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="press-feature-media">
            <div className="press-media-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.imgs[0]} alt={a.title} draggable={false} />
            </div>
            <div className="press-media-sub">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.imgs[1]} alt="" aria-hidden="true" draggable={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.imgs[2]} alt="" aria-hidden="true" draggable={false} />
            </div>
          </div>
          <div className="press-feature-body">
            <p className="article-cats">
              {a.cat.map((c) => (
                <a
                  key={c}
                  href="#press"
                  onClick={(e) => {
                    e.preventDefault();
                    goToCategory(c);
                  }}
                >
                  {c}
                </a>
              ))}
            </p>
            <h3>{a.title}</h3>
            <p className="press-desc">{a.description}</p>
            <p className="press-meta">
              <span>{a.location}</span>
              <i aria-hidden="true">•</i>
              {a.distance && a.travelTime ? (
                <>
                  <span>{a.distance} from FESTHER</span>
                  <i aria-hidden="true">•</i>
                  <span>Approx. {a.travelTime}</span>
                  <i aria-hidden="true">•</i>
                </>
              ) : null}
              <span>{a.date}</span>
            </p>
            <a
              className="press-read"
              href={directionsUrl(a.destinationQuery)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions from FESTHER to ${a.title}`}
            >
              Get Directions
              <span className="press-read-arrow" aria-hidden="true">→</span>
            </a>
            <div className="press-nav">
              <span className="press-count">
                <strong>{pad(index + 1)}</strong> / {pad(articles.length)}
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
          </div>
        </motion.div>
      </div>

      <div className="press-carousel">
        <div
          className={`press-carousel-viewport horizontal-scroll${dragging ? " is-dragging" : ""}`}
          ref={ref}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          <div
            className="press-carousel-track press-carousel-track--native press-marquee-track"
            style={
              {
                "--marquee-shift": `-${(100 * press.length) / perView}%`,
                animationDuration: `${MARQUEE_SECONDS}s`,
              } as CSSProperties
            }
          >
            {Array.from({ length: MARQUEE_COPIES }, () => press)
              .flat()
              .map((p, i) => (
                <div
                  className="press-item"
                  key={`${p.key}-${i}`}
                  aria-hidden={i >= press.length ? true : undefined}
                  style={{ flex: `0 0 ${100 / perView}%` }}
                >
                  <span className="press-logo-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={`press-logo press-logo--${p.key}`} src={p.logo} alt={p.name} draggable={false} />
                  </span>
                  <p>{p.note}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
