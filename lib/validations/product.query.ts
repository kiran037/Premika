import { z } from "zod";

export const getProductsQuerySchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Math.max(1, Number(val)) : 1)),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Math.min(100, Math.max(1, Number(val))) : 20)),
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z
    .enum(["featured", "price-low", "price-high", "name", "newest"])
    .optional()
    .default("featured"),
  featured: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => (val === "true" || val === true ? true : val === "false" || val === false ? false : undefined)),
  newArrival: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => (val === "true" || val === true ? true : val === "false" || val === false ? false : undefined)),
  minPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)),
  maxPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)),
  inStock: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => (val === "true" || val === true ? true : val === "false" || val === false ? false : undefined)),
});

export const productSlugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
export type GetProductsInput = z.input<typeof getProductsQuerySchema>;
