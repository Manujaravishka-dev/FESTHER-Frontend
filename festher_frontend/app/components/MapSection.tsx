import { GOOGLE_MAP_EMBED_URL } from "@/lib/contact";

/**
 * Full-width Google Maps section, rendered between the Contact section and
 * the footer. The embed URL lives in `lib/contact.ts` (a temporary Colombo
 * sample until the final FESTHER location is confirmed) and must always use
 * the `&output=embed` form — a normal Google Maps page URL is served with
 * `X-Frame-Options` and the browser refuses to display it in an iframe.
 */
export default function MapSection() {
  return (
    <section className="fh-map" aria-label="FESTHER location map">
      <div className="fh-map-frame">
        <iframe
          className="fh-map-iframe"
          src={GOOGLE_MAP_EMBED_URL}
          title="FESTHER location on Google Maps"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
