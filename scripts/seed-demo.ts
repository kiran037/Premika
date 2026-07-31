import "dotenv/config";

import { db, client } from "../db/client";
import { customers, customerAddresses } from "../db/schema/customer";
import {
  orders,
  orderItems,
  payments,
  shipments,
  shipmentTracking,
} from "../db/schema/order";
import { products, productSizes, productHeights } from "../db/schema/product";
import { eq, inArray } from "drizzle-orm";

// Sample Indian Customer Names
const DEMO_CUSTOMERS_DATA = [
  { firstName: "Priya", lastName: "Sharma", email: "priya.sharma@demo.premika.shop", phone: "9876543201" },
  { firstName: "Ananya", lastName: "Verma", email: "ananya.verma@demo.premika.shop", phone: "9876543202" },
  { firstName: "Kavya", lastName: "Patel", email: "kavya.patel@demo.premika.shop", phone: "9876543203" },
  { firstName: "Riya", lastName: "Mehta", email: "riya.mehta@demo.premika.shop", phone: "9876543204" },
  { firstName: "Neha", lastName: "Gupta", email: "neha.gupta@demo.premika.shop", phone: "9876543205" },
  { firstName: "Pooja", lastName: "Joshi", email: "pooja.joshi@demo.premika.shop", phone: "9876543206" },
  { firstName: "Sneha", lastName: "Singh", email: "sneha.singh@demo.premika.shop", phone: "9876543207" },
  { firstName: "Shreya", lastName: "Choudhary", email: "shreya.c@demo.premika.shop", phone: "9876543208" },
  { firstName: "Divya", lastName: "Rathore", email: "divya.r@demo.premika.shop", phone: "9876543209" },
  { firstName: "Meera", lastName: "Agarwal", email: "meera.a@demo.premika.shop", phone: "9876543210" },
  { firstName: "Aditi", lastName: "Shah", email: "aditi.shah@demo.premika.shop", phone: "9876543211" },
  { firstName: "Sunita", lastName: "Kulkarni", email: "sunita.k@demo.premika.shop", phone: "9876543212" },
  { firstName: "Roshni", lastName: "Nair", email: "roshni.nair@demo.premika.shop", phone: "9876543213" },
  { firstName: "Swati", lastName: "Rao", email: "swati.rao@demo.premika.shop", phone: "9876543214" },
  { firstName: "Tanvi", lastName: "Saxena", email: "tanvi.saxena@demo.premika.shop", phone: "9876543215" },
  { firstName: "Aaradhya", lastName: "Reddy", email: "aaradhya.r@demo.premika.shop", phone: "9876543216" },
  { firstName: "Ishita", lastName: "Bhatia", email: "ishita.bhatia@demo.premika.shop", phone: "9876543217" },
  { firstName: "Radhika", lastName: "Malhotra", email: "radhika.m@demo.premika.shop", phone: "9876543218" },
  { firstName: "Vasundhara", lastName: "Kapoor", email: "vasundhara.k@demo.premika.shop", phone: "9876543219" },
  { firstName: "Deepika", lastName: "Trivedi", email: "deepika.t@demo.premika.shop", phone: "9876543220" },
  { firstName: "Kajal", lastName: "Mukherji", email: "kajal.m@demo.premika.shop", phone: "9876543221" },
  { firstName: "Nisha", lastName: "Deshmukh", email: "nisha.d@demo.premika.shop", phone: "9876543222" },
  { firstName: "Trisha", lastName: "Sonawane", email: "trisha.s@demo.premika.shop", phone: "9876543223" },
  { firstName: "Yashika", lastName: "Solanki", email: "yashika.s@demo.premika.shop", phone: "9876543224" },
  { firstName: "Archana", lastName: "Sen", email: "archana.sen@demo.premika.shop", phone: "9876543225" },
];

const INDIAN_CITIES = [
  { city: "Jaipur", state: "Rajasthan", postalCode: "302001" },
  { city: "Udaipur", state: "Rajasthan", postalCode: "313001" },
  { city: "Ahmedabad", state: "Gujarat", postalCode: "380001" },
  { city: "Surat", state: "Gujarat", postalCode: "395001" },
  { city: "Delhi", state: "Delhi", postalCode: "110001" },
  { city: "Mumbai", state: "Maharashtra", postalCode: "400001" },
  { city: "Pune", state: "Maharashtra", postalCode: "411001" },
  { city: "Indore", state: "Madhya Pradesh", postalCode: "452001" },
  { city: "Jodhpur", state: "Rajasthan", postalCode: "342001" },
  { city: "Vadodara", state: "Gujarat", postalCode: "390001" },
];

