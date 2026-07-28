import { z } from "zod";

export const checkoutAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number starting with 6-9"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "City should only contain letters and spaces"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "State should only contain letters and spaces"),
  postalCode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit postal code"),
  country: z.string().default("IN"),
});

export const checkoutCartItemSchema = z.object({
  id: z.string(),
  productId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  selectedSize: z.string().optional(),
  selectedHeight: z.string().optional(),
  isCombo: z.boolean().optional(),
  comboSelections: z.record(z.string(), z.any()).optional(),
});

export const checkoutInputSchema = z.object({
  customer: checkoutAddressSchema,
  items: z.array(checkoutCartItemSchema).min(1, "Cart cannot be empty"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
