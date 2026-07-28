"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create category");
      }

      toast.success("Category created successfully!");
      router.push("/admin/categories");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryForm
      title="Add New Category"
      subtitle="Create a new apparel collection or product grouping"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      backUrl="/admin/categories"
    />
  );
}
