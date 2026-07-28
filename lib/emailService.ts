import nodemailer from "nodemailer";
import { OrderData, ComboSelections } from "@/types";

// Create reusable transporter object using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

// Helper function to format combo selections for email
const formatComboSelectionsForEmail = (comboSelections?: ComboSelections): string => {
  if (!comboSelections) return "";
  return Object.entries(comboSelections)
    .map(([itemId, selection]) => {
      const itemLabel = (itemId === "sajni" || itemId === "heer") ? "Women's Kurti" : (itemId === "sajan" || itemId === "ranjha") ? "Men's Shirt" : itemId;
      let details = `${itemLabel}: Size ${selection.size}`;
      if (selection.height) {
        const heightLabel = selection.height === "up-to-5-3" ? "Up to 5'3\"" : 
                           selection.height === "5-4-to-5-6" ? "5'4\" - 5'6\"" : 
                           selection.height === "5-6-and-above" ? "5'6\" and above" : selection.height;
        details += ` (Height: ${heightLabel})`;
      }
      return details;
    })
    .join("<br>");
};

// Generate HTML email template
const generateOrderEmailHTML = (orderData: OrderData): string => {
  const { orderId, customerInfo, cartItems, orderSummary } = orderData;

  const itemsHTML =
    cartItems
      ?.map(
        (item) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px; text-align: left;">
        <div style="font-weight: 600; color: #333;">${item.name}</div>
        ${item.isCombo && item.comboSelections ? `
          <div style="font-size: 13px; color: #666; margin-top: 6px; padding: 8px; background-color: #f5f5f5; border-radius: 4px;">
            ${formatComboSelectionsForEmail(item.comboSelections)}
          </div>
        ` : `
          <div style="font-size: 14px; color: #666;">Size: ${item.selectedSize || "N/A"}${item.selectedHeight ? ` | Height: ${item.selectedHeight}` : ""}</div>
        `}
      </td>
      <td style="padding: 12px; text-align: center; color: #666;">${
        item.quantity || 1
      }</td>
      <td style="padding: 12px; text-align: right; font-weight: 600; color: #B67B5C;">₹${
        item.price
      }</td>
      <td style="padding: 12px; text-align: right; font-weight: 600; color: #333;">₹${(
        item.price * (item.quantity || 1)
      ).toFixed(2)}</td>
    </tr>
  `
      )
      .join("") || "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Premika Store</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Carattere:wght@400&family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #B67B5C 0%, #8B5A3C 100%); color: white; padding: 30px 20px; text-align: center; }
        .brand-name { font-family: 'Carattere', cursive; font-size: 36px; margin: 0; font-weight: 400; }
        .tagline { font-family: 'Carattere', cursive; font-size: 18px; margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .order-header { background-color: #f8f9fa; border-left: 4px solid #B67B5C; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .order-table th { background-color: #B67B5C; color: white; padding: 15px 12px; text-align: left; font-weight: 600; }
        .summary-section { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-total { font-weight: 600; font-size: 18px; color: #B67B5C; border-top: 2px solid #B67B5C; padding-top: 15px; margin-top: 15px; }
        .info-section { background-color: #E0BCA2; background-opacity: 0.1; border-radius: 8px; padding: 20px; margin-top: 30px; }
        .footer { background-color: #333; color: white; padding: 30px 20px; text-align: center; }
        .btn-primary { background-color: #B67B5C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; margin-top: 20px; }
        .highlight { color: #B67B5C; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 class="brand-name">Premika</h1>
          <p class="tagline">"Prem se bana, Premika ke liye"</p>
          <h2 style="margin: 20px 0 10px 0; font-size: 24px;">Order Confirmation</h2>
          <p style="margin: 0; opacity: 0.9;">Thank you for your purchase!</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          <!-- Order Details Header -->
          <div class="order-header">
            <h3 style="margin: 0 0 10px 0; color: #333;">Hi ${
              customerInfo?.name || "Valued Customer"
            },</h3>
            <p style="margin: 0; color: #666; line-height: 1.5;">
              Your order has been confirmed and payment has been successfully processed. 
              We're excited to get your beautiful pieces ready for delivery!
            </p>
          </div>

          <!-- Order Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Information</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> <span class="highlight">${orderId}</span></p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}</p>
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> 8-9 business days</p>
            </div>
          </div>

          <!-- Order Items -->
          <h3 style="color: #333; margin-bottom: 15px;">Your Order</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div class="summary-section">
            <h3 style="margin: 0 0 20px 0; color: #333;">Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal (${
                cartItems?.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                ) || 0
              } items):</span>
              <span>₹${orderSummary?.subtotal?.toFixed(2) || "0.00"}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>${
                orderSummary?.shipping === 0
                  ? "FREE"
                  : `₹${orderSummary?.shipping?.toFixed(2) || "0.00"}`
              }</span>
            </div>
            <div class="summary-row summary-total">
              <span>Total Amount Paid:</span>
              <span>₹${orderSummary?.total?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="info-section">
            <h3 style="margin: 0 0 15px 0; color: #333;">Delivery Information</h3>
            <p style="margin: 5px 0; color: #666;">
              <strong>Delivery Address:</strong><br>
              ${customerInfo?.address?.line1 || ""}<br>
              ${
                customerInfo?.address?.line2
                  ? customerInfo.address.line2 + "<br>"
                  : ""
              }
              ${customerInfo?.address?.city || ""}, ${
    customerInfo?.address?.state || ""
  } ${customerInfo?.address?.postal_code || ""}<br>
              ${customerInfo?.address?.country || ""}
            </p>
            <p style="margin: 15px 0 5px 0; color: #666;">
              <strong>Contact:</strong> ${customerInfo?.phone || ""}<br>
              <strong>Email:</strong> ${customerInfo?.email || ""}
            </p>
          </div>

          <!-- Important Information -->
          <div style="margin-top: 30px; padding: 20px; background-color: #fff8e7; border-left: 4px solid #ffa500; border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Important Information</h4>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.6;">
              <li>Your order will be delivered within 8-9 business days</li>
              <li>You will receive a tracking number once your order is shipped</li>
              <li>For any queries, contact us at <a href="mailto:premika.shop@gmail.com" style="color: #B67B5C;">premika.shop@gmail.com</a></li>
              <li>Returns accepted only for store errors with unboxing video</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://premika.shop" class="btn-primary">Continue Shopping</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <h3 class="brand-name" style="font-size: 28px; margin-bottom: 10px;">Premika</h3>
          <p class="tagline" style="margin-bottom: 20px;">"Prem se bana, Premika ke liye"</p>
          <p style="margin: 10px 0; opacity: 0.8;">Thank you for choosing Premika!</p>
          <p style="margin: 10px 0; font-size: 14px; opacity: 0.7;">
            📧 premika.shop@gmail.com | 📞 (+91) 9599215195
          </p>
          <p style="margin: 20px 0 0 0; font-size: 12px; opacity: 0.6;">
            © 2025 Premika. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData: OrderData) => {
  try {
    const transporter = createTransporter();
    const { customerInfo, orderId } = orderData;

    const mailOptions = {
      from: {
        name: "Premika Store",
        address: process.env.GMAIL_USER || "premika.shop@gmail.com",
      },
      to: customerInfo.email,
      subject: `Order Confirmation - Premika Store #${orderId}`,
      html: generateOrderEmailHTML(orderData),
      text: `
        Hi ${customerInfo.name},
        
        Thank you for your order! Your order #${orderId} has been confirmed.
        
        We'll process your order and deliver it within 8-9 business days.
        
        For any questions, contact us at premika.shop@gmail.com or (+91) 9599215195.
        
        Thank you for choosing Premika!
        "Prem se bana, Premika ke liye"
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      "Order confirmation email sent successfully:",
      result.messageId
    );
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Test email function (optional - for testing)
export const sendTestEmail = async (testEmail: string) => {
  try {
    const transporter = createTransporter();

    // Create mock order data for testing the email template
    const mockOrderData: OrderData = {
      orderId: "TEST_ORDER_" + Date.now(),
      customerInfo: {
        name: "Test Customer",
        email: testEmail,
        phone: "+91 9999999999",
        address: {
          line1: "123 Test Street",
          line2: "Test Area",
          city: "Test City",
          state: "Test State",
          postal_code: "123456",
          country: "India",
        },
      },
      cartItems: [
        {
          id: "monika",
          name: "Monika",
          price: 599,
          quantity: 1,
          selectedSize: "M",
          images: [],
          category: "clothing",
        },
        {
          id: "mastani",
          name: "Mastani",
          price: 599,
          quantity: 2,
          selectedSize: "L",
          images: [],
          category: "clothing",
        },
      ],
      orderSummary: {
        subtotal: 1797,
        shipping: 0,
        total: 1797,
      },
    };

    const mailOptions = {
      from: {
        name: "Premika Store",
        address: process.env.GMAIL_USER || "premika.shop@gmail.com",
      },
      to: testEmail,
      subject: "Test Email - Premika Store Email Service (Sample Order Format)",
      html: generateOrderEmailHTML(mockOrderData),
      text: `
        Hi Test Customer,
        
        This is a test email from Premika Store showing the order confirmation format.
        
        Test Order ID: ${mockOrderData.orderId}
        
        If you're receiving this email, the Premika Store email service is working correctly!
        
        Time: ${new Date().toLocaleString()}
        
        Thank you for choosing Premika!
        "Prem se bana, Premika ke liye"
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Test email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return { success: false, error: error.message };
  }
};
