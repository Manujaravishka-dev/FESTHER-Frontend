import Link from "next/link";

const imgs = [
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&h=1400&q=80",
    alt: "A spread of fresh island dishes at FESTHER",
  },
  {
    src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&h=1400&q=80",
    alt: "Dining beneath the tropical sky at FESTHER",
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&h=1400&q=80",
    alt: "A dessert shaped by the tropics at FESTHER",
  },
];

export default function DiningTaste() {
  return (
    <section className="dining-taste-section" id="dine">
      <div className="dining-taste-panel" id="dining">
        <div className="dining-taste-copy">
          <h2>A Taste of Sri Lanka</h2>
          <p>
            Discover the warmth of Sri Lankan dining through fresh local ingredients, timeless island
            flavours and thoughtfully prepared dishes, served in a relaxed setting inspired by nature.
          </p>
          <Link href="/dining" className="dining-taste-explore">
            Explore Dining →
          </Link>
        </div>

        <div className="dining-taste-images">
          {imgs.map((img) => (
            <div className="dining-taste-image" key={img.src}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}