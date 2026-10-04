import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function LocationSection() {
  return (
    <>
      <section className="location-hero" aria-labelledby="location-title">
        <Navbar />
        <Image
          className="location-hero-image"
          src="/festher-sunset-view.jpg"
          alt="A garden terrace overlooking lush Sri Lankan hills at sunset"
          fill
          sizes="100vw"
          preload
        />
        <div className="location-hero-overlay" aria-hidden="true" />
        <h1 id="location-title">Location</h1>
      </section>

      <section className="location-intro" aria-labelledby="location-intro-title">
        <nav aria-label="Breadcrumb">
          <ol className="location-breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li aria-hidden="true">&bull;</li>
            <li aria-current="page">Location</li>
          </ol>
        </nav>
        <h2 id="location-intro-title">A peaceful Sri Lankan escape</h2>
        {/* Sample copy until the final FESTHR location is confirmed. */}
        <div className="location-description">
          <p>
            Discover a peaceful retreat surrounded by the natural beauty and timeless charm of
            Sri Lanka. FESTHR offers a relaxing setting where comfort, nature and authentic
            island hospitality come together.
          </p>
          <p>
            Perfectly positioned for exploring nearby attractions and experiencing the beauty
            of Sri Lanka, our location provides a calm escape while keeping memorable journeys
            within easy reach.
          </p>
        </div>
      </section>
    </>
  );
}
