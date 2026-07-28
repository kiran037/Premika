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
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Sparkles,
} from "lucide-react";
import { AdminCard, AdminButton, AdminBadge, AdminTable, ConfirmDialog, Skeleton } from "@/components/admin";
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
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
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

  const { category, productCount, products } = data;
  const bannerImg = category.image || "/placeholder.svg";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/categories">
            <button className="p-2 rounded-xl text-stone-600 hover:bg-stone-100">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{category.name}</h1>
              {category.isActive ? (
                <AdminBadge variant="green">Active</AdminBadge>
              ) : (
                <AdminBadge variant="red">Inactive</AdminBadge>
              )}
            </div>
            <p className="text-xs text-stone-500 font-mono">Slug: {category.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/clothing?category=${category.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
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
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Safe Delete Category"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner Preview */}
        <div className="space-y-3">
          <div className="relative aspect-16/9 md:aspect-4/3 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
            <Image src={bannerImg} alt={category.name} fill className="object-cover" />
          </div>
        </div>

        {/* Metadata */}
        <div className="md:col-span-2 space-y-6">
          <AdminCard title="Category Overview" description="Core properties and product metrics">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Category ID</span>
                <span className="font-mono text-stone-700 text-[11px] truncate block">{category.id}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Product Count</span>
                <span className="font-bold text-stone-900 text-sm">{productCount} Products</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Sort Order</span>
                <span className="font-bold text-stone-900">{category.sortOrder}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 text-xs">
              <span className="text-stone-400 block font-semibold uppercase mb-1">Description</span>
              <p className="text-stone-700 leading-relaxed">
                {category.description || "No description provided for this collection."}
              </p>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Products Belonging to Category */}
      <AdminCard
        title={`Products in ${category.name}`}
        description={`List of ${products.length} product(s) assigned to this category`}
      >
        <AdminTable
          headers={["Product Name", "Slug", "Price", "Status", "Actions"]}
          isEmpty={products.length === 0}
          emptyText="No products assigned to this category"
        >
          {products.map((p: any) => (
            <tr key={p.id} className="hover:bg-stone-50 text-xs">
              <td className="px-6 py-3 font-semibold text-stone-900">{p.name}</td>
              <td className="px-6 py-3 font-mono text-stone-600">{p.slug}</td>
              <td className="px-6 py-3 font-bold text-stone-900">₹{p.price.toLocaleString()}</td>
              <td className="px-6 py-3">
                {p.isActive ? (
                  <AdminBadge variant="green">Active</AdminBadge>
                ) : (
                  <AdminBadge variant="red">Inactive</AdminBadge>
                )}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/products/${p.id}`} title="View Product Details">
                    <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg">
                      <Eye size={15} />
                    </button>
                  </Link>

                  <Link href={`/admin/products/${p.id}/edit`} title="Edit Product">
                    <button className="p-1.5 text-stone-500 hover:text-[#B67B5C] hover:bg-[#B67B5C]/10 rounded-lg">
                      <Edit size={15} />
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

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
