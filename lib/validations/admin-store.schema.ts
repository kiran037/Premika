import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(255, "Store name cannot exceed 255 characters"),
  storeEmail: z.string().email("Invalid store email address"),
  storePhone: z.string().max(30, "Phone number cannot exceed 30 characters").optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  maintenanceMode: z.boolean().default(false),
});

export const storeContactsSchema = z.object({
  address: z.string().optional().nullable(),
  city: z.string().max(100, "City cannot exceed 100 characters").optional().nullable(),
  state: z.string().max(100, "State cannot exceed 100 characters").optional().nullable(),
  country: z.string().max(100, "Country cannot exceed 100 characters").optional().nullable(),
  postalCode: z.string().max(20, "Postal code cannot exceed 20 characters").optional().nullable(),
  supportEmail: z.string().email("Invalid support email address").optional().or(z.literal("")).nullable(),
  supportPhone: z.string().max(30, "Support phone cannot exceed 30 characters").optional().nullable(),
  businessHours: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
});

export const socialLinkSchema = z.object({
  platform: z
    .string()
    .min(2, "Platform name is required")
    .max(100, "Platform cannot exceed 100 characters"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().max(100).optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.string().default("0"),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type StoreContactsInput = z.infer<typeof storeContactsSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export { delhiverySettingsSchema, type DelhiverySettingsInput } from "./admin-delhivery.schema";
