"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm
      title="Add New Product"
      subtitle="Create a new item in the Premika product catalog"
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      backUrl="/admin/products"
    />
  );
}
