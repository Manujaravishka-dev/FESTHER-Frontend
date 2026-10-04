import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Poppins } from "next/font/google";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";
import "./gold-accents.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: { url: "/f.png", type: "image/png" },
    shortcut: "/f.png",
    apple: "/f.png",
  },
  title: "FESTHER | Every Moment, A Celebration",
  description: "Discover FESTHER — thoughtful stays, memorable dining and warm Sri Lankan hospitality.",
};

/**
 * Hydration-independent guard for the Contact anchor.
 *
 * Before React hydrates, a click on the server-rendered "Contact" link is
 * handled by the browser: the URL hash changes, but the viewport stays put
 * because the browser does not re-scroll for an unchanged fragment. This tiny
 * capture-phase handler scrolls to #contact itself, so the link behaves the
 * same before and after hydration. The React handlers in Navbar/page remain as
 * the component-level implementation.
 */
const CONTACT_SCROLL_BOOTSTRAP = `(function(){var s='a[href="/#contact"],a[href$="#contact"]';function align(){var e=document.getElementById('contact');if(!e)return false;e.scrollIntoView({behavior:'smooth',block:'start'});var n=0,last=NaN,st=0;function t(){var c=document.getElementById('contact');if(!c)return;var top=Math.round(c.getBoundingClientRect().top);st=top===last?st+1:0;last=top;if(Math.abs(top-90)>4&&st<8&&n++<120){c.scrollIntoView({behavior:n<14?'smooth':'auto',block:'start'});requestAnimationFrame(t);}}requestAnimationFrame(t);return true;}document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest?ev.target.closest(s):null;if(!a)return;if(ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;ev.preventDefault();ev.stopPropagation();if(align()){if(location.hash!=='#contact'){history.replaceState(null,'','/#contact');window.dispatchEvent(new Event('hashchange'));}}else{location.href=a.getAttribute('href');}},true);window.addEventListener('hashchange',function(){if(location.hash==='#contact'){align();}});})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: CONTACT_SCROLL_BOOTSTRAP,
          }}
        />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
