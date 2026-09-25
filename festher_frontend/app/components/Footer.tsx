"use client";

import Link from "next/link";
import Image from "next/image";
import footerLogo from "@/public/f.png";
import { usePathname } from "next/navigation";
import { CONTACT_INFO, WHATSAPP_URL } from "@/lib/contact";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Offers", href: "/offers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const experienceLinks = [
  { label: "Festival", href: null },
  { label: "Event Planning", href: null },
  { label: "Buffet Scene", href: null },
  { label: "Tourism & Transport", href: null },
  { label: "Hotel & Villa", href: "/#stay" },
  { label: "Restaurant", href: "/#dining" },
];

/**
 * FESTHER social profiles. No confirmed profile URLs exist yet, so the links
 * are left empty on purpose — add each real URL here and the icon becomes a
 * live link automatically (no invented destinations).
 */
const socialLinks = [
  {
    label: "Facebook",
    href: "",
    icon: (
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    ),
  },
  {
    label: "Instagram",
    href: "",
    icon: (
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.741 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.9.419.418.679.816.9 1.378.164.422.36 1.057.412 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.8 3.8 0 0 1-.9 1.382 3.739 3.739 0 0 1-1.38.9c-.42.164-1.065.36-2.235.412-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.702 3.702 0 0 1-1.379-.9 3.675 3.675 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.418-.419.81-.689 1.379-.9.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    ),
  },
  {
    label: "TikTok",
    href: "",
    icon: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="fh-footer">
      <div className="fh-footer-top">
        <div className="fh-footer-grid">
          <div className="fh-footer-brand-col">
            <span className="fh-footer-brand">FESTHER</span>
            <Image
              className="fh-footer-logo"
              src="/f.png"
              width={footerLogo.width}
              height={footerLogo.height}
              alt="FESTHER logo"
              unoptimized
            />
            <div className="fh-footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href || undefined}
                  aria-label={social.label}
                  title={social.label}
                  target={social.href ? "_blank" : undefined}
                  rel={social.href ? "noopener noreferrer" : undefined}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="fh-footer-col">
            <span className="fh-footer-col-title">Explore</span>
            <ul className="fh-footer-links">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="fh-footer-col">
            <span className="fh-footer-col-title">Experiences</span>
            <ul className="fh-footer-links">
              {experienceLinks.map((link) =>
                link.href ? (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <span className="fh-footer-span">{link.label}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="fh-footer-col">
            <span className="fh-footer-col-title">Contact</span>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Address</span>
              <span className="fh-contact-value">{CONTACT_INFO.address}</span>
            </div>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Phone</span>
              <a className="fh-contact-value" href={`tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, "")}`}>
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="fh-contact-item">
              <span className="fh-contact-label">Email</span>
              <a className="fh-contact-value" href={`mailto:${CONTACT_INFO.email}`}>
                {CONTACT_INFO.email}
              </a>
            </div>
            <div className="fh-contact-item">
              <span className="fh-contact-label">WhatsApp</span>
              <a
                className="fh-contact-value"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.whatsapp}
              </a>
            </div>
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
          <p className="fh-footer-copy">© 2026 FESTHER. All rights reserved.</p>
          <p className="fh-footer-copy">Sri Lanka</p>
        </div>
      </div>

      <div className="fh-footer-credit">
        <p className="fh-footer-credit-text">
          Developed by{" "}
          <a href="https://www.corexitsolutions.com" target="_blank" rel="noopener noreferrer">
            www.corexitsolutions.com
          </a>
        </p>
      </div>
    </footer>
  );
}
