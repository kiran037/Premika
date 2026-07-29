import { z } from "zod";

export const delhiverySettingsSchema = z.object({
  pickupName: z
    .string()
    .min(2, "Pickup name must be at least 2 characters")
    .max(255, "Pickup name cannot exceed 255 characters"),
  pickupPhone: z
    .string()
    .min(5, "Pickup phone number is required")
    .max(30, "Phone number cannot exceed 30 characters"),
  pickupEmail: z.string().email("Invalid pickup email address"),
  pickupAddressLine1: z.string().min(5, "Address Line 1 is required"),
  pickupAddressLine2: z.string().optional().nullable(),
  pickupCity: z
    .string()
    .min(2, "City is required")
    .max(100, "City cannot exceed 100 characters"),
  pickupState: z
    .string()
    .min(2, "State is required")
    .max(100, "State cannot exceed 100 characters"),
  pickupPincode: z
    .string()
    .min(3, "Pincode is required")
    .max(20, "Pincode cannot exceed 20 characters"),
  pickupCountry: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country cannot exceed 100 characters")
    .default("India"),
  isActive: z.boolean().default(true),
});

export type DelhiverySettingsInput = z.infer<typeof delhiverySettingsSchema>;
