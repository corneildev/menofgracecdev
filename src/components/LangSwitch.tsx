import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type Lang } from "@/i18n";

export function LangSwitch({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2) as Lang;

  return (
    <div className={`flex items-center gap-2 eyebrow ${className}`}>
      {SUPPORTED_LANGS.map((lng, idx) => (
        <span key={lng} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            className={`uppercase tracking-[0.28em] transition-colors ${
              current === lng ? "text-bone" : "text-bone/45 hover:text-bone/80"
            }`}
            aria-label={`Switch language to ${lng.toUpperCase()}`}
            aria-pressed={current === lng}
          >
            {lng}
          </button>
          {idx < SUPPORTED_LANGS.length - 1 && (
            <span className="text-bone/30">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
