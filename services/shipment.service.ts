import { ShipmentRepository } from "@/repositories/shipment.repository";
import { OrderRepository } from "@/repositories/order.repository";
import { DelhiverySettingsService } from "@/services/delhivery-settings.service";
import { DelhiveryService } from "@/services/delhivery.service";
import { mapDelhiveryStatusToShipmentStatus } from "@/lib/delhivery";

export class ShipmentService {
  /**
   * Create a new Delhivery shipment for an order
   */
  static async createDelhiveryShipmentForOrder(
    orderId: string,
    options?: {
      weight?: number;
      length?: number;
      width?: number;
      height?: number;
      packageCount?: number;
      pickupLocationId?: string;
      invoiceNumber?: string;
      invoiceDate?: string;
    }
  ) {
    // 1. Load Order Details
    const orderData = await OrderRepository.findAdminOrderById(orderId);
    if (!orderData || !orderData.order) {
      throw new Error("Order not found");
    }

    const { order, customer, address, items, shipment } = orderData;

    // 2. Ensure shipment does not already exist
    if (shipment && shipment.trackingNumber) {
      throw new Error(`Shipment already exists with AWB: ${shipment.trackingNumber}`);
    }

    // 3. Load Delhivery Pickup Settings from Database
    const pickupSettings = await DelhiverySettingsService.getSettings();

    // 4. Build Consignee Address string
    const fullAddress = [
      address?.addressLine1,
      address?.addressLine2,
    ]
      .filter(Boolean)
      .join(", ");

    // 5. Invoke Delhivery Service API
    const delhiveryResult = await DelhiveryService.createShipment({
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toISOString(),
      paymentMode: "Pre-Paid",
      totalAmount: order.total / 100, // INR
      consigneeName: `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || "Customer",
      consigneePhone: address?.phone || customer?.phone || "0000000000",
      consigneeEmail: customer?.email || "",
      consigneeAddress: fullAddress || "Shipping Address",
      consigneeCity: address?.city || "Mumbai",
      consigneeState: address?.state || "Maharashtra",
      consigneePincode: address?.postalCode || "400001",
      consigneeCountry: address?.country || "India",
      pickupLocation: {
        pickupName: pickupSettings.pickupName,
        pickupPhone: pickupSettings.pickupPhone,
        pickupEmail: pickupSettings.pickupEmail,
        pickupAddressLine1: pickupSettings.pickupAddressLine1,
        pickupAddressLine2: pickupSettings.pickupAddressLine2,
        pickupCity: pickupSettings.pickupCity,
        pickupState: pickupSettings.pickupState,
        pickupPincode: pickupSettings.pickupPincode,
        pickupCountry: pickupSettings.pickupCountry,
      },
      items: items.map((i: any) => ({
        name: i.productName,
        sku: i.productSku || i.id,
        units: i.quantity,
        price: i.unitPrice / 100,
      })),
      weight: options?.weight,
      length: options?.length,
      width: options?.width,
      height: options?.height,
      packageCount: options?.packageCount,
      invoiceNumber: options?.invoiceNumber,
      invoiceDate: options?.invoiceDate,
    });

    if (!delhiveryResult.success || !delhiveryResult.packages?.[0]) {
      throw new Error(delhiveryResult.error || "Failed to create shipment with Delhivery");
    }

    const pkg = delhiveryResult.packages[0];
    const trackingNumber = pkg.waybill;
    const trackingUrl = `https://track.delhivery.com/p/${trackingNumber}`;

    // 6. Save Shipment Details into Database
    let createdShipment;
    if (shipment) {
      createdShipment = await ShipmentRepository.updateShipmentStatus(shipment.id, {
        status: "booked",
        courierName: "Delhivery",
        trackingNumber,
        trackingUrl,
        shippedAt: new Date(),
      });
    } else {
      createdShipment = await ShipmentRepository.createShipmentRecord({
        orderId: order.id,
        status: "booked",
        courierName: "Delhivery",
        trackingNumber,
        trackingUrl,
        shippedAt: new Date(),
      });
    }

    // 7. Update Order Status to "shipped"
    await OrderRepository.updateOrderStatusAndFulfillment(order.id, {
      status: "shipped",
      courierName: "Delhivery",
      trackingNumber,
      trackingUrl,
    });

    // 8. Record Initial Tracking History Scan
    if (createdShipment) {
      await ShipmentRepository.addTrackingHistory({
        shipmentId: createdShipment.id,
        status: "booked",
        location: pickupSettings.pickupCity,
        description: `Shipment created & waybill ${trackingNumber} assigned via Delhivery`,
      });
    }

    return {
      shipment: createdShipment,
      waybill: trackingNumber,
      trackingUrl,
    };
  }

  /**
   * Sync latest tracking status from Delhivery
   */
  static async syncShipmentStatus(orderId: string) {
    const shipment = await ShipmentRepository.getShipmentByOrderId(orderId);
    if (!shipment || !shipment.trackingNumber) {
      throw new Error("No active shipment or tracking number found for order");
    }

    const trackingRes = await DelhiveryService.trackShipment(shipment.trackingNumber);
    if (!trackingRes.success || !trackingRes.trackingData) {
      throw new Error(trackingRes.error || "Unable to sync tracking status from Delhivery");
    }

    const data = trackingRes.trackingData;
    const newShipmentStatus = mapDelhiveryStatusToShipmentStatus(data.status);

    // Update Shipment Record
    const updatedShipment = await ShipmentRepository.updateShipmentStatus(shipment.id, {
      status: newShipmentStatus,
      deliveredAt: newShipmentStatus === "delivered" ? new Date() : shipment.deliveredAt || undefined,
    });

    // Record Tracking History Scan
    await ShipmentRepository.addTrackingHistory({
      shipmentId: shipment.id,
      status: newShipmentStatus,
      location: data.location || "Delhivery Network",
      description: data.instructions || data.status,
    });

    // Map order status
    let orderStatus = "shipped";
    if (newShipmentStatus === "delivered") orderStatus = "delivered";
    else if (newShipmentStatus === "failed" || newShipmentStatus === "returned") orderStatus = "cancelled";

    await OrderRepository.updateOrderStatusAndFulfillment(orderId, {
      status: orderStatus as any,
    });

    return {
      shipment: updatedShipment,
      trackingData: data,
    };
  }

  /**
   * Retrieve label for shipment
   */
  static async getShipmentLabel(orderId: string) {
    const shipment = await ShipmentRepository.getShipmentByOrderId(orderId);
    if (!shipment || !shipment.trackingNumber) {
      throw new Error("No shipment found for order");
    }

    return DelhiveryService.fetchLabel(shipment.trackingNumber);
  }
}
