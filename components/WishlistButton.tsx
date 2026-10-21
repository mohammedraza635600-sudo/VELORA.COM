"use client";
import { useWishlist } from "./WishlistContext";

// Small heart used on product cards. It sits inside a <Link>, so the click handler
// stops the card navigation and only toggles the wishlist.
export default function WishlistButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const active = has(slug);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center transition-transform active:scale-90 hover:scale-105 ${className}`}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill={active ? "#4D694E" : "none"} stroke="#4D694E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z" />
      </svg>
    </button>
  );
}
