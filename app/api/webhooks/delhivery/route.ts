import { NextRequest, NextResponse } from "next/server";
import { DELHIVERY_CONFIG, mapDelhiveryStatusToShipmentStatus } from "@/lib/delhivery";
import { ShipmentRepository } from "@/repositories/shipment.repository";
import { OrderRepository } from "@/repositories/order.repository";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const expectedSecret = DELHIVERY_CONFIG.webhookSecret;
    if (expectedSecret) {
      const headerSecret = req.headers.get("x-delhivery-secret") || req.headers.get("authorization");
      const urlSecret = new URL(req.url).searchParams.get("secret");

      if (headerSecret !== expectedSecret && urlSecret !== expectedSecret) {
        return NextResponse.json({ success: false, message: "Unauthorized webhook request" }, { status: 401 });
      }
    }

    const payload = await req.json();
    const waybill = payload.waybill || payload.AWB || payload.wbn;
    const rawStatus = payload.status || payload.Status || payload.scans?.[0]?.scanType;

    if (!waybill || !rawStatus) {
      return NextResponse.json(
        { success: true, message: "Webhook event ignored: Missing waybill or status payload" },
        { status: 200 }
      );
    }

    const shipment = await ShipmentRepository.getShipmentByTrackingNumber(waybill);
    if (!shipment) {
      return NextResponse.json(
        { success: true, message: `No matching internal shipment found for AWB ${waybill}` },
        { status: 200 }
      );
    }

    const newShipmentStatus = mapDelhiveryStatusToShipmentStatus(rawStatus);

    const updatedShipment = await ShipmentRepository.updateShipmentStatus(shipment.id, {
      status: newShipmentStatus,
      deliveredAt: newShipmentStatus === "delivered" ? new Date() : shipment.deliveredAt || undefined,
    });

    await ShipmentRepository.addTrackingHistory({
      shipmentId: shipment.id,
      status: newShipmentStatus,
      location: payload.location || payload.scans?.[0]?.location || "Delhivery Network",
      description: payload.instructions || payload.scans?.[0]?.instructions || rawStatus,
    });

    let orderStatus = "shipped";
    if (newShipmentStatus === "delivered") orderStatus = "delivered";
    else if (newShipmentStatus === "failed" || newShipmentStatus === "returned") orderStatus = "cancelled";

    await OrderRepository.updateOrderStatusAndFulfillment(shipment.orderId, {
      status: orderStatus as any,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Delhivery webhook processed successfully for AWB ${waybill}`,
        data: { shipmentId: shipment.id, newStatus: newShipmentStatus },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error processing Delhivery webhook:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Error processing webhook payload" },
      { status: 500 }
    );
  }
}
