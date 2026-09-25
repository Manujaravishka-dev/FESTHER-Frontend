/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Photography is reused from the existing FESTHER library (local estate,
// press and destination images plus the established dining photograph already
// used across the dining catalogue) — no new artwork is introduced.
const services = [
  {
    title: "Festival",
    href: "/festival",
    src: "/festher-sunset-view.jpg",
    alt: "Guests sharing a golden-hour terrace gathering at FESTHER",
  },
  {
    title: "Event Planning",
    href: "/event-planning",
    src: "/edison/edison_1.png",
    alt: "An elegantly arranged celebration space prepared for guests",
  },
  {
    title: "Buffet Scene",
    href: "/buffet-scene",
    src: "/asapuwa/asapuwa_1.jpg",
    alt: "A generous spread of Sri Lankan dishes ready to share",
  },
  {
    title: "Tourism & Transport",
    href: "/tourism-transport",
    src: "/nine/nine_1.png",
    alt: "A train crossing the Nine Arch Bridge through the Sri Lankan hills",
  },
  {
    title: "Hotel & Villa",
    href: "/accommodation",
    src: "/festher-hero.jpg",
    alt: "An illuminated villa and garden at dusk",
  },
  {
    title: "Restaurant",
    href: "/dining",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&h=1050&q=80",
    alt: "A warmly lit restaurant set for dinner",
  },
];

export default function ServicesSection() {
  return (
    <section className="fh-services" aria-labelledby="fh-services-title">
      <div className="fh-services-head">
        <p className="gold-label">Explore Festhr</p>
        <h2 className="fh-services-title" id="fh-services-title">
          Experiences made for every moment.
        </h2>
        <p className="fh-services-sub">
          From celebrations and dining to stays and journeys, discover the experiences that make FESTHER special.
        </p>
      </div>

      <div className="fh-services-grid">
        {services.map((service) => (
          <Link key={service.title} className="fh-service" href={service.href}>
            <img className="fh-service-image" src={service.src} alt={service.alt} loading="lazy" />
            <span className="fh-service-shade" aria-hidden="true" />
            <span className="fh-service-name">
              <span className="fh-service-name-text">{service.title}</span>
              <span className="fh-service-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
