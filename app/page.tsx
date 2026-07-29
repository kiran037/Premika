"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

import HeroSection from "@/components/home/hero";
import NewArrivals from "@/components/home/new-arrivals";
import FeaturedProducts from "@/components/home/featured-products";
import CategorySection from "@/components/home/category-section";
import { Product, Category } from "@/types";

export default function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/categories"),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

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
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. New Arrivals Section */}
      <NewArrivals products={products} loading={loading} />

      {/* 3. Featured Collection Section */}
      <FeaturedProducts products={products} loading={loading} />

      {/* 4. Shop By Category Section */}
      <CategorySection categories={categories} />

      {/* 6. Footer CTA Section */}
      <section className="py-14 sm:py-20 bg-popover/40 border-b border-border/50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 text-foreground flex items-center justify-center mx-auto mb-4">
            <Gift size={22} className="text-foreground" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Ready to find your perfect gift?
          </h2>

          <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Explore our complete collection of handcrafted ethnic kurtis, dresses, and sets designed with love.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-background bg-foreground rounded-md shadow-md hover:bg-secondary transition-all duration-200"
          >
            <span>Shop Collection</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
