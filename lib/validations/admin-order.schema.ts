import { z } from "zod";

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ]),
  courierName: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  trackingUrl: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type AdminOrderStatusInput = z.infer<typeof adminOrderStatusSchema>;
