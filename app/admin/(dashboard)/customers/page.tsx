"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag,
  CreditCard,
  Crown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("spend_desc");

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (segmentFilter !== "all") params.set("segment", segmentFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setCustomers(json.data.items || []);
        setTotal(json.data.total || 0);
        setTotalPages(json.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch customer records");
      }
    } catch {
      toast.error("Error loading customer records");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, segmentFilter, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="space-y-6 w-full mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Customer CRM & Analytics</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Monitor customer behaviour, purchase frequency, and lifetime spend ({total} total buyers)
          </p>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search customer name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
          </div>

          {/* Customer Segment Filter */}
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">Segment: All Customers</option>
            <option value="vip">VIP Customers (₹10,000+ / 3+ Orders)</option>
            <option value="high_spender">High Spenders (₹5,000+)</option>
            <option value="returning">Returning Buyers (2+ Orders)</option>
            <option value="one_time">One-Time Buyers</option>
            <option value="new">New Customers (Last 7 Days)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="spend_desc">Sort: Highest Lifetime Spend</option>
            <option value="orders_desc">Sort: Most Orders Placed</option>
            <option value="newest">Sort: Newest Customers</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Customer CRM Table */}
      <AdminCard title="Customers CRM Directory" description={`Showing ${customers.length} of ${total} customer profiles`}>
        <AdminTable
          headers={[
            "Customer Profile",
            "Segment Badges",
            "Orders",
            "Lifetime Spend",
            "Average Order Value",
            "Last Order Date",
            "Actions",
          ]}
          isEmpty={!isLoading && customers.length === 0}
          emptyText="No customer profiles found matching your search"
        >
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-stone-50 text-xs">
              {/* Customer Profile */}
              <td className="px-6 py-3">
                <div>
                  <p className="font-bold text-stone-900">{c.name}</p>
                  <p className="text-[11px] text-stone-500">{c.email}</p>
                  <p className="text-[11px] text-stone-400">{c.phone}</p>
                </div>
              </td>

              {/* Dynamic Tag Badges */}
              <td className="px-6 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tag === "VIP Customer"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : tag === "High Spender"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : tag === "Returning Customer"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                              : tag === "New Customer"
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-stone-100 text-stone-700 border border-stone-200"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>

              {/* Orders */}
              <td className="px-6 py-3 font-semibold text-stone-800">{c.totalOrders} Orders</td>

              {/* Lifetime Spend */}
              <td className="px-6 py-3 font-bold text-stone-900 text-sm">
                ₹{c.lifetimeSpend.toLocaleString("en-IN")}
              </td>

              {/* AOV */}
              <td className="px-6 py-3 font-medium text-stone-700">
                ₹{c.aov.toLocaleString("en-IN")}
              </td>

              {/* Last Order Date */}
              <td className="px-6 py-3 text-stone-600">
                {c.lastOrderDate
                  ? new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "N/A"}
              </td>

              {/* Actions */}
              <td className="px-6 py-3">
                <Link href={`/admin/customers/${c.id}`} title="View Customer CRM Profile & History">
                  <button className="flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-[#B67B5C] hover:text-white text-stone-700 rounded-lg transition font-medium text-[11px]">
                    <Eye size={14} />
                    <span>View CRM</span>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 px-2 text-xs">
            <span className="text-stone-500">
              Page {page} of {totalPages} ({total} customers)
            </span>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
