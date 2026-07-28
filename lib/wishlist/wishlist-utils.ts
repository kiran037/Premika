import { WishlistItem } from "@/types";

/**
 * Sanitize and validate raw wishlist items restored from localStorage
 */
export const sanitizeWishlistState = (rawItems: any[]): WishlistItem[] => {
  if (!Array.isArray(rawItems)) return [];

  const seenIds = new Set<string>();

  return rawItems.filter((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      isNaN(item.price)
    ) {
      return false;
    }

    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
};
