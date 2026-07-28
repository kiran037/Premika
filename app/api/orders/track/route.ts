import { NextRequest } from "next/server";
import { trackOrderSchema } from "@/lib/validations/track-order.schema";
import { OrderService } from "@/services/order.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = trackOrderSchema.safeParse(body);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return errorResponse(
        firstIssue ? `${firstIssue.message}` : "Invalid order lookup criteria",
        400
      );
    }

    const { orderNumber, identifier } = validationResult.data;
    const trackingData = await OrderService.trackGuestOrder(orderNumber, identifier);

    return successResponse(trackingData, "Order details retrieved successfully");
  } catch (err: any) {
    console.error("Error in order tracking API:", err);
    return errorResponse(err.message || "Failed to retrieve order tracking information", 404);
  }
}
