// Public admin offers service. Swap these bodies for REST / Firebase later.
import { addOffer, listOffers, patchOffer, removeOffer } from "./store";

export {
  listOffers as getOffers,
  addOffer as createOffer,
  patchOffer as updateOffer,
  removeOffer as deleteOffer,
};

export type {
  AdminOffer,
  AdminOfferCta,
  AdminOfferStatus,
  AdminOfferType,
  OfferInput,
} from "@/lib/admin/types";