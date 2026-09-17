"use client";

import Link from "next/link";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Collection", href: "/#stay" },
  { label: "Journeys", href: "/gallery" },
  { label: "Wellness", href: "/#experiences" },
  { label: "Offers", href: "/#offers" },
  { label: "Sustainability", href: null },
  { label: "Blog", href: null },
  { label: "Careers", href: null },
  { label: "Gifts", href: null },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="fh-footer" id="contact">
      <div className="fh-footer-top">
        <div className="fh-footer-grid">
          <div className="fh-footer-brand-col">
            <span className="fh-footer-brand">FESTHER</span>
          </div>

          <div className="fh-footer-col">
            <span className="fh-footer-col-title">Explore</span>
            <ul className="fh-footer-links">
              {exploreLinks.map((link) =>
                link.href ? (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <span className="fh-footer-span">{link.label}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="fh-footer-col">
            <span className="fh-footer-col-title">Contact</span>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Address</span>
              <span className="fh-contact-value">Sri Lanka</span>
            </div>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Email</span>
              {/* TODO: add the hotel email here when available */}
              <span className="fh-contact-value fh-contact-value--muted">—</span>
            </div>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Contact number</span>
              {/* TODO: add the hotel phone number here when available */}
              <span className="fh-contact-value fh-contact-value--muted">—</span>
            </div>
            <Link className="fh-footer-link" href="/#contact">
              Reservations &amp; Enquiries
            </Link>
          </div>

          <div className="fh-footer-col fh-newsletter">
            <span className="fh-footer-col-title">Stay in Touch</span>
            <p>Subscribe for offers, journeys and the moments in between.</p>
            <form
              className="fh-newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reset();
              }}
            >
              <input
                className="fh-newsletter-input"
                type="email"
                name="email"
                placeholder="Enter your email here"
                aria-label="Email address"
              />
              <button className="fh-submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="fh-footer-awards">
        <div className="fh-footer-awards-inner">
          <img
            className="fh-award fh-award--conde"
            src="/images/awards/conde-nast-traveller.svg"
            alt="Condé Nast Traveller — Gold List 2024"
          />
          <img
            className="fh-award fh-award--kayak"
            src="/images/awards/kayak.svg"
            alt="KAYAK — Travel Awards"
          />
          <img
            className="fh-award fh-award--travelife"
            src="/images/awards/travelife.svg"
            alt="Travelife — Gold Certified for Accommodation Sustainability"
          />
          <img
            className="fh-award fh-award--unesco"
            src="/images/awards/unesco.svg"
            alt="UNESCO — Sustainable Travel Pledge"
          />
          <img
            className="fh-award fh-award--srilanka"
            src="/images/awards/sri-lanka-tourism.svg"
            alt="Sri Lanka Tourism Alliance — Love Sri Lanka"
          />
        </div>
      </div>

      <div className="fh-footer-bottom">
        <div className="fh-footer-bottom-inner">
          <div className="fh-footer-legals">
            <Link href="/#booking">Privacy Policy</Link>
            <span className="fh-footer-rule" aria-hidden="true">
              |
            </span>
            <Link href="/#contact">Terms &amp; Conditions</Link>
          </div>

          <div className="fh-footer-social">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>

          <p className="fh-footer-copy">© 2026 FESTHER · Every Moment, A Celebration</p>
        </div>
      </div>
    </footer>
  );
}