/**
 * Single source of truth for FESTHR contact details, the map embed and social
 * links. The Contact section, the Footer and the floating WhatsApp button all
 * read from here so nothing is duplicated across components.
 *
 * Values that are not confirmed yet are left as clearly editable
 * "ADD_..." placeholders. Replace them with the real details — the UI renders
 * a contact row (or a map) automatically once a value is filled in.
 */

export const WHATSAPP_NUMBER = "9476342913";

export const WHATSAPP_DISPLAY = "076 343 2913";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_INFO = {
  /** Replace with the real FESTHR address, e.g. "123 Temple Road, Galle 80000". */
  address: "ADD FESTHR ADDRESS",
  /** Replace with the reservations phone number, digits and spaces are fine. */
  phone: "ADD PHONE NUMBER",
  /** Replace with the FESTHR email address. */
  email: "ADD EMAIL ADDRESS",
  whatsapp: WHATSAPP_DISPLAY,
} as const;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const CONTACT_ROWS = [
  { key: "address", label: "Address", value: CONTACT_INFO.address, href: null },
  { key: "phone", label: "Phone", value: CONTACT_INFO.phone, href: telHref(CONTACT_INFO.phone) },
  { key: "whatsapp", label: "WhatsApp", value: CONTACT_INFO.whatsapp, href: WHATSAPP_URL, external: true },
  { key: "email", label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
] as const;

/** True once a placeholder has been replaced with a real value. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("ADD ");
}

/**
 * Google Maps embed URL used by the Contact page map.
 *
 * IMPORTANT: this is a TEMPORARY sample location (Colombo, Sri Lanka) so the
 * map UI can be verified. Replace it with the real FESTHER location later.
 *
 * It must be an EMBED url (`&output=embed`). A normal Google Maps page/share
 * url cannot be used in an iframe: it is served with `X-Frame-Options:
 * SAMEORIGIN` and the browser blocks it ("refused to connect").
 *
 * To swap in the real location, either:
 *   - use the place name / address:  https://www.google.com/maps?q=<address>&hl=en&z=14&output=embed
 *   - or use a place CID:             https://www.google.com/maps?cid=<decimal-cid>&hl=en&z=14&output=embed
 */
export const GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps?q=Colombo%2C+Sri+Lanka&hl=en&z=12&output=embed";

/** Social links are rendered only when a real URL is configured. */
export const SOCIAL_LINKS = [{ label: "WhatsApp", href: WHATSAPP_URL }];
