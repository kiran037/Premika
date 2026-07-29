"use client";

import React from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  availabilityFilter: string;
  onSelectAvailability: (val: string) => void;
  isFeaturedOnly: boolean;
  onToggleFeatured: (val: boolean) => void;
  isNewOnly: boolean;
  onToggleNew: (val: boolean) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

export default function ShopFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  availabilityFilter,
  onSelectAvailability,
  isFeaturedOnly,
  onToggleFeatured,
  isNewOnly,
  onToggleNew,
  onClearAll,
  activeFilterCount,
  isMobileModal = false,
  onCloseMobileModal,
}: ShopFiltersProps) {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Filter size={16} className="text-primary" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-background text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-red-600 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory("")}
            className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-primary text-white font-bold"
                : "text-foreground hover:bg-popover/60"
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === (cat.name || cat.slug || cat.id).toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.name || cat.slug || cat.id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-white font-bold"
                    : "text-foreground hover:bg-popover/60"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Availability
        </h4>
        <div className="space-y-1">
          {[
            { id: "", label: "All Items" },
            { id: "in-stock", label: "In Stock Only" },
            { id: "out-of-stock", label: "Out of Stock" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground cursor-pointer hover:text-primary py-1"
            >
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === item.id}
                onChange={() => onSelectAvailability(item.id)}
                className="w-4 h-4 text-primary focus:ring-primary border-primary/40"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Collections Toggles */}
      <div className="space-y-3 pt-2 border-t border-border/40">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Curated Collections
        </h4>

        <label className="flex items-center justify-between text-xs sm:text-sm font-medium text-foreground cursor-pointer hover:text-primary py-1">
          <span>Featured Items</span>
          <input
            type="checkbox"
            checked={isFeaturedOnly}
            onChange={(e) => onToggleFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-primary/40"
          />
        </label>

        <label className="flex items-center justify-between text-xs sm:text-sm font-medium text-foreground cursor-pointer hover:text-primary py-1">
          <span>New Arrivals</span>
          <input
            type="checkbox"
            checked={isNewOnly}
            onChange={(e) => onToggleNew(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-primary/40"
          />
        </label>
      </div>
    </div>
  );

  if (isMobileModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
        <div className="w-full max-w-xs bg-background h-full p-6 overflow-y-auto shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Filter Products</h3>
              <button
                type="button"
                onClick={onCloseMobileModal}
                className="p-1 rounded-md text-foreground hover:bg-popover"
              >
                <X size={20} />
              </button>
            </div>
            {content}
          </div>

          <div className="pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCloseMobileModal}
              className="w-full py-3 bg-foreground text-background font-bold text-sm rounded-md hover:bg-secondary transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="bg-popover/20 border border-primary/20 rounded-xl p-5">{content}</div>;
}
