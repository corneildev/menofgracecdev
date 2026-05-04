import { useEffect, useState } from "react";

const MESSAGES = [
  "Livraison offerte dès 150 000 FCFA",
  "Soldes —15 % · Code : GRACE15 · jusqu'au 15/05",
  "Retouches locales offertes · Retours sous 14 jours",
  "Conseil privé sur WhatsApp · 7j/7",
];

export function PromoBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % MESSAGES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-foreground text-background text-[11px] tracking-[0.28em] uppercase font-light h-9 flex items-center justify-center overflow-hidden relative">
      <div className="relative h-full w-full max-w-[1600px] flex items-center justify-center px-6">
        {MESSAGES.map((m, idx) => (
          <span
            key={idx}
            className={`absolute inset-0 flex items-center justify-center text-center transition-all duration-700 px-4 ${
              idx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
