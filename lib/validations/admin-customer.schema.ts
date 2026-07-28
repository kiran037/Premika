import { z } from "zod";

export const adminCustomerQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  segment: z.enum(["all", "vip", "high_spender", "returning", "one_time", "new"]).default("all"),
  sortBy: z.enum(["spend_desc", "orders_desc", "newest", "name_asc"]).default("spend_desc"),
});

export type AdminCustomerQueryInput = z.infer<typeof adminCustomerQuerySchema>;
