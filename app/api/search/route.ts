import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ hits: [] });
  const hits = await prisma.product.findMany({
    where: { status: "published", name: { contains: q, mode: "insensitive" } },
    take: 10,
  });
  return NextResponse.json({ hits });
}
