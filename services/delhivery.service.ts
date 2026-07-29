import { DELHIVERY_CONFIG } from "@/lib/delhivery";
import {
  DelhiveryCreateShipmentPayload,
  DelhiveryCreateShipmentResponse,
  DelhiveryTrackingResponse,
  DelhiveryLabelResponse,
} from "@/types/delhivery";

export interface DelhiveryPincodeServiceabilityResponse {
  success: boolean;
  isServiceable: boolean;
  remarks?: string;
  pincodeData?: any;
  error?: string;
}

export class DelhiveryService {
  /**
   * Helper to sanitize text fields for Delhivery API
   */
  private static sanitizeText(str: string | null | undefined): string {
    if (!str) return "";
    return str
      .replace(/[\r\n\t]+/g, " ")
      .replace(/["'\\]/g, "")
      .replace(/[^\x20-\x7E]/g, "")
      .trim();
  }

  /**
   * Helper for standard API request headers
   */
  private static getHeaders(contentType: string = "application/json") {
    return {
      "Content-Type": contentType,
      Authorization: `Token ${DELHIVERY_CONFIG.apiToken}`,
      Accept: "application/json",
    };
  }

  /**
   * Check destination pincode serviceability
   */
  static async checkPincodeServiceability(
    pincode: string
  ): Promise<DelhiveryPincodeServiceabilityResponse> {
    const token = DELHIVERY_CONFIG.apiToken;
    if (!token) {
      return { success: true, isServiceable: true };
    }

    try {
      const cleanPincode = (pincode || "").trim();
      const url = `${DELHIVERY_CONFIG.baseUrl}/c/api/pin-codes/json/?token=${encodeURIComponent(
        token
      )}&pincode=${encodeURIComponent(cleanPincode)}`;



      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        return {
          success: true,
          isServiceable: true,
          remarks: "Serviceability lookup fallback mode",
        };
      }

      const data = await res.json();
      const deliveryCodes = data.delivery_codes;
      if (Array.isArray(deliveryCodes) && deliveryCodes.length > 0) {
        const codeInfo = deliveryCodes[0]?.postal_code;
        if (codeInfo && codeInfo.is_serviceable === false) {
          return {
            success: false,
            isServiceable: false,
            error: `Destination pincode ${cleanPincode} is not serviceable by Delhivery.`,
          };
        }
      }

      return { success: true, isServiceable: true, pincodeData: data };
    } catch (err: any) {
      console.warn("Pincode serviceability check skipped:", err?.message);
      return { success: true, isServiceable: true };
    }
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
      console.warn(
        "DELHIVERY_API_TOKEN is not set in environment. Generating simulated Delhivery Waybill."
      );
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
      // 1. Serviceability Check
      const serviceability = await this.checkPincodeServiceability(
        payload.consigneePincode
      );
      if (!serviceability.isServiceable) {
        return {
          success: false,
          error:
            serviceability.error ||
            `Pincode ${payload.consigneePincode} is not serviceable by Delhivery.`,
        };
      }

      // 2. Prepare payload fields according to Delhivery B2C documentation
      const rawPaymentMode = (payload.paymentMode || "").trim();
      const paymentMode =
        rawPaymentMode === "Pre-Paid" || rawPaymentMode === "Prepaid"
          ? "Prepaid"
          : "COD";

      const orderDateStr = payload.invoiceDate || payload.orderDate;
      const formattedOrderDate = orderDateStr
        ? new Date(orderDateStr).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const weightInGrams = Math.round((payload.weight || 0.5) * 1000);
      const pickupNameClean = this.sanitizeText(
        payload.pickupLocation.pickupName
      );

      const formattedPayload = {
        shipments: [
          {
            name: this.sanitizeText(payload.consigneeName),
            add: this.sanitizeText(
              `${payload.consigneeAddress}, ${payload.consigneeCity}`
            ),
            pin: this.sanitizeText(payload.consigneePincode),
            city: this.sanitizeText(payload.consigneeCity),
            state: this.sanitizeText(payload.consigneeState),
            country: this.sanitizeText(payload.consigneeCountry || "India"),
            phone: this.sanitizeText(payload.consigneePhone),
            order: this.sanitizeText(
              payload.invoiceNumber || payload.orderNumber
            ),
            order_date: formattedOrderDate,
            payment_mode: paymentMode,
            return_name: pickupNameClean,
            pickup_location: pickupNameClean,
            seller_name: pickupNameClean,
            seller_inv: this.sanitizeText(
              payload.invoiceNumber || payload.orderNumber
            ),
            products_desc: this.sanitizeText(
              payload.items.map((i) => i.name).join(", ")
            ),
            total_amount: Math.round(payload.totalAmount),
            quantity: payload.items.reduce((acc, i) => acc + i.units, 0),
            weight: weightInGrams,
            shipment_height: payload.height || 10,
            shipment_width: payload.width || 10,
            shipment_length: payload.length || 10,
            height: payload.height || 10,
            width: payload.width || 10,
            length: payload.length || 10,
            number_of_packages: payload.packageCount || 1,
            shipping_mode: "Surface",
          },
        ],
        pickup_location: {
          name: pickupNameClean,
        },
      };

      // Delhivery CMU creation endpoint requires format=json&data=JSON_STRING as form data
      const bodyParams = new URLSearchParams();
      bodyParams.append("format", "json");
      bodyParams.append("data", JSON.stringify(formattedPayload));

      const startTime = Date.now();
      const endpoint = `${DELHIVERY_CONFIG.baseUrl}/api/cmu/create.json`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: this.getHeaders("application/x-www-form-urlencoded"),
        body: bodyParams.toString(),
      });

