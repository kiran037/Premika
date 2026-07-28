import { db } from "@/db/client";
import { coupons, newsletterSubscribers } from "@/db/schema/marketing";
import { orders } from "@/db/schema/order";
import { eq, and, count, sum, desc, lt, gt, isNotNull } from "drizzle-orm";

export class MarketingRepository {
  static async getOverviewStats() {
    const now = new Date();

    const [
      totalCouponsRes,
      activeCouponsRes,
      expiredCouponsRes,
      mostUsedCoupons,
      recentCoupons,
      totalDiscountRes,
      subscribersRes,
    ] = await Promise.all([
      // Total coupons count
      db.select({ count: count() }).from(coupons),

      // Active coupons count
      db.select({ count: count() }).from(coupons).where(eq(coupons.isActive, true)),

      // Expired coupons count
      db
        .select({ count: count() })
        .from(coupons)
        .where(and(isNotNull(coupons.expiresAt), lt(coupons.expiresAt, now))),

      // Top 5 most used coupons
      db
        .select()
        .from(coupons)
        .orderBy(desc(coupons.usedCount))
        .limit(5),

      // Recent 5 coupons
      db
        .select()
        .from(coupons)
        .orderBy(desc(coupons.createdAt))
        .limit(5),

      // Total discount given from orders
      db
        .select({ totalDiscount: sum(orders.discount) })
        .from(orders)
        .where(gt(orders.discount, 0)),

      // Newsletter subscribers count
      db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isSubscribed, true)),
    ]);

    const totalCoupons = totalCouponsRes[0]?.count || 0;
    const activeCoupons = activeCouponsRes[0]?.count || 0;
    const expiredCoupons = expiredCouponsRes[0]?.count || 0;
    const totalDiscountGiven = Number(totalDiscountRes[0]?.totalDiscount || 0);
    const totalSubscribers = subscribersRes[0]?.count || 0;

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalDiscountGiven,
      totalSubscribers,
      mostUsedCoupons,
      recentCoupons,
    };
  }
}
