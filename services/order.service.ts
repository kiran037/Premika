import { CheckoutInput } from "@/lib/validations/checkout.schema";
import { ProductRepository } from "@/repositories/product.repository";
import { CouponService } from "@/services/coupon.service";
import { OrderRepository } from "@/repositories/order.repository";
import { getDiscountedPrice } from "@/lib/pricing";

export class OrderService {
  // TODO: Admin Panel - Future Integration (Admin Order Management: updateOrderStatus, createShipment, updateTrackingNumber, refundOrder)

  static async createGuestOrder(input: CheckoutInput) {
    if (!input.items || input.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 1. Validate items against database
    const validatedItems: Array<{
      productId: string;
      productSizeId?: string;
      productHeightId?: string;
      productName: string;
      productSku?: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    let calculatedSubtotal = 0;

    for (const item of input.items) {
      const targetId = item.productId || item.id;
      const dbProduct = await ProductRepository.findProductBySlug(targetId);

      if (!dbProduct) {
        throw new Error(`Product "${item.name}" is no longer available.`);
      }

      const prod = dbProduct.product;

      if (prod.stockStatus === "out_of_stock") {
        throw new Error(`Product "${prod.name}" is currently out of stock.`);
      }

      // Calculate unit price from DB pricing rules
      const pricing = getDiscountedPrice({ price: prod.price });
      const unitPrice = Math.floor(pricing.discountedPrice);
      const qty = Math.max(1, item.quantity);
      const totalPrice = unitPrice * qty;

      calculatedSubtotal += totalPrice;

      // Find matching size record ID if size selected
      let matchedSizeId: string | undefined = undefined;
      if (item.selectedSize && dbProduct.sizes && dbProduct.sizes.length > 0) {
        const foundSize = dbProduct.sizes.find(
          (s) => s.size.toLowerCase() === item.selectedSize?.toLowerCase()
        );
        if (foundSize) matchedSizeId = foundSize.id;
      }

      // Find matching height record ID if height selected
      let matchedHeightId: string | undefined = undefined;
      if (item.selectedHeight && dbProduct.heights && dbProduct.heights.length > 0) {
        const foundHeight = dbProduct.heights.find(
          (h) =>
            h.value.toLowerCase() === item.selectedHeight?.toLowerCase() ||
            h.label.toLowerCase() === item.selectedHeight?.toLowerCase()
        );
        if (foundHeight) matchedHeightId = foundHeight.id;
      }

      validatedItems.push({
        productId: prod.id,
        productSizeId: matchedSizeId,
        productHeightId: matchedHeightId,
        productName: prod.name,
        productSku: prod.sku || undefined,
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    // 2. Validate Coupon if provided
    let discount = 0;
    if (input.couponCode && input.couponCode.trim()) {
      const couponResult = await CouponService.validateCoupon(
        input.couponCode,
        calculatedSubtotal
      );
      if (couponResult.valid) {
        discount = couponResult.discount;
      }
    }

    const shippingCharge = 0; // Free shipping rule
    const tax = 0;
    const grandTotal = Math.max(0, calculatedSubtotal - discount + shippingCharge + tax);

    // 3. Create Order via DB transaction
    const result = await OrderRepository.createOrderTransaction({
      customer: {
        fullName: input.customer.fullName,
        email: input.customer.email,
        phone: input.customer.phone,
        addressLine1: input.customer.addressLine1,
        addressLine2: input.customer.addressLine2,
        city: input.customer.city,
        state: input.customer.state,
        postalCode: input.customer.postalCode,
        country: input.customer.country || "India",
      },
      subtotal: calculatedSubtotal,
      discount,
      shippingCharge,
      tax,
      total: grandTotal,
      notes: input.notes,
      items: validatedItems,
    });

    return {
      orderId: result.order.id,
      orderNumber: result.orderNumber,
      subtotal: calculatedSubtotal,
      discount,
      shippingCharge,
      tax,
      total: grandTotal,
      customer: {
        id: result.customerId,
        email: input.customer.email,
        name: input.customer.fullName,
      },
    };
  }

  /**
   * Track guest order securely by orderNumber and identifier (email/phone)
   */
  static async trackGuestOrder(orderNumber: string, identifier: string) {
    const data = await OrderRepository.findOrderForGuest(orderNumber, identifier);

    if (!data) {
      throw new Error("No order found matching the provided order number and email/phone");
    }

    return {
      orderNumber: data.order.orderNumber,
      orderDate: data.order.createdAt,
      orderStatus: data.order.status,
      paymentStatus: data.payment ? data.payment.status : "pending",
      subtotal: data.order.subtotal,
      discount: data.order.discount,
      shippingCharge: data.order.shippingCharge,
      tax: data.order.tax,
      total: data.order.total,
      customer: {
        name: `${data.customer.firstName} ${data.customer.lastName || ""}`.trim(),
        email: data.customer.email,
        phone: data.customer.phone,
      },
      address: data.address
        ? {
            line1: data.address.addressLine1,
            line2: data.address.addressLine2,
            city: data.address.city,
            state: data.address.state,
            postalCode: data.address.postalCode,
            country: data.address.country,
          }
        : null,
      items: data.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        sku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      shipment: data.shipment
        ? {
            status: data.shipment.status,
            courierName: data.shipment.courierName,
            trackingNumber: data.shipment.trackingNumber,
            trackingUrl: data.shipment.trackingUrl,
            estimatedDeliveryAt: data.shipment.estimatedDeliveryAt,
          }
        : null,
      trackingHistory: data.trackingHistory || [],
    };
  }

  /**
   * Admin: List orders with search, filters, sorting, and pagination
   */
  static async getAdminOrdersList(query: {
    page?: number;
    limit?: number;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
    range?: "today" | "7d" | "30d" | "all";
    sortBy?: "newest" | "oldest" | "total_desc" | "total_asc";
  }) {
    return await OrderRepository.getAdminOrders(query);
  }

  /**
   * Admin: Get order details by ID or orderNumber
   */
  static async getAdminOrderById(idOrNumber: string) {
    return await OrderRepository.findAdminOrderById(idOrNumber);
  }

  /**
   * Admin: Update order status & fulfillment tracking
   */
  static async updateAdminOrderStatus(id: string, payload: any) {
    return await OrderRepository.updateOrderStatusAndFulfillment(id, payload);
  }

  /**
   * Admin: Bulk order status update
   */
  static async bulkAdminOrderStatusUpdate(ids: string[], status: string) {
    return await OrderRepository.bulkUpdateOrderStatus(ids, status);
  }
}
