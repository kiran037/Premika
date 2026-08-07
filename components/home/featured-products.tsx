"use client";

import { memo, useMemo } from "react";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";
import HomeProductSection from "./home-product-section";

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

function FeaturedProductsComponent({
  products,
  loading = false,
}: FeaturedProductsProps) {
  // Filter featured products or fall back to first products
  const displayProducts = useMemo(() => {
    const featured = products.filter((p) => p.isFeatured || p.featured);
    return (featured.length > 0 ? featured : products).slice(0, 8);
  }, [products]);

  return (
    <HomeProductSection
      title="Featured Collection"
      subtitle="Our most loved, signature pieces celebrated for their quiet luxury."
      viewAllLink="/shop?featured=true"
    >
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No featured products available.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </HomeProductSection>
  );
}

const FeaturedProducts = memo(FeaturedProductsComponent);
export default FeaturedProducts;
