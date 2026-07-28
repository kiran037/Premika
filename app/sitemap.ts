import { MetadataRoute } from "next";
import { ProductService } from "@/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://premika.shop";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: "always",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: "always",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: "always",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: currentDate,
      changeFrequency: "always",
      priority: 0.7,
    },
  ];

  try {
    const { items: products } = await ProductService.getProducts({ limit: 100 });

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/${product.id}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
