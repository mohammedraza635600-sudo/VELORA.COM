"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginCustomer, signupCustomer } from "@/app/actions";

export default function AccountForms() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = mode === "login" ? await loginCustomer(fd) : await signupCustomer(fd);
    setBusy(false);
    if (res.ok) router.refresh();
    else setError(res.message || "Something went wrong.");
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <div className="text-[11px] tracking-widest text-olive mb-2">MY ACCOUNT</div>
      <h1 className="font-serif text-4xl mb-8">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <form onSubmit={submit} className="grid gap-3">
        {mode === "signup" && (
          <input name="name" placeholder="Full name" required className="border border-black/20 p-3 text-sm bg-transparent" />
        )}
        <input name="email" type="email" placeholder="Email" required className="border border-black/20 p-3 text-sm bg-transparent" />
        <input name="password" type="password" placeholder={mode === "signup" ? "Password (min 8 characters)" : "Password"} required minLength={mode === "signup" ? 8 : undefined} className="border border-black/20 p-3 text-sm bg-transparent" />
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn justify-center mt-2" style={{ background: "var(--olive)", color: "var(--cream)" }}>
          {busy ? "PLEASE WAIT…" : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
      </form>
      <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="text-xs text-olive underline mt-6">
        {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
      <p className="text-[11px] text-taupe mt-6">You can always check out as a guest and use <a href="/track-order" className="underline">Track Order</a> with your order ID and email.</p>
    </div>
  );
}
