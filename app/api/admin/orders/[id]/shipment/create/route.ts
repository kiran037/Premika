import { NextRequest, NextResponse } from "next/server";
import { ShipmentService } from "@/services/shipment.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";
import { adminShipmentCreateSchema } from "@/lib/validations/admin-shipment.schema";

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

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const validationResult = adminShipmentCreateSchema.safeParse(body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid shipment parameters";
      return NextResponse.json(
        {
          success: false,
          message: firstIssue,
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await ShipmentService.createDelhiveryShipmentForOrder(
      orderId,
      validationResult.data
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: `Delhivery shipment created successfully with AWB: ${result.waybill}`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating Delhivery shipment:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create Delhivery shipment" },
      { status: 400 }
    );
  }
}
