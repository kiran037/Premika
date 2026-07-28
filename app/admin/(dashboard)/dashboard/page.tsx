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
    <div className="space-y-6 w-full mx-auto pb-12">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B67B5C]/10 text-[#B67B5C] rounded-full text-xs font-semibold mb-2">
            <ShieldCheck size={14} />
            <span>Premika Business Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Store Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time revenues, order trends, customer data, and sales activity
          </p>
        </div>

        {/* Time Range Filter Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit">
          {[
            { label: "Today", value: "today" },
            { label: "7 Days", value: "7d" },
            { label: "30 Days", value: "30d" },
            { label: "This Year", value: "year" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value as DateRange)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${range === item.value
                  ? "bg-[#B67B5C] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 9 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(overview?.totalRevenue || 0).toLocaleString()}`}
          subtitle="Selected Time Period"
          icon={TrendingUp}
          iconBgColor="bg-[#B67B5C]/10"
          iconColor="text-[#B67B5C]"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Revenue Today"
          value={`₹${(overview?.revenueToday || 0).toLocaleString()}`}
          subtitle="Midnight to Now"
          icon={Calendar}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Revenue This Month"
          value={`₹${(overview?.revenueThisMonth || 0).toLocaleString()}`}
          subtitle="Current Calendar Month"
          icon={CreditCard}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Total Orders"
          value={overview?.totalOrders || 0}
          subtitle="All Time Database Orders"
          icon={ShoppingCart}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Pending Orders"
          value={overview?.pendingOrders || 0}
          subtitle="Action Required"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Completed Orders"
          value={overview?.completedOrders || 0}
          subtitle="Delivered / Confirmed"
          icon={CheckCircle}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Total Customers"
          value={overview?.totalCustomers || 0}
          subtitle="Registered Guest Profiles"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Active Products"
          value={overview?.totalProducts || 0}
          subtitle="Live Catalog Items"
          icon={ShoppingBag}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
          isLoading={isLoadingStats}
        />

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

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard
          title="Revenue Trend"
          description={`Daily revenue breakdown (${range.toUpperCase()})`}
        >
          <AdminRevenueChart data={salesTrend} />
        </AdminCard>

        <AdminCard
          title="Order Volume"
          description={`Order count breakdown (${range.toUpperCase()})`}
        >
          <AdminOrdersChart data={salesTrend} />
        </AdminCard>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Orders Widget */}
        <AdminCard
          title="Latest Orders"
          description="Recent orders placed by guest customers"
        >
          <AdminTable
            headers={["Order #", "Customer", "Date", "Status", "Total"]}
            isEmpty={!widgetsData?.latestOrders || widgetsData.latestOrders.length === 0}
            emptyText="No orders recorded yet"
          >
            {widgetsData?.latestOrders?.map((o: any) => (
              <tr key={o.id} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3 font-semibold text-[#B67B5C]">{o.orderNumber}</td>
                <td className="px-6 py-3 text-stone-900 font-medium">{o.customerName}</td>
                <td className="px-6 py-3 text-stone-500">{o.date}</td>
                <td className="px-6 py-3">
                  <AdminStatusBadge status={o.status} />
                </td>
                <td className="px-6 py-3 font-bold text-stone-900">₹{o.total?.toLocaleString()}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>

        {/* Latest Customers Widget */}
        <AdminCard
          title="Recent Customers"
          description="Newly registered guest customer profiles"
        >
          <AdminTable
            headers={["Customer Name", "Email", "Phone", "Date"]}
            isEmpty={!widgetsData?.latestCustomers || widgetsData.latestCustomers.length === 0}
            emptyText="No customers recorded yet"
          >
            {widgetsData?.latestCustomers?.map((c: any) => (
              <tr key={c.id} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3 font-semibold text-stone-900">{c.name}</td>
                <td className="px-6 py-3 text-stone-600">{c.email}</td>
                <td className="px-6 py-3 text-stone-500">{c.phone}</td>
                <td className="px-6 py-3 text-stone-400">{c.date}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>
      </div>

      {/* Top Products & Recent Payments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <AdminCard
          title="Top Selling Products"
          description="Best performing products by order quantity"
        >
          <AdminTable
            headers={["Product Name", "Units Sold", "Total Revenue"]}
            isEmpty={!widgetsData?.topProducts || widgetsData.topProducts.length === 0}
            emptyText="No sales data recorded yet"
          >
            {widgetsData?.topProducts?.map((p: any, idx: number) => (
              <tr key={idx} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3 font-semibold text-stone-900">{p.name}</td>
                <td className="px-6 py-3 text-[#B67B5C] font-bold">{p.salesCount} units</td>
                <td className="px-6 py-3 font-bold text-emerald-600">₹{p.revenue?.toLocaleString()}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>

        {/* Recent Payments Log */}
        <AdminCard
          title="Recent Payments Log"
          description="Latest Razorpay transactions"
        >
          <AdminTable
            headers={["Gateway ID", "Method", "Date", "Status", "Amount"]}
            isEmpty={!widgetsData?.recentPayments || widgetsData.recentPayments.length === 0}
            emptyText="No payment logs recorded yet"
          >
            {widgetsData?.recentPayments?.map((p: any) => (
              <tr key={p.id} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3 font-mono text-stone-600 text-[11px]">
                  {p.gatewayPaymentId}
                </td>
                <td className="px-6 py-3 capitalize text-stone-700">{p.paymentMethod}</td>
                <td className="px-6 py-3 text-stone-400">{p.date}</td>
                <td className="px-6 py-3">
                  <AdminStatusBadge status={p.status} />
                </td>
                <td className="px-6 py-3 font-bold text-stone-900">₹{p.amount?.toLocaleString()}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>
      </div>
    </div>
  );
}
