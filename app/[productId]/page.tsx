import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductInfo } from "@/components/product-info";
import { ProductTabs } from "@/components/product-tabs";
import { RelatedProducts } from "@/components/related-products";
import { Breadcrumb } from "@/components/breadcrumb";
import JsonLd from "@/components/JsonLd";
import { ProductService } from "@/services/product.service";
import { ProductRepository } from "@/repositories/product.repository";
import { SeoService } from "@/services/seo.service";
import { getDiscountedPrice } from "@/lib/pricing";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface SingleProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateMetadata({
  params,
}: SingleProductPageProps): Promise<Metadata> {
  const [productItem, seo] = await Promise.all([
    ProductRepository.findProductBySlug(params.productId),
    SeoService.getSeoSettings(),
  ]);

  if (!productItem) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const p = productItem.product;
  const productFormatted = ProductService.formatProductResponse(productItem);

  const pricing = getDiscountedPrice(productFormatted);
  const priceDisplay = pricing.isOnSale
    ? `₹${pricing.discountedPrice.toFixed(2)} (${pricing.discount}% OFF - was ₹${pricing.originalPrice.toFixed(2)})`
    : `₹${productFormatted.price.toFixed(2)}`;

  const canonicalDomain = seo?.canonicalDomain || "https://premika.shop";
  const defaultTitle = `${p.name} | ${seo?.siteName || "Premika"}`;
  const defaultDescription = `${p.shortDescription || p.name} - Available at ${seo?.siteName || "Premika Store"} for ${priceDisplay}. ${productFormatted.inStock ? "In Stock" : "Out of Stock"}.`;

  const metaTitle = p.metaTitle || defaultTitle;
  const metaDescription = p.metaDescription || defaultDescription;
  const keywords = p.keywords
    ? p.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : seo?.defaultKeywords
    ? seo.defaultKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : undefined;

  const canonicalUrl = p.canonicalUrl || `${canonicalDomain}/${p.slug || p.id}`;
  const ogImage = p.ogImage || productFormatted.images[0] || seo?.defaultOgImage || "/logo.png";
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
          alt: p.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: !p.noIndex,
      follow: !p.noIndex,
    },
  };
}

export default async function SingleProductPage({ params }: SingleProductPageProps) {
  const productItem = await ProductRepository.findProductBySlug(params.productId);

  if (!productItem) {
    notFound();
  }

  const product = ProductService.formatProductResponse(productItem);
  const pRecord = productItem.product;

  const seo = await SeoService.getSeoSettings();
  const canonicalDomain = seo?.canonicalDomain || "https://premika.shop";

  // Fetch related products in category
  const { items: categoryProducts } = await ProductService.getProducts({
    category: product.category,
    limit: 5,
  });

  const relatedProducts = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
    .map((p) => {
      const pricing = getDiscountedPrice(p);
      return {
        ...p,
        price: pricing.discountedPrice,
        originalPrice: pricing.originalPrice,
        isOnSale: pricing.isOnSale,
        discount: pricing.discount,
        rating: 5,
        images: p.images,
      };
    });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: product.name, href: `/${product.id}` },
  ];

  const jsonLdBreadcrumbs = [
    { name: "Home", url: canonicalDomain },
    { name: "Shop", url: `${canonicalDomain}/shop` },
    { name: product.name, url: `${canonicalDomain}/${product.id}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data JSON-LD */}
      <JsonLd
        type="Product"
        name={product.name}
        description={pRecord.metaDescription || product.shortDescription}
        image={product.images}
        price={product.price}
        availability={product.inStock}
        sku={pRecord.sku || product.id}
        brand={seo?.siteName || "Premika"}
        category={product.category}
        url={`${canonicalDomain}/${product.id}`}
        ratingValue={product.reviews.length > 0 ? 5 : undefined}
        reviewCount={product.reviews.length > 0 ? product.reviews.length : undefined}
      />
      <JsonLd type="BreadcrumbList" items={jsonLdBreadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Product Images */}
          <ProductImageCarousel images={product.images} alt={product.name} />

          {/* Product Details */}
          <ProductInfo
            id={product.id}
            title={product.name}
            price={product.price}
            rating={5}
            reviewCount={product.reviews.length}
            description={product.shortDescription}
            categories={[product.category]}
            tags={[product.category]}
            sizes={product.sizes}
            heights={(product as any).heights}
            inStock={product.inStock}
            images={product.images}
            isCombo={product.isCombo}
            comboItems={product.comboItems}
            gender={(product as any).gender}
          />
        </div>

        {/* Product Description Tabs */}
        <div className="mb-16">
          <ProductTabs
            description={product.longDescription}
            reviews={product.reviews}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts as any} />
      </div>
    </div>
  );
}
