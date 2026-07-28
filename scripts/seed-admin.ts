import "dotenv/config";
import { db } from "../db/client";
import { admins } from "../db/schema/admin";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function seedAdmin() {
  console.log("🌱 Checking Super Admin account...");

  const adminName = process.env.ADMIN_NAME || "Super Admin";
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@premika.shop").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  const nameParts = adminName.trim().split(" ");
  const firstName = nameParts[0] || "Super";
  const lastName = nameParts.slice(1).join(" ") || "Admin";

  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.email, adminEmail))
    .then((rows) => rows[0]);

  if (existing) {
    console.log(`✅ Super Admin already exists: ${adminEmail} (ID: ${existing.id})`);
    return;
  }

  const passwordHash = hashPassword(adminPassword);

  const [created] = await db
    .insert(admins)
    .values({
      firstName,
      lastName,
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      isActive: true,
    })
    .returning();

  console.log(`🎉 Created Super Admin successfully!`);
  console.log(`📧 Email: ${created.email}`);
  console.log(`🔑 Role: ${created.role}`);
}

seedAdmin()
  .then(() => {
    console.log("✨ Seed script completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed script error:", err);
    process.exit(1);
  });
