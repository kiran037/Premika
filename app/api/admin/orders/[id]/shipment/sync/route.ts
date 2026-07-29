import { NextRequest, NextResponse } from "next/server";
import { ShipmentService } from "@/services/shipment.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const result = await ShipmentService.syncShipmentStatus(orderId);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Shipment tracking status synced successfully",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error syncing Delhivery shipment status:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to sync shipment status" },
      { status: 400 }
    );
  }
}
