export const DELHIVERY_CONFIG = {
  get baseUrl() {
    return (process.env.DELHIVERY_API_URL || "https://track.delhivery.com")
      .trim()
      .replace(/\/+$/, "");
  },
  get apiToken() {
    return (process.env.DELHIVERY_API_TOKEN || "").trim();
  },
  get webhookSecret() {
    return (process.env.DELHIVERY_WEBHOOK_SECRET || "").trim();
  },
};

/**
 * Map Delhivery status string to standard shipmentStatusEnum
 */
export function mapDelhiveryStatusToShipmentStatus(
  delhiveryStatus: string
): "pending" | "booked" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed" | "returned" {
  const status = (delhiveryStatus || "").toLowerCase();

  if (status.includes("delivered")) return "delivered";
  if (status.includes("out for delivery") || status.includes("dispatched")) return "out_for_delivery";
  if (status.includes("in transit") || status.includes("manifested") || status.includes("reached")) return "in_transit";
  if (status.includes("picked up") || status.includes("pickup")) return "picked_up";
  if (status.includes("booked")) return "booked";
  if (status.includes("rto") || status.includes("returned")) return "returned";
  if (status.includes("failed") || status.includes("cancelled") || status.includes("canceled")) return "failed";

  return "in_transit";
}
