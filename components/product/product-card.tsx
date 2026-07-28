"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getDiscountedPrice } from "@/lib/pricing";
import { Product } from "@/types";
import HeartButton from "@/components/ui/heart-button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link href={`/${product.id}`} className="block h-full">
      <div className="group relative bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Product Image Container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100"
          onMouseEnter={() => setCurrentImageIndex(1)}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {/* Main Product Image */}
          <Image
            src={product.images[currentImageIndex] || product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 ease-in-out transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Heart Button Overlay */}
          <div className="absolute top-2 right-2 z-10">
            <HeartButton product={product} size={18} />
          </div>

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              Out of Stock
            </div>
          )}

          {/* Sale Badge */}
          {(() => {
            const pricing = getDiscountedPrice(product);
            return pricing.isOnSale && product.inStock ? (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-md">
                SALE
              </div>
            ) : null;
          })()}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 space-y-1">
            <h3 className="text-m font-bold text-foreground line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-primary line-clamp-1">
              {product.shortDescription}
            </p>

            {/* Price - Fixed height container */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[3rem] py-1">
              {(() => {
                const pricing = getDiscountedPrice(product);
                return pricing.isOnSale ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-foreground">
                        Rs. {pricing.discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm sm:text-sm text-gray-500 line-through">
                        Rs. {pricing.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-medium w-fit">
                      {pricing.discount}% OFF
                    </span>
                  </>
                ) : (
                  <div className="flex items-center h-full">
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* View Product Button - pushed to bottom */}
          <button
            className="w-full px-4 py-2 text-sm font-medium text-background bg-foreground border border-secondary rounded-md hover:bg-popover hover:font-bold hover:text-foreground hover:border-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            disabled={!product.inStock}
          >
            {product.inStock ? "View Details" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
}
