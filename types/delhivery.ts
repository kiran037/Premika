export interface DelhiveryPickupLocation {
  pickupName: string;
  pickupPhone: string;
  pickupEmail: string;
  pickupAddressLine1: string;
  pickupAddressLine2?: string | null;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  pickupCountry: string;
}

export interface DelhiveryPackageItem {
  name: string;
  sku?: string | null;
  units: number;
  price: number;
}

export interface DelhiveryCreateShipmentPayload {
  orderNumber: string;
  orderDate: string;
  paymentMode: "Pre-Paid" | "COD";
  totalAmount: number;
  consigneeName: string;
  consigneePhone: string;
  consigneeEmail: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneeCountry: string;
  pickupLocation: DelhiveryPickupLocation;
  items: DelhiveryPackageItem[];
}

export interface DelhiveryCreateShipmentResponse {
  success: boolean;
  uploadWbn?: string;
  packages?: Array<{
    waybill: string;
    refnum: string;
    status: string;
    sortCode?: string;
    remarks?: string[];
  }>;
  error?: string;
}

export interface DelhiveryTrackingStatus {
  waybill: string;
  status: string;
  statusCode?: string;
  statusDateTime?: string;
  location?: string;
  instructions?: string;
  scans?: Array<{
    scanDateTime: string;
    scanType: string;
    location: string;
    instructions: string;
  }>;
}

export interface DelhiveryTrackingResponse {
  success: boolean;
  trackingData?: DelhiveryTrackingStatus;
  error?: string;
}

export interface DelhiveryLabelResponse {
  success: boolean;
  labelUrl?: string;
  pdfData?: string;
  error?: string;
}

export interface DelhiveryWebhookPayload {
  waybill: string;
  refnum: string;
  status: string;
  statusCode?: string;
  statusDateTime?: string;
  location?: string;
  instructions?: string;
  eventTime?: string;
  secretToken?: string;
}
