import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSetting, DEFAULT_HERO } from "@/lib/settings";
import ProductCard from "@/components/ProductCard";
import HeroParallax from "@/components/HeroParallax";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [hero, products, collections] = await Promise.all([
    getSetting("hero", DEFAULT_HERO),
    prisma.product.findMany({ where: { status: "published" }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.collection.findMany({ where: { status: "active" }, orderBy: { order: "asc" }, take: 4 }),
  ]);

  return (
    <>
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        {hero.videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={hero.videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="frame absolute inset-0"><div className="bg" /></div>
        )}
        <div className="absolute inset-0 bg-black/25" />
        <HeroParallax>
          <div className="relative z-10 px-5 md:px-12 pb-24 text-cream max-w-3xl">
            <div className="hero-eyebrow text-[11px] tracking-widest mb-4">{hero.eyebrow}</div>
            <h1 className="hero-title font-serif text-6xl md:text-8xl leading-[.98]">{hero.title}</h1>
            <p className="hero-sub mt-6 max-w-md text-sm leading-relaxed">{hero.subtitle}</p>
            <div className="hero-cta flex gap-4 mt-9 flex-wrap">
              <Link href={hero.ctaUrl} className="btn btn-inverse transition-transform active:scale-95">{hero.ctaText} →</Link>
              <Link href="/#story" className="btn btn-inverse transition-transform active:scale-95" style={{ borderColor: "rgba(255,243,213,.5)" }}>EXPLORE THE STORY →</Link>
            </div>
          </div>
        </HeroParallax>
      </section>

      <section className="bg-creamSoft py-32 reveal">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12 grid md:grid-cols-[1.1fr_.9fr] gap-12 items-end">
          <h2 className="font-serif text-4xl md:text-5xl leading-tight" style={{ color: "var(--olive-dark)" }}>
            &ldquo;Velora is a study<br />in timeless form.&rdquo;
          </h2>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: "#3c4238" }}>
            Every piece begins with restraint — a single fabric, a single silhouette, refined until nothing further can be removed. Menswear built for the wardrobe that outlasts the season.
          </p>
        </div>
      </section>

      <section id="collections" className="py-28 reveal">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12 mb-12">
          <div className="text-[11px] tracking-widest text-olive mb-2">CURATED FOR THE MODERN MAN</div>
          <h2 className="font-serif text-4xl md:text-5xl">The Collection</h2>
        </div>
        <div className="grid md:grid-cols-4" data-reveal-group>
          {collections.map((c, i) => (
            <div key={c.id} className="reveal relative aspect-[3/4.4] group transition-transform duration-150 active:scale-[.98]">
              <div className="frame absolute inset-0" style={{ background: c.cover || undefined }}><div className="bg" /></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-7 text-cream">
                <div className="text-[11px] opacity-70 mb-2">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-serif text-3xl transition-transform duration-300 group-hover:translate-x-1">{c.name}</h3>
                <p className="text-xs opacity-75 mt-2 max-w-[200px]">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-5 md:px-12 pb-32 reveal">
        <div className="mb-12">
          <div className="text-[11px] tracking-widest text-olive mb-2">JUST LANDED</div>
          <h2 className="font-serif text-4xl md:text-5xl">New Arrivals</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8" data-reveal-group>
          {products.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-sm text-taupe">No published products yet — add some from /admin/products.</p>
        )}
      </section>

      <section id="story" className="grid md:grid-cols-2 min-h-[70vh] reveal">
        <div className="frame relative min-h-[380px]"><div className="bg" /></div>
        <div className="p-10 md:p-24 flex flex-col justify-center text-cream" style={{ background: "var(--olive)" }}>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">Designed<br />with<br />intention.</h2>
          <p className="mt-7 max-w-md text-sm leading-relaxed opacity-85">
            From the mills we choose to the hands that finish every seam, each decision is made in service of longevity.
          </p>
        </div>
      </section>

      <section className="py-32 bg-creamSoft reveal">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12 grid md:grid-cols-3 gap-14">
          {[["Craft", "Precision in every detail, considered from sketch to final stitch."], ["Form", "Designed beyond the moment, for a wardrobe that holds its shape."], ["Intention", "Nothing unnecessary — every element earns its place."]].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-serif text-3xl" style={{ color: "var(--olive-dark)" }}>{t}</h3>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "#4a5045" }}>{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
