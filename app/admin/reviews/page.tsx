import { prisma } from "@/lib/prisma";
import { setReviewApproved, deleteReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewsAdmin() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Reviews</h2>
      <p className="text-xs text-gray-500 mb-5">{reviews.filter(r => !r.approved).length} pending approval.</p>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-gray-50 text-left text-[10.5px] text-gray-500"><th className="p-3">Product</th><th className="p-3">Rating</th><th className="p-3">Name</th><th className="p-3">Text</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.product.name}</td><td className="p-3">{"★".repeat(r.rating)}</td><td className="p-3">{r.name}</td>
                <td className="p-3 max-w-xs">{r.text}</td>
                <td className="p-3">{r.approved ? "Approved" : "Pending"}</td>
                <td className="p-3 flex gap-2">
                  <form action={setReviewApproved.bind(null, r.id, !r.approved)}><button className="border rounded px-2 py-1 text-[11px]">{r.approved ? "Unpublish" : "Approve"}</button></form>
                  <form action={deleteReview.bind(null, r.id)}><button className="border rounded px-2 py-1 text-[11px] text-red-600">Delete</button></form>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No reviews yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
