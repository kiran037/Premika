import { MetadataRoute } from "next";
import { ProductRepository } from "@/repositories/product.repository";
import { CategoryService } from "@/services/category.service";
import { SeoService } from "@/services/seo.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  let baseUrl = "https://premika.shop";

  try {
    const seo = await SeoService.getSeoSettings();
    if (seo?.canonicalDomain) {
      baseUrl = seo.canonicalDomain.replace(/\/$/, "");
    }
  } catch {
    // Fallback if SEO settings unavailable
  }

  // Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
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
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const [categories, { items: productItems }] = await Promise.all([
      CategoryService.getCategories(),
      ProductRepository.getAdminProducts({ limit: 1000, isActive: true }),
    ]);

    // Filter active categories that are NOT marked noIndex
    const categoryPages: MetadataRoute.Sitemap = categories
      .filter((cat) => cat.isActive && !cat.noIndex)
      .map((cat) => ({
        url: `${baseUrl}/category/${encodeURIComponent(cat.slug)}`,
        lastModified: cat.updatedAt ? new Date(cat.updatedAt).toISOString() : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    // Filter active products
    const productPages: MetadataRoute.Sitemap = productItems
      .map((p: any) => ({
        url: `${baseUrl}/${encodeURIComponent(p.id)}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    // Deduplicate entries by URL
    const map = new Map<string, MetadataRoute.Sitemap[number]>();
    [...staticPages, ...categoryPages, ...productPages].forEach((entry) => {
      if (entry.url && !map.has(entry.url)) {
        map.set(entry.url, entry);
      }
    });

    return Array.from(map.values());
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticPages;
  }
}
