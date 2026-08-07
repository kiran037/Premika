"use client";

import { memo, useMemo } from "react";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";
import HomeProductSection from "./home-product-section";

interface NewArrivalsProps {
  products: Product[];
  loading?: boolean;
}

function NewArrivalsComponent({ products, loading = false }: NewArrivalsProps) {
  // Show first 4 to 8 products
  const displayProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <HomeProductSection
      title="New Arrivals"
      subtitle="Fresh additions crafted with intention for your seasonal wardrobe."
      viewAllLink="/shop?filter=new"
    >
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No new arrivals available right now.
        </div>
      ) : (
        <>
          {/* Horizontal scroll container on mobile, grid on desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 md:overflow-visible no-scrollbar">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[72vw] sm:w-[45vw] md:w-auto"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </HomeProductSection>
  );
}

const NewArrivals = memo(NewArrivalsComponent);
export default NewArrivals;
