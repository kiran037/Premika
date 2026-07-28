import { z } from "zod";

export const adminCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal("")).nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0, "Sort order must be 0 or greater").default(0),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
