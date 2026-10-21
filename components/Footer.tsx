import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

type Col = { title: string; links: { label: string; url: string }[] };

export default function Footer({ columns }: { columns: Col[] }) {
  return (
    <footer className="bg-charcoal text-cream pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12">
        <div className="grid md:grid-cols-5 gap-10 pb-16 border-b border-cream/10">
          <div><Logo accent="#C9A961" className="w-full max-w-[220px] h-auto" /></div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] tracking-widest text-taupe mb-4">{c.title}</h4>
              {c.links.map((l) => (
                <a key={l.label} href={l.url} className="block text-sm opacity-80 hover:opacity-100 mb-3">{l.label}</a>
              ))}
            </div>
          ))}
          <NewsletterForm />
        </div>
        <div className="flex justify-between pt-6 text-xs opacity-60 flex-wrap gap-3">
          <span>© {new Date().getFullYear()} VELORA</span>
          <div className="flex gap-6"><span>Privacy</span><span>Terms</span><span>Cookies</span></div>
        </div>
      </div>
    </footer>
  );
}
