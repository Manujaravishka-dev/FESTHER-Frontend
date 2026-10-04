// Public contact information only.
export const restaurantConfig = {
  whatsappNumber: (process.env.NEXT_PUBLIC_RESTAURANT_WHATSAPP ?? "").replace(/[\s+()-]/g, ""),
};

export function whatsappUrl(message: string): string {
  if (!/^[1-9]\d{7,14}$/.test(restaurantConfig.whatsappNumber)) {
    throw new Error("WhatsApp ordering is not available yet. Please contact the restaurant.");
  }
  return `https://wa.me/${restaurantConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
