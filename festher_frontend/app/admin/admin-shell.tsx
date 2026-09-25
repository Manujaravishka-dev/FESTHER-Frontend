"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ToastProvider, useToast } from "./components/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const iconProps = { className: "adm-nav-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" rx="0" />
        <rect x="14" y="3" width="7" height="7" rx="0" />
        <rect x="3" y="14" width="7" height="7" rx="0" />
        <rect x="14" y="14" width="7" height="7" rx="0" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: (
      <svg {...iconProps}>
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" />
      </svg>
    ),
  },
  {
    label: "Restaurant Orders",
    href: "/admin/orders",
    icon: (
      <svg {...iconProps}>
        <path d="M6 2h12v20L12 17l-6 5V2z" />
      </svg>
    ),
  },
  {
    label: "Offers",
    href: "/admin/offers",
    icon: (
      <svg {...iconProps}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/gallery": "Gallery",
  "/admin/comments": "Comments",
  "/admin/orders": "Restaurant Orders",
  "/admin/offers": "Offers",
};

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const title = pageTitles[pathname] ?? "Administration";

  return (
    <div className="adm-layout">
      <aside className={`adm-sidebar${menuOpen ? " adm-sidebar--open" : ""}`}>
        <div className="adm-brand">
          <span className="adm-brand-eyebrow">FESTHER Estate</span>
          <span className="adm-brand-name">FESTHER</span>
          <span className="adm-sidebar-note">Administration · UI preview</span>
        </div>
        <nav className="adm-sidebar-nav" aria-label="Admin navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`adm-nav-item${active ? " adm-nav-item--active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="adm-sidebar-foot">
          <button type="button" className="adm-logout" onClick={() => setLogoutOpen(true)}>
            <svg {...iconProps}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span>Logout</span>
          </button>
          <p className="adm-sidebar-note">
            This is the UI-only phase. Data is local mock data until the API is connected.
          </p>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="adm-scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <h1 className="adm-page-title">FESTHER · {title}</h1>
          <div className="adm-topbar-right">
            <Link
              className="adm-view-site"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              View site ↗
            </Link>
            <span className="adm-avatar" aria-hidden="true">
              A
            </span>
          </div>
        </header>
        <main className="adm-content">{children}</main>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Log out"
        confirmLabel="Log out"
        message="This will end your session and return to the FESTHER public website."
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          setMenuOpen(false);
          toast("Signed out.");
          router.push("/");
        }}
      />
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}