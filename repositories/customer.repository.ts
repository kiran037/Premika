import { db } from "@/db/client";
import { customers, customerAddresses } from "@/db/schema/customer";
import { orders, orderItems, payments } from "@/db/schema/order";
import { eq, and, or, ilike, count, sum, max, desc, asc, inArray } from "drizzle-orm";

export interface CustomerQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  segment?: "all" | "vip" | "high_spender" | "returning" | "one_time" | "new";
  sortBy?: "spend_desc" | "orders_desc" | "newest" | "name_asc";
}

export class CustomerRepository {
  /**
   * Helper to derive dynamic tags for a customer
   */
  static deriveCustomerTags(cust: {
    createdAt: Date;
    totalOrders: number;
    lifetimeSpend: number;
  }): string[] {
    const tags: string[] = [];

    const isNew = Date.now() - new Date(cust.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (isNew) tags.push("New Customer");

    if (cust.lifetimeSpend >= 10000 || cust.totalOrders >= 3) {
      tags.push("VIP Customer");
    } else if (cust.lifetimeSpend >= 5000) {
      tags.push("High Spender");
    }

    if (cust.totalOrders >= 2) {
      tags.push("Returning Customer");
    } else if (cust.totalOrders === 1) {
      tags.push("One-Time Buyer");
    }

    return tags;
  }

  /**
   * Admin: Search, filter, sort, and paginate customers with CRM metrics
   */
  static async getAdminCustomers(options: CustomerQueryOptions = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (options.search) {
      const term = `%${options.search.trim()}%`;
      conditions.push(
        or(
          ilike(customers.firstName, term),
          ilike(customers.lastName, term),
          ilike(customers.email, term),
          ilike(customers.phone, term)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = desc(customers.createdAt);
    if (options.sortBy === "name_asc") orderByClause = asc(customers.firstName);

    const [allCustomers, [{ totalCount }]] = await Promise.all([
      db.select().from(customers).where(whereClause).orderBy(orderByClause),
      db.select({ totalCount: count() }).from(customers).where(whereClause),
    ]);

    const customerIds = allCustomers.map((c) => c.id);

    let ordersMap = new Map<
      string,
      { totalOrders: number; lifetimeSpend: number; lastOrderDate: Date | null; latestStatus: string | null }
    >();

    if (customerIds.length > 0) {
      const customerOrders = await db
        .select()
        .from(orders)
        .where(inArray(orders.customerId, customerIds))
        .orderBy(desc(orders.createdAt));

      customerOrders.forEach((ord) => {
        const existing = ordersMap.get(ord.customerId);
        if (!existing) {
          ordersMap.set(ord.customerId, {
            totalOrders: 1,
            lifetimeSpend: ord.total,
            lastOrderDate: ord.createdAt,
            latestStatus: ord.status,
          });
        } else {
          existing.totalOrders += 1;
          existing.lifetimeSpend += ord.total;
        }
      });
    }

    let items = allCustomers.map((cust) => {
      const metrics = ordersMap.get(cust.id) || {
        totalOrders: 0,
        lifetimeSpend: 0,
        lastOrderDate: null,
        latestStatus: null,
      };

      const fullName = `${cust.firstName} ${cust.lastName || ""}`.trim();
      const aov = metrics.totalOrders > 0 ? Math.round(metrics.lifetimeSpend / metrics.totalOrders) : 0;

      const tags = CustomerRepository.deriveCustomerTags({
        createdAt: cust.createdAt,
        totalOrders: metrics.totalOrders,
        lifetimeSpend: metrics.lifetimeSpend,
      });

      return {
        id: cust.id,
        name: fullName,
        email: cust.email,
        phone: cust.phone || "N/A",
        totalOrders: metrics.totalOrders,
        lifetimeSpend: metrics.lifetimeSpend,
        aov,
        lastOrderDate: metrics.lastOrderDate,
        latestOrderStatus: metrics.latestStatus,
        createdAt: cust.createdAt,
        tags,
      };
    });

    // In-Memory Segment Filtering if specified
    if (options.segment && options.segment !== "all") {
      const seg = options.segment;
      items = items.filter((i) => {
        if (seg === "vip") return i.tags.includes("VIP Customer");
        if (seg === "high_spender") return i.tags.includes("High Spender");
        if (seg === "returning") return i.tags.includes("Returning Customer");
        if (seg === "one_time") return i.tags.includes("One-Time Buyer");
        if (seg === "new") return i.tags.includes("New Customer");
        return true;
      });
    }

    // In-Memory Sorting
    if (options.sortBy === "spend_desc") {
      items.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    } else if (options.sortBy === "orders_desc") {
      items.sort((a, b) => b.totalOrders - a.totalOrders);
    }

    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Admin: Find single customer CRM details by ID with address book, full orders history, payment transactions, and analytics
   */
  static async findAdminCustomerById(id: string) {
    const customerRecord = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .then((r) => r[0] || null);

    if (!customerRecord) return null;

    const [addresses, customerOrders] = await Promise.all([
      db
        .select()
        .from(customerAddresses)
        .where(eq(customerAddresses.customerId, customerRecord.id))
        .orderBy(desc(customerAddresses.isDefault)),
      db
        .select()
        .from(orders)
        .where(eq(orders.customerId, customerRecord.id))
        .orderBy(desc(orders.createdAt)),
    ]);

    const orderIds = customerOrders.map((o) => o.id);

    let customerPayments: any[] = [];
    let itemsCountMap = new Map<string, number>();
    let topProductsMap = new Map<string, { name: string; qty: number }>();

    if (orderIds.length > 0) {
      const [payRows, itemRows] = await Promise.all([
        db.select().from(payments).where(inArray(payments.orderId, orderIds)).orderBy(desc(payments.createdAt)),
        db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)),
      ]);

      customerPayments = payRows;

      itemRows.forEach((item) => {
        itemsCountMap.set(item.orderId, (itemsCountMap.get(item.orderId) || 0) + item.quantity);

        const prod = topProductsMap.get(item.productId);
        if (!prod) {
          topProductsMap.set(item.productId, { name: item.productName, qty: item.quantity });
        } else {
          prod.qty += item.quantity;
        }
      });
    }

    const enrichedOrders = customerOrders.map((o) => ({
      ...o,
      itemCount: itemsCountMap.get(o.id) || 0,
    }));

    // Calculate Customer Analytics
    const totalOrders = customerOrders.length;
    const lifetimeSpend = customerOrders.reduce((sum, o) => sum + o.total, 0);
    const aov = totalOrders > 0 ? Math.round(lifetimeSpend / totalOrders) : 0;
    const firstOrderDate = totalOrders > 0 ? customerOrders[customerOrders.length - 1].createdAt : null;
    const lastOrderDate = totalOrders > 0 ? customerOrders[0].createdAt : null;
    const largestOrder = totalOrders > 0 ? [...customerOrders].sort((a, b) => b.total - a.total)[0] : null;

    const topProducts = Array.from(topProductsMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const tags = CustomerRepository.deriveCustomerTags({
      createdAt: customerRecord.createdAt,
      totalOrders,
      lifetimeSpend,
    });

    return {
      customer: {
        id: customerRecord.id,
        firstName: customerRecord.firstName,
        lastName: customerRecord.lastName,
        name: `${customerRecord.firstName} ${customerRecord.lastName || ""}`.trim(),
        email: customerRecord.email,
        phone: customerRecord.phone || "N/A",
        isActive: customerRecord.isActive,
        createdAt: customerRecord.createdAt,
        tags,
      },
      analytics: {
        lifetimeSpend,
        totalOrders,
        aov,
        firstOrderDate,
        lastOrderDate,
        largestOrder,
        topProducts,
      },
      addresses,
      orders: enrichedOrders,
      payments: customerPayments,
    };
  }
}
