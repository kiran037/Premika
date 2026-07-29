import { execFileSync } from "child_process";
import path from "path";

export interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  paymentStatus: string;
  orderStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    size?: string;
    height?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
}

/**
 * Build clean PDF Document Buffer for Tax Invoice using pdf-lib
 */
export function generatePdfBuffer(data: InvoiceData): Buffer {
  try {
    const scriptPath = path.join(process.cwd(), "lib/pdf/generate-pdf.js");

    const pdfBuffer = execFileSync(process.execPath, [scriptPath], {
      input: JSON.stringify(data),
      maxBuffer: 10 * 1024 * 1024,
    });

    return pdfBuffer;
  } catch (err: any) {
    console.error("Error executing pdf-lib generator:", err);
    throw new Error(`Failed to generate PDF invoice: ${err.message || err}`);
  }
}
