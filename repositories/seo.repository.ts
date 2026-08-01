import { db } from "@/db/client";
import { seoSettings, SeoSettings, NewSeoSettings } from "@/db/schema/seo";
import { eq } from "drizzle-orm";

export class SeoRepository {
  /**
   * Pure read operation: Fetch global SEO settings or return in-memory defaults if empty.
   */
  static async getSeoSettings(): Promise<SeoSettings> {
    try {
      const [settings] = await db.select().from(seoSettings).limit(1);

      if (settings) {
        return settings;
      }
    } catch (err) {
      console.error("Error reading SEO settings from DB, returning defaults:", err);
    }

    // In-memory fallback object without writing to PostgreSQL during read operations
    return {
      id: "default-seo",
      siteName: "Premika",
      titleTemplate: "%s | Premika",
      defaultMetaTitle: "Premika | Premium Ethnic Wear",
      defaultMetaDescription: "Prem se bana, Premika ke liye. Thoughtfully crafted Indian ethnic wear.",
      defaultKeywords: "ethnic wear, sarees, kurtis, indian fashion, premika",
      defaultOgImage: "/logo.png",
      twitterHandle: "@premika_store",
      googleVerification: null,
      bingVerification: null,
      defaultRobots: "index, follow",
      canonicalDomain: "https://premika.shop",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Create global SEO settings row
   */
  static async createSeoSettings(data: NewSeoSettings): Promise<SeoSettings> {
    const [newSettings] = await db
      .insert(seoSettings)
      .values(data)
      .returning();
    return newSettings;
  }

  /**
   * Update global SEO settings row (Upserts safely if table is currently empty)
   */
  static async updateSeoSettings(data: Partial<NewSeoSettings>): Promise<SeoSettings> {
    const [existing] = await db.select().from(seoSettings).limit(1);

    if (existing) {
      const [updated] = await db
        .update(seoSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(seoSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(seoSettings)
        .values({
          siteName: data.siteName || "Premika",
          titleTemplate: data.titleTemplate || "%s | Premika",
          defaultMetaTitle: data.defaultMetaTitle || "Premika | Premium Ethnic Wear",
          defaultMetaDescription: data.defaultMetaDescription || "Prem se bana, Premika ke liye. Thoughtfully crafted Indian ethnic wear.",
          defaultKeywords: data.defaultKeywords || null,
          defaultOgImage: data.defaultOgImage || null,
          twitterHandle: data.twitterHandle || null,
          googleVerification: data.googleVerification || null,
          bingVerification: data.bingVerification || null,
          defaultRobots: data.defaultRobots || "index, follow",
          canonicalDomain: data.canonicalDomain || null,
          ...data,
        })
        .returning();
      return inserted;
    }
  }
}
