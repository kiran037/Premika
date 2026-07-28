"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, Skeleton } from "@/components/admin";
import { toast } from "react-hot-toast";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setInitialData(json.data);
        } else {
          toast.error("Product not found");
        }
      } catch {
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
    } catch {
      console.error("Error fetching categories");
    }
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push(`/admin/products/${id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      title={`Edit Product: ${initialData?.product?.name || ""}`}
      subtitle={`Product ID: ${id}`}
      initialData={initialData}
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      backUrl={`/admin/products/${id}`}
    />
  );
}
