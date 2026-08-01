import { db } from "@/db/client";
import {
  storeSettings,
  storeContacts,
  socialLinks,
} from "@/db/schema/store";
import { eq, asc } from "drizzle-orm";
import { SeoRepository } from "./seo.repository";
import { GlobalSeoInput } from "@/lib/validations/seo";

type StoreSettings = typeof storeSettings.$inferSelect;
type StoreContacts = typeof storeContacts.$inferSelect;
type SocialLink = typeof socialLinks.$inferSelect;
type NewStoreSettings = typeof storeSettings.$inferInsert;
type NewStoreContacts = typeof storeContacts.$inferInsert;
type NewSocialLink = typeof socialLinks.$inferInsert;

export class StoreRepository {
  // Settings & Branding
  static async getStoreSettings(): Promise<StoreSettings | null> {
    const [settings] = await db.select().from(storeSettings).limit(1);
    return settings || null;
  }

  static async upsertStoreSettings(
    data: Partial<NewStoreSettings>
  ): Promise<StoreSettings> {
    const current = await this.getStoreSettings();

    if (current) {
      const [updated] = await db
        .update(storeSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.id, current.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(storeSettings)
        .values({
          storeName: data.storeName || "Premika",
          storeEmail: data.storeEmail || "contact@premika.shop",
          storePhone: data.storePhone || null,
          logo: data.logo || null,
          favicon: data.favicon || null,
          currency: data.currency || "INR",
          timezone: data.timezone || "Asia/Kolkata",
          maintenanceMode: data.maintenanceMode ?? false,
          ...data,
        })
        .returning();
      return created;
    }
  }

  // Global SEO Settings Delegate
  static async getSeoSettings() {
    return SeoRepository.getSeoSettings();
  }

  static async updateSeoSettings(data: GlobalSeoInput) {
    return SeoRepository.updateSeoSettings(data);
  }

  // Contact Information
  static async getStoreContacts(): Promise<StoreContacts | null> {
    const [contacts] = await db.select().from(storeContacts).limit(1);
    return contacts || null;
  }

  static async upsertStoreContacts(
    data: Partial<NewStoreContacts>
  ): Promise<StoreContacts> {
    const current = await this.getStoreContacts();

    if (current) {
      const [updated] = await db
        .update(storeContacts)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(storeContacts.id, current.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(storeContacts)
        .values({
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          country: data.country || "India",
          postalCode: data.postalCode || null,
          supportEmail: data.supportEmail || null,
          supportPhone: data.supportPhone || null,
          businessHours: data.businessHours || null,
          googleMapsUrl: data.googleMapsUrl || null,
          ...data,
        })
        .returning();
      return created;
    }
  }

  // Social Links
  static async getSocialLinks(): Promise<SocialLink[]> {
    return db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
  }

  static async getSocialLinkById(id: string): Promise<SocialLink | null> {
    const [link] = await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.id, id))
      .limit(1);
    return link || null;
  }

  static async createSocialLink(data: NewSocialLink): Promise<SocialLink> {
    const [created] = await db.insert(socialLinks).values(data).returning();
    return created;
  }

  static async updateSocialLink(
    id: string,
    data: Partial<NewSocialLink>
  ): Promise<SocialLink> {
    const [updated] = await db
      .update(socialLinks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(socialLinks.id, id))
      .returning();
    return updated;
  }

  static async deleteSocialLink(id: string): Promise<SocialLink> {
    const [deleted] = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id))
      .returning();
    return deleted;
  }
}
