import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

const CURRENCIES = ["FCFA", "EUR", "USD"] as const;
type Currency = (typeof CURRENCIES)[number];

const STORAGE_KEY = "mog:currency";

export function getStoredCurrency(): Currency {
  if (typeof window === "undefined") return "FCFA";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "EUR" || v === "USD" || v === "FCFA") return v;
  } catch { /* ignore */ }
  return "FCFA";
}

export function CurrencySwitch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Currency>("FCFA");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getStoredCurrency());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  const select = (c: Currency) => {
    setCurrent(c);
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
    if (location.pathname.startsWith("/collection")) {
      navigate({
        to: "/collection",
        search: (prev: Record<string, string>) => ({ ...prev, currency: c }),
      });
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
        aria-label="Changer de devise"
      >
        <span>{current}</span>
        <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 fill-current"><path d="M0 0l5 6 5-6z" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 min-w-[80px] bg-background border border-hairline shadow-xl z-50">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => select(c)}
              className={`block w-full text-left px-4 py-2 text-[11px] tracking-[0.28em] uppercase hover:bg-foreground/5 transition-colors ${
                c === current ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
