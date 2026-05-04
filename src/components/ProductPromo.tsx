import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const FAKE_NAMES = [
  "Amadou", "Jean-Marc", "Olivier", "Sékou", "Karim", "Patrick",
  "Yann", "Mohamed", "Ibrahim", "Lucas", "Abdoulaye", "Pierre",
];
const FAKE_CITIES = ["Abidjan", "Paris", "Dakar", "Bamako", "Lyon", "Cotonou", "Bruxelles", "Lomé", "Casablanca"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Notification flottante "X vient d'acheter à Y" */
export function LiveActivityToast({ productName }: { productName: string }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "Amadou", city: "Abidjan", time: "il y a 12 minutes" });

  useEffect(() => {
    let i = 0;
    const minutesPool = [3, 7, 12, 18, 24, 31, 42];
    const showNext = () => {
      const seed = Date.now() + i;
      setData({
        name: pick(FAKE_NAMES, Math.floor(seed / 1000)),
        city: pick(FAKE_CITIES, Math.floor(seed / 7000)),
        time: `il y a ${pick(minutesPool, i)} minutes`,
      });
      setVisible(true);
      i++;
      setTimeout(() => setVisible(false), 6000);
    };

    const first = setTimeout(showNext, 4500);
    const interval = setInterval(showNext, 18000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-30 max-w-[300px] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-background border border-hairline shadow-2xl px-4 py-3 flex items-start gap-3">
        <div className="relative mt-0.5">
          <span className="block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="absolute inset-0 rounded-full bg-emerald-500 anim-pulse-soft" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-foreground text-xs font-medium truncate">
            {data.name} de {data.city}
          </div>
          <div className="text-foreground/60 text-[11px] mt-0.5 leading-snug">
            vient de commander <span className="text-foreground/80">{productName}</span>
          </div>
          <div className="text-foreground/40 text-[10px] mt-1">
            <Icon name="clock" className="mr-1" /> {data.time}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compteur "X personnes regardent ce produit" */
export function ViewersCounter({ productSlug }: { productSlug: string }) {
  const [count, setCount] = useState(() => {
    let h = 0;
    for (let i = 0; i < productSlug.length; i++) h = (h * 31 + productSlug.charCodeAt(i)) | 0;
    return 8 + (Math.abs(h) % 24);
  });

  useEffect(() => {
    const i = setInterval(() => {
      setCount((c) => Math.max(5, Math.min(48, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 7000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-xs text-foreground/70">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500/70 anim-pulse-soft" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <Icon name="eye" className="text-foreground/50" />
      <span>
        <span className="text-foreground font-medium">{count} personnes</span> regardent cette pièce
      </span>
    </div>
  );
}

/** Compte à rebours d'offre */
export function OfferCountdown() {
  const [end] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const ms = Math.max(0, end - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="border border-amber-500/40 bg-amber-500/5 px-4 py-3 flex items-center gap-3">
      <Icon name="bolt" className="text-amber-500 text-lg anim-pulse-soft" />
      <div className="flex-1 min-w-0">
        <div className="text-foreground text-xs font-medium">Offre exclusive — livraison offerte</div>
        <div className="text-foreground/60 text-[11px] mt-0.5">Plus que quelques heures pour en profiter.</div>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm text-foreground tabular-nums">
        <TimeBox v={pad(h)} l="h" />
        <span className="text-foreground/40">:</span>
        <TimeBox v={pad(m)} l="m" />
        <span className="text-foreground/40">:</span>
        <TimeBox v={pad(s)} l="s" />
      </div>
    </div>
  );
}

function TimeBox({ v, l }: { v: string; l: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-foreground text-background px-1.5 py-0.5 text-xs font-medium leading-tight">{v}</span>
      <span className="text-[8px] uppercase tracking-wider text-foreground/50 mt-0.5">{l}</span>
    </div>
  );
}

/** Bandeau promo offert / réduction */
export function PromoBadge({ code = "GRACE10" }: { code?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="group w-full flex items-center gap-3 px-4 py-3 border border-dashed border-foreground/30 hover:border-foreground transition-colors text-left"
    >
      <Icon name="gift" className="text-amber-500 text-lg anim-float" />
      <div className="flex-1 min-w-0">
        <div className="text-foreground text-xs font-medium">-10% sur votre première commande</div>
        <div className="text-foreground/55 text-[11px] mt-0.5">
          Code <span className="font-mono text-foreground tracking-wider">{code}</span> · cliquez pour copier
        </div>
      </div>
      <span className={`eyebrow text-[10px] transition-opacity ${copied ? "text-emerald-500 opacity-100" : "text-foreground/50 opacity-0 group-hover:opacity-100"}`}>
        {copied ? "Copié ✓" : "Copier"}
      </span>
    </button>
  );
}

/** Indicateur de stock faible / urgence */
export function StockUrgency({ stock }: { stock: number }) {
  if (stock <= 0 || stock > 5) return null;
  return (
    <div className="border border-red-500/40 bg-red-500/5 px-4 py-3 flex items-center gap-3 anim-slide-up">
      <Icon name="fire" className="text-red-500 anim-pulse-soft" />
      <p className="text-foreground text-xs">
        <span className="font-semibold text-red-500 dark:text-red-400">Plus que {stock}</span>{" "}
        {stock > 1 ? "pièces disponibles" : "pièce disponible"} — commande rapide recommandée.
      </p>
    </div>
  );
}
