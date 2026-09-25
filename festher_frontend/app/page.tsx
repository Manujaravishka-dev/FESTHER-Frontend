"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./guest-reviews.css";
import Navbar from "./components/Navbar";
import PressSection from "./components/PressSection";
import AccommodationSection from "./components/AccommodationSection";
import DiningTaste from "./components/DiningTaste";
import ServicesSection from "./components/ServicesSection";
import AboutPreview from "./components/AboutPreview";
import GuestReviews from "./components/GuestReviews";

const slides = ["/festher-hero.jpg", "/festher-sunset-view.jpg"];

export default function Home() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const timer = setInterval(() => setSlide(v => (v + 1) % slides.length), 6500); return () => clearInterval(timer); }, []);
  const previous = () => setSlide(v => (v - 1 + slides.length) % slides.length);
  const next = () => setSlide(v => (v + 1) % slides.length);

  return <main className="festher-editorial">
    <section className="editorial-hero">
      <div className="editorial-slides"><AnimatePresence mode="sync">{slides.map((src, i) => i === slide && <motion.div key={src} className="editorial-slide" style={{ backgroundImage: `url(${src})` }} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1.09 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.2 }, scale: { duration: 7 } }} />)}</AnimatePresence></div>
      <Navbar />
      <div className="hero-editorial-copy">
        <p className="gold-label">A Sri Lankan hospitality experience</p>
        <h1>Stay awhile.<br/><em>Celebrate everything.</em></h1>
        <div className="hero-editorial-bottom"><p>Thoughtful stays, memorable dining and beautifully considered experiences — brought together in one place.</p><a href="#story">Discover FESTHER <span>↓</span></a></div>
      </div>
      <div className="editorial-pager"><button onClick={previous}>←</button><span>0{slide + 1}</span><i/><span>0{slides.length}</span><button onClick={next}>→</button></div>
    </section>

    <div id="story">
      <AboutPreview />
    </div>

    <AccommodationSection />
    <DiningTaste />

    <PressSection />
    <style jsx global>{`
      .festher-press .article-cats{margin-top:50px}
      .festher-press .press-article h3{margin-top:50px}
      .festher-press .press-date{margin-top:28px}
      .festher-press .press-read{margin-top:38px}
      .festher-press .press-nav{margin-top:50px}
      @media(max-width:700px){
        .festher-press .article-cats{margin-top:38px}
        .festher-press .press-article h3{margin-top:42px}
        .festher-press .press-date{margin-top:26px}
        .festher-press .press-read{margin-top:34px}
        .festher-press .press-nav{margin-top:44px}
      }
    `}</style>

    <ServicesSection />

    <GuestReviews />
  </main>;
}
