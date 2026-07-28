import { db } from "@/db/client";
import { storeSettings, storeContacts, socialLinks } from "@/db/schema/store";
import { eq, asc } from "drizzle-orm";

export class StoreRepository {
  // Store Settings
  static async getStoreSettings() {
    const rows = await db.select().from(storeSettings).limit(1);
    return rows[0] || null;
  }

  static async upsertStoreSettings(data: Partial<typeof storeSettings.$inferInsert>) {
    const existing = await this.getStoreSettings();

    if (existing) {
      const [updated] = await db
        .update(storeSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
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
        })
        .returning();
      return inserted;
    }
  }

  // Store Contacts
  static async getStoreContacts() {
    const rows = await db.select().from(storeContacts).limit(1);
    return rows[0] || null;
  }

  static async upsertStoreContacts(data: Partial<typeof storeContacts.$inferInsert>) {
    const existing = await this.getStoreContacts();

    if (existing) {
      const [updated] = await db
        .update(storeContacts)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(storeContacts.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
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
        })
        .returning();
      return inserted;
    }
  }

  // Social Links
  static async getSocialLinks() {
    return db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
  }

  static async getSocialLinkById(id: string) {
    const rows = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return rows[0] || null;
  }

  static async createSocialLink(data: typeof socialLinks.$inferInsert) {
    const [inserted] = await db.insert(socialLinks).values(data).returning();
    return inserted;
  }

  static async updateSocialLink(id: string, data: Partial<typeof socialLinks.$inferInsert>) {
    const [updated] = await db
      .update(socialLinks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(socialLinks.id, id))
      .returning();
    return updated || null;
  }

  static async deleteSocialLink(id: string) {
    const [deleted] = await db.delete(socialLinks).where(eq(socialLinks.id, id)).returning();
    return deleted || null;
  }
}
