import crypto from "crypto";
import { AdminRepository } from "@/repositories/admin.repository";

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "CRITICAL CONFIGURATION ERROR: ADMIN_SESSION_SECRET environment variable is missing!"
    );
  }
  return secret;
}

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
   * Hash password with PBKDF2 salt (210,000 iterations for SHA512)
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = 210000;
    const hash = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex");
    return `${salt}:${hash}:${iterations}`;
  }

  /**
   * Verify candidate password against stored hash (timing-safe comparison, supports legacy 10,000 iteration hashes)
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    if (!storedHash || !storedHash.includes(":")) return false;
    const parts = storedHash.split(":");
    const salt = parts[0];
    const originalHash = parts[1];
    const iterations = parts[2] ? parseInt(parts[2], 10) : 10000;

    if (!salt || !originalHash) return false;

    const candidateHash = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex");

    const candBuf = Buffer.from(candidateHash, "hex");
    const origBuf = Buffer.from(originalHash, "hex");

    if (candBuf.length !== origBuf.length) return false;
    return crypto.timingSafeEqual(candBuf, origBuf);
  }

  /**
   * Create signed session token string
   */
  static createSessionToken(payload: AdminSessionPayload): string {
    const secret = getSessionSecret();
    const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", secret)
      .update(dataStr)
      .digest("hex");
    return `${dataStr}.${signature}`;
  }

  /**
   * Verify signed session token string using timing-safe signature comparison
   */
  static verifySessionToken(token: string): AdminSessionPayload | null {
    try {
      if (!token || !token.includes(".")) return null;
      const secret = getSessionSecret();
      const [dataStr, signature] = token.split(".");
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(dataStr)
        .digest("hex");

      const sigBuf = Buffer.from(signature, "hex");
      const expBuf = Buffer.from(expectedSignature, "hex");

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
      }

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
