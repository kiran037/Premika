import { z } from "zod";

export const categorySlugParamSchema = z.object({
  slug: z.string().min(1, "Category slug is required"),
});
