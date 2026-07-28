import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { generatePdfBuffer } from "@/lib/invoice-generator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("email") || searchParams.get("phone") || searchParams.get("identifier");

    if (!identifier) {
      return NextResponse.json(
        { error: "Email or phone identifier is required to download invoice" },
        { status: 400 }
      );
    }

    const orderData = await OrderService.trackGuestOrder(params.orderNumber, identifier);

    const pdfBuffer = generatePdfBuffer({
      orderNumber: orderData.orderNumber,
      orderDate: new Date(orderData.orderDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      paymentStatus: orderData.paymentStatus,
      orderStatus: orderData.orderStatus,
      customerName: orderData.customer.name,
      customerEmail: orderData.customer.email,
      customerPhone: orderData.customer.phone || "",
      shippingAddress: orderData.address
        ? {
            line1: orderData.address.line1,
            line2: orderData.address.line2 || undefined,
            city: orderData.address.city,
            state: orderData.address.state,
            postalCode: orderData.address.postalCode,
            country: orderData.address.country,
          }
        : {
            line1: "N/A",
            city: "N/A",
            state: "N/A",
            postalCode: "N/A",
            country: "India",
          },
      items: orderData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingCharge: orderData.shippingCharge,
      tax: orderData.tax,
      total: orderData.total,
    });

    const response = new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${orderData.orderNumber}.pdf"`,
      },
    });

    return response;
  } catch (err: any) {
    console.error("Error generating invoice PDF:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate PDF invoice" },
      { status: 404 }
    );
  }
}
