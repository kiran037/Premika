import { NextRequest } from "next/server";
import { checkoutInputSchema } from "@/lib/validations/checkout.schema";
import { OrderService } from "@/services/order.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = checkoutInputSchema.safeParse(body);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid checkout data";
      return errorResponse(errorMessage, 400);
    }

    const orderResult = await OrderService.createGuestOrder(validationResult.data);
    return successResponse(orderResult, "Order created successfully", 201);
  } catch (err: any) {
    console.error("Error creating guest order:", err);
    return errorResponse(err.message || "Failed to create order. Please try again.", 400);
  }
}