const COURIER_NAMES = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "Xpressbees",
  "Ekart",
  "India Post",
];

const PAYMENT_METHODS: Array<"cod" | "razorpay" | "upi" | "card" | "net_banking" | "wallet"> = [
  "cod",
  "razorpay",
  "upi",
  "card",
  "net_banking",
  "wallet",
];

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// Target status distribution for 100 orders
const ORDER_STATUS_DISTRIBUTION: OrderStatus[] = [
  ...Array(55).fill("delivered"),
  ...Array(10).fill("shipped"),
  ...Array(5).fill("out_for_delivery"),
  ...Array(8).fill("packed"),
  ...Array(8).fill("processing"),
  ...Array(6).fill("confirmed"),
  ...Array(5).fill("pending"),
  ...Array(3).fill("cancelled"),
];

async function seedDemoData() {
  console.log("🌱 Starting Premika Demo Data Seeding...");

  try {
    // 1. Fetch DB Products
    const dbProducts = await db.select().from(products);
    if (dbProducts.length === 0) {
      console.warn("⚠️ No products found in the database. Please ensure products are created before running demo seed.");
      return;
    }
    console.log(`📦 Found ${dbProducts.length} existing products in database.`);

    const productIds = dbProducts.map((p) => p.id);
    const dbSizes = await db.select().from(productSizes).where(inArray(productSizes.productId, productIds));
    const dbHeights = await db.select().from(productHeights).where(inArray(productHeights.productId, productIds));

    // Map sizes & heights by productId
    const sizesByProduct = new Map<string, typeof dbSizes>();
    dbSizes.forEach((s) => {
      const arr = sizesByProduct.get(s.productId) || [];
      arr.push(s);
      sizesByProduct.set(s.productId, arr);
    });

    const heightsByProduct = new Map<string, typeof dbHeights>();
    dbHeights.forEach((h) => {
      const arr = heightsByProduct.get(h.productId) || [];
      arr.push(h);
      heightsByProduct.set(h.productId, arr);
    });

    // 2. Check for existing demo customers (Safety check)
    const existingDemoCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.email, DEMO_CUSTOMERS_DATA[0].email));

    let seededCustomers: typeof customers.$inferSelect[] = [];

    if (existingDemoCustomers.length > 0) {
      console.log("ℹ️ Demo customers already exist in database. Reusing existing demo customer records...");
      seededCustomers = await db
        .select()
        .from(customers)
        .where(inArray(customers.email, DEMO_CUSTOMERS_DATA.map((c) => c.email)));
    } else {
      console.log("👤 Creating 25 demo customer profiles and address records...");
      const nowMs = Date.now();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;

      // Create Customers
      const newCustomersData = DEMO_CUSTOMERS_DATA.map((c, i) => {
        const createdMs = nowMs - Math.floor(Math.random() * oneYearMs);
        const lastLoginMs = createdMs + Math.floor(Math.random() * (nowMs - createdMs));
        return {
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: new Date(createdMs),
          lastLoginAt: new Date(lastLoginMs),
        };
      });

      seededCustomers = await db.insert(customers).values(newCustomersData).returning();

      // Create Customer Addresses
      const newAddressesData = seededCustomers.map((cust, i) => {
        const loc = INDIAN_CITIES[i % INDIAN_CITIES.length];
        return {
          customerId: cust.id,
          type: "home" as const,
          fullName: `${cust.firstName} ${cust.lastName || ""}`.trim(),
          phone: cust.phone || "9876543210",
          addressLine1: `${101 + i * 4}, Sector ${((i % 12) + 1)}, Near City Mall`,
          addressLine2: `Main Road`,
          city: loc.city,
          state: loc.state,
          country: "India",
          postalCode: loc.postalCode,
          isDefault: true,
          createdAt: cust.createdAt,
        };
      });

      await db.insert(customerAddresses).values(newAddressesData);
      console.log("✅ 25 demo customers & 25 addresses created successfully.");
    }

    // 3. Generate 100 Orders spread across last 365 days
    console.log("🛒 Generating 100 realistic orders spread over the last 12 months...");
    const nowMs = Date.now();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;

    // Shuffle status distribution
    const shuffledStatuses = [...ORDER_STATUS_DISTRIBUTION].sort(() => Math.random() - 0.5);

    let totalOrderItemsCount = 0;
    let grandTotalRevenue = 0;

    await db.transaction(async (tx) => {
      for (let i = 0; i < shuffledStatuses.length; i++) {
        const status = shuffledStatuses[i];
        const customer = seededCustomers[i % seededCustomers.length];
        const cityLoc = INDIAN_CITIES[i % INDIAN_CITIES.length];

        // Random order creation date within 365 days
        const daysAgo = Math.floor((i / shuffledStatuses.length) * 365);
        const orderDateMs = nowMs - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 3600000);
        const orderCreatedAt = new Date(orderDateMs);

        // Select 1-4 random products for this order
        const numItems = Math.floor(Math.random() * 4) + 1;
        const selectedProducts: typeof dbProducts = [];
        for (let k = 0; k < numItems; k++) {
          const randProd = dbProducts[Math.floor(Math.random() * dbProducts.length)];
          selectedProducts.push(randProd);
        }

        // Calculate line items
        let subtotal = 0;
        const itemsToInsert: Array<{
          productId: string;
          productSizeId?: string;
          productHeightId?: string;
          productName: string;
          productSku?: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          createdAt: Date;
        }> = [];

        for (const prod of selectedProducts) {
          const qty = Math.floor(Math.random() * 3) + 1;
          const unitPrice = prod.price;
          const totalPrice = unitPrice * qty;
          subtotal += totalPrice;

          const pSizes = sizesByProduct.get(prod.id) || [];
          const pHeights = heightsByProduct.get(prod.id) || [];

          const matchedSizeId = pSizes.length > 0 ? pSizes[Math.floor(Math.random() * pSizes.length)].id : undefined;
          const matchedHeightId = pHeights.length > 0 ? pHeights[Math.floor(Math.random() * pHeights.length)].id : undefined;

          itemsToInsert.push({
            productId: prod.id,
            productSizeId: matchedSizeId,
            productHeightId: matchedHeightId,
            productName: prod.name,
            productSku: prod.sku || undefined,
            quantity: qty,
            unitPrice,
            totalPrice,
            createdAt: orderCreatedAt,
          });
        }

        // Random 0-10% discount
        const discount = Math.random() > 0.6 ? Math.round(subtotal * 0.1) : 0;
        const shippingCharge = 0;
        const tax = 0;
        const total = subtotal - discount;

        if (["confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"].includes(status)) {
          grandTotalRevenue += total;
        }

        const orderNumber = `ORD-DEMO-${1000 + i}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Insert Order
        const [insertedOrder] = await tx
          .insert(orders)
          .values({
            customerId: customer.id,
            orderNumber,
            status,
            subtotal,
            discount,
            shippingCharge,
            tax,
            total,
            createdAt: orderCreatedAt,
            updatedAt: orderCreatedAt,
          })
          .returning();

        // Insert Order Items
        const formattedItems = itemsToInsert.map((item) => ({
          orderId: insertedOrder.id,
          productId: item.productId,
          productSizeId: item.productSizeId || null,
          productHeightId: item.productHeightId || null,
          productName: item.productName,
          productSku: item.productSku || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          createdAt: orderCreatedAt,
        }));

        await tx.insert(orderItems).values(formattedItems);
        totalOrderItemsCount += formattedItems.length;

        // Payment setup
        const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
        let paymentStatus: "pending" | "paid" | "failed" | "refunded" = "pending";

        if (["confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"].includes(status)) {
          paymentStatus = "paid";
        } else if (status === "cancelled") {
          paymentStatus = "failed";
        }

        const paidAt = paymentStatus === "paid" ? new Date(orderCreatedAt.getTime() + 300000) : null;

        await tx.insert(payments).values({
          orderId: insertedOrder.id,
          paymentMethod,
          status: paymentStatus,
          amount: total * 100, // in paise
          gateway: paymentMethod === "razorpay" || paymentMethod === "upi" ? "razorpay" : "manual",
          gatewayOrderId: `pay_ord_demo_${i}`,
          gatewayPaymentId: paymentStatus === "paid" ? `pay_demo_${1000 + i}` : null,
          paidAt,
          createdAt: orderCreatedAt,
        });

        // Shipment setup
        const courierName = COURIER_NAMES[i % COURIER_NAMES.length];
        const trackingNumber = `WAYBILL-${700000000 + i}`;
        const trackingUrl = `https://track.premika.shop/${trackingNumber}`;

        let shipmentStatus: "pending" | "booked" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed" = "pending";
        let shippedAt: Date | null = null;
        let deliveredAt: Date | null = null;

        if (status === "delivered") {
          shipmentStatus = "delivered";
          shippedAt = new Date(orderCreatedAt.getTime() + 24 * 3600000);
          deliveredAt = new Date(orderCreatedAt.getTime() + 72 * 3600000);
        } else if (status === "out_for_delivery") {
          shipmentStatus = "out_for_delivery";
          shippedAt = new Date(orderCreatedAt.getTime() + 24 * 3600000);
        } else if (status === "shipped") {
          shipmentStatus = "in_transit";
          shippedAt = new Date(orderCreatedAt.getTime() + 24 * 3600000);
        } else if (status === "packed") {
          shipmentStatus = "booked";
        } else if (status === "cancelled") {
          shipmentStatus = "failed";
        }

        const [insertedShipment] = await tx
          .insert(shipments)
          .values({
            orderId: insertedOrder.id,
            status: shipmentStatus,
            courierName,
            trackingNumber,
            trackingUrl,
            shippedAt,
            deliveredAt,
            createdAt: orderCreatedAt,
          })
          .returning();

        // Shipment Tracking History for active/delivered shipments
        if (["delivered", "out_for_delivery", "in_transit", "picked_up"].includes(shipmentStatus)) {
          type ShipmentTrackingInsert = typeof shipmentTracking.$inferInsert;

          const trackingEvents: ShipmentTrackingInsert[] = [
            {
              shipmentId: insertedShipment.id,
              status: "booked",
              location: cityLoc.city,
              description: `Shipment booked with ${courierName}`,
              createdAt: new Date(orderCreatedAt.getTime() + 12 * 3600000),
            },
            {
              shipmentId: insertedShipment.id,
              status: "picked_up",
              location: cityLoc.city,
              description: `Picked up by ${courierName}`,
              createdAt: new Date(orderCreatedAt.getTime() + 24 * 3600000),
            },
          ];

          if (["in_transit", "out_for_delivery", "delivered"].includes(shipmentStatus)) {
            trackingEvents.push({
              shipmentId: insertedShipment.id,
              status: "in_transit",
              location: `Hub ${cityLoc.city}`,
              description: `In transit to destination hub`,
              createdAt: new Date(orderCreatedAt.getTime() + 48 * 3600000),
            });
          }

          if (["out_for_delivery", "delivered"].includes(shipmentStatus)) {
            trackingEvents.push({
              shipmentId: insertedShipment.id,
              status: "out_for_delivery",
              location: cityLoc.city,
              description: `Out for delivery with courier executive`,
              createdAt: new Date(orderCreatedAt.getTime() + 68 * 3600000),
            });
          }

          if (shipmentStatus === "delivered") {
            trackingEvents.push({
              shipmentId: insertedShipment.id,
              status: "delivered",
              location: cityLoc.city,
              description: `Package delivered successfully to recipient`,
              createdAt: new Date(orderCreatedAt.getTime() + 72 * 3600000),
            });
          }

          await tx.insert(shipmentTracking).values(trackingEvents);
        }
      }
    });

    console.log("\n==================================================");
    console.log("🎉 Premika Demo Ecommerce Seeding Complete!");
    console.log("==================================================");
    console.log(`👤 Customers Seeded:      25 profiles`);
    console.log(`🏠 Addresses Seeded:      25 addresses`);
    console.log(`📦 Orders Seeded:         100 orders`);
    console.log(`🛒 Order Items Seeded:    ${totalOrderItemsCount} items`);
    console.log(`💰 Valid Revenue Generated: ₹${grandTotalRevenue.toLocaleString("en-IN")}`);
    console.log("==================================================\n");
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
  } finally {
    await client.end();
  }
}

seedDemoData();
