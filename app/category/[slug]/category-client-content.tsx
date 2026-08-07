"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/product-card";
import ShopToolbar from "@/components/shop/shop-toolbar";
import ShopFilters from "@/components/shop/shop-filters";
import { Product, Category } from "@/types";
import { ShoppingBag } from "lucide-react";

interface CategoryClientContentProps {
  displayCategoryName: string;
  categories: Category[];
  allProducts: Product[];
  initialSearchParams?: {
    availability?: string;
    featured?: string;
    new?: string;
    sort?: string;
  };
}

export default function CategoryClientContent({
  displayCategoryName,
  categories,
  allProducts,
  initialSearchParams,
}: CategoryClientContentProps) {
  const [availabilityFilter, setAvailabilityFilter] = useState<string>(
    initialSearchParams?.availability || ""
  );
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(
    initialSearchParams?.featured === "true"
  );
  const [isNewOnly, setIsNewOnly] = useState<boolean>(
    initialSearchParams?.new === "true"
  );
  const [sortBy, setSortBy] = useState<string>(
    initialSearchParams?.sort || "featured"
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (availabilityFilter) count++;
    if (isFeaturedOnly) count++;
    if (isNewOnly) count++;
    return count;
  }, [availabilityFilter, isFeaturedOnly, isNewOnly]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (availabilityFilter === "in-stock") {
      result = result.filter((p) => p.inStock);
    } else if (availabilityFilter === "out-of-stock") {
      result = result.filter((p) => !p.inStock);
    }

    if (isFeaturedOnly) {
      result = result.filter((p) => (p as any).isFeatured || p.featured);
    }

    if (isNewOnly) {
      result = result.filter(
        (p) => p.newArrival || (p as any).isFeatured || p.featured
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result.sort((a, b) =>
        (b.createdAt || b.id || "").localeCompare(a.createdAt || a.id || "")
      );
    }

    return result;
  }, [allProducts, availabilityFilter, isFeaturedOnly, isNewOnly, sortBy]);

  const handleClearAll = () => {
    setAvailabilityFilter("");
    setIsFeaturedOnly(false);
    setIsNewOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ShopFilters
              categories={categories}
              selectedCategory={displayCategoryName}
              onSelectCategory={() => {}}
              availabilityFilter={availabilityFilter}
              onSelectAvailability={setAvailabilityFilter}
              isFeaturedOnly={isFeaturedOnly}
              onToggleFeatured={setIsFeaturedOnly}
              isNewOnly={isNewOnly}
              onToggleNew={setIsNewOnly}
              onClearAll={handleClearAll}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          <ShopToolbar
            totalProducts={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-popover/20 border border-dashed border-primary/30 rounded-xl p-8">
              <ShoppingBag size={36} className="mx-auto text-primary/60 mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">
                No Products Found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                We couldn&apos;t find any products matching your current filters.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-foreground text-background text-xs sm:text-sm font-bold rounded-md hover:bg-secondary transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFiltersOpen && (
        <ShopFilters
          categories={categories}
          selectedCategory={displayCategoryName}
          onSelectCategory={() => {}}
          availabilityFilter={availabilityFilter}
          onSelectAvailability={setAvailabilityFilter}
          isFeaturedOnly={isFeaturedOnly}
          onToggleFeatured={setIsFeaturedOnly}
          isNewOnly={isNewOnly}
          onToggleNew={setIsNewOnly}
          onClearAll={handleClearAll}
          activeFilterCount={activeFilterCount}
          isMobileModal={true}
          onCloseMobileModal={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </div>
  );
}
