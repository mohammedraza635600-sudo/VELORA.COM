"use client";
import { useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const BUCKET = "velora-media";

function publicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return publicUrl(path);
}

export default function MediaUploader({
  initialImages = [],
  initialVideo = "",
}: {
  initialImages?: string[];
  initialVideo?: string;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [video, setVideo] = useState<string>(initialVideo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onImagesSelected(files: FileList | null) {
    if (!files || !files.length) return;
    setError("");
    const room = Math.max(0, 6 - images.length);
    const toUpload = Array.from(files).slice(0, room);
    if (toUpload.length === 0) { setError("Maximum 6 images reached — remove one first."); return; }
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of toUpload) urls.push(await uploadFile(f, "products"));
      setImages((prev) => [...prev, ...urls]);
    } catch (e: any) {
      setError(e.message || "Upload failed.");
    }
    setBusy(false);
  }

  async function onVideoSelected(files: FileList | null) {
    if (!files || !files.length) return;
    setError("");
    setBusy(true);
    try {
      const url = await uploadFile(files[0], "product-videos");
      setVideo(url);
    } catch (e: any) {
      setError(e.message || "Upload failed.");
    }
    setBusy(false);
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="col-span-2">
      <input type="hidden" name="images" value={images.join(",")} />
      <input type="hidden" name="video" value={video} />

      <label className="block text-[11px] text-gray-500 mb-1.5">Product Images (up to 6)</label>
      <div className="grid grid-cols-6 gap-2 mb-2">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-md overflow-hidden border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white text-[10px] w-5 h-5 rounded-full leading-none"
            >✕</button>
          </div>
        ))}
        {images.length < 6 && (
          <label className="aspect-square rounded-md border border-dashed flex items-center justify-center text-[11px] text-gray-400 cursor-pointer hover:border-gray-500">
            {busy ? "…" : "+ Add"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onImagesSelected(e.target.files)} disabled={busy} />
          </label>
        )}
      </div>

      <label className="block text-[11px] text-gray-500 mb-1.5 mt-4">Product Video (1, optional)</label>
      {video ? (
        <div className="relative w-40">
          <video src={video} className="w-full rounded-md border" controls />
          <button type="button" onClick={() => setVideo("")} className="absolute top-1 right-1 bg-black/60 text-white text-[10px] w-5 h-5 rounded-full leading-none">✕</button>
        </div>
      ) : (
        <label className="inline-block border border-dashed rounded-md px-4 py-3 text-[11px] text-gray-400 cursor-pointer hover:border-gray-500">
          {busy ? "Uploading…" : "+ Upload video"}
          <input type="file" accept="video/*" className="hidden" onChange={(e) => onVideoSelected(e.target.files)} disabled={busy} />
        </label>
      )}

      {error && <p className="text-[11px] text-red-600 mt-2">{error}</p>}
    </div>
  );
}
