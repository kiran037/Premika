import crypto from "crypto";
import { AdminRepository } from "@/repositories/admin.repository";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "premika_super_secret_admin_session_key_2025";
export const ADMIN_COOKIE_NAME = "admin_session_token";

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: "super_admin" | "admin" | "manager" | "staff";
  name: string;
  expiresAt: number;
}

export class AdminAuthService {
  /**
   * Hash password with PBKDF2 salt
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return `${salt}:${hash}`;
  }

  /**
   * Verify candidate password against stored hash
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    if (!storedHash || !storedHash.includes(":")) return false;
    const [salt, originalHash] = storedHash.split(":");
    const candidateHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return candidateHash === originalHash;
  }

  /**
   * Create signed session token string
   */
  static createSessionToken(payload: AdminSessionPayload): string {
    const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(dataStr)
      .digest("hex");
    return `${dataStr}.${signature}`;
  }

  /**
   * Verify signed session token string
   */
  static verifySessionToken(token: string): AdminSessionPayload | null {
    try {
      if (!token || !token.includes(".")) return null;
      const [dataStr, signature] = token.split(".");
      const expectedSignature = crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(dataStr)
        .digest("hex");

      if (signature !== expectedSignature) return null;

      const payload: AdminSessionPayload = JSON.parse(
        Buffer.from(dataStr, "base64url").toString("utf-8")
      );

      if (Date.now() > payload.expiresAt) return null;

      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Authenticate admin credentials and issue session token
   */
  static async authenticate(payload: {
    email: string;
    password: string;
    rememberMe?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // 1. Auto-seed default Super Admin if table is empty
    await AdminRepository.ensureDefaultSuperAdmin();

    const admin = await AdminRepository.findByEmail(payload.email);

    if (!admin) {
      throw new Error("Invalid admin email or password");
    }

    if (!admin.isActive) {
      throw new Error("Admin account has been deactivated");
    }

    const isValidPassword = this.verifyPassword(payload.password, admin.passwordHash);

    if (!isValidPassword) {
      throw new Error("Invalid admin email or password");
    }

    // 2. Update last login timestamp & log audit trail
    await AdminRepository.updateLastLogin(admin.id);
    await AdminRepository.logActivity({
      adminId: admin.id,
      action: "login",
      entity: "admins",
      entityId: admin.id,
      description: `Admin ${admin.email} logged in successfully`,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    });

    // 3. Create session token (expires in 24 hours or 7 days)
    const durationMs = payload.rememberMe
      ? 7 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

    const sessionPayload: AdminSessionPayload = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      name: `${admin.firstName} ${admin.lastName || ""}`.trim(),
      expiresAt: Date.now() + durationMs,
    };

    const token = this.createSessionToken(sessionPayload);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        name: sessionPayload.name,
        role: admin.role,
      },
      token,
      maxAge: Math.floor(durationMs / 1000),
    };
  }

  /**
   * Log out admin session
   */
  static async logoutAdmin(adminId?: string, ipAddress?: string, userAgent?: string) {
    if (adminId) {
      await AdminRepository.logActivity({
        adminId,
        action: "logout",
        entity: "admins",
        entityId: adminId,
        description: `Admin logged out`,
        ipAddress,
        userAgent,
      });
    }
  }
}
