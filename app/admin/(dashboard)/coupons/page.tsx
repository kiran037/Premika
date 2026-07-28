"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminCard } from "@/components/admin/AdminCard";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponPreviewModal } from "@/components/admin/CouponPreviewModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Skeleton } from "@/components/admin/Skeleton";
import { AdminCouponInput } from "@/lib/validations/admin-coupon.schema";
import {
  Tag,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  Edit,
  Trash2,
  CopyPlus,
  ChevronLeft,
  ChevronRight,
  Power,
  RefreshCw,
  CheckSquare,
  Percent,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface CouponItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "percentage" | "fixed";
  value: number;
  minimumOrderAmount: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Modals
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [previewCoupon, setPreviewCoupon] = useState<CouponItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      if (search) params.set("search", search);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("isActive", statusFilter === "active" ? "true" : "false");

      const res = await fetch(`/api/admin/coupons?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setCoupons(json.data.items || []);
        setTotal(json.data.pagination.total || 0);
        setTotalPages(json.data.pagination.totalPages || 1);
      } else {
        toast.error(json.message || "Failed to load coupons");
      }
    } catch {
      toast.error("Network error while fetching coupons");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, typeFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateOrUpdate = async (data: AdminCouponInput) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingCoupon) {
        res = await fetch(`/api/admin/coupons/${editingCoupon.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      const json = await res.json();

      if (json.success) {
        toast.success(json.message || "Coupon saved successfully!");
        setIsFormOpen(false);
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        toast.error(json.message || "Failed to save coupon");
      }
    } catch {
      toast.error("Error submitting coupon request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (coupon: CouponItem) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}/duplicate`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Duplicated coupon as ${json.data.code}`);
        fetchCoupons();
      } else {
        toast.error(json.message || "Failed to duplicate coupon");
      }
    } catch {
      toast.error("Error duplicating coupon");
    }
  };

  const handleDeleteSingle = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/coupons/${deleteConfirmId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Coupon deleted");
        setDeleteConfirmId(null);
        fetchCoupons();
      } else {
        toast.error(json.message || "Failed to delete coupon");
      }
    } catch {
      toast.error("Error deleting coupon");
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`Delete ${selectedIds.length} selected coupon(s)?`)) return;

    try {
      const res = await fetch("/api/admin/coupons/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setSelectedIds([]);
        fetchCoupons();
      } else {
        toast.error(json.message || "Bulk operation failed");
      }
    } catch {
      toast.error("Network error during bulk operation");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(coupons.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Tag size={22} className="text-[#B67B5C]" />
            <span>Coupon & Promotional Management</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Create, search, filter, and control discount coupons for checkout promotions.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="md"
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={16} className="mr-1.5" />
          <span>Create New Coupon</span>
        </AdminButton>
      </div>

      {/* Filter Bar */}
      <AdminCard className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search coupon code or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
            />
          </div>

          {/* Discount Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          >
            <option value="all">All Discount Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb);
              setSortOrder(so as "asc" | "desc");
            }}
            className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          >
            <option value="createdAt-desc">Newest Created</option>
            <option value="createdAt-asc">Oldest Created</option>
            <option value="code-asc">Code A-Z</option>
            <option value="usedCount-desc">Most Used</option>
            <option value="value-desc">Highest Value</option>
            <option value="expiresAt-asc">Expiring Soonest</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-[#B67B5C]/10 border border-[#B67B5C]/30 rounded-xl text-xs">
            <span className="font-semibold text-stone-900">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-xs"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-2.5 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded-lg font-medium transition shadow-xs"
              >
                Deactivate Selected
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-xs"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Coupons Table */}
      <AdminCard className="overflow-hidden border border-stone-200 shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No coupons found"
              description={
                search || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try resetting your search filters."
                  : "Get started by creating your first promotional coupon."
              }
              action={
                <AdminButton
                  size="sm"
                  onClick={() => {
                    if (search || typeFilter !== "all" || statusFilter !== "all") {
                      setSearch("");
                      setTypeFilter("all");
                      setStatusFilter("all");
                    } else {
                      setEditingCoupon(null);
                      setIsFormOpen(true);
                    }
                  }}
                >
                  {search || typeFilter !== "all" || statusFilter !== "all"
                    ? "Clear Filters"
                    : "Create Coupon"}
                </AdminButton>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider font-bold text-stone-500">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === coupons.length && coupons.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-[#B67B5C] rounded border-stone-300"
                    />
                  </th>
                  <th className="py-3.5 px-4">Coupon Code & Name</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Usage</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isSelected = selectedIds.includes(coupon.id);

                  return (
                    <tr
                      key={coupon.id}
                      className={`hover:bg-stone-50/80 transition ${
                        isSelected ? "bg-[#B67B5C]/5" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(coupon.id, e.target.checked)}
                          className="w-4 h-4 text-[#B67B5C] rounded border-stone-300"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="font-mono font-bold text-xs bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg text-stone-900 border border-stone-200 flex items-center gap-1.5 transition"
                            title="Click to copy code"
                          >
                            <span>{coupon.code}</span>
                            {copiedCode === coupon.code ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} className="text-stone-400" />
                            )}
                          </button>
                        </div>
                        <p className="font-semibold text-stone-900 mt-1">{coupon.name}</p>
                        {coupon.description && (
                          <p className="text-[11px] text-stone-400 truncate max-w-xs">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-800">
                        {coupon.type === "percentage" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs">
                            {coupon.value}% OFF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs">
                            ₹{coupon.value} OFF
                          </span>
                        )}
                        {coupon.type === "percentage" && coupon.maximumDiscount && (
                          <p className="text-[10px] text-stone-400 font-normal mt-0.5">
                            Max: ₹{coupon.maximumDiscount}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-stone-600">
                        ₹{coupon.minimumOrderAmount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 font-mono">
                        <span>{coupon.usedCount}</span>
                        {coupon.usageLimit ? (
                          <span className="text-stone-400"> / {coupon.usageLimit}</span>
                        ) : (
                          <span className="text-stone-400"> / ∞</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                        {coupon.expiresAt ? (
                          <span className={isExpired ? "text-red-600 font-bold" : "text-stone-700"}>
                            {new Date(coupon.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-stone-400">No Expiry</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {coupon.isActive ? (
                          isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Expired
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewCoupon(coupon)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Preview / Test"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(coupon)}
                            className="p-1.5 text-stone-500 hover:text-[#B67B5C] hover:bg-stone-100 rounded-lg transition"
                            title="Duplicate"
                          >
                            <CopyPlus size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(coupon.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing {coupons.length} of {total} coupons
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-stone-200 rounded-lg disabled:opacity-30 hover:bg-stone-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-stone-200 rounded-lg disabled:opacity-30 hover:bg-stone-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Form Drawer / Modal */}
      <CouponForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingCoupon}
        isSubmitting={isSubmitting}
      />

      {/* Preview Modal */}
      <CouponPreviewModal
        isOpen={Boolean(previewCoupon)}
        onClose={() => setPreviewCoupon(null)}
        coupon={previewCoupon}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteSingle}
        title="Delete Coupon"
        message="Are you sure you want to permanently delete this coupon? This action cannot be undone."
        confirmLabel="Delete Coupon"
        isDangerous={true}
      />
    </div>
  );
}
