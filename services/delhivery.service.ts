import { DELHIVERY_CONFIG } from "@/lib/delhivery";
import {
  DelhiveryCreateShipmentPayload,
  DelhiveryCreateShipmentResponse,
  DelhiveryTrackingResponse,
  DelhiveryLabelResponse,
} from "@/types/delhivery";

export class DelhiveryService {
  /**
   * Helper for API request headers
   */
  private static getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Token ${DELHIVERY_CONFIG.apiToken}`,
      Accept: "application/json",
    };
  }

  /**
   * Create a shipment / Waybill on Delhivery API
   */
  static async createShipment(
    payload: DelhiveryCreateShipmentPayload & {
      weight?: number;
      length?: number;
      width?: number;
      height?: number;
      packageCount?: number;
      invoiceNumber?: string;
      invoiceDate?: string;
    }
  ): Promise<DelhiveryCreateShipmentResponse> {
    const token = DELHIVERY_CONFIG.apiToken;

    // Simulation / fallback mode when API token is not configured in environment
    if (!token) {
      console.warn("DELHIVERY_API_TOKEN is not set in environment. Generating simulated Delhivery Waybill.");
      const mockWaybill = `DEL${Date.now().toString().slice(-10)}`;
      return {
        success: true,
        uploadWbn: `WBN${Date.now()}`,
        packages: [
          {
            waybill: mockWaybill,
            refnum: payload.invoiceNumber || payload.orderNumber,
            status: "Manifested",
            remarks: ["Simulated shipment creation"],
          },
        ],
      };
    }

    try {
      const formattedPayload = {
        shipments: [
          {
            name: payload.consigneeName,
            add: `${payload.consigneeAddress}, ${payload.consigneeCity}`,
            pin: payload.consigneePincode,
            city: payload.consigneeCity,
            state: payload.consigneeState,
            country: payload.consigneeCountry || "India",
            phone: payload.consigneePhone,
            order: payload.invoiceNumber || payload.orderNumber,
            order_date: payload.invoiceDate || payload.orderDate,
            payment_mode: payload.paymentMode,
            return_pin: payload.pickupLocation.pickupPincode,
            return_city: payload.pickupLocation.pickupCity,
            return_phone: payload.pickupLocation.pickupPhone,
            return_add: payload.pickupLocation.pickupAddressLine1,
            return_state: payload.pickupLocation.pickupState,
            return_country: payload.pickupLocation.pickupCountry || "India",
            pickup_location: payload.pickupLocation.pickupName,
            products_desc: payload.items.map((i) => i.name).join(", "),
            total_amount: payload.totalAmount,
            quantity: payload.items.reduce((acc, i) => acc + i.units, 0),
            weight: payload.weight ? payload.weight * 1000 : undefined, // Convert kg to grams
            shipment_height: payload.height,
            shipment_width: payload.width,
            shipment_length: payload.length,
            number_of_packages: payload.packageCount || 1,
          },
        ],
        pickup_location: {
          name: payload.pickupLocation.pickupName,
          add: payload.pickupLocation.pickupAddressLine1,
          city: payload.pickupLocation.pickupCity,
          state: payload.pickupLocation.pickupState,
          country: payload.pickupLocation.pickupCountry,
          pin: payload.pickupLocation.pickupPincode,
          phone: payload.pickupLocation.pickupPhone,
          email: payload.pickupLocation.pickupEmail,
        },
      };

      const res = await fetch(`${DELHIVERY_CONFIG.baseUrl}/api/cmu/create.json`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(formattedPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, error: `Delhivery API error (${res.status}): ${errText}` };
      }

      const data = await res.json();
      if (data.packages && data.packages.length > 0) {
        const firstPkg = data.packages[0];
        if (firstPkg.status === "Fail" || firstPkg.status === "Error" || firstPkg.status === "FAILED") {
          const errorMsg = Array.isArray(firstPkg.remarks)
            ? firstPkg.remarks.join("; ")
            : firstPkg.remarks || firstPkg.status || "Delhivery shipment creation failed";
          return {
            success: false,
            error: errorMsg,
          };
        }

        return {
          success: true,
          uploadWbn: data.upload_wbn,
          packages: data.packages.map((p: any) => ({
            waybill: p.waybill,
            refnum: p.refnum,
            status: p.status || "Manifested",
            remarks: p.remarks,
          })),
        };
      }

      const errorMsg =
        data.rmk ||
        data.error ||
        (Array.isArray(data.remarks) ? data.remarks.join("; ") : null) ||
        "Delhivery API returned empty shipment packages";

      return {
        success: false,
        error: errorMsg,
      };
    } catch (err: any) {
      console.error("Error creating Delhivery shipment:", err);
      return { success: false, error: err.message || "Failed to communicate with Delhivery API" };
    }
  }

  /**
   * Track shipment status by Waybill number
   */
  static async trackShipment(waybill: string): Promise<DelhiveryTrackingResponse> {
    const token = DELHIVERY_CONFIG.apiToken;
    if (!token) {
      return {
        success: true,
        trackingData: {
          waybill,
          status: "In Transit",
          statusCode: "IT",
          statusDateTime: new Date().toISOString(),
          location: "Mumbai Hub",
          instructions: "Shipment in transit to destination warehouse",
        },
      };
    }

    try {
      const url = `${DELHIVERY_CONFIG.baseUrl}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}&token=${encodeURIComponent(token)}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) {
        return { success: false, error: `Failed to fetch tracking info (${res.status})` };
      }

      const data = await res.json();
      const shipmentData = data.ShipmentData?.[0]?.Shipment;
      if (!shipmentData) {
        return { success: false, error: "Tracking data not found for waybill" };
      }

      return {
        success: true,
        trackingData: {
          waybill: shipmentData.AWB || waybill,
          status: shipmentData.Status?.Status || "In Transit",
          statusCode: shipmentData.Status?.StatusCode,
          statusDateTime: shipmentData.Status?.StatusDateTime,
          location: shipmentData.Status?.StatusLocation,
          instructions: shipmentData.Status?.Instructions,
          scans: shipmentData.Scans?.map((s: any) => ({
            scanDateTime: s.ScanDetail?.ScanDateTime,
            scanType: s.ScanDetail?.ScanType,
            location: s.ScanDetail?.ScannedLocation,
            instructions: s.ScanDetail?.Instructions,
          })),
        },
      };
    } catch (err: any) {
      console.error("Error tracking Delhivery shipment:", err);
      return { success: false, error: err.message || "Tracking lookup failed" };
    }
  }

  /**
   * Download / Retrieve shipping label URL for Waybill
   */
  static async fetchLabel(waybill: string): Promise<DelhiveryLabelResponse> {
    const token = DELHIVERY_CONFIG.apiToken;
    if (!token) {
      return {
        success: true,
        labelUrl: `https://track.delhivery.com/p/${waybill}`,
      };
    }

    try {
      const url = `${DELHIVERY_CONFIG.baseUrl}/api/p/packing_slip?wbns=${encodeURIComponent(waybill)}&pdf=true`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) {
        return { success: false, error: `Failed to fetch label (${res.status})` };
      }

      const data = await res.json();
      return {
        success: true,
        labelUrl: data.packages?.[0]?.pdf_download_link || `https://track.delhivery.com/p/${waybill}`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to fetch label from Delhivery" };
    }
  }
}
