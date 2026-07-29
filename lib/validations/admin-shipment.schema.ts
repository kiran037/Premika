import { z } from "zod";

export const adminShipmentCreateSchema = z.object({
  weight: z
    .number({ message: "Weight must be a valid number" })
    .positive("Weight must be greater than 0"),
  length: z
    .number({ message: "Length must be a valid number" })
    .positive("Length must be greater than 0"),
  width: z
    .number({ message: "Width must be a valid number" })
    .positive("Width must be greater than 0"),
  height: z
    .number({ message: "Height must be a valid number" })
    .positive("Height must be greater than 0"),
  packageCount: z
    .number({ message: "Package count must be a number" })
    .int("Package count must be an integer")
    .min(1, "Package count must be at least 1"),
  pickupLocationId: z
    .string({ message: "Pickup location is required" })
    .min(1, "Pickup location is required"),
  invoiceNumber: z
    .string({ message: "Invoice number is required" })
    .min(1, "Invoice number is required"),
  invoiceDate: z
    .string({ message: "Invoice date is required" })
    .min(1, "Invoice date is required"),
});

export type AdminShipmentCreateInput = z.infer<typeof adminShipmentCreateSchema>;
