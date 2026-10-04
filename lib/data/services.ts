export type ServiceImage = { src: string; alt: string; caption: string };
export type ServiceDetail = {
  title: string;
  heading: string;
  introduction: [string, string];
  hero: ServiceImage;
  gallery: ServiceImage[];
  details: { title: string; description: string }[];
};

// Editable sample content. Stock references already appear in the dining catalogue.
// Prefer local estate and destination photography wherever available.
const terrace = { src: "/festher-sunset-view.jpg", alt: "Garden terrace overlooking the hills at sunset", caption: "An evening in the hills" };
const estate = { src: "/festher-hero.jpg", alt: "Illuminated villa and garden at dusk", caption: "A welcoming setting" };
const table = { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80", alt: "An elegantly presented restaurant dining experience", caption: "Thoughtful presentation" };
const dining = { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80", alt: "Warmly lit restaurant with tables arranged for dining", caption: "Room to come together" };
const food = { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80", alt: "A selection of dishes arranged for a shared meal", caption: "Flavours to share" };
const dessert = { src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=80", alt: "A colourful selection of sweet treats", caption: "A sweet finish" };

export const services = {
  festival: {
    title: "Festival",
    heading: "Gather for moments that matter",
    introduction: [
      "Celebrate the spirit of togetherness at FESTHR, where Sri Lankan warmth and a peaceful island setting give every gathering its own character. From seasonal festivities to family milestones, there is room to make lasting memories.",
      "Share your ideas with our team and explore a celebration shaped around your guests, traditions and favourite flavours. Thoughtful details and relaxed hospitality set the tone for time well spent together.",
    ],
    hero: terrace,
    gallery: [estate, dining, food],
    details: [
      { title: "Private celebrations", description: "Bring family and friends together for the milestones worth sharing." },
      { title: "Cultural events", description: "Make space for meaningful traditions and the spirit of Sri Lanka." },
      { title: "Outdoor gatherings", description: "Explore a relaxed occasion framed by greenery and open skies." },
      { title: "Special occasions", description: "Discuss the personal touches that make the day feel yours." },
    ],
  },
  "event-planning": {
    title: "Event Planning",
    heading: "Your occasion, thoughtfully considered",
    introduction: [
      "From intimate weddings to private celebrations, FESTHR offers a welcoming starting point for occasions with a personal touch. An elegant setting, good food and warm hospitality bring people together naturally.",
      "Tell us about your vision, guest list and preferred date. Our team can help you explore the setting, dining and arrangements, with care for the details that make your occasion memorable.",
    ],
    hero: dining,
    gallery: [table, terrace, estate],
    details: [
      { title: "Weddings", description: "Imagine a personal celebration surrounded by the people closest to you." },
      { title: "Private events", description: "Shape birthdays, anniversaries and reunions around your guests." },
      { title: "Corporate gatherings", description: "Create time for conversation, shared meals and fresh perspectives." },
      { title: "Custom arrangements", description: "Talk through your preferred atmosphere, menu and finishing touches." },
    ],
  },
  "buffet-scene": {
    title: "Buffet Scene",
    heading: "A generous taste of togetherness",
    introduction: [
      "Discover the pleasure of a shared table at FESTHR. Inspired by Sri Lankan flavours and the joy of gathering, our dining approach brings variety, thoughtful presentation and warm hospitality to every occasion.",
      "Explore buffet ideas, familiar favourites and curated food experiences with our team. Whether you are planning a family meal or a larger celebration, discuss a selection suited to your guests and dietary preferences.",
    ],
    hero: food,
    gallery: [table, dessert, dining],
    details: [
      { title: "Sri Lankan cuisine", description: "Explore island flavours, fragrant spices and comforting favourites." },
      { title: "International selections", description: "Discuss a varied menu with something for every guest to enjoy." },
      { title: "Private dining", description: "Set aside time for an intimate meal and unhurried conversation." },
      { title: "Event catering", description: "Plan the food and presentation around the rhythm of your occasion." },
    ],
  },
  "tourism-transport": {
    title: "Tourism & Transport",
    heading: "Discover Sri Lanka at your own pace",
    introduction: [
      "Let FESTHR be the beginning of a Sri Lankan journey filled with green hills, local discoveries and memorable views. Explore nearby destinations or take a little longer to enjoy the island's changing landscapes.",
      "Speak with our team about your itinerary, arrival plans and transport needs. From a convenient transfer to a thoughtfully paced day out, we can help you explore options that fit the way you like to travel.",
    ],
    hero: { src: "/nine/nine_1.png", alt: "A blue train crossing Sri Lanka's Nine Arch Bridge among green hills", caption: "Journeys through the hills" },
    gallery: [
      { src: "/boburu/boburu_1.jpg", alt: "Bomburu Ella waterfall surrounded by greenery", caption: "Discover Bomburu Ella" },
      { src: "/horton_place/horton_2.png", alt: "The highland landscape of Horton Plains", caption: "Into the highlands" },
      terrace,
    ],
    details: [
      { title: "Airport transfers", description: "Discuss arrival times and transfer options for an easy start to your stay." },
      { title: "Local journeys", description: "Explore convenient transport for nearby visits and everyday plans." },
      { title: "Day trips", description: "Make room for waterfalls, hill-country scenery and unhurried discoveries." },
      { title: "Sri Lankan experiences", description: "Build a journey around the places and local culture that interest you." },
    ],
  },
} satisfies Record<string, ServiceDetail>;
