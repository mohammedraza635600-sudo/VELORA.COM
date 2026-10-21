"use client";
import { useState } from "react";

const ROWS = [
  { size: "XS", chest: "86–89", waist: "71–74", length: "68" },
  { size: "S", chest: "91–94", waist: "76–79", length: "70" },
  { size: "M", chest: "97–101", waist: "81–86", length: "72" },
  { size: "L", chest: "104–109", waist: "89–94", length: "74" },
  { size: "XL", chest: "112–117", waist: "97–102", length: "76" },
];

export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-[11px] tracking-widest text-olive underline underline-offset-2">
        SIZE GUIDE
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-5" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-offWhite max-w-lg w-full p-7 rounded-sm">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 text-lg leading-none">✕</button>
            <h3 className="font-serif text-2xl mb-1">Size Guide</h3>
            <p className="text-xs text-taupe mb-5">All measurements in centimetres, taken flat and unstretched.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] tracking-widest text-taupe text-left border-b border-black/10">
                  <th className="py-2">SIZE</th>
                  <th className="py-2">CHEST</th>
                  <th className="py-2">WAIST</th>
                  <th className="py-2">LENGTH</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-black/5">
                    <td className="py-2.5 font-medium">{r.size}</td>
                    <td className="py-2.5">{r.chest}</td>
                    <td className="py-2.5">{r.waist}</td>
                    <td className="py-2.5">{r.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-taupe mt-5">Between sizes? We recommend sizing up for a relaxed fit.</p>
          </div>
        </div>
      )}
    </>
  );
}
