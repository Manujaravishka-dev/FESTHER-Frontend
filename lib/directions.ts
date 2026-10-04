/**
 * Google Maps directions helpers for the "Explore Nearby" carousel.
 *
 * No coordinates are hard-coded here: the project does not yet have verified
 * FESTHER or attraction coordinates (see `lib/contact.ts` — the map embed is
 * still a temporary sample), so directions use place-name queries, which
 * Google Maps resolves. When exact coordinates are confirmed, replace the
 * origin query and per-attraction `destinationQuery` values with them.
 */

/** Origin for every route: the FESTHER property — never the user's location. */
export const FESTHER_ORIGIN_QUERY = "FESTHER Sri Lanka";

/**
 * Universal Google Maps directions URL (driving) from FESTHER to the given
 * destination query. Opened in a new tab by the caller.
 */
export function directionsUrl(destinationQuery: string): string {
  const params = new URLSearchParams({
    api: "1",
    origin: FESTHER_ORIGIN_QUERY,
    destination: destinationQuery,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
