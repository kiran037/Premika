import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductInfo } from "@/components/product-info";
import { ProductTabs } from "@/components/product-tabs";
import { RelatedProducts } from "@/components/related-products";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductService } from "@/services/product.service";
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
  const product = await ProductService.getProductBySlug(params.productId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const pricing = getDiscountedPrice(product);
  const priceDisplay = pricing.isOnSale
    ? `₹${pricing.discountedPrice.toFixed(2)} (${
        pricing.discount
      }% OFF - was ₹${pricing.originalPrice.toFixed(2)})`
    : `₹${product.price.toFixed(2)}`;

  return {
    title: `${product.name}`,
    description: `${
      product.shortDescription
    } - Available at Premika Store for ${priceDisplay}. ${
      product.inStock ? "In Stock" : "Out of Stock"
    }.`,
  };
}

export default async function SingleProductPage({ params }: SingleProductPageProps) {
  const product = await ProductService.getProductBySlug(params.productId);

  if (!product) {
    notFound();
  }

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
    { label: "Shop", href: "/" },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-background">
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
