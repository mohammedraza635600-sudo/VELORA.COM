import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
};

// Old admin login URL — intentionally retired. No longer a working login form.
export default function OldAdminLogin() {
  redirect("/");
}
