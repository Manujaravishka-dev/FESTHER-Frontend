// Public admin gallery service. Swap these bodies for REST / Firebase calls later.
import {
  addGalleryImage,
  listGalleryImages,
  patchGalleryImage,
  removeGalleryImage,
} from "./store";

export {
  listGalleryImages as getGalleryImages,
  addGalleryImage as createGalleryImage,
  patchGalleryImage as updateGalleryImage,
  removeGalleryImage as deleteGalleryImage,
};

export type {
  AdminGalleryImage,
  GalleryCategory,
  GalleryImageInput,
} from "@/lib/admin/types";