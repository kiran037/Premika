import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export interface SystemInfoResult {
  appVersion: string;
  environment: string;
  nodeVersion: string;
  databaseStatus: "connected" | "disconnected";
  storageStatus: "operational" | "degraded";
  emailStatus: "configured" | "not_configured";
  paymentGatewayStatus: "configured" | "not_configured";
  buildTime: string;
  uptimeSeconds: number;
}

export class SystemService {
  static async getSystemInfo(): Promise<SystemInfoResult> {
    let databaseStatus: "connected" | "disconnected" = "connected";
    try {
      await db.execute(sql`SELECT 1`);
    } catch {
      databaseStatus = "disconnected";
    }

    const hasEmailConfig = Boolean(
      process.env.SMTP_HOST ||
      process.env.RESEND_API_KEY ||
      process.env.EMAIL_SERVER_HOST
    );

    const hasPaymentConfig = Boolean(
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    );

    return {
      appVersion: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version || "v20.x",
      databaseStatus,
      storageStatus: "operational",
      emailStatus: hasEmailConfig ? "configured" : "not_configured",
      paymentGatewayStatus: hasPaymentConfig ? "configured" : "not_configured",
      buildTime: process.env.BUILD_TIME || new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
