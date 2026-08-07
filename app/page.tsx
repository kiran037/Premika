import { cache } from "react";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { Metadata } from "next";

import HeroSection from "@/components/home/hero";
import NewArrivals from "@/components/home/new-arrivals";
import FeaturedProducts from "@/components/home/featured-products";
import CategorySection from "@/components/home/category-section";
import JsonLd from "@/components/JsonLd";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { SeoService } from "@/services/seo.service";
import { StoreService } from "@/services/store.service";

import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const getCachedCategories = cache(
  unstable_cache(
    async () => CategoryService.getCategories(),
    ["homepage-categories"],
    { revalidate: 300, tags: ["categories"] }
  )
);

const getCachedSeoSettings = cache(
  unstable_cache(
    async () => SeoService.getSeoSettings(),
    ["homepage-seo-settings"],
    { revalidate: 300, tags: ["seo-settings"] }
  )
);

const getCachedStoreSettings = cache(
  unstable_cache(
    async () => StoreService.getStoreSettings(),
    ["homepage-store-settings"],
    { revalidate: 300, tags: ["store-settings"] }
  )
);

const getHomepageData = cache(async () => {
  const [{ items: products }, categories, seo, storeSettings] = await Promise.all([
    ProductService.getProducts({ limit: 20 }),
    getCachedCategories(),
    getCachedSeoSettings(),
    getCachedStoreSettings(),
  ]);

  return { products, categories, seo, storeSettings };
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageData();

  const title = seo?.defaultMetaTitle || "Premika - Premium Designer Kurtis Online";
  const description =
    seo?.defaultMetaDescription ||
    "Discover premium women's fashion at Premika. Shop designer kurtis, halter neck tops, cotton kurtas & ethnic wear. Free shipping on orders over ₹500.";
  const canonicalUrl = seo?.canonicalDomain || "https://premika.shop";
  const ogImage = seo?.defaultOgImage || "/logo.png";
  const twitterHandle = seo?.twitterHandle || "@premika_store";

  return {
    title: title,
    description: description,
    keywords: seo?.defaultKeywords
      ? seo.defaultKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : ["ethnic wear", "kurtis", "sarees", "women clothing", "premika"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: seo?.siteName || "Premika Store",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo?.siteName || "Premika Store",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
      creator: twitterHandle,
    },
  };
}

export default async function Homepage() {
  const { products, categories, seo, storeSettings } = await getHomepageData();

  const siteUrl = seo?.canonicalDomain || "https://premika.shop";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Structured Data (JSON-LD) */}
      <JsonLd
        type="Organization"
        name={seo?.siteName || storeSettings?.storeName || "Premika"}
        url={siteUrl}
        logo={seo?.defaultOgImage || storeSettings?.logo || `${siteUrl}/logo.png`}
      />
      <JsonLd
        type="WebSite"
        name={seo?.siteName || "Premika"}
        url={siteUrl}
        searchUrl={`${siteUrl}/shop`}
      />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. New Arrivals Section */}
      <NewArrivals products={products} loading={false} />

      {/* 3. Featured Collection Section */}
      <FeaturedProducts products={products} loading={false} />

      {/* 4. Shop By Category Section */}
      <CategorySection categories={categories} />

      {/* 5. Footer CTA Section */}
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
