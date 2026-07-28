"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm, Skeleton } from "@/components/admin";
import { toast } from "react-hot-toast";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setInitialData(json.data.category);
        } else {
          toast.error("Category not found");
        }
      } catch {
        toast.error("Failed to load category");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update category");
      }

      toast.success("Category updated successfully!");
      router.push(`/admin/categories/${id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CategoryForm
      title={`Edit Category: ${initialData?.name || ""}`}
      subtitle={`Category ID: ${id}`}
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      backUrl={`/admin/categories/${id}`}
    />
  );
}
