"use client";
import { useFormStatus } from "react-dom";

export default function PendingBar() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#4D694E] text-white text-xs text-center py-2">
      Working… please wait, don&rsquo;t click again.
    </div>
  );
}
