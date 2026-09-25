// DEMO DATA — shared accommodation catalogue (single source of truth).
// Backend-ready: when NEXT_PUBLIC_API_URL is configured the pages load live data
// from the API; until then these local records drive the site.
import type { Accommodation } from "../types";

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&h=${h}&fit=crop&auto=format`;

export const accommodations: Accommodation[] = [
  {
    id: "garden-suite",
    slug: "garden-suite",
    name: "Garden Suite",
    roomSize: "55 sqm",
    shortDescription:
      "Spacious, high-ceilinged accommodation with a four-poster king-size bed and a private terrace over the tropical gardens.",
    fullDescription:
      "The Garden Suite is our signature escape — generous, high-ceilinged rooms finished in warm local wood and linen, opening onto a private terrace where the estate gardens drift past your door. Slow mornings begin here: breakfast on the verandah, the pool a short wander away, and evenings that belong entirely to you. The suite is equally graceful for two or for quiet solitude, with a king-size four-poster bed, deep bathtubs and the island breeze kept just right by air conditioning.",
    heroImage: "/images/accommodation/room-1.jpg",
    images: [
      "/images/accommodation/room-1.jpg",
      u("photo-1590490360182-c33d57733427", 1200, 900),
      u("photo-1618773928121-c32242e63f39", 1200, 900),
      u("photo-1582719471384-894fbb16e074", 1200, 1600),
    ],
    amenities: [
      ["breakfast", "Breakfast Included"],
      ["veranda", "Private Verandah"],
      ["garden", "Garden View"],
      ["air", "Air Conditioning"],
    ],
    capacity: 2,
    bedType: "King-size four-poster bed",
    highlights: [
      "Private verandah with direct garden views",
      "Four-poster king-size bed with fine linen",
      "Walk-in rainfall shower and deep bathtub",
      "Breakfast served on the verandah each morning",
    ],
    details: [
      ["Room size", "55 sqm"],
      ["Sleeps", "Up to 2 guests"],
      ["Bed", "King-size four-poster"],
      ["Check-in / Check-out", "14:00 / 11:00"],
    ],
  },
  {
    id: "family-suite",
    slug: "family-suite",
    name: "Family Suite",
    roomSize: "65 sqm",
    shortDescription:
      "A spacious, family-oriented suite with elegant interiors, comfortable sleeping areas and peaceful tropical surroundings.",
    fullDescription:
      "Built for relaxed family stays, the Family Suite pairs generous living space with a calm, considered layout — a comfortable king bed for the grown-ups, a separate sleeping area for children, and room enough for everyone to find their own corner. The gardens are outside every window, the pool is a short walk away, and the team is always close at hand when little travellers need anything at all.",
    heroImage: "/images/accommodation/room-2.jpg",
    images: [
      "/images/accommodation/room-2.jpg",
      u("photo-1571003123894-1f0594d2b5d9", 1200, 900),
      u("photo-1416879595882-3373a0480b5b", 1200, 900),
      u("photo-1424847651672-bf20a4b0982b", 1200, 900),
    ],
    amenities: [
      ["breakfast", "Breakfast Included"],
      ["family", "Family Friendly"],
      ["garden", "Garden View"],
      ["air", "Air Conditioning"],
    ],
    capacity: 4,
    bedType: "King bed + twin sleeping area",
    highlights: [
      "Separate living and sleeping areas",
      "Comfortable king bed plus twin bed for children",
      "Garden-facing windows throughout",
      "Mid-day replenishment and child-friendly extras on request",
    ],
    details: [
      ["Room size", "65 sqm"],
      ["Sleeps", "Up to 4 guests"],
      ["Bed", "King + twin"],
      ["Check-in / Check-out", "14:00 / 11:00"],
    ],
  },
  {
    id: "deluxe-room",
    slug: "deluxe-room",
    name: "Deluxe Room",
    roomSize: "45 sqm",
    shortDescription:
      "An elegant, comfortable retreat combining contemporary comfort with warm Sri Lankan character and tranquil views.",
    fullDescription:
      "The Deluxe Room pairs contemporary comfort with warm local character — clean lines, natural materials and quiet views of the estate. It is an effortless base for exploring the island during the day and unwinding at night, with a plush king bed, a calm seating corner and everything kept at the right temperature by air conditioning.",
    heroImage: "/images/accommodation/room-3.jpg",
    images: [
      "/images/accommodation/room-3.jpg",
      u("photo-1611892440504-42a792e24d32", 1200, 900),
      u("photo-1424847651672-bf20a4b0982b", 1200, 900),
      u("photo-1590490360182-c33d57733427", 1200, 900),
    ],
    amenities: [
      ["breakfast", "Breakfast Included"],
      ["bed", "King Bed"],
      ["garden", "Garden View"],
      ["air", "Air Conditioning"],
    ],
    capacity: 2,
    bedType: "King-size bed",
    highlights: [
      "Plush king-size bed with crisp linen",
      "Seating corner for slow afternoons",
      "Garden-facing windows",
      "Rainfall shower with island toiletries",
    ],
    details: [
      ["Room size", "45 sqm"],
      ["Sleeps", "Up to 2 guests"],
      ["Bed", "King-size"],
      ["Check-in / Check-out", "14:00 / 11:00"],
    ],
  },
  {
    id: "premier-suite",
    slug: "premier-suite",
    name: "Premier Suite",
    roomSize: "70 sqm",
    shortDescription:
      "A spacious premium suite created for quiet luxury, generous living space and a relaxing tropical hotel experience.",
    fullDescription:
      "The Premier Suite is quiet luxury at its most generous — a wide-open living space, a sumptuous bedroom and a private terrace that feels like the whole garden belongs to you. It is our largest accommodation, made for long lunches, unhurried evenings and the indulgent, restorative pace the island does so well. Every stay is supported by butler-style attention and breakfast brought to your terrace each morning.",
    heroImage: "/images/accommodation/room-4.jpg",
    images: [
      "/images/accommodation/room-4.jpg",
      u("photo-1512917774080-9991f1c4c750", 1200, 900),
      u("photo-1517248135467-4c7edcad34c4", 1200, 900),
      u("photo-1600585154340-be6161a56a0c", 1200, 900),
    ],
    amenities: [
      ["breakfast", "Breakfast Included"],
      ["veranda", "Private Terrace"],
      ["garden", "Garden View"],
      ["air", "Air Conditioning"],
    ],
    capacity: 3,
    bedType: "King-size bed + lounge sofa bed",
    highlights: [
      "The estate's largest living space",
      "Private terrace with sweeping garden views",
      "Breakfast served on your terrace",
      "Dedicated butler-style service",
    ],
    details: [
      ["Room size", "70 sqm"],
      ["Sleeps", "Up to 3 guests"],
      ["Bed", "King + sofa bed"],
      ["Check-in / Check-out", "14:00 / 11:00"],
    ],
  },
];