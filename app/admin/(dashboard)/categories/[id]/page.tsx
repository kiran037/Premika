"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Tag,
  Layers,
  ShoppingBag,
  DollarSign,
  Hash,
} from "lucide-react";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminTable,
  ConfirmDialog,
  Skeleton,
  StatCard,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        } else {
          toast.error("Category not found");
        }
      } catch {
        toast.error("Failed to load category details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Category deleted");
        router.push("/admin/categories");
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Category Not Found</h2>
        <Link href="/admin/categories">
          <AdminButton variant="outline">Return to Categories</AdminButton>
        </Link>
      </div>
    );
  }

  const category = data.category || data;
  const productCount = data.productCount ?? category.productCount ?? 0;
  const products = data.products || category.products || [];
  const bannerImg = category.image || category.banner || "/placeholder.svg";

  const inStockCount = products.filter((p: any) => p.isInStock).length;

  const inStockPercent = products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 0;

  const avgPrice =
    products.length > 0
      ? Math.round(
          products.reduce((acc: number, p: any) => acc + (Number(p.price) || 0), 0) / products.length
        )
      : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Enhanced Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/categories">
            <button className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {category.name}
              </h1>
              {category.isActive ? (
                <AdminBadge variant="green">Active</AdminBadge>
              ) : (
                <AdminBadge variant="red">Inactive</AdminBadge>
              )}
              <AdminBadge variant="blue">{productCount} Products</AdminBadge>
            </div>
            <p className="text-xs text-stone-500 font-mono">slug: {category.slug}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 pt-2 sm:pt-0">
          <a
            href={`/shop?category=${encodeURIComponent(category.slug)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Preview Storefront</span>
          </a>

          <Link href={`/admin/categories/${category.id}/edit`}>
            <AdminButton size="sm" className="bg-[#B67B5C] hover:bg-[#8B5A3C] text-white flex items-center gap-1.5">
              <Edit size={14} />
              <span>Edit Category</span>
            </AdminButton>
          </Link>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Category"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* 2. Compact Metric Cards Grid (2 cols mobile, 4 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={`${productCount}`}
          subtitle="Assigned to collection"
          icon={ShoppingBag}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="In-Stock Items"
          value={`${inStockCount}`}
          subtitle={products.length > 0 ? `${inStockPercent}% in-stock ratio` : "Inventory available"}
          icon={Package}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Average Price"
          value={avgPrice !== null ? `₹${avgPrice.toLocaleString()}` : "N/A"}
          subtitle="Mean garment price"
          icon={DollarSign}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Sort Order"
          value={`Rank #${category.sortOrder ?? 0}`}
          subtitle="Storefront display priority"
          icon={Hash}
          iconBgColor="bg-[#B67B5C]/10"
          iconColor="text-[#B67B5C]"
        />
      </div>

      {/* 3. Category Image + Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Larger Image Preview Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Category Image
            </span>
            <span className="text-[10px] font-semibold text-stone-400">16:9 Aspect</span>
          </div>

          <div className="relative aspect-16/9 sm:aspect-4/3 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
            <Image
              src={bannerImg}
              alt={category.name || "Category Image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Structured Overview Card */}
        <div className="md:col-span-2">
          <AdminCard title="Category Overview" description="Core properties and collection metrics">
            <div className="space-y-4">
              {/* Description Block */}
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {category.description || "No description provided for this collection."}
                </p>
              </div>

              {/* Structured Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Slug
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-xs">{category.slug}</span>
                </div>

                <div>
                  <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Sort Order
                  </span>
                  <span className="font-bold text-stone-900 text-xs">Rank #{category.sortOrder ?? 0}</span>
                </div>

                <div>
                  <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                    Category ID
                  </span>
                  <span className="font-mono text-stone-600 text-[11px] truncate block" title={category.id}>
                    {category.id}
                  </span>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* 4. Products Table Enriched with Thumbnails, Stock & Badges */}
      <AdminCard
        title={`Products in ${category.name || "Category"}`}
        description={`Displaying ${products.length} assigned garment(s)`}
      >
        <AdminTable
          headers={["Product", "Price", "Stock", "Status", "Actions"]}
          isEmpty={products.length === 0}
          emptyText="No products currently assigned to this category."
        >
          {products.map((p: any) => {
            const firstImg =
              p.image ||
              (Array.isArray(p.images) && p.images.length > 0
                ? typeof p.images[0] === "string"
                  ? p.images[0]
                  : p.images[0]?.image
                : "/placeholder.svg");

            return (
              <tr key={p.id} className="hover:bg-stone-50 transition-colors text-xs">
                {/* Product Thumbnail + Name + Slug Column */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                      <Image
                        src={firstImg || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="space-y-0.5 max-w-xs">
                      <span className="font-semibold text-stone-900 block truncate" title={p.name}>
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-stone-500 block truncate">
                        {p.slug}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Price Column */}
                <td className="px-6 py-3.5 font-bold text-stone-900">
                  ₹{Number(p.price || 0).toLocaleString()}
                </td>

                {/* Stock Column */}
                <td className="px-6 py-3.5">
                  {p.isInStock ? (
                    <AdminBadge variant="green">
                      {typeof p.totalStock === "number" ? `${p.totalStock} in stock` : "In Stock"}
                    </AdminBadge>
                  ) : (
                    <AdminBadge variant="red">Out of Stock</AdminBadge>
                  )}
                </td>

                {/* Status & Badges Column */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {p.isActive ? (
                      <AdminBadge variant="green">Active</AdminBadge>
                    ) : (
                      <AdminBadge variant="red">Inactive</AdminBadge>
                    )}

                    {(p.featured || p.isFeatured) && (
                      <AdminBadge variant="amber">Featured</AdminBadge>
                    )}

                    {p.newArrival && (
                      <AdminBadge variant="indigo">New</AdminBadge>
                    )}
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/admin/products/${p.id}`} title="View Product Details">
                      <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                        <Eye size={15} />
                      </button>
                    </Link>

                    <Link href={`/admin/products/${p.id}/edit`} title="Edit Product">
                      <button className="p-1.5 text-stone-500 hover:text-[#B67B5C] hover:bg-[#B67B5C]/10 rounded-lg transition-colors">
                        <Edit size={15} />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      </AdminCard>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Deletion will be blocked if products are currently assigned to this category."
        confirmLabel="Delete Category"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}
