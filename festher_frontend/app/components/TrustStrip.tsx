"use client";

const trustItems = [
  { label: "Tripadvisor", src: "/images/trust/tripadvisor.svg" },
  { label: "Booking.com", src: "/images/trust/booking.svg" },
  { label: "Agoda", src: "/images/trust/agoda.svg" },
  { label: "Google Reviews", src: "/images/trust/google-reviews.svg" },
  { label: "Sri Lanka Tourism", src: "/images/awards/sri-lanka-tourism.svg" },
];

export default function TrustStrip() {
  return (
    <section className="fh-trust-strip">
      <div className="fh-trust-strip-inner">
        <h3 className="fh-trust-strip-title">Discover &amp; Travel</h3>
        <div className="fh-trust-strip-logos">
          {trustItems.map((item) => (
            <span key={item.label} className="fh-trust-strip-item">
              <img src={item.src} alt={item.label} loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
