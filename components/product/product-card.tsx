"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, memo } from "react";
import { getDiscountedPrice } from "@/lib/pricing";
import { Product, WishlistItem } from "@/types";
import HeartButton from "@/components/ui/heart-button";

interface ProductCardProps {
  product: Product | WishlistItem;
  variant?: "default" | "wishlist";
  onActionClick?: (e: React.MouseEvent, product: any) => void;
  actionLabel?: string;
  topRightAction?: React.ReactNode;
}

function ProductCardComponent({
  product,
  variant = "default",
  onActionClick,
  actionLabel,
  topRightAction,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pricing = getDiscountedPrice(product);

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"];
  const displayImage = images[currentImageIndex] || images[0] || "/placeholder.svg";

  const handleCtaClick = (e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      e.stopPropagation();
      onActionClick(e, product);
    }
  };

  const defaultCtaText = variant === "wishlist"
    ? (product.inStock ? "Move to Cart" : "Out of Stock")
    : (product.inStock ? "View Details" : "Out of Stock");

  const buttonText = actionLabel || defaultCtaText;

  return (
    <Link href={`/${product.id}`} className="block h-full">
      <div className="group relative bg-background rounded-xl overflow-hidden border border-primary/20 shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Product Image Container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-popover/20"
          onMouseEnter={() => setCurrentImageIndex(images.length > 1 ? 1 : 0)}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {/* Main Product Image */}
          <Image
            src={displayImage}
            alt={product.name}
            fill
            loading="lazy"
            decoding="async"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Top Right Action Overlay (Trash button or Heart button) */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {topRightAction ? topRightAction : <HeartButton product={product as Product} size={18} />}
          </div>

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <div className="absolute bottom-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Out of Stock
            </div>
          )}

          {/* Sale Badge */}
          {pricing.isOnSale && product.inStock && (
            <div className="absolute top-2.5 left-2.5 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              SALE
            </div>
          )}

          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1.5 min-h-[2.5rem]">
              {pricing.isOnSale ? (
                <>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    Rs. {pricing.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    Rs. {pricing.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    {pricing.discount}% OFF
                  </span>
                </>
              ) : (
                <span className="text-sm sm:text-base font-bold text-foreground">
                  Rs. {product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full mt-3 px-3 py-2 text-xs sm:text-sm font-semibold text-background bg-foreground rounded-md group-hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            disabled={!product.inStock}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Link>
  );
}

const ProductCard = memo(ProductCardComponent);
export default ProductCard;
