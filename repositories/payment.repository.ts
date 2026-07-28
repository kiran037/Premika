import { db } from "@/db/client";
import { payments, paymentTransactions, orders } from "@/db/schema/order";
import { eq } from "drizzle-orm";

export class PaymentRepository {
  /**
   * Create pending payment record for an order
   */
  static async createPendingPayment(
    orderId: string,
    gatewayOrderId: string,
    amount: number
  ) {
    const [paymentRecord] = await db
      .insert(payments)
      .values({
        orderId,
        paymentMethod: "razorpay",
        status: "pending",
        amount,
        gateway: "razorpay",
        gatewayOrderId,
      })
      .returning();

    return paymentRecord;
  }

  /**
   * Find payment record by Razorpay gateway order ID
   */
  static async findPaymentByGatewayOrderId(gatewayOrderId: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.gatewayOrderId, gatewayOrderId));

    return rows[0] || null;
  }

  /**
   * Find payment record by DB order ID
   */
  static async findPaymentByOrderId(orderId: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));

    return rows[0] || null;
  }

  /**
   * Atomic database transaction completing payment and confirming order
   */
  static async completePaymentTransaction(
    paymentId: string,
    orderId: string,
    gatewayPaymentId: string,
    gatewaySignature: string
  ) {
    return await db.transaction(async (tx) => {
      // 1. Update Payment Record
      const [updatedPayment] = await tx
        .update(payments)
        .set({
          status: "paid",
          gatewayPaymentId,
          gatewaySignature,
          paidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))
        .returning();

      // 2. Update Order Record
      await tx
        .update(orders)
        .set({
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      // 3. Record Payment Transaction Log
      await tx.insert(paymentTransactions).values({
        paymentId,
        status: "paid",
        amount: updatedPayment.amount,
        gatewayResponse: JSON.stringify({
          gatewayPaymentId,
          gatewaySignature,
          status: "success",
        }),
      });

      return updatedPayment;
    });
  }

  /**
   * Record payment failure
   */
  static async markPaymentFailed(
    paymentId: string,
    errorCode?: string,
    errorMessage?: string
  ) {
    return await db.transaction(async (tx) => {
      const [updatedPayment] = await tx
        .update(payments)
        .set({
          status: "failed",
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))
        .returning();

      await tx.insert(paymentTransactions).values({
        paymentId,
        status: "failed",
        amount: updatedPayment ? updatedPayment.amount : 0,
        errorCode: errorCode || "VERIFICATION_FAILED",
        errorMessage: errorMessage || "Payment signature verification failed",
      });

      return updatedPayment;
    });
  }
}
