"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import Navbar from "../components/Navbar";
import AboutPreview from "../components/AboutPreview";
import "../about.css";

const values = [
  { n: "01", title: "Thoughtful Stays", text: "Spaces designed around comfort, calm and the small details that turn a visit into a memory." },
  { n: "02", title: "Sri Lankan Warmth", text: "Hospitality inspired by genuine warmth, from the first hello to the final goodbye." },
  { n: "03", title: "Memorable Moments", text: "Experiences created to be slow, shared and remembered long after." },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className={`about-page${scrolled ? " about-page--scrolled" : ""}`}>
        <Navbar />

        <AboutPreview />

        <section className="ab-values">
          <div className="ab-values-head">
            <motion.p {...rise()}>Guided by three principles</motion.p>
            <motion.h2 {...rise(0.08)}>What we value</motion.h2>
          </div>
          <div className="ab-values-list">
            {values.map((v, i) => (
              <motion.article key={v.n} {...rise(i * 0.08)} className="ab-value">
                <p className="ab-value-num">{v.n}</p>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="ab-story">
          <div className="ab-story-canvas">
            <div className="ab-story-media">
              <div className="ab-story-zoom">
                <motion.img
                  {...rise()}
                  src="/festher-sunset-view.jpg"
                  alt="FESTHER at golden hour, framed by the island landscape"
                />
              </div>
            </div>
            <div className="ab-story-row">
              <div className="ab-story-grid">
                <div className="ab-story-kicker">
                  <motion.p {...rise()}>A place with a story</motion.p>
                  <motion.h2 {...rise(0.08)} className="ab-story-heading">
                    Our story
                  </motion.h2>
                </div>
                <div>
                  <div className="ab-story-cols">
                    <motion.p {...rise(0.05)}>
                      FESTHER was imagined as more than a place to stay. It is a feeling — of being welcomed into a home
                      that happens to hold gardens, verandas and the warmth of Sri Lankan hospitality.
                    </motion.p>
                    <motion.p {...rise(0.1)}>
                      Every room, table and quiet corner is considered with care, so that time here slows down and the
                      moments that matter most are given room to happen.
                    </motion.p>
                  </div>
                  <motion.div {...rise(0.16)}>
                    <Link className="ab-story-link" href="/gallery">
                      Discover FESTHER <span>↗</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="ab-story-aside">
                <motion.p {...rise()} className="gold-label">
                  The FESTHER Experience
                </motion.p>
                <motion.h3 {...rise(0.08)} className="ab-story-aside-heading">
                  A stay shaped
                  <br />
                  <em>around you</em>
                </motion.h3>
                <motion.p {...rise(0.16)} className="ab-story-aside-desc">
                  From peaceful mornings surrounded by nature to evenings shaped by good food and warm conversation,
                  every part of FESTHER is designed to let you slow down and experience Sri Lanka at your own pace.
                </motion.p>
                <motion.p {...rise(0.22)} className="ab-story-aside-sub">
                  Stay, dine, explore and discover moments made to be remembered.
                </motion.p>
                <motion.div {...rise(0.28)}>
                  <Link className="ab-story-aside-link" href="/gallery">
                    Explore the experience <span>↗</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}