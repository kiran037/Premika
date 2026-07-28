import Razorpay from "razorpay";
import crypto from "crypto";
import { CheckoutInput } from "@/lib/validations/checkout.schema";
import { OrderService } from "@/services/order.service";
import { PaymentRepository } from "@/repositories/payment.repository";
import { sendOrderConfirmationEmail } from "@/lib/emailService";

export class PaymentService {
  private static getRazorpayInstance() {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("Razorpay environment variables are missing!");
    }

    return new Razorpay({
      key_id: keyId || "dummy",
      key_secret: keySecret || "dummy",
    });
  }

  /**
   * Create DB order + Razorpay Payment Order
   */
  static async createPaymentOrder(checkoutInput: CheckoutInput) {
    // 1. Create DB Order & Order Items
    const orderResult = await OrderService.createGuestOrder(checkoutInput);

    // 2. Initialize Razorpay Order
    const razorpay = this.getRazorpayInstance();
    const amountInPaise = Math.round(orderResult.total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderResult.orderNumber,
      notes: {
        order_number: orderResult.orderNumber,
        customer_email: orderResult.customer.email,
      },
    });

    // 3. Persist pending payment record in DB
    await PaymentRepository.createPendingPayment(
      orderResult.orderId,
      razorpayOrder.id,
      amountInPaise
    );

    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: orderResult.orderNumber,
      orderId: orderResult.orderId,
      customer: orderResult.customer,
    };
  }

  /**
   * Verify Razorpay HMAC SHA-256 Signature & complete order
   */
  static async verifyPaymentSignature(payload: {
    orderId: string; // razorpay_order_id
    razorpayPaymentId: string;
    razorpaySignature: string;
    customerInfo?: any;
    cartItems?: any[];
    orderSummary?: any;
  }) {
    const {
      orderId: razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerInfo,
      cartItems,
      orderSummary,
    } = payload;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // 1. Compute HMAC SHA-256 Signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpaySignature;

    // 2. Find Payment Record in DB
    let paymentRecord = await PaymentRepository.findPaymentByGatewayOrderId(razorpayOrderId);
    if (!paymentRecord) {
      paymentRecord = await PaymentRepository.findPaymentByOrderId(razorpayOrderId);
    }

    if (!isSignatureValid) {
      if (paymentRecord) {
        await PaymentRepository.markPaymentFailed(
          paymentRecord.id,
          "SIGNATURE_MISMATCH",
          "Calculated HMAC signature does not match razorpay_signature"
        );
      }
      return { isOk: false, message: "Payment verification failed" };
    }

    // 3. Complete payment transaction atomically in DB
    if (paymentRecord) {
      await PaymentRepository.completePaymentTransaction(
        paymentRecord.id,
        paymentRecord.orderId,
        razorpayPaymentId,
        razorpaySignature
      );
    }

    // 4. Send Confirmation Email asynchronously
    if (customerInfo?.email) {
      sendOrderConfirmationEmail({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        customerInfo,
        cartItems: cartItems || [],
        orderSummary,
      }).catch((err) => {
        console.error("Non-fatal email notification error:", err);
      });
    }

    return {
      isOk: true,
      message: "Payment verified successfully",
      orderId: razorpayOrderId,
    };
  }
}
