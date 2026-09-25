"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Offers", href: "/offers" },
  { label: "Gallery", href: "/gallery" },
];

const festherWords: { label: string; href?: string }[] = [
  { label: "Festival", href: "/festival" },
  { label: "Event Planning", href: "/event-planning" },
  { label: "Buffet Scene", href: "/buffet-scene" },
  { label: "Tourism & Transport", href: "/tourism-transport" },
  { label: "Hotel & Villa", href: "/accommodation" },
  { label: "Restaurant", href: "/dining" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [overHero, setOverHero] = useState(false);
  const [pinned, setPinned] = useState(false);

  // The navbar only overlays transparently when it actually sits inside a hero
  // section. The boundary is measured from the hero element itself, so the
  // switch happens correctly at any viewport height.
  useIsomorphicLayoutEffect(() => {
    const nav = navRef.current;
    const parent = nav?.parentElement ?? null;
    const hero = parent
      ? parent.tagName === "SECTION"
        ? parent
        : parent.querySelector("[class*='hero']")
      : null;

    if (!hero) {
      const onScroll = () => setPinned(window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    setOverHero(true);
    setPinned(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        const past = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        setOverHero(!past);
        setPinned(past);
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fh-nav${overHero ? " fh-nav--over-hero" : ""}${pinned ? " fh-nav--pinned" : ""}`}
      ref={navRef}
    >
      <div className="fh-nav-inner">
        <div className="fh-nav-left">
          <Link className="fh-nav-brand" href="/" aria-label="FESTHER — home">
            <span className="fh-nav-brand-name">FESTHR</span>
            <span className="fh-nav-brand-sub">Sri Lanka</span>
          </Link>
        </div>

        <nav className="fh-nav-links" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              className={`fh-nav-link${pathname === link.href ? " fh-nav-link--active" : ""}`}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className={`fh-nav-link${pathname === "/contact" ? " fh-nav-link--active" : ""}`}
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>

        <div className="fh-nav-right">
          <button
            type="button"
            className="fh-nav-menu"
            aria-expanded={open}
            aria-controls="fh-nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="fh-nav-menu-text">Menu</span>
            <span className="fh-nav-burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fh-nav-overlay${open ? " fh-nav-overlay--open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="fh-nav-panel"
        className={`fh-nav-panel${open ? " fh-nav-panel--open" : ""}`}
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="fh-nav-panel-head">
          <span className="fh-nav-panel-brand">FESTHR</span>
          <button
            type="button"
            className="fh-nav-panel-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        <ul className="fh-nav-panel-words" aria-label="What FESTHR stands for">
          {festherWords.map((word) => (
            <li key={word.label} className="fh-nav-panel-word">
              {word.href ? (
                <Link href={word.href} onClick={() => setOpen(false)}>
                  {word.label}
                </Link>
              ) : (
                word.label
              )}
            </li>
          ))}
        </ul>

        <Link
          className="fh-nav-panel-book"
          href="/#booking"
          onClick={() => setOpen(false)}
        >
          Book your stay
        </Link>
        <p className="fh-nav-panel-note">FESTHER · Sri Lanka</p>
      </aside>
    </header>
  );
}