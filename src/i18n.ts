import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import fr from "./locales/fr";

export const SUPPORTED_LANGS = ["en", "fr"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
const STORAGE_KEY = "mog_lang";

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: "en", // fixed initial language for SSR/CSR first paint to avoid hydration mismatch
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// After hydration, switch to the user's stored preference.
if (typeof window !== "undefined") {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored) && stored !== i18n.language) {
      // Defer to a microtask so initial paint matches SSR.
      queueMicrotask(() => {
        void i18n.changeLanguage(stored);
      });
    }
    i18n.on("languageChanged", (lng) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, lng.slice(0, 2));
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

export default i18n;
