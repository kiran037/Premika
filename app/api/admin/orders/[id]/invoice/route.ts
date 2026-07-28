import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { generatePdfBuffer, InvoiceData } from "@/lib/invoice-generator";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const orderData = await OrderService.getAdminOrderById(params.id);
    if (!orderData) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const pdfData: InvoiceData = {
      orderNumber: orderData.order.orderNumber,
      orderDate: new Date(orderData.order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      paymentStatus: orderData.payment?.status || "pending",
      orderStatus: orderData.order.status,
      customerName:
        `${orderData.customer?.firstName || ""} ${orderData.customer?.lastName || ""}`.trim() ||
        "Guest Customer",
      customerEmail: orderData.customer?.email || "N/A",
      customerPhone: orderData.customer?.phone || "N/A",
      shippingAddress: {
        line1: orderData.address?.addressLine1 || "N/A",
        line2: orderData.address?.addressLine2 || undefined,
        city: orderData.address?.city || "N/A",
        state: orderData.address?.state || "N/A",
        postalCode: orderData.address?.postalCode || "N/A",
        country: orderData.address?.country || "India",
      },
      items: orderData.items.map((i: any) => ({
        name: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
      subtotal: orderData.order.subtotal,
      discount: orderData.order.discount,
      shippingCharge: orderData.order.shippingCharge,
      tax: orderData.order.tax,
      total: orderData.order.total,
    };

    const pdfBuffer = generatePdfBuffer(pdfData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${orderData.order.orderNumber}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Error generating admin invoice PDF:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to generate invoice PDF" },
      { status: 500 }
    );
  }
}
