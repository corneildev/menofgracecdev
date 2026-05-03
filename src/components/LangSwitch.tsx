import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type Lang } from "@/i18n";

interface LangSwitchProps {
  className?: string;
  onChange?: (lang: Lang) => void;
}

export function LangSwitch({ className = "", onChange }: LangSwitchProps) {
  const { i18n } = useTranslation();
  // Always start at "en" to match SSR-rendered HTML; sync to actual lang after mount.
  const [current, setCurrent] = useState<Lang>("en");

  useEffect(() => {
    const handler = (lng: string) => {
      const next = lng.slice(0, 2) as Lang;
      setCurrent(next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", next);
      }
    };
    // initial sync (post-mount, safe for hydration)
    handler(i18n.resolvedLanguage || i18n.language || "en");
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, [i18n]);

  const handleClick = async (lng: Lang) => {
    if (lng === current) return;
    await i18n.changeLanguage(lng);
    onChange?.(lng);
  };

  return (
    <div className={`flex items-center gap-2 eyebrow ${className}`} role="group" aria-label="Language">
      {SUPPORTED_LANGS.map((lng, idx) => (
        <span key={lng} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleClick(lng)}
            className={`uppercase tracking-[0.28em] transition-colors ${
              current === lng ? "text-bone" : "text-bone/45 hover:text-bone/80"
            }`}
            aria-label={`Switch language to ${lng.toUpperCase()}`}
            aria-pressed={current === lng}
            lang={lng}
          >
            {lng}
          </button>
          {idx < SUPPORTED_LANGS.length - 1 && (
            <span className="text-bone/30" aria-hidden="true">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
