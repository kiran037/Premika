"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useWishlist from "@/hooks/use-wishlist";
import useCart from "@/hooks/use-cart";
import { getDiscountedPrice } from "@/lib/pricing";
import ProductCard from "@/components/product-card";
import { WishlistItem } from "@/types";

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const wishlist = useWishlist();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleMoveToCart = (item: WishlistItem) => {
    const pricing = getDiscountedPrice({ price: item.price });

    // Build cart item
    const cartItem = {
      id: item.id,
      productId: item.id,
      name: item.name,
      slug: item.slug || item.id,
      price: pricing.discountedPrice,
      originalPrice: pricing.originalPrice,
      isOnSale: pricing.isOnSale,
      discount: pricing.discount,
      quantity: 1,
      selectedSize: item.sizes && item.sizes.length > 0 ? item.sizes.find(s => s.inStock)?.label || item.sizes[0]?.label : undefined,
      selectedHeight: item.heights && item.heights.length > 0 ? item.heights.find(h => h.default)?.value || item.heights[0]?.value : undefined,
      isCombo: item.isCombo,
      comboSelections: undefined,
      images: item.images,
      category: item.category || "clothing",
    };

    const success = cart.addItem(cartItem as any);
    if (success) {
      wishlist.removeItem(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="px-3 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-16">
          {/* Header */}
          <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:mb-6 md:mb-8">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base border border-secondary text-secondary hover:bg-secondary hover:text-background px-3 py-2 sm:px-4 sm:py-2"
              >
                <ArrowLeft size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Shop</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-row items-center space-x-3 mb-4 sm:mb-6 md:mb-8">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-500 fill-red-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
              My Wishlist
            </h1>
            {wishlist.items.length > 0 && (
              <span className="bg-secondary text-background px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium">
                {wishlist.items.length} {wishlist.items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {/* Wishlist Items Grid or Empty State */}
          {wishlist.items.length === 0 ? (
            <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20">
              <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-[#E0BCA2] mb-3 sm:mb-4 md:mb-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-tertiary mb-4 sm:mb-6 md:mb-8 max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4">
                Explore our catalog and save your favorite items to view them here anytime.
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-background bg-foreground hover:bg-primary transition-colors"
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-foreground">
                  Saved Products ({wishlist.items.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={wishlist.removeAll}
                  className="text-foreground hover:text-background hover:bg-red-500 text-xs sm:text-sm px-3 py-1.5"
                >
                  Clear Wishlist
                </Button>
              </div>

              {/* Shared Product Grid Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.items.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item as any}
                    variant="wishlist"
                    onActionClick={() => handleMoveToCart(item)}
                    topRightAction={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          wishlist.removeItem(item.id);
                        }}
                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-stone-600 hover:text-red-600 hover:bg-white transition-colors shadow-xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
