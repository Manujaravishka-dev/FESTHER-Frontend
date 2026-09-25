import type { Metadata } from "next";
import ContactSection from "../components/ContactSection";
import LocationSection from "../components/LocationSection";
import MapSection from "../components/MapSection";
import "./location.css";

export const metadata: Metadata = {
  title: "Location | FESTHR Sri Lanka",
  description: "Discover a peaceful Sri Lankan escape with FESTHR. Get in touch to plan your stay, dining experience or island journey.",
};

export default function ContactPage() {
  return (
    <main className="contact-page location-page">
      <LocationSection />
      <ContactSection />
      <MapSection />
    </main>
  );
}
