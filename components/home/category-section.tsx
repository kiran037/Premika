"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { Category } from "@/types";

interface CategorySectionProps {
  categories?: Category[];
}

export default function CategorySection({ categories: initialCategories }: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories || initialCategories.length === 0);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;

    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        } else if (Array.isArray(json)) {
          setCategories(json);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [initialCategories]);

  // Default fallback categories if DB has none or loading
  const fallbackCategories = [
    { id: "kurtis", name: "Designer Kurtis", slug: "kurtis", description: "Elegant daily & festive wear" },
    { id: "coord-sets", name: "Co-ord Sets", slug: "coord-sets", description: "Contemporary matching sets" },
    { id: "dresses", name: "Indo-Western Dresses", slug: "dresses", description: "Modern silhouettes & prints" },
    { id: "cotton-kurtas", name: "Cotton Kurtas", slug: "cotton-kurtas", description: "Breathable pure cotton apparel" },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-12 sm:py-16 bg-popover/30 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore tailored edits designed for every occasion.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors group w-fit"
          >
            <span>Explore All</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name || cat.slug || cat.id)}`}
                className="group relative overflow-hidden rounded-xl border border-primary/20 bg-background p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-primary flex flex-col justify-between h-44 sm:h-48"
              >
                {/* Image background if available */}
                {(cat as any).imageUrl ? (
                  <Image
                    src={(cat as any).imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-20"
                  />
                ) : (
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-popover/80 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
                )}

                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-lg bg-popover border border-primary/30 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-background transition-colors duration-200">
                    <Tag size={18} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="relative z-10 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
