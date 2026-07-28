"use client";

import { Carattere } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";

const carattere = Carattere({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-carattere",
});

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products?limit=100");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply availability filter
    if (availabilityFilter === "in-stock") {
      filtered = filtered.filter((product) => product.inStock);
    } else if (availabilityFilter === "out-of-stock") {
      filtered = filtered.filter((product) => !product.inStock);
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, availabilityFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className=" border-b border-[#B67B5C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center">
            <Image
              src="/text-logo.png"
              alt="Premika Logo"
              width={200}
              height={64}
              className="mx-auto max-h-24 sm:max-h-32 lg:max-h-40"
            />
            <p
              className={`text-lg sm:text-2xl lg:text-3xl text-primary font-bold ${carattere.className}`}
            >
              &quot;Prem se bana, Premika ke liye.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Sort Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Filter:
            </span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 flex-1 sm:flex-none"
            >
              <option value="" className="bg-popover text-foreground">
                Availability
              </option>
              <option value="in-stock" className="bg-popover text-foreground ">
                In Stock
              </option>
              <option
                value="out-of-stock"
                className="bg-popover text-foreground"
              >
                Out of Stock
              </option>
            </select>
            {(availabilityFilter || sortBy !== "featured") && (
              <button
                onClick={() => {
                  setAvailabilityFilter("");
                  setSortBy("featured");
                }}
                className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-foreground border border-red-300 rounded-md hover:bg-red-50 transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 flex-1 sm:flex-none"
              >
                <option value="featured" className="bg-popover text-foreground">
                  Featured
                </option>
                <option
                  value="price-low"
                  className="bg-popover text-foreground"
                >
                  Price: Low to High
                </option>
                <option
                  value="price-high"
                  className="bg-popover text-foreground"
                >
                  Price: High to Low
                </option>
                <option value="name" className="bg-popover text-foreground">
                  Name (A-Z)
                </option>
              </select>
            </div>
            <span className="text-xs sm:text-sm text-foreground">
              {filteredAndSortedProducts.length} products
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No products message */}
        {!loading && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-base sm:text-lg text-gray-500 px-4">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setAvailabilityFilter("");
                setSortBy("featured");
              }}
              className="mt-4 px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
