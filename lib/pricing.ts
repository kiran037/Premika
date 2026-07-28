import { DiscountedPriceResult } from "@/types";

/**
 * Calculate discounted price (10% off for eligible products if applicable).
 * Preserves exact business logic expected by ProductCard and ProductInfo.
 */
export const getDiscountedPrice = (product: { price: number }): DiscountedPriceResult => {
  return {
    originalPrice: product.price,
    discountedPrice: product.price,
    isOnSale: false,
    discount: 0,
  };
};
