import React from "react";
import ProductCard from "@/components/product-card";
import ShopToolbar from "@/components/shop/shop-toolbar";
import ShopFilters from "@/components/shop/shop-filters";
import JsonLd from "@/components/JsonLd";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { SeoService } from "@/services/seo.service";
import { CategoryRepository } from "@/repositories/category.repository";
import { Tag, ShoppingBag } from "lucide-react";
import { Metadata } from "next";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    availability?: string;
    featured?: string;
    new?: string;
    sort?: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase();
  const [categoryRecord, seo] = await Promise.all([
    CategoryRepository.findCategoryBySlug(decodedSlug),
    SeoService.getSeoSettings(),
  ]);

  const displayCategoryName =
    categoryRecord?.name ||
    decodedSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const canonicalDomain = seo?.canonicalDomain || "https://premika.shop";
  const defaultTitle = `${displayCategoryName} | ${seo?.siteName || "Premika"}`;
  const defaultDescription =
    categoryRecord?.description ||
    `Discover our handcrafted ${displayCategoryName.toLowerCase()} collection designed for timeless grace.`;

  const metaTitle = categoryRecord?.metaTitle || defaultTitle;
  const metaDescription = categoryRecord?.metaDescription || defaultDescription;
  const keywords = categoryRecord?.keywords
    ? categoryRecord.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : seo?.defaultKeywords
    ? seo.defaultKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  const canonicalUrl =
    categoryRecord?.canonicalUrl || `${canonicalDomain}/category/${categoryRecord?.slug || decodedSlug}`;
  const ogImage =
    categoryRecord?.ogImage || categoryRecord?.image || seo?.defaultOgImage || "/logo.png";
  const twitterHandle = seo?.twitterHandle || "@premika_store";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: seo?.siteName || "Premika Store",
      images: [
        {
          url: ogImage,
          alt: displayCategoryName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: !categoryRecord?.noIndex,
      follow: !categoryRecord?.noIndex,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase();

  const [categoryInfo, categories, { items: allProducts }, seo] = await Promise.all([
    CategoryService.getCategoryBySlug(decodedSlug),
    CategoryService.getCategories(),
    ProductService.getProducts({ category: decodedSlug, limit: 100 }),
    SeoService.getSeoSettings(),
  ]);

  const displayCategoryName =
    categoryInfo?.name ||
    decodedSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const canonicalDomain = seo?.canonicalDomain || "https://premika.shop";

  // Search parameters filters
  const availabilityFilter = searchParams?.availability || "";
  const isFeaturedOnly = searchParams?.featured === "true";
  const isNewOnly = searchParams?.new === "true";
  const sortBy = searchParams?.sort || "featured";

  let filteredProducts = [...allProducts];

  if (availabilityFilter === "in-stock") {
    filteredProducts = filteredProducts.filter((p) => p.inStock);
  } else if (availabilityFilter === "out-of-stock") {
    filteredProducts = filteredProducts.filter((p) => !p.inStock);
  }

  if (isFeaturedOnly) {
    filteredProducts = filteredProducts.filter((p) => (p as any).isFeatured || p.featured);
  }

  if (isNewOnly) {
    filteredProducts = filteredProducts.filter((p) => p.newArrival || (p as any).isFeatured || p.featured);
  }

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "newest") {
    filteredProducts.sort((a, b) => (b.createdAt || b.id || "").localeCompare(a.createdAt || a.id || ""));
  }

  let activeFilterCount = 0;
  if (availabilityFilter) activeFilterCount++;
  if (isFeaturedOnly) activeFilterCount++;
  if (isNewOnly) activeFilterCount++;

  const breadcrumbs = [
    { name: "Home", url: canonicalDomain },
    { name: "Shop", url: `${canonicalDomain}/shop` },
    { name: displayCategoryName, url: `${canonicalDomain}/category/${decodedSlug}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data JSON-LD */}
      <JsonLd type="BreadcrumbList" items={breadcrumbs} />

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
                onSelectAvailability={() => {}}
                isFeaturedOnly={isFeaturedOnly}
                onToggleFeatured={() => {}}
                isNewOnly={isNewOnly}
                onToggleNew={() => {}}
                onClearAll={() => {}}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            <ShopToolbar
              totalProducts={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={() => {}}
              onOpenMobileFilters={() => {}}
              activeFilterCount={activeFilterCount}
            />

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-popover/20 border border-dashed border-primary/30 rounded-xl p-8">
                <ShoppingBag size={36} className="mx-auto text-primary/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">No Products Found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching the {displayCategoryName} category.
                </p>
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
      </div>
    </div>
  );
}
