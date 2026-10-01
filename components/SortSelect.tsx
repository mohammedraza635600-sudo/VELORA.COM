"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") || "";

  function onChange(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v) next.set("sort", v); else next.delete("sort");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <select value={current} onChange={(e) => onChange(e.target.value)} className="border border-black/20 px-3 py-2 bg-transparent text-xs">
      <option value="">Sort: Featured</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="name">Name: A–Z</option>
    </select>
  );
}
