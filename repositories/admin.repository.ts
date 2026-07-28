import { db } from "@/db/client";
import { admins, adminActivityLogs } from "@/db/schema/admin";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export class AdminRepository {
  /**
   * Find admin record by email
   */
  static async findByEmail(email: string) {
    const rows = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()));

    return rows[0] || null;
  }

  /**
   * Find admin record by ID
   */
  static async findById(id: string) {
    const rows = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id));

    return rows[0] || null;
  }

  /**
   * Ensure default Super Admin account exists in the database
   */
  static async ensureDefaultSuperAdmin() {
    const existing = await this.findByEmail("admin@premika.shop");
    if (existing) return existing;

    // Hash default password "Admin@123456"
    const salt = "premika_salt_2025";
    const passwordHash = crypto
      .pbkdf2Sync("Admin@123456", salt, 10000, 64, "sha512")
      .toString("hex");

    const [created] = await db
      .insert(admins)
      .values({
        firstName: "Super",
        lastName: "Admin",
        email: "admin@premika.shop",
        passwordHash: `${salt}:${passwordHash}`,
        role: "super_admin",
        isActive: true,
      })
      .returning();

    return created;
  }

  /**
   * Update admin last login timestamp
   */
  static async updateLastLogin(adminId: string) {
    await db
      .update(admins)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(admins.id, adminId));
  }

  /**
   * Log administrative activity audit trail
   */
  static async logActivity(payload: {
    adminId?: string;
    action: "create" | "update" | "delete" | "login" | "logout";
    entity: string;
    entityId?: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await db.insert(adminActivityLogs).values({
        adminId: payload.adminId || null,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId || null,
        description: payload.description || null,
        ipAddress: payload.ipAddress || null,
        userAgent: payload.userAgent || null,
      });
    } catch (err) {
      console.error("Failed to insert admin activity log:", err);
    }
  }
}
