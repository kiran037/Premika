"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import { Product, Category } from "@/types";
import ShopToolbar from "@/components/shop/shop-toolbar";
import ShopFilters from "@/components/shop/shop-filters";
import { ShoppingBag } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();

  // URL Query Parameters
  const initialCategory = searchParams.get("category") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialFeatured = searchParams.get("featured") === "true";

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(initialFeatured);
  const [isNewOnly, setIsNewOnly] = useState<boolean>(initialFilter === "new");
  const [sortBy, setSortBy] = useState<string>("featured");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync URL params when they change
  useEffect(() => {
    if (searchParams.get("category")) setSelectedCategory(searchParams.get("category") || "");
    if (searchParams.get("filter") === "new") setIsNewOnly(true);
    if (searchParams.get("featured") === "true") setIsFeaturedOnly(true);
  }, [searchParams]);

  // Fetch Products & Categories
  useEffect(() => {
    let isSubscribed = true;
    async function loadShopData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/categories"),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (!isSubscribed) return;

        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        } else if (Array.isArray(prodJson)) {
          setProducts(prodJson);
        }

        if (catJson.success && Array.isArray(catJson.data)) {
          setCategories(catJson.data);
        } else if (Array.isArray(catJson)) {
          setCategories(catJson);
        }
      } catch (err) {
        console.error("Error loading shop data:", err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }
    loadShopData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (availabilityFilter) count++;
    if (isFeaturedOnly) count++;
    if (isNewOnly) count++;
    return count;
  }, [selectedCategory, availabilityFilter, isFeaturedOnly, isNewOnly]);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory) {
      const lowerCat = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const catStr = typeof p.category === "string" ? p.category : (p.category as any)?.name || "";
        return (
          catStr.toLowerCase().includes(lowerCat) ||
          (p.shortDescription || "").toLowerCase().includes(lowerCat) ||
          p.name.toLowerCase().includes(lowerCat)
        );
      });
    }

    // 2. Availability Filter
    if (availabilityFilter === "in-stock") {
      result = result.filter((p) => p.inStock);
    } else if (availabilityFilter === "out-of-stock") {
      result = result.filter((p) => !p.inStock);
    }

    // 3. Featured Filter
    if (isFeaturedOnly) {
      result = result.filter((p) => p.isFeatured || p.featured);
    }

    // 4. New Arrivals Filter
    if (isNewOnly) {
      result = result.filter((p) => p.newArrival || p.isFeatured || p.featured);
    }

    // 5. Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.createdAt || b.id || "").localeCompare(a.createdAt || a.id || ""));
    }

    return result;
  }, [products, selectedCategory, availabilityFilter, isFeaturedOnly, isNewOnly, sortBy]);

  const handleClearAll = () => {
    setSelectedCategory("");
    setAvailabilityFilter("");
    setIsFeaturedOnly(false);
    setIsNewOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-popover/30 border-b border-[#B67B5C]/30 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/20 text-xs font-semibold text-primary mb-3">
            <ShoppingBag size={14} />
            <span>Complete Catalogue</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {selectedCategory ? selectedCategory : "Shop All Products"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Browse our full collection of handcrafted designer kurtis, ethnic wear, and luxury attire.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ShopFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
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

          {/* Product Listing Area */}
          <div className="lg:col-span-3">
            <ShopToolbar
              totalProducts={filteredAndSortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Loading Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 bg-popover/20 border border-dashed border-primary/30 rounded-xl p-8">
                <ShoppingBag size={36} className="mx-auto text-primary/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">No Products Found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching your current filters. Try resetting or selecting a different category.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-2.5 bg-foreground text-background text-xs sm:text-sm font-bold rounded-md hover:bg-secondary transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFiltersOpen && (
        <ShopFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="animate-pulse text-sm text-primary font-bold">Loading catalogue...</div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
