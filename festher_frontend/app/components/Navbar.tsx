"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Our Collection", href: "/#stay", plus: true },
  { label: "Journeys", href: "/about" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Offers", href: "/#offers", plus: true },
  { label: "Gallery", href: "/gallery" },
];

const panelLinks = [
  { label: "Home", href: "/" },
  { label: "Our Collection", href: "/#stay" },
  { label: "Journeys", href: "/about" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Offers", href: "/#offers" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <header className="fh-nav">
      <div className="fh-nav-inner">
        <div className="fh-nav-left">
          <Link className="fh-nav-mark" href="/" aria-label="FESTHER — home">
            F
          </Link>
          <nav className="fh-nav-links" aria-label="Primary navigation">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                className={`fh-nav-link${pathname === link.href ? " fh-nav-link--active" : ""}`}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                {link.plus ? (
                  <span className="fh-nav-plus" aria-hidden="true">
                    +
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <Link className="fh-nav-brand" href="/">
          FESTHER
        </Link>

        <div className="fh-nav-right">
          <button
            type="button"
            className="fh-nav-menu"
            aria-expanded={open}
            aria-controls="fh-nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="fh-nav-burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="fh-nav-menu-label">Menu</span>
          </button>
          <Link className="fh-nav-book" href="/#booking">
            Book
          </Link>
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
          <span className="fh-nav-panel-mark" aria-hidden="true">
            F
          </span>
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

        <nav className="fh-nav-panel-links" aria-label="Site navigation">
          {panelLinks.map((link) => (
            <Link
              key={link.label}
              className={`fh-nav-panel-link${pathname === link.href ? " fh-nav-panel-link--active" : ""}`}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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