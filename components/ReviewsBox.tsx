"use client";
import { submitReview } from "@/app/actions";
import { useState } from "react";

type Review = { rating: number; name: string; text: string };

export default function ReviewsBox({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [submitted, setSubmitted] = useState(false);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-14 border-t border-black/10 pt-10">
      <h3 className="font-serif text-2xl mb-1">Reviews</h3>
      <div className="text-sm text-taupe mb-6">{avg ? `${avg} / 5 · ${reviews.length} review(s)` : "No reviews yet — be the first."}</div>
      {reviews.map((r, i) => (
        <div key={i} className="py-4 border-b border-black/5">
          <div className="text-olive text-sm tracking-widest">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
          <div className="text-xs font-medium mt-1.5">{r.name}</div>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#4a5045" }}>{r.text}</p>
        </div>
      ))}
      {submitted ? (
        <p className="text-sm text-olive mt-6">Thank you — your review is queued for approval.</p>
      ) : (
        <form
          action={async (formData) => { await submitReview(productId, formData); setSubmitted(true); }}
          className="flex flex-col gap-2.5 mt-6 max-w-md"
        >
          <select name="rating" className="border border-black/20 p-2.5 text-sm bg-transparent w-fit">
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★☆ Good</option>
            <option value="3">★★★☆☆ Average</option>
            <option value="2">★★☆☆☆ Poor</option>
            <option value="1">★☆☆☆☆ Bad</option>
          </select>
          <input name="name" placeholder="Your name" className="border border-black/20 p-2.5 text-sm bg-transparent" />
          <textarea name="text" placeholder="Share your thoughts on this piece…" required className="border border-black/20 p-2.5 text-sm bg-transparent min-h-[70px]" />
          <button type="submit" className="btn self-start">SUBMIT REVIEW</button>
        </form>
      )}
    </div>
  );
}
