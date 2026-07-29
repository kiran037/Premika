"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ShopToolbarProps {
  totalProducts: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export default function ShopToolbar({
  totalProducts,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6 sm:mb-8">
      {/* Total Count & Mobile Filter Toggle */}
      <div className="flex items-center justify-between sm:justify-start gap-4">
        <span className="text-sm font-semibold text-foreground">
          Showing <span className="text-primary font-bold">{totalProducts}</span> Products
        </span>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-foreground bg-popover border border-primary/40 rounded-md hover:bg-primary hover:text-white transition-colors"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-muted-foreground hidden sm:inline" />
          <span className="text-xs sm:text-sm font-medium text-foreground">Sort by:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 text-xs sm:text-sm border border-primary/40 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name (A-Z)</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
}
