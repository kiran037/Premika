import { db } from "@/db/client";
import { shipments, shipmentTracking } from "@/db/schema/order";
import { eq } from "drizzle-orm";

export class ShipmentRepository {
  /**
   * Fetch shipment record by Order ID
   */
  static async getShipmentByOrderId(orderId: string) {
    const rows = await db.select().from(shipments).where(eq(shipments.orderId, orderId));
    return rows[0] || null;
  }

  /**
   * Fetch shipment record by tracking number (Waybill)
   */
  static async getShipmentByTrackingNumber(trackingNumber: string) {
    const rows = await db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber));
    return rows[0] || null;
  }

  /**
   * Create a new shipment record for an order
   */
  static async createShipmentRecord(data: typeof shipments.$inferInsert) {
    const [inserted] = await db.insert(shipments).values(data).returning();
    return inserted;
  }

  /**
   * Update shipment status and tracking metadata
   */
  static async updateShipmentStatus(
    shipmentId: string,
    payload: {
      status: any;
      courierName?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      shippedAt?: Date;
      deliveredAt?: Date;
    }
  ) {
    const [updated] = await db
      .update(shipments)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(shipments.id, shipmentId))
      .returning();

    return updated;
  }

  /**
   * Record a tracking scan event in shipment_tracking history
   */
  static async addTrackingHistory(data: {
    shipmentId: string;
    status: any;
    location?: string;
    description?: string;
  }) {
    const [inserted] = await db
      .insert(shipmentTracking)
      .values({
        shipmentId: data.shipmentId,
        status: data.status,
        location: data.location || null,
        description: data.description || null,
      })
      .returning();

    return inserted;
  }

  /**
   * Fetch tracking scans history for a shipment
   */
  static async getTrackingHistory(shipmentId: string) {
    return db
      .select()
      .from(shipmentTracking)
      .where(eq(shipmentTracking.shipmentId, shipmentId));
  }
}
