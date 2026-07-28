import { z } from "zod";

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  identifier: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isPhone = /^[0-9+\s-]{8,15}$/.test(val);
      return isEmail || isPhone;
    }, "Please enter a valid email address or phone number"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
