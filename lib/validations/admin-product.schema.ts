import { z } from "zod";

export const adminProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().optional(),
  categoryId: z.string().uuid("Please select a valid category"),
  productType: z.enum(["top", "bottom", "set"]),
  gender: z.enum(["men", "women", "unisex"]).default("women"),
  price: z.number().positive("Price must be a positive number"),
  compareAtPrice: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  fabric: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  hasHeightOptions: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z
    .array(
      z.string().refine(
        (value) => value.startsWith("/") || /^https?:\/\//.test(value),
        {
          message: "Must be a valid image path or URL",
        }
      )
    )
    .min(1, "At least one product image is required"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size label is required"),
        stock: z.number().int().min(0, "Stock cannot be negative").default(10),
        isAvailable: z.boolean().default(true),
      })
    )
    .default([]),
  heights: z
    .array(
      z.object({
        label: z.string().min(1, "Height label is required"),
        value: z.string().min(1, "Height value is required"),
        isDefault: z.boolean().default(false),
      })
    )
    .default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
