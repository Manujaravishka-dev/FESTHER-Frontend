import { GOOGLE_MAP_EMBED_URL } from "@/lib/contact";

/**
 * Full-width Google Maps section for the FESTHER location.
 */
export default function MapSection() {
  return (
    <section className="fh-map" aria-label="FESTHER location map">
      <div className="fh-map-frame">
        <iframe
          className="fh-map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.735266157159!2d80.9606941!3d6.8020263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae471f6fcb3b617%3A0x1e497b12faee8f5!2sStationHill!5e0!3m2!1sen!2slk!4v1791103415738!5m2!1sen!2slk"
          title="FESTHER location on Google Maps"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}