      const responseTime = Date.now() - startTime;
      const rawText = await res.text();

      // Safe debug logging (omitting token)
      console.log(
        `[Delhivery API] POST /api/cmu/create.json | Status: ${res.status} | Time: ${responseTime}ms`
      );

      if (!res.ok) {
        console.error(
          `[Delhivery Error] Endpoint: ${endpoint} | Status: ${res.status} | Response: ${rawText}`
        );
        return {
          success: false,
          error: `Delhivery API HTTP ${res.status}: ${rawText}`,
        };
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        return {
          success: false,
          error: `Failed to parse Delhivery API response: ${rawText}`,
        };
      }

      if (data.packages && data.packages.length > 0) {
        const firstPkg = data.packages[0];
        if (
          firstPkg.status === "Fail" ||
          firstPkg.status === "Error" ||
          firstPkg.status === "FAILED"
        ) {
          const errorMsg = Array.isArray(firstPkg.remarks)
            ? firstPkg.remarks.join("; ")
            : firstPkg.remarks ||
            firstPkg.status ||
            "Delhivery shipment creation failed";
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
        "Delhivery API returned empty shipment packages. Verify pickup warehouse name configuration.";

      return {
        success: false,
        error: errorMsg,
      };
    } catch (err: any) {
      console.error("Error creating Delhivery shipment:", err);
      return {
        success: false,
        error: err.message || "Failed to communicate with Delhivery API",
      };
    }
  }

  /**
   * Track shipment status by Waybill number
   */
  static async trackShipment(
    waybill: string
  ): Promise<DelhiveryTrackingResponse> {
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
      const url = `${DELHIVERY_CONFIG.baseUrl
        }/api/v1/packages/json/?waybill=${encodeURIComponent(
          waybill
        )}&token=${encodeURIComponent(token)}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) {
        return {
          success: false,
          error: `Failed to fetch tracking info (${res.status})`,
        };
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
      const url = `${DELHIVERY_CONFIG.baseUrl
        }/api/p/packing_slip?wbns=${encodeURIComponent(waybill)}&pdf=true`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) {
        return {
          success: false,
          error: `Failed to fetch label (${res.status})`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        labelUrl:
          data.packages?.[0]?.pdf_download_link ||
          `https://track.delhivery.com/p/${waybill}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to fetch label from Delhivery",
      };
    }
  }
}
