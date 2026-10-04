"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

// Every entry reuses an existing route — no duplicate pages created.
const serviceLinks = [
  { label: "Festival", href: "/festival" },
  { label: "Event Planning", href: "/event-planning" },
  { label: "Food Ordering Service", href: "/dining" },
  { label: "Tourism & Transport", href: "/tourism-transport" },
  { label: "Hotel & Villa", href: "/accommodation" },
  { label: "Event Management", href: "/buffet-scene" },
  { label: "Restaurant", href: "/dining" },
];

const packageLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Offers", href: "/offers" },
];

const trailingLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

function isServiceActive(pathname: string): boolean {
  return serviceLinks.some(({ href }) =>
    href === "/accommodation" ? pathname.startsWith(href) : pathname === href,
  );
}

function isPackagesActive(pathname: string): boolean {
  return packageLinks.some(({ href }) => pathname === href);
}

function Chevron({ className, size = 11 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 2.5 8 6l-3.5 3.5" />
    </svg>
  );
}

interface NavDropdownProps {
  label: string;
  active: boolean;
  open: boolean;
  links: { label: string; href: string }[];
  innerRef: RefObject<HTMLDivElement | null>;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
  onClose: () => void;
}

function NavDropdown({ label, active, open, links, innerRef, onEnter, onLeave, onToggle, onClose }: NavDropdownProps) {
  return (
    <div
      className={`fh-nav-item${open ? " fh-nav-item--open" : ""}`}
      ref={innerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className={`fh-nav-link fh-nav-services-btn${active ? " fh-nav-link--active" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        onClick={onToggle}
      >
        {label}
        <Chevron className="fh-nav-chevron" />
      </button>
      <div className="fh-nav-dropdown" role="menu" aria-label={label}>
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            role="menuitem"
            className="fh-nav-dropdown-link"
            onClick={onClose}
          >
            <span>{link.label}</span>
            <RightArrow />
          </Link>
        ))}
      </div>
    </div>
  );
}

interface PanelGroupProps {
  label: string;
  expanded: boolean;
  links: { label: string; href: string }[];
  onToggle: () => void;
  onNavigate: () => void;
}

function PanelGroup({ label, expanded, links, onToggle, onNavigate }: PanelGroupProps) {
  return (
    <li className="fh-nav-panel-word fh-nav-panel-word--group">
      <button
        type="button"
        className="fh-nav-panel-subbtn"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span>{label}</span>
        <Chevron className={`fh-nav-panel-chevron${expanded ? " is-open" : ""}`} size={14} />
      </button>
      <ul className={`fh-nav-panel-sub${expanded ? " is-open" : ""}`} aria-label={label}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} onClick={onNavigate}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

type OpenMenu = "services" | "packages" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [expandedMenu, setExpandedMenu] = useState<OpenMenu>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const packagesRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the desktop dropdown when navigating or clicking outside it.
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const insideServices = servicesRef.current?.contains(target);
      const insidePackages = packagesRef.current?.contains(target);
      if (!insideServices && !insidePackages) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const enterMenu = (menu: Exclude<OpenMenu, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const scheduleCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMenus = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  const toggleExpanded = (menu: Exclude<OpenMenu, null>) => {
    setExpandedMenu((current) => (current === menu ? null : menu));
  };

  const closePanel = () => setOpen(false);
  const servicesActive = isServiceActive(pathname);
  const packagesActive = isPackagesActive(pathname);

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

          <NavDropdown
            label="Services"
            active={servicesActive}
            open={openMenu === "services"}
            links={serviceLinks}
            innerRef={servicesRef}
            onEnter={() => enterMenu("services")}
            onLeave={scheduleCloseMenu}
            onToggle={() => toggleMenu("services")}
            onClose={closeMenus}
          />

          <NavDropdown
            label="Packages"
            active={packagesActive}
            open={openMenu === "packages"}
            links={packageLinks}
            innerRef={packagesRef}
            onEnter={() => enterMenu("packages")}
            onLeave={scheduleCloseMenu}
            onToggle={() => toggleMenu("packages")}
            onClose={closeMenus}
          />

          {trailingLinks.map((link) => (
            <Link
              key={link.label}
              className={`fh-nav-link${pathname === link.href ? " fh-nav-link--active" : ""}`}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="fh-nav-right">
          <button
            type="button"
            className="fh-nav-menu"
            aria-expanded={open}
            aria-controls="fh-nav-panel"
            aria-label="Open navigation menu"
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
        onClick={closePanel}
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
            onClick={closePanel}
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

        <ul className="fh-nav-panel-words" aria-label="Site navigation">
          <li className="fh-nav-panel-word">
            <Link href="/" onClick={closePanel}>
              Home
            </Link>
          </li>
          <li className="fh-nav-panel-word">
            <Link href="/about" onClick={closePanel}>
              About
            </Link>
          </li>
          <PanelGroup
            label="Services"
            expanded={expandedMenu === "services"}
            links={serviceLinks}
            onToggle={() => toggleExpanded("services")}
            onNavigate={closePanel}
          />
          <PanelGroup
            label="Packages"
            expanded={expandedMenu === "packages"}
            links={packageLinks}
            onToggle={() => toggleExpanded("packages")}
            onNavigate={closePanel}
          />
          {trailingLinks.map((link) => (
            <li key={link.label} className="fh-nav-panel-word">
              <Link href={link.href} onClick={closePanel}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="fh-nav-panel-book"
          href="/#booking"
          onClick={closePanel}
        >
          Book your stay
        </Link>
        <p className="fh-nav-panel-note">FESTHER · Sri Lanka</p>
      </aside>
    </header>
  );
}
