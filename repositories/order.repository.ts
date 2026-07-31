import { db } from "@/db/client";
import { customers, customerAddresses } from "@/db/schema/customer";
import { orders, orderItems, payments } from "@/db/schema/order";
import { eq } from "drizzle-orm";

export interface CreateOrderRepositoryPayload {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  notes?: string;
  items: Array<{
    productId: string;
    productSizeId?: string;
    productHeightId?: string;
    productName: string;
    productSku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export class OrderRepository {
  /**
   * Find or create guest customer record
   */
  static async findOrCreateCustomer(
    email: string,
    fullName: string,
    phone: string
  ) {
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email.toLowerCase().trim()))
      .then((rows) => rows[0]);

    if (existing) {
      return existing;
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(" ") || undefined;

    const [newCustomer] = await db
      .insert(customers)
      .values({
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        isActive: true,
      })
      .returning();

    return newCustomer;
  }

  /**
   * Execute atomic order creation transaction
   */
  static async createOrderTransaction(payload: CreateOrderRepositoryPayload) {
    return await db.transaction(async (tx) => {
      // 1. Customer Record
      const existingCustomer = await tx
        .select()
        .from(customers)
        .where(eq(customers.email, payload.customer.email.toLowerCase().trim()))
        .then((rows) => rows[0]);

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const nameParts = payload.customer.fullName.trim().split(" ");
        const firstName = nameParts[0] || payload.customer.fullName;
        const lastName = nameParts.slice(1).join(" ") || undefined;

        const [created] = await tx
          .insert(customers)
          .values({
            firstName,
            lastName,
            email: payload.customer.email.toLowerCase().trim(),
            phone: payload.customer.phone.trim(),
            isActive: true,
          })
          .returning();
        customerId = created.id;
      }

      // 2. Save Address (with duplicate address prevention)
      const existingAddresses = await tx
        .select()
        .from(customerAddresses)
        .where(eq(customerAddresses.customerId, customerId));

      const normalizeStr = (str?: string | null) => (str || "").trim().toLowerCase();

      const newAddrLine1 = normalizeStr(payload.customer.addressLine1);
      const newAddrLine2 = normalizeStr(payload.customer.addressLine2);
      const newCity = normalizeStr(payload.customer.city);
      const newState = normalizeStr(payload.customer.state);
      const newPostalCode = normalizeStr(payload.customer.postalCode);
      const newCountry = normalizeStr(payload.customer.country || "India");

      const matchingAddress = existingAddresses.find((addr) => {
        return (
          normalizeStr(addr.addressLine1) === newAddrLine1 &&
          normalizeStr(addr.addressLine2) === newAddrLine2 &&
          normalizeStr(addr.city) === newCity &&
          normalizeStr(addr.state) === newState &&
          normalizeStr(addr.postalCode) === newPostalCode &&
          normalizeStr(addr.country) === newCountry
        );
      });

      if (!matchingAddress) {
        await tx.insert(customerAddresses).values({
          customerId,
          fullName: payload.customer.fullName,
          phone: payload.customer.phone,
          addressLine1: payload.customer.addressLine1,
          addressLine2: payload.customer.addressLine2 || null,
          city: payload.customer.city,
          state: payload.customer.state,
          postalCode: payload.customer.postalCode,
          country: payload.customer.country || "India",
        });
      }

      // 3. Generate Order Number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 4. Create Order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId,
          orderNumber,
          status: "pending",
          subtotal: payload.subtotal,
          discount: payload.discount,
          shippingCharge: payload.shippingCharge,
          tax: payload.tax,
          total: payload.total,
          notes: payload.notes || null,
        })
        .returning();

      // 5. Create Order Items
      const itemValues = payload.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productSizeId: item.productSizeId || null,
        productHeightId: item.productHeightId || null,
        productName: item.productName,
        productSku: item.productSku || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      await tx.insert(orderItems).values(itemValues);

      return {
        order,
        customerId,
        orderNumber,
      };
    });
  }

  /**
   * Secure order lookup for guest customers requiring orderNumber + email/phone match
   */
  static async findOrderForGuest(orderNumber: string, identifier: string) {
    const normOrderNumber = orderNumber.trim().toUpperCase();
    const normIdentifier = identifier.trim().toLowerCase();

    // 1. Fetch Order Record by Order Number
    const orderRecord = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, normOrderNumber))
      .then((rows) => rows[0]);

    if (!orderRecord) return null;

    // 2. Fetch Customer Record
    const customerRecord = await db
      .select()
      .from(customers)
      .where(eq(customers.id, orderRecord.customerId))
      .then((rows) => rows[0]);

    if (!customerRecord) return null;

    // Verify email or phone match
    const emailMatch = customerRecord.email.toLowerCase() === normIdentifier;
    const phoneMatch = customerRecord.phone?.trim() === normIdentifier || customerRecord.phone?.trim() === identifier.trim();

    if (!emailMatch && !phoneMatch) {
      return null;
    }

    // 3. Fetch Related Data (Address, Items, Payments, Shipments)
    const [addresses, items, paymentRecords] = await Promise.all([
      db.select().from(customerAddresses).where(eq(customerAddresses.customerId, customerRecord.id)),
      db.select().from(orderItems).where(eq(orderItems.orderId, orderRecord.id)),
      db.select().from(payments).where(eq(payments.orderId, orderRecord.id)),
    ]);

    const { shipments, shipmentTracking } = await import("@/db/schema/order");

    const shipmentRecords = await db
      .select()
      .from(shipments)
      .where(eq(shipments.orderId, orderRecord.id));

    let trackingHistory: any[] = [];
    if (shipmentRecords.length > 0) {
      trackingHistory = await db
        .select()
        .from(shipmentTracking)
        .where(eq(shipmentTracking.shipmentId, shipmentRecords[0].id));
    }

    return {
      order: orderRecord,
      customer: customerRecord,
      address: addresses[0] || null,
      items,
      payment: paymentRecords[0] || null,
      shipment: shipmentRecords[0] || null,
      trackingHistory,
    };
  }

  /**
   * Admin: List orders with search, filters (order status, payment status, range), sorting, and pagination
   */
  static async getAdminOrders(query: {
    page?: number;
    limit?: number;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
    range?: "today" | "7d" | "30d" | "all";
    sortBy?: "newest" | "oldest" | "total_desc" | "total_asc";
  }) {
    const { shipments, shipmentTracking } = await import("@/db/schema/order");
    const { and, or, ilike, eq, gte, desc, asc, count, inArray } = await import("drizzle-orm");

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.orderStatus && query.orderStatus !== "all") {
      conditions.push(eq(orders.status, query.orderStatus as any));
    }

    if (query.range && query.range !== "all") {
      const now = new Date();
      let startDate = new Date();
      if (query.range === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (query.range === "7d") {
        startDate.setDate(now.getDate() - 7);
      } else if (query.range === "30d") {
        startDate.setDate(now.getDate() - 30);
      }
      conditions.push(gte(orders.createdAt, startDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = desc(orders.createdAt);
    if (query.sortBy === "oldest") orderByClause = asc(orders.createdAt);
    else if (query.sortBy === "total_desc") orderByClause = desc(orders.total);
    else if (query.sortBy === "total_asc") orderByClause = asc(orders.total);

    const [rawOrders, [{ total }]] = await Promise.all([
      db.select().from(orders).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
      db.select({ total: count() }).from(orders).where(whereClause),
    ]);

    const customerIds = Array.from(new Set(rawOrders.map((o) => o.customerId)));
    const orderIds = rawOrders.map((o) => o.id);

    let customerMap = new Map<string, any>();
    let paymentMap = new Map<string, any>();
    let shipmentMap = new Map<string, any>();

    if (customerIds.length > 0) {
      const customerRows = await db.select().from(customers).where(inArray(customers.id, customerIds));
      customerMap = new Map(customerRows.map((c) => [c.id, c]));
    }

    if (orderIds.length > 0) {
      const [pRows, sRows] = await Promise.all([
        db.select().from(payments).where(inArray(payments.orderId, orderIds)),
        db.select().from(shipments).where(inArray(shipments.orderId, orderIds)),
      ]);

      paymentMap = new Map(pRows.map((p) => [p.orderId, p]));
      shipmentMap = new Map(sRows.map((s) => [s.orderId, s]));
    }

    let items = rawOrders.map((o) => {
      const cust = customerMap.get(o.customerId);
      const pay = paymentMap.get(o.id);
      const ship = shipmentMap.get(o.id);

      return {
        order: o,
        customer: cust
          ? {
              id: cust.id,
              name: `${cust.firstName} ${cust.lastName || ""}`.trim(),
              email: cust.email,
              phone: cust.phone || "N/A",
            }
          : { id: "", name: "Guest", email: "N/A", phone: "N/A" },
        payment: pay
          ? {
              id: pay.id,
              status: pay.status,
              paymentMethod: pay.paymentMethod,
              amount: pay.amount / 100, // INR
              gatewayPaymentId: pay.gatewayPaymentId || "Pending",
            }
          : null,
        shipment: ship
          ? {
              id: ship.id,
              status: ship.status,
              courierName: ship.courierName,
              trackingNumber: ship.trackingNumber,
            }
          : null,
      };
    });

    // In-memory filter for search or paymentStatus if specified
    if (query.search) {
      const term = query.search.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.order.orderNumber.toLowerCase().includes(term) ||
          i.customer.name.toLowerCase().includes(term) ||
          i.customer.email.toLowerCase().includes(term) ||
          i.customer.phone.toLowerCase().includes(term) ||
          (i.payment?.gatewayPaymentId && i.payment.gatewayPaymentId.toLowerCase().includes(term))
      );
    }

    if (query.paymentStatus && query.paymentStatus !== "all") {
      items = items.filter((i) => i.payment?.status === query.paymentStatus);
    }

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  /**
   * Admin: Find single order by ID or orderNumber for admin detail view
   */
  static async findAdminOrderById(idOrNumber: string) {
    const { shipments, shipmentTracking } = await import("@/db/schema/order");
    const { productImages } = await import("@/db/schema/product");
    const { or, eq, inArray } = await import("drizzle-orm");

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
    const condition = isUuid
      ? or(eq(orders.id, idOrNumber), eq(orders.orderNumber, idOrNumber))
      : eq(orders.orderNumber, idOrNumber);

    const orderRecord = await db.select().from(orders).where(condition).then((r) => r[0] || null);

    if (!orderRecord) return null;

    const [customerRecord, addresses, items, paymentRecords, shipmentRecords] = await Promise.all([
      db.select().from(customers).where(eq(customers.id, orderRecord.customerId)).then((r) => r[0] || null),
      db.select().from(customerAddresses).where(eq(customerAddresses.customerId, orderRecord.customerId)),
      db.select().from(orderItems).where(eq(orderItems.orderId, orderRecord.id)),
      db.select().from(payments).where(eq(payments.orderId, orderRecord.id)),
      db.select().from(shipments).where(eq(shipments.orderId, orderRecord.id)),
    ]);

    // Attach product images, sizes, and heights to items
    const productIds = items.map((i) => i.productId);
    const sizeIds = items.map((i) => i.productSizeId).filter(Boolean) as string[];
    const heightIds = items.map((i) => i.productHeightId).filter(Boolean) as string[];

    let imagesMap = new Map<string, string>();
    let sizesMap = new Map<string, string>();
    let heightsMap = new Map<string, string>();

    if (productIds.length > 0) {
      const pImages = await db.select().from(productImages).where(inArray(productImages.productId, productIds));
      pImages.forEach((img) => {
        if (!imagesMap.has(img.productId) || img.isPrimary) {
          imagesMap.set(img.productId, img.image);
        }
      });
    }

    if (sizeIds.length > 0) {
      const { productSizes } = await import("@/db/schema/product");
      const sizes = await db.select().from(productSizes).where(inArray(productSizes.id, sizeIds));
      sizes.forEach((s) => sizesMap.set(s.id, s.size));
    }

    if (heightIds.length > 0) {
      const { productHeights } = await import("@/db/schema/product");
      const heights = await db.select().from(productHeights).where(inArray(productHeights.id, heightIds));
      heights.forEach((h) => heightsMap.set(h.id, h.label));
    }

    const enrichedItems = items.map((item) => ({
      ...item,
      image: imagesMap.get(item.productId) || "/placeholder.svg",
      size: item.productSizeId ? sizesMap.get(item.productSizeId) || null : null,
      height: item.productHeightId ? heightsMap.get(item.productHeightId) || null : null,
    }));

    let trackingHistory: any[] = [];
    if (shipmentRecords.length > 0) {
      trackingHistory = await db
        .select()
        .from(shipmentTracking)
        .where(eq(shipmentTracking.shipmentId, shipmentRecords[0].id));
    }

    return {
      order: orderRecord,
      customer: customerRecord,
      address: addresses[0] || null,
      items: enrichedItems,
      payment: paymentRecords[0] || null,
      shipment: shipmentRecords[0] || null,
      trackingHistory,
    };
  }

  /**
   * Admin: Atomic order status & fulfillment tracking update
   */
  static async updateOrderStatusAndFulfillment(id: string, payload: any) {
    const { shipments, shipmentTracking } = await import("@/db/schema/order");
    const { eq } = await import("drizzle-orm");

    return await db.transaction(async (tx) => {
      // 1. Update Order Status
      const [updatedOrder] = await tx
        .update(orders)
        .set({ status: payload.status, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      // 2. Manage Shipment Record
      let shipmentRecord = await tx
        .select()
        .from(shipments)
        .where(eq(shipments.orderId, id))
        .then((r) => r[0] || null);

      if (payload.courierName || payload.trackingNumber || payload.status === "shipped" || payload.status === "delivered") {
        let shipmentStatus = "pending";
        if (payload.status === "shipped") shipmentStatus = "shipped";
        else if (payload.status === "delivered") shipmentStatus = "delivered";
        else if (payload.status === "cancelled") shipmentStatus = "cancelled";

        if (shipmentRecord) {
          [shipmentRecord] = await tx
            .update(shipments)
            .set({
              status: shipmentStatus as any,
              courierName: payload.courierName || shipmentRecord.courierName,
              trackingNumber: payload.trackingNumber || shipmentRecord.trackingNumber,
              trackingUrl: payload.trackingUrl || shipmentRecord.trackingUrl,
              shippedAt: payload.status === "shipped" ? new Date() : shipmentRecord.shippedAt,
              deliveredAt: payload.status === "delivered" ? new Date() : shipmentRecord.deliveredAt,
              updatedAt: new Date(),
            })
            .where(eq(shipments.id, shipmentRecord.id))
            .returning();
        } else {
          [shipmentRecord] = await tx
            .insert(shipments)
            .values({
              orderId: id,
              status: shipmentStatus as any,
              courierName: payload.courierName || "Standard Courier",
              trackingNumber: payload.trackingNumber || `TRK-${Date.now()}`,
              trackingUrl: payload.trackingUrl || null,
              shippedAt: payload.status === "shipped" ? new Date() : null,
            })
            .returning();
        }

        // 3. Log Shipment Tracking Entry
        await tx.insert(shipmentTracking).values({
          shipmentId: shipmentRecord.id,
          status: shipmentStatus as any,
          location: payload.location || "Premika Warehouse",
          description: payload.description || `Order status updated to ${payload.status}`,
        });
      }

      return { order: updatedOrder, shipment: shipmentRecord };
    });
  }

  /**
   * Admin: Bulk order status update
   */
  static async bulkUpdateOrderStatus(ids: string[], status: string) {
    const { inArray } = await import("drizzle-orm");

    await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(inArray(orders.id, ids));
  }
}

