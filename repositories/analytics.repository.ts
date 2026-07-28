import { db } from "@/db/client";
import { orders, orderItems, payments } from "@/db/schema/order";
import { customers } from "@/db/schema/customer";
import { products } from "@/db/schema/product";
import { coupons } from "@/db/schema/marketing";
import { eq, gte, lte, and, sql, count, desc, sum } from "drizzle-orm";

export class AnalyticsRepository {
  /**
   * Get overall overview statistics filtered by time range (today, 7d, 30d, year)
   */
  static async getOverviewStats(range: "today" | "7d" | "30d" | "year" = "30d") {
    const now = new Date();
    let startDate = new Date();

    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "year") {
      startDate.setFullYear(now.getFullYear(), 0, 1);
    }

    // 1. Total Revenue in Range (Paid Orders/Payments)
    const paidOrders = await db
      .select({
        totalRevenue: sum(orders.total),
        orderCount: count(orders.id),
      })
      .from(orders)
      .where(gte(orders.createdAt, startDate));

    // 2. Revenue Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const revenueToday = await db
      .select({ totalRevenue: sum(orders.total) })
      .from(orders)
      .where(gte(orders.createdAt, todayStart));

    // 3. Revenue This Month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueMonth = await db
      .select({ totalRevenue: sum(orders.total) })
      .from(orders)
      .where(gte(orders.createdAt, monthStart));

    // 4. Order Counts by Status
    const allOrders = await db.select({ id: orders.id, status: orders.status }).from(orders);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
    const completedOrders = allOrders.filter((o) => ["delivered", "confirmed", "processing"].includes(o.status)).length;

    // 5. Total Customers, Total Products, Active Coupons
    const [totalCustomersRow, totalProductsRow, activeCouponsRow] = await Promise.all([
      db.select({ count: count(customers.id) }).from(customers),
      db.select({ count: count(products.id) }).from(products).where(eq(products.isActive, true)),
      db.select({ count: count(coupons.id) }).from(coupons).where(eq(coupons.isActive, true)),
    ]);

    return {
      totalRevenue: Number(paidOrders[0]?.totalRevenue || 0),
      revenueToday: Number(revenueToday[0]?.totalRevenue || 0),
      revenueThisMonth: Number(revenueMonth[0]?.totalRevenue || 0),
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers: Number(totalCustomersRow[0]?.count || 0),
      totalProducts: Number(totalProductsRow[0]?.count || 0),
      activeCoupons: Number(activeCouponsRow[0]?.count || 0),
    };
  }

  /**
   * Get sales & revenue chart trend data grouped by day/month
   */
  static async getSalesChartTrend(range: "today" | "7d" | "30d" | "year" = "30d") {
    const now = new Date();
    let startDate = new Date();
    let pointsCount = 7;

    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
      pointsCount = 12; // 2-hour slots
    } else if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
      pointsCount = 7;
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
      pointsCount = 30;
    } else if (range === "year") {
      startDate.setFullYear(now.getFullYear(), 0, 1);
      pointsCount = 12;
    }

    const orderRows = await db
      .select({
        createdAt: orders.createdAt,
        total: orders.total,
      })
      .from(orders)
      .where(gte(orders.createdAt, startDate));

    // Group into time buckets
    const bucketMap: Record<string, { label: string; revenue: number; ordersCount: number }> = {};

    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date();
      let key = "";
      let label = "";

      if (range === "30d" || range === "7d") {
        d.setDate(now.getDate() - i);
        key = d.toISOString().split("T")[0];
        label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      } else if (range === "year") {
        d.setMonth(now.getMonth() - i);
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        label = d.toLocaleDateString("en-IN", { month: "short" });
      } else {
        key = `slot-${i}`;
        label = `${i * 2}:00`;
      }

      bucketMap[key] = { label, revenue: 0, ordersCount: 0 };
    }

    orderRows.forEach((row) => {
      const d = new Date(row.createdAt);
      let key = "";
      if (range === "30d" || range === "7d") {
        key = d.toISOString().split("T")[0];
      } else if (range === "year") {
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      } else {
        const slot = Math.floor(d.getHours() / 2);
        key = `slot-${slot}`;
      }

      if (bucketMap[key]) {
        bucketMap[key].revenue += Number(row.total || 0);
        bucketMap[key].ordersCount += 1;
      }
    });

    return Object.values(bucketMap);
  }

  /**
   * Fetch Latest Orders Widget Data
   */
  static async getLatestOrders(limit = 5) {
    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        customerId: orders.customerId,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    // Attach customer names
    const enriched = await Promise.all(
      rows.map(async (o) => {
        const cust = await db
          .select({ firstName: customers.firstName, lastName: customers.lastName, email: customers.email })
          .from(customers)
          .where(eq(customers.id, o.customerId))
          .then((r) => r[0]);

        return {
          ...o,
          customerName: cust ? `${cust.firstName} ${cust.lastName || ""}`.trim() : "Guest",
          customerEmail: cust ? cust.email : "N/A",
        };
      })
    );

    return enriched;
  }

  /**
   * Fetch Latest Customers Widget Data
   */
  static async getLatestCustomers(limit = 5) {
    return await db
      .select({
        id: customers.id,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        phone: customers.phone,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(limit);
  }

  /**
   * Fetch Top Selling Products Widget Data
   */
  static async getTopSellingProducts(limit = 5) {
    const items = await db
      .select({
        productName: orderItems.productName,
        totalQty: sum(orderItems.quantity),
        totalRevenue: sum(orderItems.totalPrice),
      })
      .from(orderItems)
      .groupBy(orderItems.productName)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(limit);

    return items.map((item) => ({
      name: item.productName,
      salesCount: Number(item.totalQty || 0),
      revenue: Number(item.totalRevenue || 0),
    }));
  }

  /**
   * Fetch Recent Payments Widget Data
   */
  static async getRecentPayments(limit = 5) {
    return await db
      .select({
        id: payments.id,
        orderId: payments.orderId,
        paymentMethod: payments.paymentMethod,
        status: payments.status,
        amount: payments.amount,
        gateway: payments.gateway,
        gatewayPaymentId: payments.gatewayPaymentId,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(limit);
  }
}
