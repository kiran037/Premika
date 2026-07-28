import "dotenv/config";
import { db } from "../db/client";
import {
  categories,
  products,
  productImages,
  productSizes,
  productHeights,
  productReviews,
} from "../db/schema";
import productsData from "../data/data";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Ensure "Clothing" category exists
    let clothingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "clothing"))
      .then((rows) => rows[0]);

    if (!clothingCategory) {
      console.log("Creating default category 'Clothing'...");
      const [inserted] = await db
        .insert(categories)
        .values({
          name: "Clothing",
          slug: "clothing",
          description: "Ethnic & Designer Women Wear",
          image: "/logo.png",
          isActive: true,
          sortOrder: 1,
        })
        .returning();
      clothingCategory = inserted;
    }

    console.log(`Using Category ID: ${clothingCategory.id}`);

    // 2. Iterate products in data.ts and seed into database
    for (let index = 0; index < productsData.length; index++) {
      const p = productsData[index];
      const productSlug = p.id.toLowerCase().trim();

      // Check if product already exists by slug
      const existingProduct = await db
        .select()
        .from(products)
        .where(eq(products.slug, productSlug))
        .then((rows) => rows[0]);

      let productId: string;

      if (!existingProduct) {
        // Determine productType
        let pType: "top" | "bottom" | "set" = "top";
        if (p.isCombo) {
          pType = "set";
        }

        let mappedGender: "men" | "women" | "unisex" = "women";
        if (p.gender === "male" || p.gender === "men") {
          mappedGender = "men";
        } else if (p.gender === "unisex") {
          mappedGender = "unisex";
        }

        const [insertedProduct] = await db
          .insert(products)
          .values({
            categoryId: clothingCategory.id,
            slug: productSlug,
            name: p.name,
            sku: productSlug,
            productType: pType,
            gender: mappedGender,
            status: "active",
            stockStatus: p.inStock ? "in_stock" : "out_of_stock",
            shortDescription: p.shortDescription || "",
            longDescription: p.longDescription || "",
            price: Math.round(p.price),
            compareAtPrice: Math.round(p.price),
            featured: index < 8,
            newArrival: index < 12,
            hasHeightOptions: Array.isArray(p.heights) && p.heights.length > 0,
            isActive: true,
          })
          .returning();

        productId = insertedProduct.id;
        console.log(`Inserted Product [${index + 1}/${productsData.length}]: ${p.name}`);
      } else {
        productId = existingProduct.id;
        console.log(`Skipped existing product: ${p.name}`);
      }

      // 3. Product Images
      if (Array.isArray(p.images) && p.images.length > 0) {
        const existingImages = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, productId));

        if (existingImages.length === 0) {
          await db.insert(productImages).values(
            p.images.map((imgUrl, imgIdx) => ({
              productId: productId,
              image: imgUrl,
              alt: `${p.name} image ${imgIdx + 1}`,
              sortOrder: imgIdx,
              isPrimary: imgIdx === 0,
            }))
          );
        }
      }

      // 4. Product Sizes
      if (Array.isArray(p.sizes) && p.sizes.length > 0) {
        const existingSizes = await db
          .select()
          .from(productSizes)
          .where(eq(productSizes.productId, productId));

        if (existingSizes.length === 0) {
          await db.insert(productSizes).values(
            p.sizes.map((s, sizeIdx) => ({
              productId: productId,
              size: s.label,
              stock: s.inStock ? 10 : 0,
              isAvailable: s.inStock,
              sortOrder: sizeIdx,
            }))
          );
        }
      }

      // 5. Product Heights
      if (Array.isArray(p.heights) && p.heights.length > 0) {
        const existingHeights = await db
          .select()
          .from(productHeights)
          .where(eq(productHeights.productId, productId));

        if (existingHeights.length === 0) {
          await db.insert(productHeights).values(
            p.heights.map((h, hIdx) => ({
              productId: productId,
              label: h.label,
              value: h.value,
              isDefault: Boolean(h.default),
              sortOrder: hIdx,
            }))
          );
        }
      }

      // 6. Product Reviews
      if (Array.isArray(p.reviews) && p.reviews.length > 0) {
        const existingReviews = await db
          .select()
          .from(productReviews)
          .where(eq(productReviews.productId, productId));

        if (existingReviews.length === 0) {
          await db.insert(productReviews).values(
            p.reviews.map((r) => ({
              productId: productId,
              customerName: r.name,
              rating: r.rating,
              comment: r.comment,
              reviewStatus: "approved" as const,
              verifiedPurchase: true,
              createdAt: r.date ? new Date(r.date) : new Date(),
            }))
          );
        }
      }
    }

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
