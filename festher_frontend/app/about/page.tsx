"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const values=[
 {n:"01",title:"Thoughtful Stays",text:"Spaces shaped around comfort, calm and the small details that turn a visit into a memory."},
 {n:"02",title:"Warm Hospitality",text:"Personal service with a genuine Sri Lankan spirit, from the first welcome to the final goodbye."},
 {n:"03",title:"Memorable Dining",text:"Food, atmosphere and shared moments brought together as an essential part of the FESTHER experience."},
];

export default function AboutPage(){return <main className="about-page">
 <Navbar />

 <section className="about-hero"><div className="about-hero-bg"/><div className="about-hero-copy"><motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="section-kicker">Our story · Our place · Our people</motion.p><motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.8}}>More than a hotel.<br/><em>A feeling of home.</em></motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35,duration:.8}} className="about-lead">FESTHER is a place created for meaningful stays, memorable gatherings and the kind of hospitality that stays with you long after you leave.</motion.p></div><div className="about-hero-number">EST. <span>FESTHER</span></div></section>

 <section className="story-section"><div className="story-label"><span>01</span><p>The FESTHER Story</p></div><div className="story-copy"><p className="story-big">A destination where <em>nature, comfort and celebration</em> come together.</p><div className="story-columns"><p>FESTHER was imagined as more than somewhere to sleep. It is a hospitality experience built around slowing down, reconnecting and enjoying moments that matter — whether that is a quiet escape, a family stay, a celebration or a memorable meal.</p><p>Our approach is simple: thoughtful spaces, attentive service and a warm sense of welcome. Every part of the experience is designed to feel refined without losing the personal character that makes a stay truly special.</p></div></div></section>

 <section className="about-image-break"><img src="/festher-sunset-view.jpg" alt="FESTHER sunset view"/><div><small>The setting</small><p>Surrounded by beauty.<br/><em>Made for memories.</em></p></div></section>

 <section className="owner-section"><div className="owner-visual"><img src="/festher-hero.jpg" alt="FESTHER property"/><span>FESTHER</span></div><div className="owner-copy"><p className="section-kicker">Meet the people behind FESTHER</p><h2>A vision shaped by<br/><em>genuine hospitality.</em></h2><p>The owner and team behind FESTHER share one purpose: to create a place guests want to return to. The experience is guided by personal care, attention to detail and a belief that great hospitality is remembered through how it makes people feel.</p><div className="owner-card"><div className="owner-avatar">F</div><div><small>Founder & Owner</small><strong>FESTHER Hospitality</strong><span>Owner profile & portrait can be added here.</span></div></div></div></section>

 <section className="values-section"><div className="values-heading"><p className="section-kicker">What defines us</p><h2>The FESTHER<br/><em>way of welcoming.</em></h2></div><div className="values-list">{values.map((v,i)=><motion.article key={v.n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><span>{v.n}</span><h3>{v.title}</h3><p>{v.text}</p></motion.article>)}</div></section>

 <section className="about-cta"><p className="section-kicker">Your next story starts here</p><h2>Come experience<br/><em>FESTHER for yourself.</em></h2><div><a href="/#booking" className="primary-button">Book your stay <span>→</span></a><a href="/gallery" className="about-text-link">Explore our gallery ↗</a></div></section>
 </main>}
