"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import OrderModal from "../components/offers/OrderModal";
import ReservationModal from "../components/offers/ReservationModal";
import DishCard from "../components/dining/DishCard";
import DishModal from "../components/dining/DishModal";
const CartPanel = dynamic(() => import("../components/dining/CartPanel"), { ssr: false });
import CheckoutModal from "../components/dining/CheckoutModal";
import OrderMethodModal from "../components/dining/OrderMethodModal";
import DiningOfferCard from "../components/dining/DiningOfferCard";
import DiningOfferModal from "../components/dining/DiningOfferModal";
import ReservationForm from "../components/dining/ReservationForm";
import DiningGallery, { type DiningGalleryItem } from "../components/dining/DiningGallery";
import { summarizeCart, type CartLine } from "../components/dining/cart";
import { getMenuItems } from "@/services/dining.service";
import { getOffers } from "@/services/offers.service";
import { DINING_FILTERS, diningItems } from "@/lib/data/dining";
import { formatPrice } from "@/lib/format";
import type { MenuItem, Offer } from "@/lib/types";
import "../offers.css";
import "../dining.css";
import "../checkout.css";

const U = (id: string, w: number, h: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const HERO = U("photo-1517248135467-4c7edcad34c4", 2000, 1100);

const GALLERY: DiningGalleryItem[] = [
  { id: "photo-1414235077428-338989a2e8c0", src: U("photo-1414235077428-338989a2e8c0", 900, 1200), title: "A table set for the evening", w: 900, h: 1200 },
  { id: "photo-1504674900247-0877df9cc836", src: U("photo-1504674900247-0877df9cc836", 1400, 950), title: "Flavours of the island", w: 1400, h: 950 },
  { id: "photo-1512058564366-18510be2db19", src: U("photo-1512058564366-18510be2db19", 900, 1500), title: "Served fresh from the kitchen", w: 900, h: 1500 },
  { id: "photo-1517248135467-4c7edcad34c4", src: U("photo-1517248135467-4c7edcad34c4", 1100, 1100), title: "Evenings in good company", w: 1100, h: 1100 },
  { id: "photo-1424847651672-bf20a4b0982b", src: U("photo-1424847651672-bf20a4b0982b", 1700, 820), title: "Long lunches, slow afternoons", w: 1700, h: 820 },
  { id: "photo-1551024506-0bccd828d307", src: U("photo-1551024506-0bccd828d307", 900, 1200), title: "Sweet endings", w: 900, h: 1200 },
  { id: "plated-with-care", src: U("photo-1414235077428-338989a2e8c0", 1400, 950), title: "Plated with care", w: 1400, h: 950 },
  { id: "from-our-table", src: U("photo-1504674900247-0877df9cc836", 900, 1300), title: "From our table to yours", w: 900, h: 1300 },
];

type Filter = (typeof DINING_FILTERS)[number];

export default function DiningPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [scrolled, setScrolled] = useState(false);

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);
  const [orderOffer, setOrderOffer] = useState<Offer | null>(null);
  const [reserveOffer, setReserveOffer] = useState<Offer | null>(null);

  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [menuData, offerData] = await Promise.all([getMenuItems(), getOffers()]);
        if (!alive) return;
        setMenu(menuData);
        setOffers(offerData.filter((o) => o.type === "DINING" && o.active));
        setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(
    () => (activeFilter === "ALL" ? menu : menu.filter((item) => item.category === activeFilter)),
    [menu, activeFilter],
  );
  const signatures = useMemo(() => menu.filter((item) => item.featured).slice(0, 4), [menu]);
  const summary = useMemo(() => summarizeCart(lines, offers), [lines, offers]);
  const orderItem = orderOffer ? diningItems.find((item) => item.id === orderOffer.diningItemId) ?? null : null;

  const addToCart = (item: MenuItem, qty: number, notes: string) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id
            ? { ...line, qty: line.qty + qty, notes: notes.trim() || line.notes }
            : line,
        );
      }
      return [...prev, { item, qty, notes: notes.trim() || undefined }];
    });
    setDish(null);
    setCartOpen(true);
  };

  const changeQty = (id: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((line) => (line.item.id === id ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0),
    );
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((line) => line.item.id !== id));

  return (
    <main className={`gallery-page offers-page dine-page${scrolled ? " gallery-page--scrolled" : ""}`}>
      <section className="fg-hero dine-hero">
        <Navbar />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="FESTHER dining — a table set for the evening" />
        <div className="dine-hero-copy">
          <p className="dine-hero-eyebrow">FESTHER Dining</p>
          <h1 className="dine-hero-title">Dining</h1>
          <p className="dine-hero-note">Thoughtful ingredients, local flavours and memorable moments around the table.</p>
        </div>
      </section>

      <section className="fg-head">
        <nav className="fg-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">•</span>
          <span>Dining</span>
        </nav>
        <p className="fg-intro">
          From sunrise breakfasts to candlelit dinners, our kitchen celebrates the flavours and traditions of the
          island — served with warmth and an unhurried pace.
        </p>
      </section>

      <section className="dine-block dine-story">
        <div className="dine-block-inner dine-block-head">
          <p className="dine-eyebrow">Our Table</p>
          <h2 className="dine-title">
            Food With
            <br />
            A Sense of Place
          </h2>
          <p className="dine-lead">
            At FESTHER, dining is shaped by the flavours, ingredients and traditions of Sri Lanka. From relaxed
            breakfasts to memorable dinners, each plate is prepared to celebrate good food and the pleasure of
            sharing it.
          </p>
          <Link href="#menu" className="dine-cta">
            Discover Our Menu →
          </Link>
        </div>
      </section>

      <section className="dine-block dine-block--tint dine-signatures">
        <div className="dine-block-inner">
          <div className="dine-block-head">
            <p className="dine-eyebrow">Chef&apos;s Selection</p>
            <h2 className="dine-title">Signatures From Our Kitchen</h2>
            <p className="dine-lead">A few of the dishes our kitchen is best known for.</p>
          </div>
          {status === "loading" ? (
            <p className="dine-menu-meta">Loading signatures…</p>
          ) : signatures.length > 0 ? (
            <div className="dine-sig-grid">
              {signatures.map((item) => (
                <article className="dine-sig" key={item.id}>
                  <div className="dine-sig-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={`${item.name} at FESTHER`} loading="lazy" />
                  </div>
                  <div className="dine-sig-body">
                    <h3 className="dine-sig-name">{item.name}</h3>
                    <p className="dine-sig-desc">{item.description}</p>
                    <div className="dine-sig-foot">
                      <span className="dine-sig-price">{formatPrice(item.price, item.currency) ?? "—"}</span>
                      <div className="dine-sig-actions">
                        <button type="button" className="of-btn of-btn--ghost" onClick={() => setDish(item)}>
                          View Dish
                        </button>
                        <button type="button" className="of-btn" onClick={() => addToCart(item, 1, "")}>
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="dine-block dine-menu" id="menu">
        <div className="dine-block-inner">
          <div className="dine-block-head">
            <h2 className="dine-title">Our Menu</h2>
            <p className="dine-lead">From local favourites to carefully crafted signatures.</p>
          </div>

          <nav className="fg-filters" aria-label="Menu categories">
            {DINING_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "is-active" : undefined}
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </nav>

          {status === "loading" ? (
            <p className="dine-menu-meta">Loading menu…</p>
          ) : status === "error" ? (
            <p className="dine-menu-meta">We could not load the menu. Please try again shortly.</p>
          ) : (
            <>
              <p className="dine-menu-meta">
                {shown.length} {shown.length === 1 ? "dish" : "dishes"}
              </p>
              <div className="dine-grid" key={activeFilter}>
                {shown.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onView={() => setDish(item)}
                    onOrder={() => addToCart(item, 1, "")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {offers.length > 0 ? (
        <section className="dine-block dine-block--tint dine-offers">
          <div className="dine-block-inner">
            <div className="dine-block-head">
              <p className="dine-eyebrow">Limited Time</p>
              <h2 className="dine-title">Dining Offers</h2>
              <p className="dine-lead">Seasonal menus and experiences to enjoy at the table.</p>
            </div>
            <div className="dine-offer-grid">
              {offers.map((offer) => (
                <DiningOfferCard
                  key={offer.id}
                  offer={offer}
                  onView={() => setViewOffer(offer)}
                  onOrder={() => setOrderOffer(offer)}
                  onReserve={() => setReserveOffer(offer)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="dine-block dine-gallery">
        <div className="dine-block-inner">
          <div className="dine-block-head">
            <p className="dine-eyebrow">Gallery</p>
            <h2 className="dine-title">From Our Table</h2>
            <p className="dine-lead">Moments from our kitchen and dining spaces.</p>
          </div>
        </div>
        <DiningGallery items={GALLERY} />
      </section>

      <section className="dine-block dine-reserve" id="reserve">
        <div className="dine-block-inner dine-reserve-inner">
          <div className="dine-reserve-intro">
            <p className="dine-eyebrow">Reservations</p>
            <h2 className="dine-title">Reserve Your Table</h2>
            <p className="dine-reserve-text">Join us for an unhurried dining experience at FESTHER.</p>
            <ul className="dine-reserve-list">
              <li>Dinner nightly, 6:00pm – 9:30pm</li>
              <li>Private dining on request</li>
              <li>Reservations confirmed by our team</li>
            </ul>
          </div>
          <div className="dine-reserve-panel">
            <ReservationForm />
          </div>
        </div>
      </section>

      {lines.length > 0 && !cartOpen ? (
        <button className="dine-cart-fab" type="button" onClick={() => setCartOpen(true)}>
          <span>Your Order</span>
          <span className="dine-cart-fab-count">{summary.count}</span>
          <span>{formatPrice(summary.total, summary.currency)}</span>
        </button>
      ) : null}

      {dish ? (
        <DishModal
          item={dish}
          onClose={() => setDish(null)}
          onAdd={addToCart}
          onViewCart={() => {
            setDish(null);
            setCartOpen(true);
          }}
          cartCount={summary.count}
        />
      ) : null}

      {viewOffer ? (
        <DiningOfferModal
          offer={viewOffer}
          onClose={() => setViewOffer(null)}
          onOrder={() => {
            setOrderOffer(viewOffer);
            setViewOffer(null);
          }}
          onReserve={() => {
            setReserveOffer(viewOffer);
            setViewOffer(null);
          }}
        />
      ) : null}

      {orderOffer && orderItem ? (
        <OrderModal item={orderItem} offer={orderOffer} onClose={() => setOrderOffer(null)} />
      ) : null}

      {reserveOffer ? <ReservationModal offer={reserveOffer} onClose={() => setReserveOffer(null)} /> : null}

      {methodOpen && lines.length > 0 ? (
        <OrderMethodModal
          lines={lines}
          offers={offers}
          onClose={() => setMethodOpen(false)}
          onCardPayment={() => {
            setMethodOpen(false);
            setCheckoutOpen(true);
          }}
        />
      ) : null}

      {checkoutOpen ? (
        <CheckoutModal
          lines={lines}
          offers={offers}
          onClose={() => setCheckoutOpen(false)}
          onPlaced={() => setLines([])}
        />
      ) : null}

      <CartPanel
        lines={lines}
        offers={offers}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={removeLine}
        onCheckout={() => {
          if (lines.length === 0) return;
          setCartOpen(false);
          setMethodOpen(true);
        }}
      />
    </main>
  );
}
