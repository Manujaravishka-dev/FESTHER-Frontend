import Link from "next/link";
import { CONTACT_ROWS, WHATSAPP_URL } from "@/lib/contact";
import { contactIcons } from "./contact-icons";

const icons = contactIcons;

export default function ContactSection() {
  return (
    <section className="fh-contact-section" id="contact" aria-labelledby="fh-contact-title">
      <div className="fh-contact-inner">
        <div className="fh-contact-info">
          <p className="fh-contact-eyebrow">Get in Touch</p>
          <h2 className="fh-contact-title" id="fh-contact-title">
            Contact FESTHR
          </h2>
          <p className="fh-contact-lead">
            Whether you&apos;re planning a stay, dining experience, event, festival or Sri Lankan journey, our team
            is here to help.
          </p>

          <div className="fh-contact-actions">
            <a className="fh-contact-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
            <Link className="fh-contact-btn fh-contact-btn--ghost" href="/dining">
              Explore Dining
            </Link>
          </div>
        </div>

        <ul className="fh-contact-rows">
          {CONTACT_ROWS.map((row) => (
            <li className="fh-contact-row" key={row.key}>
              <span className="fh-contact-row-icon">{icons[row.key]}</span>
              <span className="fh-contact-row-text">
                <span className="fh-contact-row-label">{row.label}</span>
                {row.href ? (
                  <a
                    className="fh-contact-row-value"
                    href={row.href}
                    {...("external" in row && row.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="fh-contact-row-value">{row.value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
