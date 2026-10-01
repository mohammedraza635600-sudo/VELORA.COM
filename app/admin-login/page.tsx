import { loginAdmin } from "./actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#26382A]">
      <form action={loginAdmin} className="bg-white rounded-xl p-9 w-[360px] max-w-[90vw]">
        <h1 className="text-lg font-semibold mb-1">VELORA Admin</h1>
        <p className="text-xs text-gray-500 mb-5">Sign in to the control center.</p>
        {sp.error && <p className="text-xs text-red-600 mb-3">Incorrect password.</p>}
        <label className="block text-[11px] text-gray-500 mb-1.5">Your name</label>
        <input name="name" defaultValue="Admin" className="w-full border rounded-md p-2.5 mb-3.5 text-sm" />
        <label className="block text-[11px] text-gray-500 mb-1.5">Role</label>
        <select name="role" className="w-full border rounded-md p-2.5 mb-3.5 text-sm">
          {["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "INVENTORY_MANAGER", "CONTENT_MANAGER", "MARKETING_MANAGER", "SUPPORT"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <label className="block text-[11px] text-gray-500 mb-1.5">Password</label>
        <input name="password" type="password" required className="w-full border rounded-md p-2.5 mb-5 text-sm" />
        <button type="submit" className="w-full bg-[#4D694E] text-white rounded-md py-2.5 text-sm">Enter Admin Panel</button>
      </form>
    </div>
  );
}
