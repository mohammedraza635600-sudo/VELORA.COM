import { getSetting, DEFAULT_BRANDING, DEFAULT_HERO, DEFAULT_NAV, DEFAULT_FOOTER, DEFAULT_ANNOUNCEMENT } from "@/lib/settings";
import { saveBranding, saveHero, saveNav, saveAnnouncement, saveFooter } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams;
  const tab = sp.tab || "branding";
  const [branding, hero, nav, footer, announcement] = await Promise.all([
    getSetting("branding", DEFAULT_BRANDING),
    getSetting("hero", DEFAULT_HERO),
    getSetting("navigation", DEFAULT_NAV),
    getSetting("footer", DEFAULT_FOOTER),
    getSetting("announcement", DEFAULT_ANNOUNCEMENT),
  ]);

  const tabs = ["branding", "homepage", "navigation", "footer", "announcement"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Website Builder</h2>
      <p className="text-xs text-gray-500 mb-5">Changes publish to the live storefront instantly — no code, no redeploy.</p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <a key={t} href={`/admin/settings?tab=${t}`} className={`text-xs px-3.5 py-2 rounded-full border ${tab === t ? "bg-[#4D694E] text-white border-[#4D694E]" : "bg-white"}`}>{t[0].toUpperCase() + t.slice(1)}</a>
        ))}
      </div>

      {tab === "branding" && (
        <form action={saveBranding} className="bg-white border rounded-lg p-6 max-w-xl grid grid-cols-2 gap-4">
          {Object.entries(branding).filter(([k]) => k !== "headingFont" && k !== "bodyFont").map(([k, v]) => (
            <div key={k}>
              <label className="block text-[11px] text-gray-500 mb-1.5 capitalize">{k.replace(/([A-Z])/g, " $1")}</label>
              <input type="color" name={k} defaultValue={v as string} className="w-full h-10 border rounded-md" />
            </div>
          ))}
          <button className="col-span-2 bg-[#4D694E] text-white text-sm px-4 py-2.5 rounded-md mt-2">Save & Publish to Storefront</button>
        </form>
      )}

      {tab === "homepage" && (
        <form action={saveHero} className="bg-white border rounded-lg p-6 max-w-xl">
          <h3 className="text-sm font-medium mb-3">Hero Section</h3>
          <label className="block text-[11px] text-gray-500 mb-1.5">Eyebrow</label>
          <input name="eyebrow" defaultValue={hero.eyebrow} className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <label className="block text-[11px] text-gray-500 mb-1.5">Title</label>
          <input name="title" defaultValue={hero.title} className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <label className="block text-[11px] text-gray-500 mb-1.5">Subtitle</label>
          <textarea name="subtitle" defaultValue={hero.subtitle} className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-[11px] text-gray-500 mb-1.5">CTA Text</label><input name="ctaText" defaultValue={hero.ctaText} className="w-full border rounded-md p-2.5 text-sm" /></div>
            <div><label className="block text-[11px] text-gray-500 mb-1.5">CTA URL</label><input name="ctaUrl" defaultValue={hero.ctaUrl} className="w-full border rounded-md p-2.5 text-sm" /></div>
          </div>
          <label className="block text-[11px] text-gray-500 mb-1.5">Background Video URL (.mp4) — leave empty to use the plain background</label>
          <input name="videoUrl" defaultValue={(hero as any).videoUrl || ""} placeholder="https://vvbczidjnwjpqvqskhar.supabase.co/storage/v1/object/public/velora-media/hero.mp4" className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2.5 rounded-md">Save Hero</button>
        </form>
      )}

      {tab === "navigation" && (
        <form action={saveNav} className="bg-white border rounded-lg p-6 max-w-xl">
          <h3 className="text-sm font-medium mb-3">Navigation Menu (one item per row)</h3>
          {[...nav.items, { label: "", url: "" }].map((n, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input name="navLabel" defaultValue={n.label} placeholder="Label" className="flex-1 border rounded-md p-2 text-sm" />
              <input name="navUrl" defaultValue={n.url} placeholder="URL" className="flex-1 border rounded-md p-2 text-sm" />
            </div>
          ))}
          <p className="text-[11px] text-gray-400 mb-3">Leave the last row filled to add another item next time you save.</p>
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2.5 rounded-md">Save & Publish Navigation</button>
        </form>
      )}

      {tab === "footer" && (
        <form action={saveFooter} className="bg-white border rounded-lg p-6 max-w-2xl">
          <h3 className="text-sm font-medium mb-1">Footer Columns</h3>
          <p className="text-[11px] text-gray-400 mb-3">One link per line, formatted as Label|URL</p>
          {footer.columns.map((c, i) => (
            <div key={i} className="border rounded-md p-3 mb-3">
              <input name="colTitle" defaultValue={c.title} className="w-full border rounded-md p-2 text-sm font-medium mb-2" />
              <textarea name="colLinks" defaultValue={c.links.map(l => `${l.label}|${l.url}`).join("\n")} className="w-full border rounded-md p-2 text-sm min-h-[90px] font-mono text-xs" />
            </div>
          ))}
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2.5 rounded-md">Save & Publish Footer</button>
        </form>
      )}

      {tab === "announcement" && (
        <form action={saveAnnouncement} className="bg-white border rounded-lg p-6 max-w-xl">
          <label className="block text-[11px] text-gray-500 mb-1.5">Text</label>
          <input name="text" defaultValue={announcement.text} className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <label className="block text-[11px] text-gray-500 mb-1.5">Link URL</label>
          <input name="link" defaultValue={announcement.link} className="w-full border rounded-md p-2.5 text-sm mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-[11px] text-gray-500 mb-1.5">Background</label><input type="color" name="bg" defaultValue={announcement.bg} className="w-full h-10 border rounded-md" /></div>
            <div><label className="block text-[11px] text-gray-500 mb-1.5">Text Color</label><input type="color" name="color" defaultValue={announcement.color} className="w-full h-10 border rounded-md" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm mb-3.5"><input type="checkbox" name="enabled" defaultChecked={announcement.enabled} /> Enabled</label>
          <button className="bg-[#4D694E] text-white text-sm px-4 py-2.5 rounded-md">Save & Publish</button>
        </form>
      )}
    </div>
  );
}
