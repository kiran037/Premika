import { z } from "zod";

export const adminCouponSchema = z
  .object({
    code: z
      .string()
      .min(2, "Coupon code must be at least 2 characters")
      .max(50, "Coupon code cannot exceed 50 characters")
      .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, or underscores"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(150, "Name cannot exceed 150 characters"),
    description: z.string().optional().nullable(),
    type: z.enum(["percentage", "fixed"], {
      message: "Coupon type is required",
    }),
    value: z
      .number()
      .positive("Discount value must be greater than 0"),
    minimumOrderAmount: z
      .number()
      .min(0, "Minimum order amount cannot be negative")
      .default(0),
    maximumDiscount: z
      .number()
      .min(0, "Maximum discount cannot be negative")
      .optional()
      .nullable(),
    usageLimit: z
      .number()
      .min(1, "Usage limit must be at least 1")
      .optional()
      .nullable(),
    startsAt: z.string().optional().nullable(),
    expiresAt: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.type === "percentage" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount value cannot exceed 100%",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      if (data.startsAt && data.expiresAt) {
        const start = new Date(data.startsAt);
        const expiry = new Date(data.expiresAt);
        return expiry > start;
      }
      return true;
    },
    {
      message: "Expiry date must be after start date",
      path: ["expiresAt"],
    }
  );

export type AdminCouponInput = z.infer<typeof adminCouponSchema>;
