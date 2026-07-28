import { AnalyticsRepository } from "@/repositories/analytics.repository";

export class AnalyticsService {
  /**
   * Get Dashboard Overview Stats & Sales Trend Chart
   */
  static async getDashboardStats(range: "today" | "7d" | "30d" | "year" = "30d") {
    const [overview, salesTrend] = await Promise.all([
      AnalyticsRepository.getOverviewStats(range),
      AnalyticsRepository.getSalesChartTrend(range),
    ]);

    return {
      overview: {
        totalRevenue: overview.totalRevenue,
        revenueToday: overview.revenueToday,
        revenueThisMonth: overview.revenueThisMonth,
        totalOrders: overview.totalOrders,
        pendingOrders: overview.pendingOrders,
        completedOrders: overview.completedOrders,
        totalCustomers: overview.totalCustomers,
        totalProducts: overview.totalProducts,
        activeCoupons: overview.activeCoupons,
      },
      salesTrend,
    };
  }

  /**
   * Get Dashboard Widgets Data (Latest Orders, Customers, Top Products, Payments)
   */
  static async getDashboardWidgets() {
    const [latestOrders, latestCustomers, topProducts, recentPayments] = await Promise.all([
      AnalyticsRepository.getLatestOrders(5),
      AnalyticsRepository.getLatestCustomers(5),
      AnalyticsRepository.getTopSellingProducts(5),
      AnalyticsRepository.getRecentPayments(5),
    ]);

    return {
      latestOrders: latestOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        status: o.status,
        total: o.total,
        date: new Date(o.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
      latestCustomers: latestCustomers.map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName || ""}`.trim(),
        email: c.email,
        phone: c.phone || "N/A",
        date: new Date(c.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      })),
      topProducts: topProducts.map((p) => ({
        name: p.name,
        salesCount: p.salesCount,
        revenue: p.revenue,
      })),
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        paymentMethod: p.paymentMethod,
        status: p.status,
        amount: p.amount / 100, // paise to INR
        gateway: p.gateway || "razorpay",
        gatewayPaymentId: p.gatewayPaymentId || "Pending",
        date: new Date(p.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      })),
    };
  }
}
