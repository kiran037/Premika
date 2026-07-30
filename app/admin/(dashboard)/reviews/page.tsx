"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
  ShoppingBag,
  User,
  Calendar,
  ShieldCheck,
  Filter,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminModal,
  ConfirmDialog,
} from "@/components/admin";
import { toast } from "react-hot-toast";

interface ReviewItem {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  reviewStatus: "pending" | "approved" | "rejected";
  verifiedPurchase: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface StatsData {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
}

interface SimpleProduct {
  id: string;
  name: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 5.0,
  });
  const [productsList, setProductsList] = useState<SimpleProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Selection for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Dialog State
  const [viewingReview, setViewingReview] = useState<ReviewItem | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    rating: 5,
    comment: "",
    reviewStatus: "approved" as "pending" | "approved" | "rejected",
    verifiedPurchase: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (verifiedFilter !== "all")
        params.set("verifiedPurchase", verifiedFilter === "verified" ? "true" : "false");
      if (ratingFilter !== "all") params.set("rating", ratingFilter);
      if (productFilter !== "all") params.set("productId", productFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setReviews(json.data.items || []);
        setTotal(json.data.pagination.total || 0);
        setTotalPages(json.data.pagination.totalPages || 1);
        if (json.data.stats) setStats(json.data.stats);
        if (json.data.productsList) setProductsList(json.data.productsList);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch {
      toast.error("Error loading reviews");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, verifiedFilter, ratingFilter, productFilter, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === reviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviews.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick Action Handlers
  const handleStatusChange = async (id: string, status: "pending" | "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Review status updated to ${status}`);
        fetchReviews();
      } else {
        toast.error(json.message || "Failed to update review status");
      }
    } catch {
      toast.error("Error updating review status");
    }
  };

  // Delete Single Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/admin/reviews/${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Review deleted successfully");
        setDeleteTargetId(null);
        fetchReviews();
      } else {
        toast.error(json.message || "Failed to delete review");
      }
    } catch {
      toast.error("Error deleting review");
    }
  };

  // Bulk Actions Handlers
  const handleBulkStatusChange = async (status: "approved" | "rejected" | "pending") => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_status", ids: selectedIds, status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Updated ${json.data.count} reviews to ${status}`);
        setSelectedIds([]);
        fetchReviews();
      } else {
        toast.error(json.message || "Bulk status update failed");
      }
    } catch {
      toast.error("Error running bulk action");
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_delete", ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Deleted ${json.data.count} reviews`);
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
        fetchReviews();
      } else {
        toast.error(json.message || "Bulk delete failed");
      }
    } catch {
      toast.error("Error running bulk delete");
    }
  };

  // Form Validation & Submit for Create / Edit
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    if (!editingReview && !formData.productId) {
      errors.productId = "Please select a product";
    }
    if (!formData.comment.trim()) {
      errors.comment = "Review comment is required";
    }
    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = "Rating must be between 1 and 5";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateModal = () => {
    setFormData({
      productId: productsList[0]?.id || "",
      customerName: "",
      rating: 5,
      comment: "",
      reviewStatus: "approved",
      verifiedPurchase: true,
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const openEditModal = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      productId: review.productId,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      reviewStatus: review.reviewStatus,
      verifiedPurchase: review.verifiedPurchase,
    });
    setFormErrors({});
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingReview) {
        // Edit Review
        const res = await fetch(`/api/admin/reviews/${editingReview.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.customerName,
            rating: formData.rating,
            comment: formData.comment,
            reviewStatus: formData.reviewStatus,
            verifiedPurchase: formData.verifiedPurchase,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Review updated successfully");
          setEditingReview(null);
          fetchReviews();
        } else {
          toast.error(json.message || "Failed to update review");
        }
      } else {
        // Create Review
        const res = await fetch("/api/admin/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("New review created successfully");
          setIsCreateModalOpen(false);
          fetchReviews();
        } else {
          toast.error(json.message || "Failed to create review");
        }
      }
    } catch {
      toast.error("Error submitting review form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: "approved" | "pending" | "rejected") => {
    switch (status) {
      case "approved":
        return <AdminBadge variant="green">Approved</AdminBadge>;
      case "pending":
        return <AdminBadge variant="amber">Pending</AdminBadge>;
      case "rejected":
        return <AdminBadge variant="red">Rejected</AdminBadge>;
      default:
        return <AdminBadge variant="gray">{status}</AdminBadge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating ? "fill-current" : "stroke-current fill-transparent text-stone-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full mx-auto pb-12">
      {/* 1. Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <MessageSquareQuote className="w-6 h-6 text-[#B67B5C]" />
            <span>Product Reviews Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Moderate, approve, edit, and create customer product reviews
          </p>
        </div>

        <AdminButton onClick={openCreateModal} variant="primary" className="shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Review</span>
        </AdminButton>
      </div>

      {/* 2. Top Dashboard Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard className="p-4 border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Reviews
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2">{stats.total}</p>
        </AdminCard>

        <AdminCard className="p-4 border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{stats.approved}</p>
        </AdminCard>

        <AdminCard className="p-4 border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2">{stats.pending}</p>
        </AdminCard>

        <AdminCard className="p-4 border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Avg Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 mt-2 flex items-baseline gap-1">
            <span>{stats.averageRating.toFixed(1)}</span>
            <span className="text-xs font-normal text-stone-400">/ 5.0</span>
          </p>
        </AdminCard>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search customer, product, or review..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Verified Purchase Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">All Purchases</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>

        {/* Product Dropdown Filter (If products exist) */}
        {productsList.length > 0 && (
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 font-medium shrink-0">Filter Product:</span>
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setPage(1);
              }}
              className="max-w-md w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
            >
              <option value="all">All Products ({productsList.length})</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-[#B67B5C]/10 p-3 rounded-xl">
            <span className="text-xs font-bold text-[#B67B5C]">
              {selectedIds.length} review{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatusChange("approved")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Approve Selected
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("rejected")}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Reject Selected
              </button>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Main Reviews Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <AdminTable
          headers={[
            <input
              key="select-all"
              type="checkbox"
              checked={reviews.length > 0 && selectedIds.length === reviews.length}
              onChange={toggleSelectAll}
              className="rounded border-stone-300 text-[#B67B5C] focus:ring-[#B67B5C]"
            />,
            "Customer",
            "Product Name",
            "Rating",
            "Review Comment",
            "Verified",
            "Status",
            "Date",
            <div key="act" className="text-right">
              Actions
            </div>,
          ]}
          isEmpty={!isLoading && reviews.length === 0}
          emptyText="No reviews found matching your search and filters."
        >
          {isLoading ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-stone-400">
                Loading reviews data...
              </td>
            </tr>
          ) : (
            reviews.map((review) => {
              const isSelected = selectedIds.includes(review.id);
              return (
                <tr
                  key={review.id}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    isSelected ? "bg-[#B67B5C]/5" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(review.id)}
                      className="rounded border-stone-300 text-[#B67B5C] focus:ring-[#B67B5C]"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                        {review.customerName.charAt(0)}
                      </div>
                      <span className="truncate max-w-[120px]">{review.customerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-900">
                    {review.product ? (
                      <Link
                        href={`/admin/products/${review.product.id}`}
                        className="hover:text-[#B67B5C] hover:underline flex items-center gap-1.5 truncate max-w-[160px]"
                        title={review.product.name}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{review.product.name}</span>
                      </Link>
                    ) : (
                      <span className="text-stone-400 italic">Unknown Product</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 shrink-0">{renderStars(review.rating)}</td>
                  <td className="py-3.5 px-4">
                    <p className="line-clamp-2 max-w-xs text-stone-600 text-[11px] leading-relaxed">
                      {review.comment}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    {review.verifiedPurchase ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-medium">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">{renderStatusBadge(review.reviewStatus)}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Quick Approve/Reject buttons */}
                      {review.reviewStatus !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(review.id, "approved")}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve Review"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {review.reviewStatus !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(review.id, "rejected")}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject Review"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* View details */}
                      <button
                        type="button"
                        onClick={() => setViewingReview(review)}
                        className="p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEditModal(review)}
                        className="p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-colors"
                        title="Edit Review"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(review.id)}
                        className="p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </AdminTable>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total reviews)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-stone-200 rounded-lg disabled:opacity-50 flex items-center gap-1 hover:bg-stone-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-stone-200 rounded-lg disabled:opacity-50 flex items-center gap-1 hover:bg-stone-50"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. View Details Modal */}
      <AdminModal
        isOpen={Boolean(viewingReview)}
        onClose={() => setViewingReview(null)}
        title="Review Details"
      >
        {viewingReview && (
          <div className="space-y-4 text-xs text-stone-700">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">{viewingReview.customerName}</h3>
                <span className="text-[11px] text-stone-400">
                  Posted on {new Date(viewingReview.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div>{renderStatusBadge(viewingReview.reviewStatus)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-stone-400 font-semibold block uppercase text-[10px]">
                  Product Name
                </span>
                {viewingReview.product ? (
                  <Link
                    href={`/admin/products/${viewingReview.product.id}`}
                    className="text-[#B67B5C] font-bold hover:underline"
                  >
                    {viewingReview.product.name}
                  </Link>
                ) : (
                  <span className="text-stone-400 italic">Unknown Product</span>
                )}
              </div>

              <div>
                <span className="text-stone-400 font-semibold block uppercase text-[10px]">
                  Rating
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {renderStars(viewingReview.rating)}
                  <span className="font-bold text-stone-900">{viewingReview.rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 font-semibold block uppercase text-[10px]">
                  Verified Purchase Status
                </span>
                <span className="font-semibold text-stone-900">
                  {viewingReview.verifiedPurchase ? "✓ Yes (Verified Buyer)" : "✗ No (Standard Review)"}
                </span>
              </div>

              <div>
                <span className="text-stone-400 font-semibold block uppercase text-[10px] mb-1">
                  Customer Comment
                </span>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 leading-relaxed font-normal">
                  {viewingReview.comment}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {viewingReview.reviewStatus !== "approved" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(viewingReview.id, "approved");
                      setViewingReview(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {viewingReview.reviewStatus !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(viewingReview.id, "rejected");
                      setViewingReview(null);
                    }}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
              </div>

              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => setViewingReview(null)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* 6. Create / Edit Review Modal */}
      <AdminModal
        isOpen={isCreateModalOpen || Boolean(editingReview)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingReview(null);
        }}
        title={editingReview ? "Edit Customer Review" : "Create New Customer Review"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          {/* Product Selection (Only on Create) */}
          {!editingReview && (
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Target Product <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
              >
                <option value="">Select a product...</option>
                {productsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {formErrors.productId && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.productId}</p>
              )}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
            {formErrors.customerName && (
              <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerName}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Rating (1 to 5 Stars) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400 gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <Star
                    key={starVal}
                    onClick={() => setFormData({ ...formData, rating: starVal })}
                    className={`w-6 h-6 transition-transform hover:scale-110 ${
                      starVal <= formData.rating
                        ? "fill-current text-amber-400"
                        : "stroke-current fill-transparent text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-900 text-sm">{formData.rating} Stars</span>
            </div>
            {formErrors.rating && (
              <p className="text-rose-600 text-[11px] mt-1">{formErrors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Review Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Write customer review feedback here..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
            {formErrors.comment && (
              <p className="text-rose-600 text-[11px] mt-1">{formErrors.comment}</p>
            )}
          </div>

          {/* Status & Verified */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Status</label>
              <select
                value={formData.reviewStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reviewStatus: e.target.value as "pending" | "approved" | "rejected",
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="verifiedPurchaseCheck"
                checked={formData.verifiedPurchase}
                onChange={(e) =>
                  setFormData({ ...formData, verifiedPurchase: e.target.checked })
                }
                className="rounded border-stone-300 text-[#B67B5C] focus:ring-[#B67B5C] w-4 h-4"
              />
              <label htmlFor="verifiedPurchaseCheck" className="font-semibold text-stone-800">
                Verified Purchase
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingReview(null);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingReview
                ? "Update Review"
                : "Create Review"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* 7. Delete Single Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this customer review? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
      />

      {/* 8. Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Reviews"
        message={`Are you sure you want to delete ${selectedIds.length} selected review(s)? This action cannot be undone.`}
        confirmLabel="Delete Selected"
        isDangerous={true}
      />
    </div>
  );
}
