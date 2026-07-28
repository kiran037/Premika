"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { Skeleton } from "@/components/admin/Skeleton";
import {
  Megaphone,
  Tag,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface MarketingData {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalDiscountGiven: number;
  totalSubscribers: number;
  mostUsedCoupons: Array<{
    id: string;
    code: string;
    name: string;
    type: "percentage" | "fixed";
    value: number;
    usedCount: number;
    isActive: boolean;
  }>;
  recentCoupons: Array<{
    id: string;
    code: string;
    name: string;
    createdAt: string;
    isActive: boolean;
  }>;
}

export default function MarketingOverviewPage() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/marketing/overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        } else {
          toast.error(json.message || "Failed to load marketing stats");
        }
      })
      .catch(() => toast.error("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Megaphone size={22} className="text-[#B67B5C]" />
            <span>Marketing Overview & Analytics</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Performance overview of active campaigns, coupon discounts, and subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/coupons">
            <AdminButton variant="outline" size="sm">
              <Tag size={14} className="mr-1.5" />
              <span>Manage Coupons</span>
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Coupons"
          value={data?.activeCoupons || 0}
          icon={CheckCircle2}
        />

        <StatCard
          title="Expired Coupons"
          value={data?.expiredCoupons || 0}
          icon={AlertCircle}
        />

        <StatCard
          title="Total Discount Given"
          value={`₹${(data?.totalDiscountGiven || 0).toLocaleString("en-IN")}`}
          icon={TrendingDown}
        />

        <StatCard
          title="Newsletter Subscribers"
          value={data?.totalSubscribers || 0}
          icon={Users}
        />
      </div>

      {/* Overview Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Used Coupons Table */}
        <AdminCard className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Award size={16} className="text-[#B67B5C]" />
              <span>Most Popular Coupons</span>
            </h3>
            <Link href="/admin/coupons" className="text-xs font-semibold text-[#B67B5C] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {!data?.mostUsedCoupons || data.mostUsedCoupons.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">No coupon usage recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Times Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.mostUsedCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-stone-900">{coupon.code}</td>
                      <td className="py-3 px-3 font-medium text-stone-700">{coupon.name}</td>
                      <td className="py-3 px-3">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#B67B5C]">
                        {coupon.usedCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        {/* Recent Promotions */}
        <AdminCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Tag size={16} className="text-[#B67B5C]" />
              <span>Recent Promotions</span>
            </h3>
          </div>

          {!data?.recentCoupons || data.recentCoupons.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">No promotions created yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100"
                >
                  <div>
                    <p className="font-bold text-xs text-stone-900 font-mono">{coupon.code}</p>
                    <p className="text-[11px] text-stone-500 truncate max-w-[140px]">{coupon.name}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      coupon.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
