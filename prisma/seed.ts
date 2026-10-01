import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Structured Wool Coat", slug: "structured-wool-coat", category: "Outerwear", collection: "Signature", price: 480, compareAt: 560, sku: "VEL-COT-001", stock: 14, status: "published", colors: "#26382A,#B7AE99", description: "Double-faced wool coat, horn buttons, hand-stitched lapel.", material: "90% wool, 10% cashmere. Full canvas construction.", care: "Dry clean only." },
        { name: "Tailored Wool Blazer", slug: "tailored-wool-blazer", category: "Tailoring", collection: "Signature", price: 420, sku: "VEL-BLZ-002", stock: 9, status: "published", colors: "#4D694E,#191B18", description: "Structured shoulder, notch lapel, full canvas construction.", material: "100% wool.", care: "Dry clean only." },
        { name: "Merino Crewneck Sweater", slug: "merino-crewneck-sweater", category: "Knitwear", collection: "Essentials", price: 165, sku: "VEL-KNT-003", stock: 2, status: "published", colors: "#344A38,#B7AE99", description: "Fine-gauge merino, ribbed hem and cuffs.", material: "100% merino wool.", care: "Hand wash cold." },
        { name: "Oxford Cotton Shirt", slug: "oxford-cotton-shirt", category: "Shirting", collection: "Essentials", price: 135, sku: "VEL-SHT-004", stock: 0, status: "published", colors: "#FFF3D5,#191B18", description: "Classic collar, mother-of-pearl buttons.", material: "100% cotton.", care: "Machine wash cold." },
        { name: "Wide-Leg Wool Trouser", slug: "wide-leg-wool-trouser", category: "Trousers", collection: "Signature", price: 210, sku: "VEL-TRS-005", stock: 11, status: "draft", colors: "#26382A,#191B18", description: "High-rise, pressed centre crease.", material: "100% wool.", care: "Dry clean only." },
        { name: "Suede Chelsea Boot", slug: "suede-chelsea-boot", category: "Footwear", collection: "Signature", price: 340, sku: "VEL-SHO-006", stock: 6, status: "published", colors: "#191B18,#B7AE99", description: "Hand-lasted suede, leather sole.", material: "Suede upper, leather sole.", care: "Brush clean, use suede protector." },
      ],
    });
    await prisma.collection.createMany({
      data: [
        { name: "Essentials", slug: "essentials", description: "Foundational pieces built for daily wear.", cover: "#4D694E", order: 1 },
        { name: "Signature", slug: "signature", description: "Our most refined tailoring, reimagined.", cover: "#344A38", order: 2 },
        { name: "Nocturne", slug: "nocturne", description: "Evening tailoring in deep, quiet tones.", cover: "#191B18", order: 3 },
        { name: "Atelier", slug: "atelier", description: "Limited runs, made by hand.", cover: "#26382A", order: 4 },
      ],
    });
    await prisma.category.createMany({
      data: [
        { name: "Outerwear", slug: "outerwear", order: 1 },
        { name: "Tailoring", slug: "tailoring", order: 2 },
        { name: "Knitwear", slug: "knitwear", order: 3 },
        { name: "New Arrivals", slug: "new-arrivals", order: 4 },
        { name: "Sale", slug: "sale", order: 5 },
      ],
    });
    await prisma.coupon.createMany({
      data: [
        { code: "WELCOME10", type: "percentage", value: 10, minOrder: 100, usageLimit: 500, expiry: "2026-12-31" },
        { code: "FREESHIP", type: "free_shipping", value: 0, minOrder: 0, usageLimit: 1000, expiry: "2026-12-31" },
      ],
    });
    console.log("Seeded products, collections, categories, coupons.");
  } else {
    console.log("Data already exists — skipping seed.");
  }
}

main().finally(() => prisma.$disconnect());
