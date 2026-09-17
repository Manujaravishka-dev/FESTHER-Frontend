"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Icons: Record<string, ReactNode> = {
  breakfast: icon(<><path d="M4 9h11v4.5A4.5 4.5 0 0 1 10.5 18h-2A4.5 4.5 0 0 1 4 13.5V9Z"/><path d="M15 10h1.4a2.6 2.6 0 0 1 0 5.2H15"/><path d="M7.5 3v2.2M11.5 3v2.2"/></>),
  veranda: icon(<><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M3 21h18"/><path d="M10 21v-5h4v5"/></>),
  garden: icon(<><path d="M12 3 6.5 11.5h3.2L6 17h12l-3.7-5.5h3.2L12 3Z"/><path d="M12 17v4"/></>),
  air: icon(<><path d="M3 8h9.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5"/></>),
  family: icon(<><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6"/><path d="M17.5 20a6.2 6.2 0 0 0-2.2-4.4"/></>),
  bed: icon(<><path d="M3 19v-7h18v7"/><path d="M3 19v2M21 19v2"/><path d="M7 12V8.5A1.5 1.5 0 0 1 8.5 7h7A1.5 1.5 0 0 1 17 8.5V12"/></>),
};
interface Room { img:string; title:string; size:string; desc:string; amenities:[keyof typeof Icons,string][]; }
const rooms: Room[] = [
  {img:"/images/accommodation/room-1.jpg",title:"Garden Suite",size:"Room Size: 55 sqm",desc:"Spacious, high-ceilinged luxurious rooms featuring four-poster king-size or twin beds and a private terrace with tropical garden views.",amenities:[["breakfast","Breakfast Included"],["veranda","Private Verandah"],["garden","Garden View"],["air","Air Conditioning"]]},
  {img:"/images/accommodation/room-2.jpg",title:"Family Suite",size:"Room Size: 65 sqm",desc:"A spacious family-oriented suite designed for relaxed stays, with elegant interiors, comfortable sleeping areas and peaceful tropical surroundings.",amenities:[["breakfast","Breakfast Included"],["family","Family Friendly"],["garden","Garden View"],["air","Air Conditioning"]]},
  {img:"/images/accommodation/room-3.jpg",title:"Deluxe Room",size:"Room Size: 45 sqm",desc:"An elegant and comfortable retreat combining contemporary comfort with warm Sri Lankan character and tranquil views.",amenities:[["breakfast","Breakfast Included"],["bed","King Bed"],["garden","Garden View"],["air","Air Conditioning"]]},
  {img:"/images/accommodation/room-4.jpg",title:"Premier Suite",size:"Room Size: 70 sqm",desc:"A spacious premium suite created for quiet luxury, generous living space and a relaxing tropical hotel experience.",amenities:[["breakfast","Breakfast Included"],["veranda","Private Terrace"],["garden","Garden View"],["air","Air Conditioning"]]},
];
const loopRooms=[rooms[rooms.length-1],...rooms,rooms[0]];
export default function AccommodationSection(){
  const [position,setPosition]=useState(1); const [step,setStep]=useState(0); const x=useMotionValue(0); const trackRef=useRef<HTMLDivElement>(null); const animating=useRef(false);
  const realIndex=(position-1+rooms.length)%rooms.length;
  useEffect(()=>{const measure=()=>{const track=trackRef.current;const first=track?.children[0] as HTMLElement|undefined;if(!track||!first)return;const gap=parseFloat(getComputedStyle(track).columnGap||"0")||0;const nextStep=first.getBoundingClientRect().width+gap;setStep(nextStep);x.set(-position*nextStep);};measure();const ro=new ResizeObserver(measure);if(trackRef.current)ro.observe(trackRef.current);window.addEventListener("resize",measure);return()=>{ro.disconnect();window.removeEventListener("resize",measure);};},[]);
  useEffect(()=>{if(!step||animating.current)return;animating.current=true;const controls=animate(x,-position*step,{duration:.9,ease:[.16,1,.3,1],onComplete:()=>{animating.current=false;if(position===0){setPosition(rooms.length);x.set(-rooms.length*step);}else if(position===rooms.length+1){setPosition(1);x.set(-step);}}});return()=>controls.stop();},[position,step,x]);
  const previous=()=>{if(!animating.current)setPosition(v=>v-1);}; const next=()=>{if(!animating.current)setPosition(v=>v+1);};
  return <section className="acc-section"><div className="acc-head"><motion.h2 className="acc-title" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.6}} transition={{duration:.8,ease:"easeOut"}}>Accommodation</motion.h2><a className="acc-viewall" href="#stay">View All</a></div><div className="acc-viewport" style={{overflow:"visible"}}><motion.div ref={trackRef} className="acc-track" style={{x}} drag="x" dragConstraints={{left:-step*(loopRooms.length-1),right:0}} dragElastic={.06} dragMomentum={false} onDragEnd={(_,info)=>{if(!step)return;if(info.offset.x<-45)next();else if(info.offset.x>45)previous();else animate(x,-position*step,{duration:.35});}}>{loopRooms.map((room,i)=><article className="acc-slide" key={`${room.title}-${i}`}><img className="acc-photo" src={room.img} alt={`${room.title} at FESTHER`} draggable={false} loading="lazy"/><div className="acc-card"><h3 className="acc-room-title">{room.title}</h3><p className="acc-room-size">{room.size}</p><p className="acc-room-desc">{room.desc}</p><div className="acc-actions"><a className="acc-action" href="#stay">Explore</a><span className="acc-actions-sep" aria-hidden="true"/><a className="acc-action" href="#booking">Check Availability</a></div><div className="acc-divider"/><ul className="acc-amenities">{room.amenities.map(([key,label])=><li key={label}>{Icons[key]}{label}</li>)}</ul></div></article>)}</motion.div></div><div className="acc-nav"><button type="button" className="acc-arrow" onClick={previous} aria-label="Previous accommodation">←</button><span className="acc-counter" aria-live="polite">{realIndex+1} / {rooms.length}</span><button type="button" className="acc-arrow" onClick={next} aria-label="Next accommodation">→</button></div></section>;
}
