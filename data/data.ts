import { Product, DiscountedPriceResult } from "@/types";

// Products excluded from 10% discount sale
const EXCLUDED_FROM_SALE = [
  "Chahat",
  "Srishti",
  "ayushi",
  "aashi",
  "simran",
  "Mehak",
  "Sneha",
];

// Calculate discounted price (10% off for eligible products)
export const getDiscountedPrice = (product: { price: number }): DiscountedPriceResult => {
  // All items are excluded from sale
  return {
    originalPrice: product.price,
    discountedPrice: product.price,
    isOnSale: false,
    discount: 0,
  };
};

const products: Product[] = [
   {
    id: "kajal",
    name: "Kajal",
    price: 649,
    shortDescription:
      "Kajal is a chic beige and black pure cotton kurti featuring an adjustable sweetheart neckline and a flattering corset back. Comfortable, stylish, and perfect for everyday wear or special occasions.",
    longDescription:
      "Kajal is a timeless beige and black kurti crafted from breathable pure cotton for all-day comfort. It features adjustable pull-up strings at the neckline that can be styled into a flattering sweetheart shape, while the elegant corset back enhances your silhouette with a beautiful, adjustable fit. Effortlessly versatile, Kajal is perfect for casual outings, office wear, brunches, and festive occasions.",
    images: [
      "/Kajal/Kajal1.png",
      "/Kajal/Kajal2.png",
      "/Kajal/Kajal3.png",
      "/Kajal/Kajal4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Sakshi",
        date: "2025-05-14",
        rating: 5,
        comment:
          "The beige and black combination looks so classy. I received so many compliments the first time I wore it.",
      },
      {
        name: "Rekha",
        date: "2025-06-07",
        rating: 4,
        comment: "I’ve worn it to brunch and family gatherings, and it looked amazing both times. Super comfortable and stylish.",
      },
    ],
  },
       {
    id: "sana",
    name: "Sana",
    price: 649,
    shortDescription:
      "Sana is a chic and effortlessly elegant kurti featuring a flattering square neckline, delicate noodle straps, and an adjustable corset back. Soft, breathable, and designed for all-day comfort, it’s perfect for both casual days and special occasions.",
    longDescription:
      "Sana is a timeless kurti designed to make you feel effortlessly confident. Featuring a flattering square neckline, delicate noodle straps, and an elegant corset back, it creates a beautifully feminine silhouette with an adjustable fit. Lightweight, breathable, and versatile, Sana is perfect for brunch dates, vacations, festive gatherings, or everyday outings.",
    images: [
      "/Sana/Sana1.png",
      "/Sana/Sana2.png",
      "/Sana/Sana3.png",
      "/Sana/Sana4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Rucha",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Such a beautiful fit! The square neckline and corset back make it so flattering. It fits perfectly and feels amazing to wear.",
      },
      {
        name: "Anushka",
        date: "2025-06-07",
        rating: 4,
        comment: "It’s comfortable enough for everyday wear but also looks dressy for special occasions.",
      },
    ],
  },
  {
    id: "divya",
    name: "Divya",
    price: 649,
    shortDescription:
      "Divya is a pure cotton kurti featuring delicate noodle straps, a sweetheart scrunched neckline, and an elegant corset back. Light, feminine, and effortlessly chic.",
    longDescription:
      "Divya is a charming pure cotton kurti designed for effortless elegance. Featuring delicate noodle straps and a sweetheart scrunched neckline, it adds a soft, romantic touch to your look. The corset back creates a flattering silhouette while ensuring a comfortable fit. Lightweight, breathable, and versatile, Divya is perfect for everything from casual outings to special occasions.",
    images: [
      "/Divya/Divya1.png",
      "/Divya/Divya2.png",
      "/Divya/Divya3.png",
      "/Divya/Divya4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "malika",
    name: "Malika",
    price: 649,
    shortDescription:
      "Malika is a dreamy baby pink kurti crafted from pure cotton, featuring adjustable pull-up strings that create a flattering sweetheart neckline and an elegant corset back for the perfect feminine fit.",
    longDescription:
      "Malika is a charming baby pink kurti designed to make you feel effortlessly beautiful. Made from breathable pure cotton, it features adjustable pull-up strings at the neckline that can be styled into a flattering sweetheart shape. The elegant corset back adds a feminine touch while ensuring a flattering fit. Soft, comfortable, and versatile, Malika is perfect for everything from casual outings to special occasions.",
    images: [
      "/Malika/Malika1.png",
      "/Malika/Malika2.png",
      "/Malika/Malika3.png",
      "/Malika/Malika4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "tanya-kurti",
    name: "Tanya Kurti",
    price: 649,
    shortDescription:
      "The Tanya Kurti is crafted from pure cotton and features a beautifully designed neckline with an adjustable corset tie-up back. Comfortable, flattering, and easy to wear, it’s designed for effortless everyday elegance.",
    longDescription:
      "Crafted from breathable pure cotton, the Tanya Kurti is designed to bring together comfort and charm. Featuring a beautiful neckline and a corset tie-up back for an adjustable fit, it flatters the silhouette while maintaining an effortless feel. Thoughtfully designed and easy to style, Tanya is the kind of piece you’ll find yourself reaching for time and time again.",
    images: [
      "/Tanya/Tanya1.png",
      "/Tanya/Tanya2.png",
      "/Tanya/Tanya3.png",
      "/Tanya/Tanya4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "tanya-salwar",
    name: "Tanya Salwar",
    price: 899,
    shortDescription:
      "The Tanya Salwar features a beautiful print that adds just the right amount of charm to the set. Comfortable, breathable, and easy to wear, it’s designed for effortless everyday elegance.View Size Chart For Bottoms for the perfect fit.",
    longDescription:
      "Designed to complement the Tanya Kurti, this salwar features a beautiful print that brings character and charm to the overall look. Crafted from soft, breathable slub cotton, it offers all-day comfort while maintaining a graceful silhouette. Versatile and timeless, it’s a piece you’ll love wearing again and again.",
    images: [
      "/TanyaSal/Tanya1.png",
      "/TanyaSal/Tanya2.png",
      "/TanyaSal/Tanya3.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "Tanya-Full",
    name: "Tanya Set",
    price: 1499,
    shortDescription:
      "Tanya is a pure cotton kurti and salwar set designed for effortless elegance. Featuring a flattering corset back and a beautifully crafted neckline, it is paired with a printed slub cotton salwar that adds charm and character to the look.View Size Chart For Bottoms for the perfect fit.",
    longDescription:
      "Meet Tanya — a timeless kurti and salwar set crafted for days when comfort and elegance go hand in hand. Made from breathable pure cotton, the kurti features a beautifully designed neckline and an adjustable corset back that creates a flattering fit. Paired with a printed slub cotton salwar, the set combines structure, comfort, and effortless style. Thoughtfully designed and easy to wear, Tanya is perfect for everything from casual gatherings to festive celebrations.",
    images: [
      "/TanyaFull/Tanya1.png",
      "/TanyaFull/Tanya2.png",
      "/TanyaFull/Tanya3.png",
      "/TanyaFull/Tanya4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "palak",
    name: "Palak",
    price: 649,
    shortDescription:
      "Palak is a timeless black halter-neck kurti crafted from pure cotton. Designed with a relaxed silhouette and a flattering neckline, it’s the perfect blend of comfort, simplicity, and effortless style.",
    longDescription:
      "Meet Palak — a black halter-neck kurti crafted from breathable pure cotton for all-day comfort. Featuring a flattering V-neckline, an easy silhouette, and a classic black hue, it’s a versatile piece that can be dressed up or down with ease. Minimal, comfortable, and effortlessly elegant, Palak is designed for days when you want to look put together without trying too hard.",
    images: [
      "/Palak/Palak1.png",
      "/Palak/Palak2.png",
      "/Palak/Palak3.png",
      "/Palak/Palak4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "yamini",
    name: "Yamini",
    price: 699,
    shortDescription:
      "Yamini is a butter yellow cotton kurti designed for effortless elegance. Double-lined for comfort and coverage, it features delicate side tie-up detailing that adds a subtle, flattering touch to its relaxed silhouette.",
    longDescription:
      "Meet Yamini — a soft butter yellow kurti crafted from breathable cotton and thoughtfully double-lined for added comfort. Designed with adjustable side tie-up detailing that gently cinches the waist, it creates a flattering silhouette while maintaining an effortless feel. Light, versatile, and easy to wear, Yamini is perfect for slow mornings, sunny afternoons, and everything in between.",
    images: [
      "/Yamini/Yamini1.png",
      "/Yamini/Yamini2.png",
      "/Yamini/Yamini3.png",
      "/Yamini/Yamini4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "Diksha",
    name: "Diksha",
    price: 649,
    shortDescription:
      "Diksha is a soft butter-yellow kurti crafted from lightweight georgette chiffon. Featuring delicate noodle straps and a double-lined finish for added comfort and coverage, it’s the perfect blend of elegance and ease.",
    longDescription:
      "Meet Diksha — a dreamy butter-yellow kurti crafted from flowy georgette chiffon. Designed with delicate noodle straps and thoughtfully double-lined for comfort and confidence, it drapes beautifully while maintaining a lightweight feel. The subtle texture and soft hue make it an effortlessly feminine piece that’s perfect for warm days, festive gatherings, and everything in between.",
    images: [
      "/Diksha/Diksha1.png",
      "/Diksha/Diksha2.png",
      "/Diksha/Diksha3.png",
      "/Diksha/Diksha4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "Chand",
    name: "Chand",
    price: 649,
    shortDescription:
      "Chand is a timeless white cotton kurti designed for effortless everyday elegance. Double-lined for comfort and coverage, it features statement bell sleeves and a relaxed silhouette that feels as good as it looks.",
    longDescription:
      "Meet Chand — a classic white kurti crafted from breathable cotton and thoughtfully double-lined for added comfort and coverage. Featuring elegant bell sleeves, side slits, and a relaxed silhouette, it’s the kind of piece you’ll keep reaching for. Simple, versatile, and effortlessly graceful, Chand is designed to fit seamlessly into your everyday wardrobe.",
    images: [
      "/Chand/Chand1.png",
      "/Chand/Chand2.png",
      "/Chand/Chand3.png",
      "/Chand/Chand4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "Tara",
    name: "Tara",
    price: 649,
    shortDescription:
      "Tara is a timeless halter-neck kurti crafted from breathable slub cotton. Designed with a flattering silhouette and subtle texture, it brings together comfort, elegance, and effortless charm.",
    longDescription:
      "Meet Tara — a graceful halter-neck kurti crafted from premium slub cotton. Featuring a flattering neckline and a beautifully relaxed silhouette, Tara is designed for days when comfort and style go hand in hand. The textured slub cotton fabric adds character and depth, making it a versatile piece that transitions effortlessly from casual outings to special occasions.",
    images: [
      "/Tara/Tara1.png",
      "/Tara/Tara2.png",
      "/Tara/Tara3.png",
      "/Tara/Tara4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "bulbul-kurti",
    name: "Bulbul Kurti",
    price: 649,
    shortDescription:
      "Bulbul is crafted in soft cotton and features delicate noodle straps with a corset tie-up back for the perfect fit. Double-lined for added comfort and coverage, this timeless black kurti is effortlessly stylish and designed to be worn on repeat.",
    longDescription:
      "Bulbul is a black cotton kurti with delicate noodle straps and a corset tie-up back. Designed to fit beautifully and comfortably, it’s one of those pieces that feels effortless yet makes a statement. The classic black color makes it easy to dress up or down, making Bulbul a wardrobe staple you’ll keep reaching for.",
    images: [
      "/Bulbul/Bulbul1.png",
      "/Bulbul/Bulbul2.png",
      "/Bulbul/Bulbul3.png",
      "/Bulbul/Bulbul4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "bulbul-salwar",
    name: "Bulbul Salwar",
    price: 899,
    shortDescription:
      "The Bulbul Farshi Salwar is crafted from soft viscose rayon that drapes beautifully with every step. Designed for comfort and effortless movement, its flowy silhouette adds grace and elegance while perfectly complementing the structured fit of the Bulbul Kurti.",
    longDescription:
      "The Bulbul Farshi Salwar is crafted from soft viscose rayon that drapes beautifully and moves effortlessly with you. Designed with a flowy, relaxed silhouette, it offers the perfect combination of comfort and elegance. The lightweight fabric creates a graceful fall, while the timeless design makes it easy to pair with both festive and everyday looks. Comfortable, versatile, and effortlessly chic, Bulbul is a piece you’ll find yourself reaching for again and again.",
    images: [
      "/BulbulSal/Bulbul1.png",
      "/BulbulSal/Bulbul2.png",
      "/BulbulSal/Bulbul3.png",
      "/BulbulSal/Bulbul4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
{
    id: "bulbul-set",
    name: "Bulbul Set",
    price: 1499,
    shortDescription: "Bulbul is a timeless black kurti and farshi salwar set crafted for modern elegance. Featuring a cotton kurti with delicate noodle straps and a corset-style back, it is paired with a flowy viscose rayon farshi salwar for a graceful and effortlessly chic look.View Size Chart For Bottoms for the perfect fit.",
    longDescription:
      "Meet Bulbul — a striking black kurti and farshi salwar set designed for effortless elegance. Crafted from breathable cotton, the kurti features delicate noodle straps and a beautifully adjustable corset back that flatters the silhouette while adding a contemporary touch. Paired with a flowy viscose rayon farshi salwar, the set offers graceful movement and all-day comfort. Timeless yet distinctive, Bulbul is perfect for festive gatherings, intimate celebrations, and everything in between.",
    images: [
      "/BulbulFull/Bulbul1.png",
      "/BulbulFull/Bulbul2.png",
      "/BulbulFull/Bulbul3.png",
      "/BulbulFull/Bulbul4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "swati",
        date: "2026-06-14",
        rating: 5,
        comment:
          "Absolutely loved it!Loved the fabric! The pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "simran",
        date: "2026-05-07",
        rating: 4,
        comment: "Loved the sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },  
  {
    id: "koyal-set",
    name: "Koyal Set",
    price: 1499,
    shortDescription: "Koyal is a timeless soft brown kurti and farshi salwar set crafted for effortless elegance. The kurti is made from pure cambric cotton and features a charming neckline with delicate side detailing on both sides, while the pure cotton slub farshi salwar adds a beautifully structured silhouette. View Size Chart For Bottoms for the perfect fit.",
    longDescription:
      "Meet Koyal — a graceful soft brown kurti and farshi salwar set designed for comfort and sophistication. The kurti is crafted from premium pure cambric cotton, offering a lightweight and breathable feel, and is adorned with a cute neckline and subtle side detailing on both sides for an elevated touch. Paired with a pure cotton slub farshi salwar, the set creates a structured yet effortless silhouette, making it perfect for everyday elegance as well as special occasions.",
    images: [
      "/KoyalFull/Koyal1.PNG",
      "/KoyalFull/Koyal2.PNG",
      "/KoyalFull/Koyal3.png",
      "/KoyalFull/Koyal4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "swati",
        date: "2026-06-14",
        rating: 5,
        comment:
          "Absolutely loved it!Loved the fabric! The pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "simran",
        date: "2026-05-07",
        rating: 4,
        comment: "Loved the sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "koyal-kurti",
    name: "Koyal Kurti",
    price: 699,
    shortDescription: "Koyal is a soft brown kurti crafted from premium pure cambric cotton. Designed with a charming neckline and delicate side detailing on both sides, it blends everyday comfort with understated elegance.",
    longDescription:
      "The Koyal Kurti is crafted from breathable pure cambric cotton in a beautiful soft brown hue. Featuring a cute, thoughtfully designed neckline and elegant side detailing on both sides, it offers a perfect balance of comfort and sophistication. Lightweight and versatile, Koyal is designed to be your go-to choice for effortless everyday dressing.",
    images: [
      "/KoyalKurti/Koyal1.png",
      "/KoyalKurti/Koyal2.PNG",
      "/KoyalKurti/Koyal3.PNG",
      "/KoyalKurti/Koyal4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "priya",
        date: "2026-06-1",
        rating: 5,
        comment:
          "The fabric is so soft and breathable. The fit is beautiful, and the side detailing makes it look much more premium than regular cotton kurtis.",
      },
      {
        name: "kritika",
        date: "2026-05-01",
        rating: 4,
        comment:
          "Absolutely loved the soft brown color! It’s subtle, elegant, and perfect for everyday wear as well as casual outings!",
      },
    ],
  },
  {
    id: "koyal-salwar",
    name: "Koyal Salwar",
    price: 899,
    shortDescription: "The Koyal Farshi Salwar is crafted from premium pure cotton slub fabric, offering a structured yet comfortable silhouette. Designed to add effortless grace and movement to your look, it’s the perfect blend of elegance and ease. View Size Chart For Bottoms for the perfect fit.",
    longDescription:
      "Crafted from pure cotton slub fabric, the Koyal Farshi Salwar is designed to create a beautifully structured and flowy silhouette. The textured fabric adds depth and character, while the comfortable fit ensures ease of movement throughout the day. Timeless, versatile, and effortlessly elegant, it’s the perfect companion to elevate any kurti.",
    images: [
      "/KoyalSalwar/Koyal1.PNG",
      "/KoyalSalwar/Koyal2.PNG",
      "/KoyalSalwar/Koyal3.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "sarah",
        date: "2026-06-1",
        rating: 5,
        comment:
          "The fall of this salwar is absolutely beautiful. It gives such a graceful and premium look.",
      },
      {
        name: "aayushi",
        date: "2026-05-01",
        rating: 4,
        comment:
          "The cotton slub fabric has the perfect structure without feeling heavy. Super comfortable to wear all day.",
      },
    ],
  },
  {
    id: "Swasti",
    name: "Swasti",
    price: 649,
    shortDescription:
      "Swasti is a timeless black georgette kurti with delicate white floral prints and a flattering corset back, blending effortless elegance with pure desi vibes.",
    longDescription:
      "Swasti is a beautifully designed black kurti crafted from flowy georgette, featuring soft white floral prints that add a touch of classic charm. Its standout corset back enhances your silhouette, giving a structured yet graceful fit. Light, stylish, and easy to wear, it captures pure desi vibes while staying minimal and versatile—perfect for both everyday elegance and subtle festive looks.",
    images: [
      "/Swasti/Swasti1.png",
      "/Swasti/Swasti2.png",
      "/Swasti/Swasti3.png",
      "/Swasti/Swasti4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment: "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "rimjhim",
    name: "Rimjhim",
    price: 649,
    shortDescription:
      "Rimjhim is a stunning magenta pink georgette kurti that blends elegance with pure desi vibes, featuring a flattering silhouette and a chic corset back for the perfect fit.",
    longDescription:
      "Rimjhim is a beautifully crafted magenta pink kurti made from flowy georgette, designed to give you those effortless, pure desi vibes with a modern twist. Its standout corset back enhances your silhouette while adding a touch of contemporary charm. Light, graceful, and versatile, Ananya is perfect for festive occasions or special outings where you want to feel rooted yet stylish.",
    images: [
      "/Rimjhim/Rimjhim1.png",
      "/Rimjhim/Rimjhim2.png",
      "/Rimjhim/Rimjhim3.png",
      "/Rimjhim/Rimjhim4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "ananya",
    name: "Ananya",
    price: 649,
    shortDescription:
      "Ananya is a stunning blue georgette kurti that blends elegance with pure desi vibes, featuring a flattering silhouette and a chic corset back for the perfect fit.",
    longDescription:
      "Ananya is a beautifully crafted blue kurti made from flowy georgette, designed to give you those effortless, pure desi vibes with a modern twist. Its standout corset back enhances your silhouette while adding a touch of contemporary charm. Light, graceful, and versatile, Ananya is perfect for festive occasions or special outings where you want to feel rooted yet stylish",
    images: [
      "/Ananya/Ananya1.PNG",
      "/Ananya/Ananya2.PNG",
      "/Ananya/Ananya3.PNG",
      "/Ananya/Ananya4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "ojasvi",
    name: "Ojasvi",
    price: 599,
    shortDescription:
      "Ojasvi is a pure cotton printed kurti with a flattering corset back and a beautifully crafted neckline, bringing together comfort, elegance, and pure desi vibes.",
    longDescription:
      "Ojasvi is a thoughtfully designed kurti made from breathable pure cotton, perfect for all-day comfort without compromising on style. Featuring elegant prints, a beautifully detailed neckline, and a flattering corset back, it enhances your silhouette while keeping the look soft and effortless. With its easy charm and pure desi vibes, Ojasvi is ideal for everyday wear, casual outings, or relaxed festive moments.",
    images: [
      "/Ojasvi/Ojasvi1.PNG",
      "/Ojasvi/Ojasvi2.PNG",
      "/Ojasvi/Ojasvi3.PNG",
      "/Ojasvi/Ojasvi4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "suhani",
    name: "Suhani",
    price: 599,
    shortDescription:
      "Suhani is a graceful purple pure cotton kurti with elegant prints, a flattering corset back, and a beautifully crafted neckline, bringing together comfort and pure desi vibes",
    longDescription:
      "Suhani is a beautifully designed kurti in a rich purple hue, crafted from breathable pure cotton for all-day ease. Featuring subtle prints, a stunning neckline, and a flattering corset back, it enhances your silhouette while keeping the look soft and effortless. With its blend of comfort, elegance, and pure desi vibes, Suhani is perfect for everyday wear, casual outings, or relaxed festive moments",
    images: [
      "/Suhani/Suhani1.PNG",
      "/Suhani/Suhani2.PNG",
      "/Suhani/Suhani3.PNG",
      "/Suhani/Suhani4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "teena",
    name: "Teena",
    price: 649,
    shortDescription:
      "Teena is a dreamy pastel pink georgette kurti with a flattering corset back, perfect for summers and filled with soft, pure desi vibes.",
    longDescription:
      "Teena is a beautifully crafted kurti in a delicate pastel pink shade, made from lightweight georgette that feels breezy and effortless—perfect for warm summer days. Designed with a flattering corset back, it enhances your silhouette while keeping the look soft and feminine. With its airy feel, elegant flow, and pure desi vibes, Teena is ideal for daytime outings, brunches, or light festive moments.",
    images: [
      "/Teena/Teena1.png",
      "/Teena/Teena2.png",
      "/Teena/Teena3.png",
      "/Teena/Teena4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "riya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "srishti",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "ritika",
    name: "Ritika",
    price: 699,
    shortDescription:
      "Ritika is a versatile green pure cotton kurti with noodle straps, a flattering corset back, and a detachable jacket—giving you a stylish 2-in-1 look with pure desi vibes.",
    longDescription:
      "Ritika is a thoughtfully designed green kurti crafted from breathable pure cotton, featuring beautiful prints that bring out a rich desi aesthetic. It comes with noodle straps and a flattering corset back to enhance your silhouette, while the detachable jacket lets you switch between two looks effortlessly. Double-lined for added comfort and coverage, Ritika blends functionality with style—perfect for when you want versatility without compromising on elegance",
    images: [
      "/Ritika/Ritika1.png",
      "/Ritika/Ritika2.png",
      "/Ritika/Ritika3.png",
      "/Ritika/Ritika4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "riya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "srishti",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "jiya",
    name: "Jiya",
    price: 649,
    shortDescription:
      "Jiya is a dreamy pastel pink kurti with a flattering corset back, perfect for summers and filled with soft, pure desi vibes.",
    longDescription:
      "Jiya is a minimal yet striking pastel pink kurti designed to be your go-to statement piece. Crafted for comfort in warm weather, it features a flattering corset back that enhances your silhouette while keeping the look polished and refined. Its plain, elegant design makes it perfect for office wear as well as summer outings, offering a blend of modern simplicity and soft pure desi vibes",
    images: [
      "/Jiya/Jiya1.png",
      "/Jiya/Jiya2.png",
      "/Jiya/Jiya3.png",
      "/Jiya/Jiya4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "riya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "srishti",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },

  {
    id: "sakshi",
    name: "Sakshi",
    price: 649,
    shortDescription:
      "Meet our Sakshi Kurti, a stunning green piece designed to make a statement. Featuring elegant printed rose detailing, a flattering corset back, and graceful bell sleeves, it perfectly blends charm and sophistication for a timeless look.",
    longDescription:
      "Introducing our Sakshi Kurti, a beautiful green kurti crafted for effortless elegance. Adorned with delicate printed rose detailing, this piece brings a touch of femininity and charm to your wardrobe. The stylish corset back enhances the fit and creates a flattering silhouette, while the flowy bell sleeves add a graceful and trendy finish. Perfect for casual outings, festive gatherings, or special occasions, the Sakshi Kurti is designed to make you feel confident, stylish, and comfortable.",
    images: [
      "/Sakshi/Sakshi1.png",
      "/Sakshi/Sakshi2.png",
      "/Sakshi/Sakshi3.png",
      "/Sakshi/Sakshi4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },
  {
    id: "akshara",
    name: "Akshara",
    price: 649,
    shortDescription:
      "Meet our Akshara Kurti, a stunning magenta red piece designed to make a statement. Featuring elegant printed rose detailing, a flattering corset back, and graceful bell sleeves, it perfectly blends charm and sophistication for a timeless look.",
    longDescription:
      "Introducing our Akshara Kurti, a beautiful magenta red kurti crafted for effortless elegance. Adorned with delicate printed rose detailing, this piece brings a touch of femininity and charm to your wardrobe. The stylish corset back enhances the fit and creates a flattering silhouette, while the flowy bell sleeves add a graceful and trendy finish. Perfect for casual outings, festive gatherings, or special occasions, the Akshara Kurti is designed to make you feel confident, stylish, and comfortable.",
    images: [
      "/Akshara/Akshara1.png",
      "/Akshara/Akshara2.png",
      "/Akshara/Akshara3.png",
      "/Akshara/Akshara4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! Loved the fabric — the pure cotton feels so soft and breathable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the bell sleeves and the overall style. It looks even better in real life!",
      },
    ],
  },

  {
    id: "kashish",
    name: "Kashish",
    price: 699,
    shortDescription:
      "Meet our Kashish Kurti—designed with elegant corset detailing on both sides for a beautifully snatched fit. Featuring a stunning neckline and double-lined fabric for comfort and structure, it blends style with sophistication effortlessly.",
    longDescription:
      "Introducing our Kashish Kurti, thoughtfully designed to enhance your silhouette with corset detailing on both sides for a flattering, snatched fit. It features a beautiful neckline that adds a touch of elegance, while the double-lined construction ensures comfort, structure, and a premium feel. Stylish yet comfortable, Kashish is perfect for days when you want effortless grace with a modern touch.",
    images: [
      "/Kashish/Kashish1.PNG",
      "/Kashish/Kashish2.png",
      "/Kashish/Kashish3.png",
      "/Kashish/Kashish4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! The fabric feels premium, soft, and breathable. Perfect for daily wear with a stylish edge.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the fit and the neckline. The corset detailing gives such a flattering shape, and it looks even better in real life.",
      },
    ],
  },

  {
    id: "navya",
    name: "Navya",
    price: 649,
    shortDescription:
      "Meet our Navya Kurti—crafted from pure cotton in a rich solid rust-mehroon shade. Designed with a minimal little collar for a clean, elegant look, it’s comfortable, breathable, and perfect for everyday effortless style.",
    longDescription:
      "Introducing our Navya Kurti, made from pure cotton for all-day comfort and breathability. It comes in a beautiful solid rust-mehroon shade that adds warmth and elegance to your everyday wardrobe. Designed with a minimal little collar, the silhouette is simple yet refined, making it perfect for both casual outings and elevated daily wear. Easy, timeless, and effortlessly stylish.",
    images: [
      "/Navya/Navya1.PNG",
      "/Navya/Navya2.PNG",
      "/Navya/Navya3.PNG",
      "/Navya/Navya4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! The pure cotton fabric feels soft, breathable, and very comfortable. Perfect for daily wear.",
      },
      {
        name: "Manojna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Loved the clean design and the color. It looks simple yet elegant and feels even better in real life.",
      },
    ],
  },
  {
    id: "aashi",
    name: "Aashi",
    price: 699,
    shortDescription:
      "Aashi Kurti is a stylish pure cotton kurti crafted using two fabrics—printed and plain. Designed in classic red and black tones, it features side tie-up detailing and a comfortable double-lined finish.",
    longDescription:
      "The Aashi Kurti brings together contrast and comfort in a timeless design. Made from breathable pure cotton, it combines a printed fabric with a plain red and black base for a striking yet elegant look. The kurti is double-lined for added comfort and structure, while the side tie-up detailing adds a touch of charm and adjustability. Perfect for everyday wear, casual outings, or relaxed festive occasions.",
    images: [
      "/Aashi/Aashi1.PNG",
      "/Aashi/Aashi2.PNG",
      "/Aashi/Aashi3.PNG",
      "/Aashi/Aashi4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Ananya",
        date: "2025-04-18",
        rating: 5,
        comment:
          "Love the mix of printed and plain fabric! The red and black combo is so striking. The side tie-up detail is such a nice touch.",
      },
      {
        name: "Priya",
        date: "2025-05-22",
        rating: 4,
        comment:
          "Great quality cotton and the double lining makes it feel premium. The contrast design is really eye-catching.",
      },
    ],
  },
  {
    id: "simran",
    name: "Simran",
    price: 699,
    shortDescription:
      "Simaran Kurti is a stylish 2-in-1 outfit featuring a removable jacket and a noodle-strap kurti. Crafted from pure cotton, it is double-lined for comfort and finished with a corset back. Available in a rich brown shade.",
    longDescription:
      "The Simaran Kurti is a versatile 2-in-1 ensemble designed for effortless styling. It includes a removable jacket paired with a noodle-strap kurti, allowing you to wear it together or separately. Made from pure cotton, the kurti is double-lined for enhanced comfort and structure. A corset back adds a flattering fit, while the elegant brown color gives it a timeless, earthy charm—perfect for both casual and festive occasions",
    images: [
      "/Simran/Simran1.png",
      "/Simran/Simran2.png",
      "/Simran/Simran3.png",
      "/Simran/Simran4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Kavya",
        date: "2025-03-28",
        rating: 5,
        comment:
          "Absolutely love the 2-in-1 design! The removable jacket makes it so versatile. Can wear it for casual days or dress it up.",
      },
      {
        name: "Meera",
        date: "2025-04-15",
        rating: 4,
        comment:
          "The brown color is gorgeous and the corset back gives such a flattering fit. The cotton fabric is really comfortable.",
      },
    ],
  },
  {
    id: "Sneha",
    name: "Sneha",
    price: 749,
    shortDescription:
      "Sneha Kurti is a padded, backless kurti crafted from pure cotton. Designed in a soft butter yellow shade, it offers a fresh, elegant look with all-day comfort..",
    longDescription:
      "The Sneha Kurti is a perfect blend of simplicity and charm. Made from breathable pure cotton, it features built-in padding for ease and a stylish backless design that adds a modern touch. The soothing butter yellow color brings a light, graceful appeal, making it ideal for summer days, casual outings, and daytime festive occasions.",
    images: [
      "/Sneha/Sneha1.png",
      "/Sneha/Sneha2.png",
      "/Sneha/Sneha3.png",
      "/Sneha/Sneha4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Isha",
        date: "2025-04-25",
        rating: 5,
        comment:
          "The butter yellow color is absolutely gorgeous! So soft and refreshing. The backless design with padding is perfect.",
      },
      {
        name: "Tara",
        date: "2025-05-18",
        rating: 4,
        comment:
          "Perfect for hot weather! The cotton is so airy and breathable. The color brightens up any day. Love the modern cut.",
      },
    ],
  },
  {
    id: "Chahat",
    name: "Chahat",
    price: 699,
    shortDescription:
      "Chahat is a mint green pure cotton 2-in-1 kurti featuring a noodle-strap inner, a detachable jacket, and a graceful corset back that creates a fresh, modern, and elegant look.",
    longDescription:
      "Introducing Chahat, a mint green pure cotton 2-in-1 kurti designed to blend comfort with contemporary style. It comes with a chic noodle-strap inner and a detachable jacket, allowing you to switch looks effortlessly. The corset-style back adds a flattering fit and a touch of sophistication. Light, breathable, and versatile, Chahat is perfect for casual outings, festive gatherings, and relaxed day-to-evening wear.",
    images: [
      "/Chahat/Chahat1.png",
      "/Chahat/Chahat4.png",
      "/Chahat/Chahat2.png",
      "/Chahat/Chahat3.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "pooja",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Loved the versatility! The detachable jacket gives two completely different looks, and the cotton fabric feels so soft. The corset back is a beautiful touch",
      },
      {
        name: "Aditi",
        date: "2025-06-07",
        rating: 4,
        comment:
          ". The mint green color is so refreshing and elegant. I love how versatile Chahat is—you can style it with or without the jacket. The corset back gives a really nice fit",
      },
    ],
  },
  // {
  //   id: "Mayuri",
  //   name: "Mayuri",
  //   price: 599,
  //   shortDescription:
  //     "Mayuri is a pure cotton short-top kurti featuring a chic zig-zag style slit at the bottom a perfect blend of trend and desi aesthetics.",
  //   longDescription:
  //     "Introducing Mayuri, a pure cotton short-top kurti designed for women who love modern fashion with a traditional touch. Its standout feature—a zig-zag styled bottom slit—adds movement, charm, and a contemporary edge to the classic kurti look. Soft, breathable, and stylish, Mayuri is the perfect mix of trend and desi aesthetics, ideal for everyday wear, outings, or casual festive styling.",
  //   images: [
  //     "/Mayuri/Mayuri1.PNG",
  //     "/Mayuri/Mayuri2.png",
  //     "/Mayuri/Mayuri3.png",
  //     "/Mayuri/Mayuri4.PNG",
  //   ],
  //   category: "clothing",
  //   inStock: true,
  //   sizes: [
  //     { label: "XXS", inStock: true },
  //     { label: "XS", inStock: true },
  //     { label: "S", inStock: true },
  //     { label: "M", inStock: true },
  //     { label: "L", inStock: true },
  //     { label: "XL", inStock: true },
  //   ],
  //   reviews: [
  //     {
  //       name: "Alisha",
  //       date: "2025-05-14",
  //       rating: 5,
  //       comment:
  //         "The zig-zag slit at the bottom is such a cute detail! Mayuri feels super comfortable and looks stylish without trying too hard.",
  //     },
  //     {
  //       name: "Riya",
  //       date: "2025-06-07",
  //       rating: 4,
  //       comment:
  //         ". Loved the mix of trendy and traditional. The cotton fabric is soft and perfect for everyday wear. The zig-zag design really stands out.",
  //     },
  //   ],
  // },
  {
    id: "Srishti",
    name: "Srishti ",
    price: 699,
    shortDescription:
      "Srishti is a pure cotton 2-in-1 kurti with a noodle-strap inner, detachable jacket, and a stylish corset back",
    longDescription:
      "Meet Srishti , the kurti that blends comfort with contemporary charm. Made from breathable pure cotton, this unique 2-in-1 design includes a chic noodle-strap inner kurti complemented by a detachable jacket, allowing you to switch between looks effortlessly. The beautifully crafted corset back adds a touch of sophistication and ensures a flattering fit. Whether you're dressing up for a festive event or keeping it casual, Srishti adapts to your style with ease and grace",
    images: [
      "/Srishti/Srishti1.PNG",
      "/Srishti/Srishti2.PNG",
      "/Srishti/Srishti3.PNG",
      "/Srishti/Srishti4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Kavya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Loved the versatility! The detachable jacket gives two completely different looks, and the cotton fabric feels so soft. The corset back is a beautiful touch",
      },
      {
        name: "Sneha",
        date: "2025-06-07",
        rating: 4,
        comment:
          ". Srishti is perfect for both casual and festive wear. The fit is amazing, and the noodle-strap kurti is super comfortable. Totally worth it!",
      },
    ],
  },
  {
    id: "ayushi",
    name: "Ayushi",
    price: 699,
    shortDescription:
      "Ayushi is a pure cotton 2-in-1 kurti with a noodle-strap inner, detachable jacket, and a stylish corset back",
    longDescription:
      "Meet Ayushi, the kurti that blends comfort with contemporary charm. Made from breathable pure cotton, this unique 2-in-1 design includes a chic noodle-strap inner kurti complemented by a detachable jacket, allowing you to switch between looks effortlessly. The beautifully crafted corset back adds a touch of sophistication and ensures a flattering fit. Whether you're dressing up for a festive event or keeping it casual, Ayushi adapts to your style with ease and grace",
    images: [
      "/Ayushi/Ayushi1.PNG",
      "/Ayushi/Ayushi2.PNG",
      "/Ayushi/Ayushi3.PNG",
      "/Ayushi/Ayushi4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Ananya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Loved the versatility! The detachable jacket gives two completely different looks, and the cotton fabric feels so soft. The corset back is a beautiful touch",
      },
      {
        name: "Ishita",
        date: "2025-06-07",
        rating: 4,
        comment:
          ". Ayushi is perfect for both casual and festive wear. The fit is amazing, and the noodle-strap kurti is super comfortable. Totally worth it!",
      },
    ],
  },
  {
    id: "khushi",
    name: "Khushi",
    price: 769,
    shortDescription:
      "Khushi is a premium velvet winter kurti featuring adorable collar detailing for a warm and stylish look..",
    longDescription:
      "Introducing Khushi, a premium velvet kurti crafted to keep you warm while elevating your winter style. Soft, luxurious, and beautifully tailored, Khushi features charming collar detailing that adds a playful yet elegant touch. Perfect for chilly days, festive gatherings, or cozy outings, this kurti blends comfort, sophistication, and seasonal charm in the most effortless way",
    images: [
      "/Khushi/Khushi1.png",
      "/Khushi/Khushi2.png",
      "/Khushi/Khushi3.png",
      "/Khushi/Khushi4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Tanya",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Khushi is perfect for winter! The velvet feels so soft and luxurious, and the cute collar makes it look effortlessly stylish.",
      },
      {
        name: "Nisha",
        date: "2025-06-07",
        rating: 4,
        comment:
          ". A must-have for winter! The fit is great, the fabric is premium, and the collar detailing adds the perfect charm. Totally worth it",
      },
    ],
  },
  {
    id: "nazakat",
    name: "Nazakat",
    price: 649,
    shortDescription:
      "Nazakat is a graceful georgette kurti featuring elegant bell sleeves, a corset back, and double lining for added comfort. Flowing and feminine, it’s designed to make a subtle yet striking statement.",
    longDescription:
      "Nazakat is a flowy georgette kurti that exudes quiet elegance. It features romantic bell sleeves and a structured corset back for a flattering shape. Designed with double lining, it offers both comfort and coverage without compromising on style. The lightweight georgette drapes beautifully, perfect for special occasions or evening wear. Nazakat moves with grace and ease, capturing attention with every step. A timeless piece that balances softness with strength.",
    images: [
      "/Nazakat/Nazakat1.webp",
      "/Nazakat/Nazakat2.webp",
      "/Nazakat/Nazakat3.webp",
      "/Nazakat/Nazakat4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Sana",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The bell sleeves are so elegant and the corset back gives a lovely shape. The georgette drapes beautifully.",
      },
      {
        name: "Farah",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Really like the graceful flow of the fabric. The double lining makes it comfortable while keeping the design stylish.",
      },
    ],
  },
  {
    id: "masakali",
    name: "Masakali",
    price: 649,
    shortDescription:
      "Masakali is a breezy blue georgette kurti with delicate white prints, featuring elegant bell sleeves and a flattering corset back. Light, airy, and effortlessly graceful, it’s made for days when you want to feel free yet put-together.",
    longDescription:
      "Masakali is a dreamy georgette kurti in a soft blue shade adorned with subtle white prints. It features graceful bell sleeves and a corset back that adds shape without sacrificing comfort. Lightweight and flowy, the georgette fabric drapes beautifully with every movement. Designed for ease and elegance, it's ideal for daytime outings or relaxed festive gatherings. The airy silhouette and thoughtful detailing make it a versatile, go-to piece. Masakali is where comfort meets charm — effortlessly and beautifully.",
    images: [
      "/Masakali/Masakali1.webp",
      "/Masakali/Masakali2.webp",
      "/Masakali/Masakali3.webp",
      "/Masakali/Masakali4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The blue shade with white prints is so calming and pretty. The bell sleeves give it such a graceful look.",
      },
      {
        name: "Sneha",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Very airy and flowy, perfect for warm days. The corset back adds structure without losing comfort.",
      },
    ],
  },
  {
    id: "neelam",
    name: "Neelam",
    price: 599,
    shortDescription:
      "100% cotton, short kurti with full sleeves and back tie up for stretched waist",
    longDescription:
      "Sleek, stylish, and subtly bold—the Neelam Kurti features a crisp square neckline, elegant full sleeves, and a tie-up back that perfectly snatches the waist. A modern essential for everyday chic.",
    images: [
      "/Neelam/Neelam1.png",
      "/Neelam/Neelam2.PNG",
      "/Neelam/Neelam3.PNG",
      "/Neelam/Neelam4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: false },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Shreya",
        date: "2025-05-10",
        rating: 5,
        comment:
          "The square neckline and full sleeves look so chic. The tie-up back gives a perfect fit.",
      },
      {
        name: "Garima",
        date: "2025-06-20",
        rating: 4,
        comment:
          "Love the cotton fabric and the modern design. Great for everyday wear!",
      },
    ],
  },
  {
    id: "piku",
    name: "Piku",
    price: 599,
    shortDescription:
      "short kurti with full sleeves and back tie up for stretched waist",
    longDescription:
      "Timeless and fresh, the Piku Kurti in classic white features a sharp square neckline, graceful full sleeves, and a chic tie-up back to accentuate your waist. Perfect for effortless elegance any day.",
    images: [
      "/Piku/Piku1.jpg",
      "/Piku/Piku2.PNG",
      "/Piku/Piku3.PNG",
      "/Piku/Piku4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Vandana",
        date: "2025-05-16",
        rating: 5,
        comment:
          "The white color is so classic and the square neckline is very flattering. Love the tie-up back!",
      },
      {
        name: "Deepa",
        date: "2025-06-11",
        rating: 4,
        comment:
          "Full sleeves make it perfect for any season. The fit is amazing and very comfortable.",
      },
    ],
  },
  {
    id: "durga",
    name: "Durga",
    price: 899,
    shortDescription:
      "Durga is a bold black top featuring intricate lace detailing and a dramatic backless design. Long in the front and daring at the back, it’s a perfect blend of elegance and edge.",
    longDescription:
      "Durga is a striking black top designed to make a statement. It features delicate lace detailing in the front, adding a touch of softness to its bold silhouette. The front is elongated for a graceful fall, while the back is open and dramatic — completely backless. Perfect for evening outings or special events, it balances mystery and elegance effortlessly. Durga is confidence stitched into fabric, made for those who dress with intention. Pair it with fitted bottoms or a skirt to let the top speak for itself.",
    images: [
      "/Durga/Durga1.webp",
      "/Durga/Durga2.webp",
      "/Durga/Durga3.webp",
      "/Durga/Durga4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: true },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Simran",
        date: "2025-09-09",
        rating: 5,
        comment:
          "Absolutely love the dramatic backless design! The lace details in the front balance it so well — elegant yet daring.",
      },
      {
        name: "Avni",
        date: "2025-09-10",
        rating: 4,
        comment:
          "The fit is great and it looks very stylish for evening outings. Would have loved a bit more lining, but overall stunning!",
      },
    ],
  },
  {
    id: "shakti",
    name: "Shakti",
    price: 899,
    shortDescription:
      "Shakti is a powerful red top with intricate lace detailing and a dramatic backless design. Long in the front and open at the back, it’s made to turn heads with elegance and fire.",
    longDescription:
      "Shakti is a bold and beautiful red top that commands attention. Featuring delicate lace detailing in the front, it brings softness to its striking silhouette. The front drapes long and elegantly, while the open back adds a daring edge. Crafted for evenings that call for confidence and grace, it’s both sensual and sophisticated. Perfectly paired with sleek bottoms or statement jewelry, Shakti lets your presence speak. It’s not just a top — it’s power in red.",
    images: [
      "/Shakti/Shakti1.webp",
      "/Shakti/Shakti2.webp",
      "/Shakti/Shakti3.webp",
      "/Shakti/Shakti4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Rhea",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The vibrant red is absolutely stunning! The lace adds elegance, and the open back makes it bold and unforgettable.",
      },
      {
        name: "Tanvi",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Really love the design — it’s powerful and chic. The long front drape makes it graceful while the back is super dramatic.",
      },
    ],
  },
  {
    id: "harsha",
    name: "Harsha",
    price: 599,
    shortDescription:
      "Harsha is a pure cotton yellow short kurti with a round neck and delicate noodle straps. It features lively floral prints, making it a cheerful and breezy option for sunny days.",
    longDescription:
      "Harsha is a vibrant yellow short kurti crafted from pure cotton, designed for comfort and effortless style. Featuring a round neck and fine noodle straps, it's adorned with playful floral prints that add a touch of freshness. Lightweight and airy, it's ideal for casual summer outings or lounging in style. Pair it with denims or skirts for a fun, relaxed look.",
    images: [
      "/Harsha/Harsha1.jpg",
      "/Harsha/Harsha2.jpg",
      "/Harsha/Harsha3.jpg",
      "/Harsha/Harsha4.jpg",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-07-09",
        rating: 5,
        comment:
          "Love the vibrant yellow color and beautiful floral prints! The cotton fabric is so soft and breathable.",
      },
      {
        name: "Khushi",
        date: "2025-07-09",
        rating: 4,
        comment:
          "The noodle straps are delicate and the round neck is flattering. Perfect for summer days!",
      },
    ],
  },
  {
    id: "radha",
    name: "Radha",
    price: 599,
    shortDescription:
      "Radha is a green pure cotton kurti designed for comfort and style. It features elegant side knots on both sides, adding a modern twist to its traditional charm.",
    longDescription:
      "Radha is a pure cotton kurti in a soothing green shade. Soft, breathable, and perfect for everyday wear. Features stylish side knots on both sides. Adds a unique twist to a classic design. Comfortable fit with a touch of elegance. Ideal for casual outings or daily wear. Pairs well with jeans, leggings, or palazzos. Easy to style and gentle on the skin. Simple yet effortlessly chic. Radha brings comfort and style together.",
    images: [
      "/Radha/Radha1.jpg",
      "/Radha/Radha2.jpg",
      "/Radha/Radha3.jpg",
      "/Radha/Radha4.jpg",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Ishita",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The soothing green color is beautiful and the side knots add such a unique touch! Very comfortable for daily wear.",
      },
      {
        name: "Meera",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Love the modern twist with side knots on a classic kurti. The cotton fabric is soft and breathable, perfect for summers.",
      },
    ],
  },
  {
    id: "sanjh",
    name: "Sanjh",
    price: 649,
    shortDescription:
      "Sanjh is a chic one-shoulder kurti in a soft butter yellow hue, crafted from pure cotton. Featuring a unique blend of a single sleeve on one side and delicate noodle straps on the other, it effortlessly blends tradition with a modern twist.",
    longDescription:
      "Sanjh is a stylish one-shoulder kurti made from pure cotton. It features a full sleeve on one side and noodle straps on the other. The asymmetrical design adds a modern, playful twist. Soft butter yellow brings a calm, sunny charm. Lightweight and breathable for all-day comfort. Perfect for brunches, gatherings, or casual evenings. Pair it with trousers, skirts, or even jeans. Effortlessly blends tradition with contemporary style. A subtle statement for the modern woman. Sanjh is where comfort meets quiet elegance.",
    images: [
      "/Sanjh/Sanjh1.webp",
      "/Sanjh/Sanjh2.webp",
      "/Sanjh/Sanjh3.webp",
      "/Sanjh/Sanjh4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Naina",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The one-shoulder design with a sleeve on one side and noodle strap on the other is so unique! The butter yellow shade is soft and elegant.",
      },
      {
        name: "Tanya",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Really like the modern asymmetrical look. The cotton fabric feels light and airy, perfect for day outings.",
      },
    ],
  },
  {
    id: "shreya",
    name: "Shreya",
    price: 599,
    shortDescription:
      "Shreya is a striking red kurti with a sweetheart neckline and corset-style back, crafted from pure cotton. Designed with breathable fabric, it combines elegance and comfort for a confident, modern look.",
    longDescription:
      "Shreya is a vibrant red kurti made from pure, breathable cotton. It features a romantic sweetheart neckline and a structured corset back for a flattering fit. Designed to balance comfort with bold style, it’s perfect for festive days or evening outings. The airy fabric keeps you cool while adding a graceful flow to every move. Pair it with flared pants or a sleek skirt for an effortlessly elegant look. Shreya is where timeless charm meets modern edge.",
    images: [
      "/Shreya/Shreya1.png",
      "/Shreya/Shreya2.webp",
      "/Shreya/Shreya3.webp",
      "/Shreya/Shreya4.webp",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Aditi",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The sweetheart neckline and corset back give such a flattering fit. The red is vibrant and perfect for festive wear.",
      },
      {
        name: "Rhea",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Love the bold yet elegant style. The cotton fabric keeps it comfortable even for long wear.",
      },
    ],
  },
  {
    id: "barkha",
    name: "Barkha",
    price: 649,
    shortDescription:
      "Crafted in pure cotton, this elegant piece features graceful bell sleeves and a chic corset back for a modern twist on tradition",
    longDescription:
      "The Barkha Kurti blends comfort with elegance. Made from pure cotton, it's breathable and perfect for all day wear. Featuring graceful bell sleeves and a flattering corset back, this kurti adds a modern twist to a classic silhouette,ideal for both casual outings and festive occasions.",
    images: [
      "/Barkha/Barkha1.png",
      "/Barkha/Barkha2.png",
      "/Barkha/Barkha3.png",
      "/Barkha/Barkha4.png",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Sita",
        date: "2025-08-15",
        rating: 5,
        comment:
          "The graceful bell sleeves are so elegant and the corset back gives a perfect fit! Modern yet traditional.",
      },
      {
        name: "Sarla",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Love the pure cotton fabric and the unique corset back design. Great for both casual and festive wear.",
      },
    ],
  },
  {
    id: "monika",
    name: "Monika",
    price: 599,
    shortDescription: "100% cotton, halter neck kurti",
    longDescription:
      "Fresh and fearless, the Monika Kurti shines in a breezy mint green. Made from pure cotton with double lining, it features a flattering halter neck and striking backless design, blending comfort with contemporary charm.",
    images: [
      "/Monika/Monika1.png",
      "/Monika/Monika2.PNG",
      "/Monika/Monika3.PNG",
      "/Monika/Monika4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Aarushi",
        date: "2025-05-15",
        rating: 5,
        comment:
          "Absolutely love the mint green color and the halter neck! The cotton fabric is so comfortable for all-day wear.",
      },
      {
        name: "Simran",
        date: "2025-06-03",
        rating: 5,
        comment:
          "The backless design is so unique and stylish. Double lining makes it feel premium and soft.",
      },
    ],
  },
  {
    id: "naina",
    name: "Naina",
    price: 599,
    shortDescription: "100% cotton, halter neck kurti",
    longDescription:
      "Make a striking impression with the Naina Kurti, crafted from pure cotton with a soft double lining for comfort and elegance. The halter neck, deep blue shade, and bold backless cut bring a perfect mix of grace and modern flair.",
    images: [
      "/Naina/Naina1.PNG",
      "/Naina/Naina2.PNG",
      "/Naina/Naina3.PNG",
      "/Naina/Naina4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Riya",
        date: "2025-05-20",
        rating: 5,
        comment:
          "The deep blue color is stunning and the cotton fabric feels so soft. The halter neck is very flattering.",
      },
      {
        name: "Tanvi",
        date: "2025-06-15",
        rating: 5,
        comment:
          "Love the bold backless design! It's both graceful and modern, perfect for any event.",
      },
    ],
  },
  {
    id: "heer",
    name: "Heer",
    price: 599,
    shortDescription: "halter neck kurti",
    longDescription:
      "Delicate yet daring, the Heer Kurti comes in a soft light pink shade, crafted from pure cotton with double lining for comfort and grace. Its elegant halter neck and backless style blend femininity with a bold, modern touch.",
    images: [
      "/Heer/Heer1.PNG",
      "/Heer/Heer2.PNG",
      "/Heer/Heer3.PNG",
      "/Heer/Heer4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Isha",
        date: "2025-05-12",
        rating: 5,
        comment:
          "The light pink color is so pretty and feminine. The halter neck and backless style are very trendy.",
      },
      {
        name: "Neha",
        date: "2025-06-05",
        rating: 4,
        comment:
          "Super comfortable and the double lining is a great feature. Love the modern yet delicate look.",
      },
    ],
  },
  {
    id: "geet",
    name: "Geet",
    price: 599,
    shortDescription: "100% cotton, halter neck kurti",
    longDescription:
      "Bold and beautiful, the Geet Kurti stuns in a rich dark green hue. Made from pure cotton with double lining, it offers all-day comfort with a luxe feel. Featuring a flattering halter neck and daring backless design, it's perfect for making a stylish statement.",
    images: [
      "/Geet/Geet1.jpg",
      "/Geet/Geet2.PNG",
      "/Geet/Geet3.PNG",
      "/Geet/Geet4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Aditi",
        date: "2025-05-08",
        rating: 5,
        comment:
          "The dark green color is so bold and eye-catching. The halter neck fits beautifully.",
      },
      {
        name: "Kavya",
        date: "2025-06-18",
        rating: 5,
        comment:
          "Love the comfort of the cotton and the double lining. The backless design is a real showstopper!",
      },
    ],
  },
  {
    id: "babita",
    name: "Babita",
    price: 599,
    shortDescription: "Kurti with high side slits",
    longDescription:
      "Bold and stylish, the Babita Kurti in classic black features daring high side slits for a contemporary edge. Perfect for making a statement with effortless confidence.",
    images: [
      "/Babita/Babita1.PNG",
      "/Babita/Babita2.PNG",
      "/Babita/Babita3.PNG",
      "/Babita/Babita4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Sonal",
        date: "2025-05-25",
        rating: 4,
        comment:
          "The high side slits give this kurti a modern twist. The black color is always in style.",
      },
      {
        name: "Divya",
        date: "2025-06-12",
        rating: 5,
        comment:
          "Very comfortable and easy to style. The slits make it perfect for both casual and party looks.",
      },
    ],
  },
  {
    id: "rekha",
    name: "Rekha",
    price: 599,
    shortDescription: "Noodle strap kurti",
    longDescription:
      "Feminine and flirty, the Rekha Kurti features delicate noodle straps and a lovely pink shade, perfect for warm days and casual outings. This short kurti combines simplicity with subtle elegance.",
    images: [
      "/Rekha/Rekha1.PNG",
      "/Rekha/Rekha2.PNG",
      "/Rekha/Rekha3.PNG",
      "/Rekha/Rekha4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Sneha",
        date: "2025-05-18",
        rating: 5,
        comment:
          "The noodle straps are perfect for summer! The pink color is so pretty and feminine.",
      },
      {
        name: "Anjali",
        date: "2025-06-22",
        rating: 4,
        comment:
          "Simple yet elegant design. Great for casual outings and feels very comfortable.",
      },
    ],
  },
    {
    id: "meera",
    name: "Meera",
    price: 599,
    shortDescription: "100% cotton, short Asymmetrical Kurti",
    longDescription:
      "Bold and unique, the Meera Kurti in warm rust features trendy tie-up sleeve straps and a stylish asymmetrical cut for a modern, edgy look. Perfect for those who love to stand out with effortless style.",
    images: [
      "/Meera/Meera1.PNG",
      "/Meera/Meera2.PNG",
      "/Meera/Meera3.PNG",
      "/Meera/Meera4.PNG",
    ],
    category: "clothing",
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Pooja",
        date: "2025-05-14",
        rating: 5,
        comment:
          "The asymmetrical cut is so stylish and modern. The rust color is very unique.",
      },
      {
        name: "Bhavna",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Love the tie-up sleeve straps! The cotton fabric is soft and comfortable.",
      },
    ],
  },
  {
    id: "neha",
    name: "Neha",
    price: 599,
    shortDescription:
      "Neha is a pure cotton short kurti featuring delicate noodle straps and a round neck. Its white base is adorned with vibrant multicolour floral prints, making it a breezy and stylish pick for summer days",
    longDescription:
      "Neha is a pure cotton short kurti with a round neck and delicate noodle straps. Its white base is brightened with multicolour floral prints, giving it a fresh, summery vibe. Lightweight and breezy, it's perfect for casual days out or relaxed indoor wear. Pair it with jeans, shorts, or skirts for an effortlessly chic look.",
    images: [
      "/Neha/Neha1.jpg",
      "/Neha/Neha2.jpg",
      "/Neha/Neha3.jpg",
      "/Neha/Neha4.jpg",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Ananya",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The multicolour floral prints on the white base look so fresh and summery! The cotton fabric feels super light and comfy, perfect for hot days.",
      },
      {
        name: "Kritika",
        date: "2025-09-10",
        rating: 4,
        comment:
          "Love the round neck and noodle straps design. It’s stylish yet casual, and the breezy fit makes it great for everyday wear.",
      },
    ],
  },
   {
    id: "Hema",
    name: "Hema",
    price: 599,
    shortDescription:
      "Crafted in pure cotton, this feminine piece features a soft sweetheart neckline and a flattering corset back.",
    longDescription:
      "The Hema Kurti is made from breathable pure cotton, designed for comfort and elegance. A soft sweetheart neckline brings a romantic touch, while the corset back adds a modern, form-enhancing detail. Feminine and flattering, Hema is perfect for both everyday grace and special moments.",
    images: [
      "/Hema/Hema1.png",
      "/Hema/Hema2.png",
      "/Hema/Hema3.png",
      "/Hema/Hema4.png",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Khushi",
        date: "2025-08-15",
        rating: 5,
        comment:
          "The soft sweetheart neckline is so romantic and feminine! The corset back gives a beautiful silhouette.",
      },
      {
        name: "Saumya",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Love the cotton fabric and the elegant design. Perfect for both everyday wear and special occasions.",
      },
    ],
  },
   {
    id: "mastani",
    name: "Mastani",
    price: 599,
    shortDescription: "halter neck kurti",
    longDescription:
      "Grace meets bold in the Mastani Kurti, tailored in pure cotton with a soft double lining for extra comfort and coverage. Its elegant halter neck, timeless white hue, and daring backless design make it a standout for any occasion.",
    images: [
      "/Mastani/Mastani1.png",
      "/Mastani/Mastani2.webp",
      "/Mastani/Mastani3.PNG",
      "/Mastani/Mastani4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-05-28",
        rating: 5,
        comment:
          "The white color is so elegant and the halter neck fits perfectly. Love the bold backless style!",
      },
      {
        name: "Megha",
        date: "2025-06-10",
        rating: 4,
        comment:
          "Super comfortable and the double lining adds a nice touch. Great for both casual and special occasions.",
      },
    ],
  },
    {
    id: "sajni-sajan-combo",
    name: "Sajni & Sajan Combo",
    price: 1119,
    shortDescription:
      "Sajni & Sajan is a pure cotton couple set featuring desi-inspired prints and a soft, breathable feel—perfect for stylish twinning with comfort and charm.",
    longDescription:
      "Sajni & Sajan is a beautifully crafted couple set made from pure cotton, designed for comfort, culture, and effortless style. Inspired by desi aesthetics and traditional prints, this set brings together timeless charm and modern elegance. Soft on the skin and breathable for all-day wear, it’s perfect for festive moments, casual outings, or cozy celebrations together. With coordinated prints and a graceful vibe, Sajni & Sajan lets you and your partner twin in style while staying true to your roots.",
    images: [
      "/Sajni-Sajan/SS1.WEBP",
      "/Sajni-Sajan/Ss2.WEBP",
      "/Sajni-Sajan/SS3.WEBP",
    ],
    category: "clothing",
    inStock: false,
    isCombo: false,
    comboItems: [
      {
        id: "sajni",
        name: "Sajni (Women's Kurti)",
        sizes: [
          { label: "XXS", inStock: false },
          { label: "XS", inStock: false },
          { label: "S", inStock: false },
          { label: "M", inStock: false },
          { label: "L", inStock: false },
          { label: "XL", inStock: false },
        ],
        heights: [
          { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
          { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
          { label: "5'6\" and above", value: "5-6-and-above", default: false },
        ],
      },
      {
        id: "sajan",
        name: "Sajan (Men's Shirt)",
        sizes: [
          { label: "XXS", inStock: false },
          { label: "XS", inStock: false },
          { label: "S", inStock: false },
          { label: "M", inStock: false },
          { label: "L", inStock: false },
          { label: "XL", inStock: false },
          { label: "XXL", inStock: false },
        ],
      },
    ],
    reviews: [
      {
        name: "Harshit",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! The fabric is so soft and comfortable. We wore it for a family function and got so many compliments. The desi prints look even better in real life. Totally worth it!",
      },
      {
        name: "Gaurav",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Perfect for twinning! Bought this for me and my partner and we're obsessed! The fit is great and the cotton feels very breathable. Looks super cute in pictures too.",
      },
    ],
  },
 {
    id: "ambika",
    name: "Ambika",
    price: 1599,
    shortDescription:
      "Ambika is a powerful black set featuring our signature backless lace top Durga paired with a full-flared, double-lined skirt. Fierce, fluid, and unapologetically bold.<br>View Size Chart For Skirt for the perfect fit.",
    longDescription:
      "Ambika is a statement in all black a striking set that pairs the dramatic lace-back kurti with a voluminous, double-lined skirt. The top flows long in the front and daringly open at the back, while the skirt brings movement and depth with its full flare. Together, they create a look that’s equal parts elegance and attitude — made for presence, not subtlety.",
    images: [
      "/Ambika/Ambika1.png",
      "/Ambika/Ambika2.png",
      "/Ambika/Ambika3.png",
      "/Ambika/Ambika4.png",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Priya",
        date: "2025-08-15",
        rating: 5,
        comment:
          "Absolutely stunning set! The backless lace top is so dramatic and the full-flared skirt flows beautifully. Perfect for special occasions.",
      },
      {
        name: "Kavya",
        date: "2025-09-19",
        rating: 5,
        comment:
          "The all-black look is so powerful and elegant. Love how the double-lined skirt moves when I walk. Definitely a statement piece!",
      },
      {
        name: "Anita",
        date: "2025-09-19",
        rating: 4,
        comment:
          "The lace detailing on the top is exquisite and the skirt has such a lovely volume. Great quality fabric and fits perfectly.",
      },
    ],
  },
  {
    id: "heer-ranjha-combo",
    name: "Heer Ranjha Combo",
    price: 1119,
    shortDescription:
      "Heer Ranjha is a pure cotton couple set with a corset-back shirt for her and a brown desi-print shirt for him—perfect for romantic twinning with comfort and style.",
    longDescription:
      "Heer Ranjha is a timeless couple set inspired by classic romance and desi aesthetics. Crafted from pure cotton, this set blends comfort with statement style. For her, the shirt features a flattering corset-style back that adds a modern, feminine touch while keeping the look elegant and graceful. For him, the brown shirt with desi-inspired prints offers a rich, earthy vibe that feels both traditional and trendy. Breathable, soft, and stylish, Heer Ranjha is perfect for festive days, date outings, cultural events, or simply twinning in effortless charm.",
    images: [
      "/Heer-Ranjha/HR1.WEBP",
      "/Heer-Ranjha/HR2.WEBP",
      "/Heer-Ranjha/HR3.WEBP",
      "/Heer-Ranjha/HR4.WEBP",
    ],
    category: "clothing",
    inStock: false,
    isCombo: false,
    comboItems: [
      {
        id: "heer",
        name: "Heer (Women's Kurti)",
        sizes: [
          { label: "XXS", inStock: false },
          { label: "XS", inStock: false },
          { label: "S", inStock: false },
          { label: "M", inStock: false },
          { label: "L", inStock: false },
          { label: "XL", inStock: false },
        ],
        heights: [
          { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
          { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
          { label: "5'6\" and above", value: "5-6-and-above", default: false },
        ],
      },
      {
        id: "ranjha",
        name: "Ranjha (Men's Shirt)",
        sizes: [
          { label: "XXS", inStock: false },
          { label: "XS", inStock: false },
          { label: "S", inStock: false },
          { label: "M", inStock: false },
          { label: "L", inStock: false },
          { label: "XL", inStock: false },
          { label: "XXL", inStock: false },
        ],
      },
    ],
    reviews: [
      {
        name: "Harshit",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Absolutely loved it! The corset-back shirt looks stunning on my partner and the brown shirt for me has such a rich, earthy vibe. Perfect for romantic twinning!",
      },
      {
        name: "Shreya",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Perfect blend of traditional and modern! This set looks very desi but still feels trendy. The brown shade is beautiful and the fabric is super soft.",
      },
    ],
  },
    {
    id: "kishore",
    name: "Kishore",
    gender: "male",
    price: 659,
    shortDescription:
      "Kishore is a brown pure cotton men’s shirt that carries a warm desi vibe. Comfortable, breathable, and effortlessly stylish for everyday wear..",
    longDescription:
      "The Kishore shirt in earthy brown is crafted from 100% pure cotton, offering unmatched comfort and breathability. Inspired by classic desi aesthetics, it features a relaxed yet polished look that works well for both casual and semi-traditional occasions. Soft on the skin and easy to style, Kishore pairs beautifully with jeans, chinos, or ethnic bottoms making it a versatile staple for a grounded, authentic wardrobe.",
    images: [
      "/Kishore/Kishore1.PNG",
      "/Kishore/Kishore2.PNG",
      "/Kishore/Kishore3.PNG",
      "/Kishore/Kishore4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXXS", inStock: false },
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: true },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "harshit",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Very comfortable and light. The color is exactly as shown and gives a nice earthy vibe. Definitely my go-to shirt for casual outings.",
      },
      {
        name: "gaurav",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Nice desi aesthetic and feels very natural. Fits well with jeans or ethnic pants. Worth the price!.",
      },
    ],
  },
  {
    id: "Manoj",
    name: "Manoj",
    gender: "male",
    price: 659,
    shortDescription:
      "Manoj is a bold black and red pure cotton men’s shirt with a strong desi touch. Comfortable, breathable, and perfect for everyday or festive wear.",
    longDescription:
      "The Manoj shirt blends classic desi aesthetics with a striking black and red color combination. Made from 100% pure cotton, it offers excellent breathability and all-day comfort, making it ideal for warm weather. The bold colors add character while keeping the look rooted and authentic. Easy to style with jeans, trousers, or ethnic bottoms, Manoj works effortlessly for casual outings, festive gatherings, and relaxed traditional wear.",
    images: [
      "/Manoj/Manoj1.PNG",
      "/Manoj/Manoj2.PNG",
      "/Manoj/Manoj3.PNG",
      "/Manoj/Manoj4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXXS", inStock: false },
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Kartik",
        date: "2025-05-14",
        rating: 5,
        comment:
          "Very stylish shirt. The black and red combo looks powerful and the cotton fabric feels great on the skin.",
      },
      {
        name: "Parth",
        date: "2025-06-07",
        rating: 4,
        comment:
          "Comfortable and breathable. Has a nice desi vibe and fits well. Good for both casual and festive use.",
      },
    ],
  },
   {
    id: "gauri",
    name: "Gauri",
    price: 899,
    shortDescription:
      "Gauri is a striking purple top with delicate lace detailing and a bold backless cut. Flowing in the front and fearless at the back, it brings together elegance and edge with effortless ease.",
    longDescription:
      "Gauri is a bold purple kurti that blends classic charm with a daring twist. Featuring soft lace details and a striking backless design, it’s graceful in the front and fearless at the back. Whether styled up or down, Gauri is made for moments when you want to stand out — without saying a word",
    images: [
      "/Gauri/Gauri1.png",
      "/Gauri/Gauri2.jpg",
      "/Gauri/Gauri3.png",
      "/Gauri/Gauri4.png",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Shreya",
        date: "2025-09-19",
        rating: 5,
        comment:
          "The purple color is absolutely gorgeous! The lace detailing adds such elegance and the backless design is so bold and beautiful.",
      },
      {
        name: "Rhea",
        date: "2025-09-19",
        rating: 5,
        comment:
          "Love how it flows in the front and is fearless at the back. Perfect blend of classic charm with a daring twist. Gets compliments every time!",
      },
      {
        name: "Meera",
        date: "2025-09-12",
        rating: 4,
        comment:
          "The soft lace details are beautiful and the striking backless design makes it perfect for special occasions. Very well made!",
      },
    ],
  },
  {
    id: "Mehak",
    name: "Mehak",
    price: 749,
    shortDescription:
      "Mehak Kurti is a chic, padded, backless kurti crafted from pure cotton. Designed in a rich brown color, it offers comfort with a bold, elegant silhouette.",
    longDescription:
      "The Mehak Kurti blends comfort with contemporary style. Made from breathable pure cotton, this brown kurti features built-in padding for support and a stylish backless design that adds a modern edge. Lightweight and comfortable, it is perfect for warm days, casual gatherings, or festive styling when paired with statement accessories.",
    images: [
      "/Mehak/Mehak1.PNG",
      "/Mehak/Mehak2.PNG",
      "/Mehak/Mehak3.PNG",
      "/Mehak/Mehak4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Riya",
        date: "2025-05-10",
        rating: 5,
        comment:
          "The backless design is so chic! Perfect for summer days. The padding gives good support and the brown color is beautiful.",
      },
      {
        name: "Shreya",
        date: "2025-06-02",
        rating: 4,
        comment:
          "Love the modern edge this kurti has. The cotton is breathable and the fit is really comfortable. Great for casual outings.",
      },
    ],
  },
  {
    id: "badal",
    name: "Badal",
    price: 769,
    shortDescription:
      "Add a touch of elegance to your wardrobe with the Badal kurti, crafted from luxurious printed velvet. Its stunning blend of white, blue, and orange hues creates a vibrant yet graceful look perfect for festive or casual occasions.",
    longDescription:
      "Embrace effortless sophistication with our Badal kurti, designed in soft and sumptuous velvet fabric. The kurti features an exquisite white base adorned with blue and orange prints, bringing a refreshing fusion of tradition and modern style. Perfect for festive gatherings, evening outings, or special occasions, Badal offers comfort, style, and a hint of regal charm making it a standout piece",
    images: [
      "/Badal/Badal1.PNG",
      "/Badal/Badal2.PNG",
      "/Badal/Badal3.PNG",
      "/Badal/Badal4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Anjali",
        date: "2025-05-14",
        rating: 5,
        comment:
          "The color combo is chef's kiss! Looks even better in person 💙🧡",
      },
      {
        name: "Kajal",
        date: "2025-06-07",
        rating: 4,
        comment: "Wore it for a family gathering and got endless compliments!",
      },
    ],
  },
  {
    id: "mishti",
    name: "Mishti",
    price: 769,
    shortDescription:
      "Add a pop of colour to your wardrobe with Mishti, a premium black velvet kurti featuring vibrant multicolour prints. Chic, comfortable, and effortlessly elegant perfect for any festive or evening occasion.",
    longDescription:
      "Redefine festive elegance with Mishti, crafted in rich premium black velvet and adorned with striking multicolour prints. The contrast of bold hues against the deep black fabric brings a perfect blend of sophistication and vibrance. Designed for comfort and style, Mishti is ideal for celebrations, evening gatherings, or anytime you want to make a subtle yet stunning statement.",
    images: [
      "/Mishti/Mishti1.PNG",
      "/Mishti/Mishti2.png",
      "/Mishti/Mishti3.png",
      "/Mishti/Mishti4.png",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: true },
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    reviews: [
      {
        name: "Aakriti",
        date: "2025-05-14",
        rating: 5,
        comment:
          "The black velvet feels so luxe, and those colourful prints just pop! Totally obsessed.",
      },
      {
        name: "Sanjana",
        date: "2025-06-07",
        rating: 4,
        comment: "Such a classy piece - bold, comfy, and effortlessly elegant.",
      },
    ],
  },
  {
    id: "diya",
    name: "Diya",
    price: 1999,
    shortDescription:
      "Diya is a graceful Farsi salwar suit with delicate noodle straps and a corset back. It blends ethnic elegance with a modern silhouette, perfect for festive occasions. Effortlessly stylish and uniquely feminine.",
    longDescription:
      "Diya is a striking Farsi salwar suit that blends tradition with a modern silhouette. Featuring delicate noodle straps and a structured corset back, it offers a flattering, feminine fit. The soft, flowing fabric contrasts beautifully with the tailored bodice, creating a look that's both graceful and bold. Perfect for festive events or weddings, Diya stands out with its effortless charm. Style it with statement jewelry for a look that's elegant yet contemporary.",
    images: [
      "/Diya/Diya1.png",
      "/Diya/Diya2.png",
      "/Diya/Diya3.png",
      "/Diya/Diya4.png",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    reviews: [
      {
        name: "Divya",
        date: "2025-10-14",
        rating: 5,
        comment:
          "Perfect for festive occasions — lightweight, flattering, and very chic. Will buy again in another color.",
      },
      {
        name: "Ishu",
        date: "2025-10-16",
        rating: 4,
        comment:
          "Diya made me feel so confident — the corset back gives great shape without being restrictive.",
      },
    ],
  },
  {
    id: "nishtha",
    name: "Nishtha",
    price: 599,
    shortDescription:
      "Nishtha is a bold red kurti made from pure cotton, featuring a double V neckline and the same elegant print as Shreya. Designed with breathable fabric, it offers a flattering silhouette with modern charm and all-day comfort.",
    longDescription:
      "Nishtha is a striking red kurti crafted from pure, breathable cotton. It shares the same elegant print as Shreya but features a unique double V neckline for a modern edge. The silhouette is flattering yet comfortable, perfect for day-to-night wear. Its airy fabric ensures ease and movement, even in warmer weather. Effortlessly stylish, it pairs beautifully with trousers, skirts, or statement accessories. Nishtha is a blend of bold color, thoughtful design, and everyday elegance.",
    images: [
      "/Nishtha/Nishtha1.webp",
      "/Nishtha/Nishtha2.webp",
      "/Nishtha/Nishtha3.webp",
      "/Nishtha/Nishtha4.webp",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: true },
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Shalini",
        date: "2025-09-09",
        rating: 5,
        comment:
          "The double V neckline is such a stylish detail. Love how the red stands out while still feeling very comfortable.",
      },
      {
        name: "Divya",
        date: "2025-09-10",
        rating: 4,
        comment:
          "The fit is flattering and the breathable cotton is perfect for all-day wear. Great for both casual and festive occasions.",
      },
    ],
  },
  {
    id: "asha",
    name: "Asha",
    price: 599,
    shortDescription: "100% cotton, short kurti with bell sleeves",
    longDescription:
      "Grace meets playfulness in the Asha Kurti, featuring delicate blue bell sleeves that add a charming flair. This short kurti blends comfort with style, perfect for adding a fresh twist to your everyday wardrobe.",
    images: [
      "/Asha/Asha1.PNG",
      "/Asha/Asha2.PNG",
      "/Asha/Asha3.PNG",
      "/Asha/Asha4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Maya",
        date: "2025-05-30",
        rating: 5,
        comment:
          "The bell sleeves are so cute and playful! The cotton fabric is light and comfy.",
      },
      {
        name: "Rashmi",
        date: "2025-06-08",
        rating: 4,
        comment:
          "Love the short length and the blue color. Perfect for a fresh, everyday look.",
      },
    ],
  },
  {
    id: "jaya",
    name: "Jaya",
    price: 599,
    shortDescription: "Asymmetrical Kurti",
    longDescription:
      "Classic and captivating, the Jaya Kurti in serene blue offers timeless style with a modern touch. Perfect for day-to-night wear, it's your go-to for effortless elegance.",
    images: [
      "/Jaya/Jaya1.PNG",
      "/Jaya/Jaya2.PNG",
      "/Jaya/Jaya3.PNG",
      "/Jaya/Jaya4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XXS", inStock: false },
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Nisha",
        date: "2025-05-22",
        rating: 5,
        comment:
          "The serene blue color is so calming and elegant. The asymmetrical design is very flattering.",
      },
      {
        name: "Ritika",
        date: "2025-06-14",
        rating: 4,
        comment:
          "Perfect for both day and night looks. The fit is great and the style is timeless.",
      },
    ],
  },
  {
    id: "Indu",
    name: "Indu",
    price: 599,
    shortDescription: "100% cotton, full sleeves sweetheart kurti",
    longDescription:
      "Elegant and enchanting, the Indu Kurti features a sweetheart neckline and full sleeves, crafted from pure cotton for a soft, luxurious feel. Perfect for adding a touch of sophistication to your wardrobe.",
    images: [
      "/Indu/Indu1.PNG",
      "/Indu/Indu2.PNG",
      "/Indu/Indu3.PNG",
      "/Indu/Indu4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Manisha",
        date: "2025-05-05",
        rating: 5,
        comment:
          "The sweetheart neckline is so elegant and the cotton fabric feels luxurious. Love the full sleeves!",
      },
      {
        name: "Preeti",
        date: "2025-06-01",
        rating: 5,
        comment:
          "Adds a sophisticated touch to my wardrobe. The fit and feel are just perfect.",
      },
    ],
  },
  {
    id: "Lata",
    name: "Lata",
    price: 599,
    shortDescription: "100% cotton, noodle strap kurti",
    longDescription:
      "Lightweight and breezy, the Lata Kurti features delicate noodle straps and a relaxed fit, crafted from 100% cotton for ultimate comfort. Perfect for warm days or layering in cooler weather.",
    images: [
      "/Lata/Lata1.png",
      "/Lata/Lata2.PNG",
      "/Lata/Lata3.PNG",
      "/Lata/Lata4.PNG",
    ],
    category: "clothing",
    inStock: false,
    sizes: [
      { label: "XS", inStock: false },
      { label: "S", inStock: false },
      { label: "M", inStock: false },
      { label: "L", inStock: false },
      { label: "XL", inStock: false },
    ],
    heights: [
      { label: "Up to 5'3\"", value: "up-to-5-3", default: true },
      { label: "5'4\" - 5'6\"", value: "5-4-to-5-6", default: false },
      { label: "5'6\" and above", value: "5-6-and-above", default: false },
    ],
    reviews: [
      {
        name: "Rupal",
        date: "2025-05-07",
        rating: 4,
        comment:
          "The noodle straps and relaxed fit make this kurti perfect for hot days. So light and comfy!",
      },
      {
        name: "Jasleen",
        date: "2025-06-17",
        rating: 5,
        comment:
          "Love the 100% cotton fabric. It's easy to layer and feels great on the skin.",
      },
    ],
  },
];

export default products;
