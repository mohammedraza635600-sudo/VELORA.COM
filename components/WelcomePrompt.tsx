"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const KEY = "velora_welcome_seen";
// Pages where the prompt must never appear (account/checkout flows and the admin side).
const SKIP = ["/admin", "/velora-staff-k9x2m", "/account", "/checkout", "/cart", "/track-order"];

// Friendly one-time "Sign in / Create account" prompt shown when a visitor first opens the
// site. It can always be dismissed ("Continue as guest") so it never blocks shopping, and it
// is not shown again on that device once dismissed or once the visitor is signed in.
export default function WelcomePrompt({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname() || "";
  const [show, setShow] = useState(false);
  const skip = loggedIn || SKIP.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (skip) return;
    let seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => setShow(true), 3000); // after the intro animation
    return () => clearTimeout(t);
  }, [skip]);

  function close() {
    setShow(false);
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  if (!show || skip) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label="Welcome to VELORA">
      <div className="w-full max-w-sm bg-creamSoft p-7 text-center relative">
        <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-4 text-lg opacity-60">✕</button>
        <div className="text-[11px] tracking-widest text-olive mb-2">WELCOME</div>
        <h2 className="font-serif text-3xl mb-2">Join VELORA</h2>
        <p className="text-sm text-taupe mb-6">Create an account to track your orders and keep your favourites.</p>
        <div className="grid gap-3">
          <Link href="/account?mode=signup" onClick={close} className="btn justify-center" style={{ background: "var(--olive)", color: "var(--cream)" }}>CREATE ACCOUNT</Link>
          <Link href="/account" onClick={close} className="btn justify-center" style={{ background: "transparent", color: "var(--olive)", border: "1px solid var(--olive)" }}>SIGN IN</Link>
        </div>
        <button type="button" onClick={close} className="text-xs text-taupe underline mt-5">Continue as guest</button>
      </div>
    </div>
  );
}
