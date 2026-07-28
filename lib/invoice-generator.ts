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
 * Build clean PDF Document Buffer for Tax Invoice
 */
export function generatePdfBuffer(data: InvoiceData): Buffer {
  const sanitize = (text: string) => text.replace(/[()\\]/g, "\\$&");

  const lines: string[] = [];
  lines.push("%PDF-1.4");
  lines.push("1 0 obj");
  lines.push("<< /Type /Catalog /Pages 2 0 R >>");
  lines.push("endobj");
  lines.push("2 0 obj");
  lines.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  lines.push("endobj");
  lines.push("3 0 obj");
  lines.push("<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 595.28 841.89] /Contents 5 0 R >>");
  lines.push("endobj");
  lines.push("4 0 obj");
  lines.push("<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>");
  lines.push("endobj");

  const contentStream: string[] = [];

  // Background Header Bar
  contentStream.push("0.71 0.48 0.36 rg"); // #B67B5C color
  contentStream.push("0 761.89 595.28 80 re f");

  // Header Title
  contentStream.push("BT /F2 24 Tf 1 1 1 rg 40 800 Td (PREMIKA STORE) Tj ET");
  contentStream.push("BT /F1 12 Tf 1 1 1 rg 40 780 Td (TAX INVOICE) Tj ET");

  contentStream.push("0 0 0 rg"); // Reset text color to black

  // Store Details (Right Aligned Header area)
  contentStream.push("BT /F1 10 Tf 380 820 Td (Invoice #: INV-" + sanitize(data.orderNumber) + ") Tj ET");
  contentStream.push("BT /F1 10 Tf 380 805 Td (Date: " + sanitize(data.orderDate) + ") Tj ET");
  contentStream.push("BT /F1 10 Tf 380 790 Td (Status: " + sanitize(data.paymentStatus.toUpperCase()) + ") Tj ET");

  // Customer & Shipping Info
  let y = 730;
  contentStream.push("BT /F2 12 Tf 40 " + y + " Td (Billed / Shipped To:) Tj ET");
  y -= 18;
  contentStream.push("BT /F2 11 Tf 40 " + y + " Td (" + sanitize(data.customerName) + ") Tj ET");
  y -= 14;
  contentStream.push("BT /F1 10 Tf 40 " + y + " Td (" + sanitize(data.customerEmail) + " | " + sanitize(data.customerPhone) + ") Tj ET");
  y -= 14;
  contentStream.push("BT /F1 10 Tf 40 " + y + " Td (" + sanitize(data.shippingAddress.line1) + ") Tj ET");
  if (data.shippingAddress.line2) {
    y -= 14;
    contentStream.push("BT /F1 10 Tf 40 " + y + " Td (" + sanitize(data.shippingAddress.line2) + ") Tj ET");
  }
  y -= 14;
  contentStream.push("BT /F1 10 Tf 40 " + y + " Td (" + sanitize(data.shippingAddress.city + ", " + data.shippingAddress.state + " " + data.shippingAddress.postalCode) + ") Tj ET");

  // Table Header
  y -= 35;
  contentStream.push("0.94 0.94 0.94 rg");
  contentStream.push("40 " + (y - 5) + " 515.28 22 re f");
  contentStream.push("0 0 0 rg");
  contentStream.push("BT /F2 10 Tf 45 " + y + " Td (Item Description) Tj ET");
  contentStream.push("BT /F2 10 Tf 340 " + y + " Td (Qty) Tj ET");
  contentStream.push("BT /F2 10 Tf 410 " + y + " Td (Unit Price) Tj ET");
  contentStream.push("BT /F2 10 Tf 490 " + y + " Td (Amount) Tj ET");

  y -= 20;

  // Item Rows
  data.items.forEach((item) => {
    let desc = item.name;
    if (item.size || item.height) {
      desc += " (" + [item.size ? "Size: " + item.size : "", item.height ? "Height: " + item.height : ""].filter(Boolean).join(", ") + ")";
    }

    contentStream.push("BT /F1 9 Tf 45 " + y + " Td (" + sanitize(desc) + ") Tj ET");
    contentStream.push("BT /F1 9 Tf 350 " + y + " Td (" + item.quantity + ") Tj ET");
    contentStream.push("BT /F1 9 Tf 410 " + y + " Td (Rs. " + item.unitPrice + ") Tj ET");
    contentStream.push("BT /F1 9 Tf 490 " + y + " Td (Rs. " + item.totalPrice + ") Tj ET");
    y -= 18;
  });

  // Divider line
  contentStream.push("0.8 0.8 0.8 RG 1 w");
  contentStream.push("40 " + y + " m 555.28 " + y + " l S");

  y -= 25;

  // Summary Totals
  contentStream.push("BT /F1 10 Tf 380 " + y + " Td (Subtotal:) Tj ET");
  contentStream.push("BT /F1 10 Tf 490 " + y + " Td (Rs. " + data.subtotal + ") Tj ET");
  y -= 16;

  if (data.discount > 0) {
    contentStream.push("BT /F1 10 Tf 380 " + y + " Td (Discount:) Tj ET");
    contentStream.push("BT /F1 10 Tf 490 " + y + " Td (- Rs. " + data.discount + ") Tj ET");
    y -= 16;
  }

  contentStream.push("BT /F1 10 Tf 380 " + y + " Td (Shipping:) Tj ET");
  contentStream.push("BT /F1 10 Tf 490 " + y + " Td (FREE) Tj ET");
  y -= 20;

  contentStream.push("0.71 0.48 0.36 RG 2 w");
  contentStream.push("380 " + (y + 10) + " m 555.28 " + (y + 10) + " l S");

  contentStream.push("BT /F2 12 Tf 380 " + y + " Td (Grand Total:) Tj ET");
  contentStream.push("BT /F2 12 Tf 490 " + y + " Td (Rs. " + data.total + ") Tj ET");

  // Footer
  contentStream.push("BT /F1 9 Tf 0.5 0.5 0.5 rg 180 50 Td (Thank you for shopping with Premika Store!) Tj ET");
  contentStream.push("BT /F1 8 Tf 0.5 0.5 0.5 rg 200 35 Td (For support contact: premika.shop@gmail.com) Tj ET");

  const streamText = contentStream.join("\n");
  const streamLength = Buffer.byteLength(streamText);

  lines.push("5 0 obj");
  lines.push("<< /Length " + streamLength + " >>");
  lines.push("stream");
  lines.push(streamText);
  lines.push("endstream");
  lines.push("endobj");

  // Cross reference table
  const pdfString = lines.join("\n") + "\n";
  return Buffer.from(pdfString, "binary");
}
