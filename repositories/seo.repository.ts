import { db } from "@/db/client";
import { seoSettings, SeoSettings, NewSeoSettings } from "@/db/schema/seo";
import { eq } from "drizzle-orm";

export class SeoRepository {
  /**
   * Fetch global SEO settings or initialize default row if empty
   */
  static async getSeoSettings(): Promise<SeoSettings> {
    const [settings] = await db.select().from(seoSettings).limit(1);

    if (settings) {
      return settings;
    }

    // Auto-create default SEO settings if empty
    const [newSettings] = await db
      .insert(seoSettings)
      .values({
        siteName: "Premika",
        titleTemplate: "%s | Premika",
        defaultMetaTitle: "Premika | Premium Ethnic Wear",
        defaultMetaDescription: "Prem se bana, Premika ke liye. Thoughtfully crafted Indian ethnic wear.",
        defaultRobots: "index, follow",
      })
      .returning();

    return newSettings;
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
   * Update global SEO settings row
   */
  static async updateSeoSettings(data: Partial<NewSeoSettings>): Promise<SeoSettings> {
    const current = await this.getSeoSettings();

    const [updated] = await db
      .update(seoSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(seoSettings.id, current.id))
      .returning();

    return updated;
  }
}
