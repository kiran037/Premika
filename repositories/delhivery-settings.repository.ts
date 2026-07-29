import { db } from "@/db/client";
import { delhiverySettings } from "@/db/schema/delhivery";
import { eq } from "drizzle-orm";

export class DelhiverySettingsRepository {
  /**
   * Fetch active Delhivery shipping & pickup settings
   */
  static async getSettings() {
    const rows = await db.select().from(delhiverySettings).limit(1);
    return rows[0] || null;
  }

  /**
   * Upsert single Delhivery shipping & pickup configuration
   */
  static async upsertSettings(data: Partial<typeof delhiverySettings.$inferInsert>) {
    const existing = await this.getSettings();

    if (existing) {
      const [updated] = await db
        .update(delhiverySettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(delhiverySettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(delhiverySettings)
        .values({
          pickupName: data.pickupName || "Premika Warehouse",
          pickupPhone: data.pickupPhone || "",
          pickupEmail: data.pickupEmail || "",
          pickupAddressLine1: data.pickupAddressLine1 || "",
          pickupAddressLine2: data.pickupAddressLine2 || null,
          pickupCity: data.pickupCity || "",
          pickupState: data.pickupState || "",
          pickupPincode: data.pickupPincode || "",
          pickupCountry: data.pickupCountry || "India",
          isActive: data.isActive ?? true,
        })
        .returning();
      return inserted;
    }
  }
}
