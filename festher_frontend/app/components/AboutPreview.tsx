"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export default function AboutPreview() {
  return (
    <section className="about-preview">
      <div className="about-preview-row">
        <motion.div
          className="about-preview-media"
          initial={{ opacity: 0, y: 26, scale: 1.04 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/boburu/boburu_2.jpg"
            alt="FESTHER — quiet corners set among the Sri Lankan landscape"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <div className="about-preview-panel">
          <motion.p className="gold-label" {...rise(0.1)}>
            About FESTHER
          </motion.p>
          <motion.h2 {...rise(0.18)}>
            Stylish &amp; Sustainable
            <br />
            Sri Lankan Holidays
          </motion.h2>
          <motion.p className="about-preview-desc" {...rise(0.28)}>
            FESTHER is a Sri Lankan escape woven around slow mornings, considered detail and genuine warmth. Tucked
            among gardens and verandas, it brings together thoughtful stays, island dining and quietly memorable
            experiences — a home for the moments that matter, in the heart of the island.
          </motion.p>
          <motion.div {...rise(0.38)}>
            <Link className="about-preview-cta" href="/about">
              More About Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}