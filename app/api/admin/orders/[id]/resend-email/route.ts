import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { sendOrderConfirmationEmail } from "@/lib/emailService";
import { OrderData } from "@/types";
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

    const orderData = await OrderService.getAdminOrderById(params.id);
    if (!orderData || !orderData.customer?.email) {
      return NextResponse.json({ success: false, message: "Order or customer email not found" }, { status: 404 });
    }

    const orderDataPayload: OrderData = {
      orderId: orderData.order.orderNumber,
      customerInfo: {
        name:
          `${orderData.customer.firstName || ""} ${orderData.customer.lastName || ""}`.trim() ||
          "Customer",
        email: orderData.customer.email,
        phone: orderData.customer.phone || "",
        address: {
          line1: orderData.address?.addressLine1 || "N/A",
          line2: orderData.address?.addressLine2 || undefined,
          city: orderData.address?.city || "N/A",
          state: orderData.address?.state || "N/A",
          postal_code: orderData.address?.postalCode || "N/A",
          country: orderData.address?.country || "India",
        },
      },
      cartItems: orderData.items.map((i: any) => ({
        id: i.productId,
        name: i.productName,
        price: i.unitPrice,
        quantity: i.quantity,
        images: [],
        category: "clothing",
      })),
      orderSummary: {
        subtotal: orderData.order.subtotal,
        shipping: orderData.order.shippingCharge,
        total: orderData.order.total,
      },
    };

    const sent = await sendOrderConfirmationEmail(orderDataPayload);

    return NextResponse.json(
      {
        success: true,
        message: sent.success
          ? "Order confirmation email sent successfully"
          : "Email service attempted (logged or sent)",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error resending order email:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to send email" }, { status: 500 });
  }
}
