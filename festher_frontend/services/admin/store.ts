// In-memory mock data store for the Admin Panel (UI phase).
// Mirrors what a REST API will later provide. Swap these internals for fetch()
// calls behind the public service functions — the UI never talks to this file.
import type {
  AdminGalleryImage,
  AdminOffer,
  GalleryImageInput,
  OfferInput,
  ReviewComment,
  CommentInput,
} from "@/lib/admin/types";
import type { OrderStatus, RestaurantOrder } from "@/lib/types";
import {
  sampleComments,
  sampleGalleryImages,
  sampleOffers,
  sampleRestaurantOrders,
} from "@/lib/admin/mock-data";
import { delay } from "@/services/config";

const LATENCY = 350;

let images = [...sampleGalleryImages];
let comments = [...sampleComments];
let offers = [...sampleOffers];
let orders = [...sampleRestaurantOrders];

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ------------------------------ Gallery ------------------------------ */

export async function listGalleryImages(): Promise<AdminGalleryImage[]> {
  await delay(LATENCY);
  return [...images];
}

export async function addGalleryImage(
  input: GalleryImageInput
): Promise<AdminGalleryImage> {
  await delay(LATENCY);
  const item: AdminGalleryImage = {
    ...input,
    id: uid("img"),
    createdAt: todayISO(),
  };
  images = [item, ...images];
  return item;
}

export async function patchGalleryImage(
  id: string,
  input: GalleryImageInput
): Promise<AdminGalleryImage> {
  await delay(LATENCY);
  const item = images.find((i) => i.id === id);
  if (!item) throw new Error("Image not found.");
  const updated = { ...item, ...input };
  images = images.map((i) => (i.id === id ? updated : i));
  return updated;
}

export async function removeGalleryImage(id: string): Promise<void> {
  await delay(LATENCY);
  images = images.filter((i) => i.id !== id);
}

/* ------------------------------ Comments ------------------------------ */

export async function listComments(): Promise<ReviewComment[]> {
  await delay(LATENCY);
  return [...comments];
}

export async function addComment(input: CommentInput): Promise<ReviewComment> {
  await delay(LATENCY);
  const item: ReviewComment = { ...input, id: uid("c") };
  comments = [item, ...comments];
  return item;
}

export async function patchComment(
  id: string,
  input: CommentInput
): Promise<ReviewComment> {
  await delay(LATENCY);
  const item = comments.find((c) => c.id === id);
  if (!item) throw new Error("Comment not found.");
  const updated = { ...item, ...input };
  comments = comments.map((c) => (c.id === id ? updated : c));
  return updated;
}

export async function removeComment(id: string): Promise<void> {
  await delay(LATENCY);
  comments = comments.filter((c) => c.id !== id);
}

/* ------------------------------ Offers ------------------------------ */

export async function listOffers(): Promise<AdminOffer[]> {
  await delay(LATENCY);
  return [...offers];
}

export async function addOffer(input: OfferInput): Promise<AdminOffer> {
  await delay(LATENCY);
  const item: AdminOffer = { ...input, id: uid("off"), createdAt: todayISO() };
  offers = [item, ...offers];
  return item;
}

export async function patchOffer(
  id: string,
  input: OfferInput
): Promise<AdminOffer> {
  await delay(LATENCY);
  const item = offers.find((o) => o.id === id);
  if (!item) throw new Error("Offer not found.");
  const updated = { ...item, ...input };
  offers = offers.map((o) => (o.id === id ? updated : o));
  return updated;
}

export async function removeOffer(id: string): Promise<void> {
  await delay(LATENCY);
  offers = offers.filter((o) => o.id !== id);
}

/* ------------------------------ Restaurant Orders ------------------------------ */

export async function listRestaurantOrders(): Promise<RestaurantOrder[]> {
  await delay(LATENCY);
  return [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Orders recorded while the frontend runs in demo mode (no backend). Payment
// state is set by verified payment processing only — demo records never mark
// a PayHere payment as PAID.
export async function recordRestaurantOrder(
  order: RestaurantOrder,
): Promise<RestaurantOrder> {
  await delay(LATENCY);
  orders = [order, ...orders];
  return order;
}

export async function getRestaurantOrderById(id: string): Promise<RestaurantOrder> {
  await delay(120);
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("We could not find this order reference.");
  return order;
}

export async function patchRestaurantOrder(
  id: string,
  orderStatus: OrderStatus,
): Promise<RestaurantOrder> {
  await delay(LATENCY);
  const current = orders.find((o) => o.id === id);
  if (!current) throw new Error("Order not found.");
  const updated: RestaurantOrder = { ...current, orderStatus, version: current.version + 1 };
  orders = orders.map((o) => (o.id === id ? updated : o));
  return updated;
}