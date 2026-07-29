"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import { Product, Category } from "@/types";
import ShopToolbar from "@/components/shop/shop-toolbar";
import ShopFilters from "@/components/shop/shop-filters";
import { Tag, ShoppingBag } from "lucide-react";

function CategoryContent() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(false);
  const [isNewOnly, setIsNewOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);

        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/categories"),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        let allCats: Category[] = [];
        if (catJson.success && Array.isArray(catJson.data)) {
          allCats = catJson.data;
        } else if (Array.isArray(catJson)) {
          allCats = catJson;
        }
        setCategories(allCats);

        // Find current category
        const matchedCat = allCats.find(
          (c) =>
            (c.slug || "").toLowerCase() === decodedSlug ||
            (c.name || "").toLowerCase() === decodedSlug ||
            c.id.toLowerCase() === decodedSlug
        );
        if (matchedCat) {
          setCategoryInfo(matchedCat);
        }

        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        } else if (Array.isArray(prodJson)) {
          setProducts(prodJson);
        }
      } catch (err) {
        console.error("Error loading category page data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (decodedSlug) {
      loadCategoryData();
    }
  }, [decodedSlug]);

  const displayCategoryName =
    categoryInfo?.name ||
    decodedSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (availabilityFilter) count++;
    if (isFeaturedOnly) count++;
    if (isNewOnly) count++;
    return count;
  }, [availabilityFilter, isFeaturedOnly, isNewOnly]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category Slug
    result = result.filter((p) => {
      const catStr = typeof p.category === "string" ? p.category : (p.category as any)?.name || "";
      return (
        catStr.toLowerCase().includes(decodedSlug) ||
        (p.shortDescription || "").toLowerCase().includes(decodedSlug) ||
        p.name.toLowerCase().includes(decodedSlug)
      );
    });

    if (availabilityFilter === "in-stock") {
      result = result.filter((p) => p.inStock);
    } else if (availabilityFilter === "out-of-stock") {
      result = result.filter((p) => !p.inStock);
    }

    if (isFeaturedOnly) {
      result = result.filter((p) => p.isFeatured || p.featured);
    }

    if (isNewOnly) {
      result = result.filter((p) => p.newArrival || p.isFeatured || p.featured);
    }

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
  }, [products, decodedSlug, availabilityFilter, isFeaturedOnly, isNewOnly, sortBy]);

  const handleClearAll = () => {
    setAvailabilityFilter("");
    setIsFeaturedOnly(false);
    setIsNewOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header Banner */}
      <div className="bg-popover/30 border-b border-[#B67B5C]/30 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/20 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            <Tag size={13} />
            <span>Category Edit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {displayCategoryName}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            {categoryInfo?.description ||
              `Discover our handcrafted ${displayCategoryName.toLowerCase()} collection designed for timeless grace.`}
          </p>
        </div>
      </div>

      {/* Category Products Content */}
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
              totalProducts={filteredAndSortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-popover/20 border border-dashed border-primary/30 rounded-xl p-8">
                <ShoppingBag size={36} className="mx-auto text-primary/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">No Products Found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching the {displayCategoryName} category.
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

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="animate-pulse text-sm text-primary font-bold">Loading category...</div>
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
