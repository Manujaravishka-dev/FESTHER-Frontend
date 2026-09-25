export type GalleryCategory = "ROOMS" | "VIEWS" | "DINING" | "SPACES" | "WELLNESS";

export interface AdminGalleryImage {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: GalleryCategory;
  description: string;
  createdAt: string;
}

export type CommentStatus = "approved" | "pending" | "hidden";

export interface ReviewComment {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
  status: CommentStatus;
  active?: boolean;
}

export type AdminOfferType = "ACCOMMODATION" | "DINING" | "PACKAGES" | "SEASONAL";
export type AdminOfferCta = "BOOK_NOW" | "ORDER_NOW";
export type AdminOfferStatus = "active" | "inactive";

export interface AdminOffer {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  originalPrice: number | null;
  offerPrice: number | null;
  discount: number | null;
  startDate: string;
  endDate: string;
  type: AdminOfferType;
  status: AdminOfferStatus;
  cta: AdminOfferCta;
  createdAt: string;
}

export interface GalleryImageInput {
  src: string;
  title: string;
  alt: string;
  category: GalleryCategory;
  description: string;
}

export interface CommentInput {
  name: string;
  comment: string;
  rating: number;
  date: string;
  status: CommentStatus;
}

export type OfferInput = Omit<AdminOffer, "id" | "createdAt">;