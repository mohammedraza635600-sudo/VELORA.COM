"use client";
import { useRouter } from "next/navigation";
import { logoutCustomer } from "@/app/actions";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => { await logoutCustomer(); router.refresh(); }}
      className="text-xs tracking-widest text-olive underline"
    >
      SIGN OUT
    </button>
  );
}
