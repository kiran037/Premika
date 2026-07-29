const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function buildPdf(data) {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const formatCurrency = (amount) => {
    const val = Number(amount) || 0;
    return `Rs. ${val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const sanitizeStr = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/[^\x20-\x7E]/g, "")
      .trim();
  };

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 515.28

  let page = doc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight;

  // 1. Header Banner
  page.drawRectangle({
    x: 0,
    y: pageHeight - 90,
    width: pageWidth,
    height: 90,
    color: rgb(0.11, 0.11, 0.13), // #1C1C21
  });

  page.drawText("PREMIKA STORE", {
    x: margin,
    y: pageHeight - 45,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Official Tax Invoice & Order Receipt", {
    x: margin,
    y: pageHeight - 65,
    size: 9,
    font: fontOblique,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText("TAX INVOICE", {
    x: pageWidth - margin - 130,
    y: pageHeight - 45,
    size: 18,
    font: fontBold,
    color: rgb(0.71, 0.48, 0.36), // #B67B5C
  });

  currentY = pageHeight - 115;

  // 2. Info Columns (Invoice Details & Customer/Shipping Details)
  const leftColX = margin;
  const rightColX = margin + 260;

  // Left Box: Invoice Meta
  page.drawText("INVOICE DETAILS", {
    x: leftColX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.71, 0.48, 0.36),
  });

  const invoiceMeta = [
    { label: "Invoice No:", val: sanitizeStr(data.orderNumber) },
    { label: "Order Date:", val: sanitizeStr(data.orderDate) },
    { label: "Payment Status:", val: sanitizeStr(data.paymentStatus) },
    { label: "Order Status:", val: sanitizeStr(data.orderStatus) },
  ];

  let metaY = currentY - 18;
  invoiceMeta.forEach((meta) => {
    page.drawText(meta.label, {
      x: leftColX,
      y: metaY,
      size: 9,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(meta.val, {
      x: leftColX + 90,
      y: metaY,
      size: 9,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    metaY -= 15;
  });

  // Right Box: Customer & Shipping Details
  page.drawText("BILLED TO & SHIP TO", {
    x: rightColX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.71, 0.48, 0.36),
  });

  let shipY = currentY - 18;
  const shipAddr = data.shippingAddress || {};
  const addrLines = [
    sanitizeStr(data.customerName),
    sanitizeStr(shipAddr.line1),
    shipAddr.line2 ? sanitizeStr(shipAddr.line2) : null,
    `${sanitizeStr(shipAddr.city)}, ${sanitizeStr(
      shipAddr.state
    )} - ${sanitizeStr(shipAddr.postalCode)}`,
    sanitizeStr(shipAddr.country || "India"),
    data.customerPhone ? `Phone: ${sanitizeStr(data.customerPhone)}` : null,
    data.customerEmail ? `Email: ${sanitizeStr(data.customerEmail)}` : null,
  ].filter(Boolean);

  addrLines.forEach((line, index) => {
    page.drawText(line, {
      x: rightColX,
      y: shipY,
      size: 9,
      font: index === 0 ? fontBold : fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    shipY -= 14;
  });

  currentY = Math.min(metaY, shipY) - 20;

  // Horizontal Separator
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: pageWidth - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  currentY -= 20;

  // 3. Products Table Header
  const colX = {
    num: margin + 8,
    desc: margin + 30,
    qty: margin + 290,
    price: margin + 345,
    total: margin + 435,
  };

  const drawTableHeader = (y) => {
    page.drawRectangle({
      x: margin,
      y: y - 18,
      width: contentWidth,
      height: 24,
      color: rgb(0.96, 0.96, 0.97),
    });

    page.drawText("#", {
      x: colX.num,
      y: y - 10,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText("Item Description", {
      x: colX.desc,
      y: y - 10,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText("Qty", {
      x: colX.qty,
      y: y - 10,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText("Unit Price", {
      x: colX.price,
      y: y - 10,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText("Amount", {
      x: colX.total,
      y: y - 10,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
  };

  drawTableHeader(currentY);
  currentY -= 28;

  // 4. Products Items
  const items = data.items || [];
  items.forEach((item, idx) => {
    if (currentY < 150) {
      page = doc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - 50;
      drawTableHeader(currentY);
      currentY -= 28;
    }

    const itemName = sanitizeStr(item.name);
    const itemQty = String(item.quantity || 1);
    const unitPriceStr = formatCurrency(item.unitPrice || 0);
    const totalPriceStr = formatCurrency(
      item.totalPrice || (item.unitPrice || 0) * (item.quantity || 1)
    );

    page.drawText(String(idx + 1), {
      x: colX.num,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    const truncatedName =
      itemName.length > 42 ? itemName.substring(0, 40) + "..." : itemName;
    page.drawText(truncatedName, {
      x: colX.desc,
      y: currentY,
      size: 9,
      font: fontBold,
      color: rgb(0.15, 0.15, 0.15),
    });

    page.drawText(itemQty, {
      x: colX.qty,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    page.drawText(unitPriceStr, {
      x: colX.price,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    page.drawText(totalPriceStr, {
      x: colX.total,
      y: currentY,
      size: 9,
      font: fontBold,
      color: rgb(0.15, 0.15, 0.15),
    });

    currentY -= 14;

    const extraDetails = [];
    if (item.size) extraDetails.push(`Size: ${sanitizeStr(item.size)}`);
    if (item.height) extraDetails.push(`Height: ${sanitizeStr(item.height)}`);
    if (extraDetails.length > 0) {
      page.drawText(extraDetails.join(" | "), {
        x: colX.desc,
        y: currentY,
        size: 8,
        font: fontOblique,
        color: rgb(0.5, 0.5, 0.5),
      });
      currentY -= 12;
    }

    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: pageWidth - margin, y: currentY },
      thickness: 0.5,
      color: rgb(0.92, 0.92, 0.92),
    });
    currentY -= 10;
  });

  currentY -= 10;

  // 5. Totals Block (Right Aligned)
  if (currentY < 180) {
    page = doc.addPage([pageWidth, pageHeight]);
    currentY = pageHeight - 50;
  }

  const totalsX = margin + 270;
  const totalsValX = margin + 415;

  const totals = [
    { label: "Subtotal:", val: formatCurrency(data.subtotal) },
    ...(data.discount > 0
      ? [{ label: "Discount:", val: `- ${formatCurrency(data.discount)}` }]
      : []),
    {
      label: "Shipping Charge:",
      val:
        data.shippingCharge === 0
          ? "FREE"
          : formatCurrency(data.shippingCharge),
    },
    ...(data.tax > 0
      ? [{ label: "Tax / GST:", val: formatCurrency(data.tax) }]
      : []),
  ];

  totals.forEach((row) => {
    page.drawText(row.label, {
      x: totalsX,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText(row.val, {
      x: totalsValX,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
    currentY -= 16;
  });

  currentY -= 6;

  // Grand Total Box
  page.drawRectangle({
    x: totalsX - 10,
    y: currentY - 8,
    width: contentWidth - (totalsX - margin) + 10,
    height: 26,
    color: rgb(0.96, 0.94, 0.92),
    borderColor: rgb(0.71, 0.48, 0.36),
    borderWidth: 1,
  });

  page.drawText("Grand Total:", {
    x: totalsX,
    y: currentY,
    size: 11,
    font: fontBold,
    color: rgb(0.71, 0.48, 0.36),
  });
  page.drawText(formatCurrency(data.total), {
    x: totalsValX,
    y: currentY,
    size: 11,
    font: fontBold,
    color: rgb(0.11, 0.11, 0.13),
  });

  // 6. Footer at bottom of page
  const footerY = 45;
  page.drawLine({
    start: { x: margin, y: footerY + 25 },
    end: { x: pageWidth - margin, y: footerY + 25 },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.88),
  });

  page.drawText("Thank you for shopping with Premika Store!", {
    x: margin,
    y: footerY + 10,
    size: 9,
    font: fontBold,
    color: rgb(0.71, 0.48, 0.36),
  });

  page.drawText(
    "For order support, contact support@premika.shop | www.premika.shop",
    {
      x: margin,
      y: footerY - 2,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  page.drawText(
    "This is a computer-generated tax invoice. No signature required.",
    {
      x: pageWidth - margin - 230,
      y: footerY - 2,
      size: 8,
      font: fontOblique,
      color: rgb(0.6, 0.6, 0.6),
    }
  );

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

// Read input JSON from stdin and output PDF buffer to stdout
let inputData = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", async () => {
  try {
    const data = JSON.parse(inputData);
    const pdfBuffer = await buildPdf(data);
    process.stdout.write(pdfBuffer);
  } catch (err) {
    console.error("PDF generation script error:", err);
    process.exit(1);
  }
});
