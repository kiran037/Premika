"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminStatusBadge,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [rangeFilter, setRangeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "25");
      if (search) params.set("search", search);
      if (orderStatusFilter !== "all") params.set("orderStatus", orderStatusFilter);
      if (paymentStatusFilter !== "all") params.set("paymentStatus", paymentStatusFilter);
      if (rangeFilter !== "all") params.set("range", rangeFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setOrders(json.data.items || []);
        setTotal(json.data.total || 0);
        setTotalPages(json.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch {
      toast.error("Error loading orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, orderStatusFilter, paymentStatusFilter, rangeFilter, sortBy]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      const res = await fetch("/api/admin/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Bulk updated to ${status}`);
        setSelectedIds([]);
        fetchOrders();
      } else {
        toast.error(json.message || "Bulk update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error performing bulk action");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.order.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6 w-full mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Orders & Fulfillment</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Monitor, process, and fulfill customer orders ({total} total orders)
          </p>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Order #, Name, Email, Phone, Payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
          </div>

          {/* Order Status */}
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">Order Status: All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Time Range */}
          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">Range: All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="total_desc">Sort: Amount (High to Low)</option>
            <option value="total_asc">Sort: Amount (Low to High)</option>
          </select>
        </div>

        {/* Selected Bulk Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#B67B5C]/10 border border-[#B67B5C]/30 p-2.5 rounded-xl text-xs">
            <span className="font-semibold text-[#B67B5C]">
              {selectedIds.length} order(s) selected
            </span>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatus("confirmed")}
                isLoading={isBulkLoading}
              >
                Mark Confirmed
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatus("processing")}
                isLoading={isBulkLoading}
              >
                Mark Processing
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatus("shipped")}
                isLoading={isBulkLoading}
              >
                Mark Shipped
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatus("delivered")}
                isLoading={isBulkLoading}
              >
                Mark Delivered
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <AdminCard title="Orders Table" description={`Showing ${orders.length} of ${total} orders`}>
        <AdminTable
          headers={[
            <input
              key="select-all"
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === orders.length}
              onChange={toggleSelectAll}
              className="rounded text-[#B67B5C]"
            />,
            "Order Number",
            "Customer Details",
            "Total",
            "Payment",
            "Order Status",
            "Order Date",
            "Actions",
          ]}
          isEmpty={!isLoading && orders.length === 0}
          emptyText="No orders found matching your search filters"
        >
          {orders.map(({ order: o, customer: cust, payment: pay }) => (
            <tr key={o.id} className="hover:bg-stone-50 text-xs">
              <td className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(o.id)}
                  onChange={() => toggleSelectOne(o.id)}
                  className="rounded text-[#B67B5C]"
                />
              </td>

              {/* Order Number */}
              <td className="px-6 py-3">
                <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                  <span>{o.orderNumber}</span>
                  <button
                    onClick={() => copyToClipboard(o.orderNumber, "Order Number")}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded"
                    title="Copy Order Number"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </td>

              {/* Customer */}
              <td className="px-6 py-3">
                <div>
                  <p className="font-semibold text-stone-900">{cust.name}</p>
                  <p className="text-[11px] text-stone-500">{cust.email}</p>
                  <p className="text-[11px] text-stone-400">{cust.phone}</p>
                </div>
              </td>

              {/* Total */}
              <td className="px-6 py-3 font-bold text-stone-900 text-sm">
                ₹{o.total.toLocaleString("en-IN")}
              </td>

              {/* Payment Status */}
              <td className="px-6 py-3">
                {pay?.status === "paid" ? (
                  <AdminBadge variant="green">Paid</AdminBadge>
                ) : pay?.status === "failed" ? (
                  <AdminBadge variant="red">Failed</AdminBadge>
                ) : (
                  <AdminBadge variant="amber">Pending</AdminBadge>
                )}
              </td>

              {/* Order Status */}
              <td className="px-6 py-3">
                <AdminStatusBadge status={o.status} />
              </td>

              {/* Date */}
              <td className="px-6 py-3 text-stone-600">
                {new Date(o.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-6 py-3">
                <Link href={`/admin/orders/${o.id}`} title="View Order & Fulfillment Details">
                  <button className="flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-[#B67B5C] hover:text-white text-stone-700 rounded-lg transition font-medium text-[11px]">
                    <Eye size={14} />
                    <span>View Order</span>
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
              Page {page} of {totalPages} ({total} orders)
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
