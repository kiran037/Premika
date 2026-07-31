"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  Tag,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  ShieldCheck,
  Package,
} from "lucide-react";
import {
  AdminCard,
  StatCard,
  AdminBadge,
  AdminStatusBadge,
  AdminTable,
  AdminRevenueChart,
  AdminOrdersChart,
} from "@/components/admin";
import { toast } from "react-hot-toast";

type DateRange = "today" | "7d" | "30d" | "year";

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);

  const [statsData, setStatsData] = useState<any | null>(null);
  const [widgetsData, setWidgetsData] = useState<any | null>(null);

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchStats = async (selectedRange: DateRange) => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(`/api/admin/dashboard/stats?range=${selectedRange}`);
      const json = await res.json();
      if (json.success) {
        setStatsData(json.data);
      } else {
        toast.error("Failed to load statistics");
      }
    } catch {
      toast.error("Error loading dashboard metrics");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchWidgets = async () => {
    setIsLoadingWidgets(true);
    try {
      const res = await fetch("/api/admin/dashboard/widgets");
      const json = await res.json();
      if (json.success) {
        setWidgetsData(json.data);
      }
    } catch {
      console.error("Error loading widgets");
    } finally {
      setIsLoadingWidgets(false);
    }
  };

  const overview = statsData?.overview;
  const salesTrend = statsData?.salesTrend || [];

  return (
    <div className="space-y-8 sm:space-y-10 w-full mx-auto pb-16">
      {/* Top Banner & Time Range Segmented Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs transition-all">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B67B5C]/10 text-[#B67B5C] rounded-full text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Premika Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            Real-time revenues, order trends, customer metrics, and sales activity across your storefront.
          </p>
        </div>

        {/* Premium Time Range Segmented Control */}
        <div className="flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/70 shadow-2xs w-fit self-start md:self-auto">
          {[
            { label: "Today", value: "today" },
            { label: "7 Days", value: "7d" },
            { label: "30 Days", value: "30d" },
            { label: "This Year", value: "year" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value as DateRange)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                range === item.value
                  ? "bg-[#B67B5C] text-white shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Key Performance Metrics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Key Performance Metrics ({range.toUpperCase()})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Total Revenue"
              value={`₹${(overview?.totalRevenue || 0).toLocaleString("en-IN")}`}
              subtitle="Selected Time Period"
              icon={TrendingUp}
              iconBgColor="bg-[#B67B5C]/10"
              iconColor="text-[#B67B5C]"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Revenue Today"
              value={`₹${(overview?.revenueToday || 0).toLocaleString("en-IN")}`}
              subtitle="Midnight to Now"
              icon={Calendar}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Revenue This Month"
              value={`₹${(overview?.revenueThisMonth || 0).toLocaleString("en-IN")}`}
              subtitle="Current Calendar Month"
              icon={CreditCard}
              iconBgColor="bg-sky-50"
              iconColor="text-sky-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Total Orders"
              value={overview?.totalOrders || 0}
              subtitle="All Time Database Orders"
              icon={ShoppingCart}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Pending Orders"
              value={overview?.pendingOrders || 0}
              subtitle="Action Required"
              icon={Clock}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Completed Orders"
              value={overview?.completedOrders || 0}
              subtitle="Confirmed Sales & Fulfilled"
              icon={CheckCircle}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Total Customers"
              value={overview?.totalCustomers || 0}
              subtitle="Registered Profiles"
              icon={Users}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Active Products"
              value={overview?.totalProducts || 0}
              subtitle="Live Catalog Items"
              icon={ShoppingBag}
              iconBgColor="bg-orange-50"
              iconColor="text-orange-600"
              isLoading={isLoadingStats}
            />
          </div>

          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <StatCard
              title="Active Coupons"
              value={overview?.activeCoupons || 0}
              subtitle="Active Promotions"
              icon={Tag}
              iconBgColor="bg-pink-50"
              iconColor="text-pink-600"
              isLoading={isLoadingStats}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Primary Analytics Charts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Revenue & Volume Visualizations
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard
            title="Revenue Trend"
            description={`Daily revenue breakdown (${range.toUpperCase()})`}
          >
            <div className="pt-2">
              <AdminRevenueChart data={salesTrend} />
            </div>
          </AdminCard>

          <AdminCard
            title="Order Volume"
            description={`Order count breakdown (${range.toUpperCase()})`}
          >
            <div className="pt-2">
              <AdminOrdersChart data={salesTrend} />
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Section 3: Recent Activity Widgets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Recent Orders & Customer Activity
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Orders Widget */}
          <AdminCard
            title="Latest Orders"
            description="Recent orders placed by customers"
          >
            <AdminTable
              headers={["Order #", "Customer", "Date", "Status", "Total"]}
              isEmpty={!widgetsData?.latestOrders || widgetsData.latestOrders.length === 0}
              emptyText="No orders recorded yet"
            >
              {widgetsData?.latestOrders?.map((o: any) => (
                <tr key={o.id} className="hover:bg-stone-50/80 text-xs transition-colors">
                  <td className="px-6 py-3.5 font-bold text-[#B67B5C] font-mono">{o.orderNumber}</td>
                  <td className="px-6 py-3.5 text-stone-900 font-semibold">{o.customerName}</td>
                  <td className="px-6 py-3.5 text-stone-500">{o.date}</td>
                  <td className="px-6 py-3.5">
                    <AdminStatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3.5 font-bold text-stone-900">
                    ₹{o.total?.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>

          {/* Latest Customers Widget */}
          <AdminCard
            title="Recent Customers"
            description="Newly registered customer profiles"
          >
            <AdminTable
              headers={["Customer Name", "Email", "Phone", "Date"]}
              isEmpty={!widgetsData?.latestCustomers || widgetsData.latestCustomers.length === 0}
              emptyText="No customers recorded yet"
            >
              {widgetsData?.latestCustomers?.map((c: any) => (
                <tr key={c.id} className="hover:bg-stone-50/80 text-xs transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-stone-900">{c.name}</td>
                  <td className="px-6 py-3.5 text-stone-600">{c.email}</td>
                  <td className="px-6 py-3.5 text-stone-500 font-mono text-[11px]">{c.phone}</td>
                  <td className="px-6 py-3.5 text-stone-400">{c.date}</td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>
        </div>
      </div>

      {/* Section 4: Performance Logs & Top Products */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Product Performance & Payment Logs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <AdminCard
            title="Top Selling Products"
            description="Best performing products by confirmed sales quantity"
          >
            <AdminTable
              headers={["Product Name", "Units Sold", "Total Revenue"]}
              isEmpty={!widgetsData?.topProducts || widgetsData.topProducts.length === 0}
              emptyText="No sales data recorded yet"
            >
              {widgetsData?.topProducts?.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-stone-50/80 text-xs transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-stone-900">{p.name}</td>
                  <td className="px-6 py-3.5 text-[#B67B5C] font-bold">{p.salesCount} units</td>
                  <td className="px-6 py-3.5 font-bold text-emerald-600">
                    ₹{p.revenue?.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>

          {/* Recent Payments Log */}
          <AdminCard
            title="Recent Payments Log"
            description="Latest payment transactions & gateway status"
          >
            <AdminTable
              headers={["Gateway ID", "Method", "Date", "Status", "Amount"]}
              isEmpty={!widgetsData?.recentPayments || widgetsData.recentPayments.length === 0}
              emptyText="No payment logs recorded yet"
            >
              {widgetsData?.recentPayments?.map((p: any) => (
                <tr key={p.id} className="hover:bg-stone-50/80 text-xs transition-colors">
                  <td className="px-6 py-3.5 font-mono text-stone-600 text-[11px]">
                    {p.gatewayPaymentId}
                  </td>
                  <td className="px-6 py-3.5 capitalize text-stone-700 font-medium">{p.paymentMethod}</td>
                  <td className="px-6 py-3.5 text-stone-400">{p.date}</td>
                  <td className="px-6 py-3.5">
                    <AdminStatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-3.5 font-bold text-stone-900">
                    ₹{p.amount?.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
