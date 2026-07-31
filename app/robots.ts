import { MetadataRoute } from "next";
import { SeoService } from "@/services/seo.service";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const seo = await SeoService.getSeoSettings();

    const baseUrl = seo?.canonicalDomain || "https://premika.shop";
    const defaultRobots = seo?.defaultRobots || "index, follow";

    const isNoIndex = defaultRobots.includes("noindex");

    if (isNoIndex) {
      return {
        rules: {
          userAgent: "*",
          disallow: "/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
      };
    }

    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/", "/cart/"],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl,
    };
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      sitemap: "https://premika.shop/sitemap.xml",
      host: "https://premika.shop",
    };
  }
}
