/* eslint-disable @next/next/no-img-element -- Supports existing project stock photography references. */
import Link from "next/link";
import type { ServiceDetail, ServiceImage } from "@/lib/data/services";
import Navbar from "./Navbar";
import ContactSection from "./ContactSection";
import "../services.css";

function ServiceHero({ title, image }: { title: string; image: ServiceImage }) {
  return (
    <section className="service-hero" aria-labelledby="service-title">
      <Navbar />
      <img className="service-hero-image" src={image.src} alt={image.alt} fetchPriority="high" />
      <h1 id="service-title">{title}</h1>
    </section>
  );
}

function ServiceGallery({ images }: { images: ServiceImage[] }) {
  return (
    <div className="service-gallery">
      {images.map((image) => (
        <figure key={image.src}>
          <div className="service-gallery-image">
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          </div>
          <figcaption>{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  return (
    <main className="service-page">
      <ServiceHero title={service.title} image={service.hero} />
      <section className="service-intro service-container" aria-labelledby="service-intro-title">
        <nav className="service-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">&bull;</span><span aria-current="page">{service.title}</span>
        </nav>
        <h2 id="service-intro-title">{service.heading}</h2>
        <div className="service-intro-copy">
          {service.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
      <section className="service-experience service-container" aria-labelledby="service-experience-title">
        <div className="service-section-heading">
          <p className="service-eyebrow">The FESTHR experience</p>
          <h2 id="service-experience-title">A closer look</h2>
        </div>
        <ServiceGallery images={service.gallery} />
        <dl className="service-details">
          {service.details.map((detail) => (
            <div key={detail.title}>
              <dt>{detail.title}</dt>
              <dd>{detail.description}</dd>
            </div>
          ))}
        </dl>
      </section>
      <ContactSection />
      {/* The root layout renders the existing Footer immediately after main. */}
    </main>
  );
}
