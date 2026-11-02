"use client";
import { useEffect, useState } from "react";

// Shows an "Install App" button. Android/desktop Chrome: one-tap install.
// iPhone Safari has no install prompt, so we show the Add to Home Screen steps.
export default function InstallButton({ className = "" }: { className?: string }) {
  const [evt, setEvt] = useState<any>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (standalone) { setInstalled(true); return; }
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function click() {
    if (evt) {
      evt.prompt();
      await evt.userChoice.catch(() => {});
      setEvt(null);
    } else {
      setHelp((h) => !h);
    }
  }

  return (
    <div>
      <button type="button" onClick={click} className={className}>📲 Install App</button>
      {help && (
        <p className="text-[11px] opacity-70 mt-2 max-w-[220px] leading-relaxed">
          {ios
            ? "iPhone: Safari me neeche Share button dabao → “Add to Home Screen”."
            : "Browser menu (⋮) kholo → “Install app” ya “Add to Home screen” dabao."}
        </p>
      )}
    </div>
  );
}
