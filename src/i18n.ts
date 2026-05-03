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

// After hydration, persist language changes to localStorage.
// IMPORTANT: We do NOT auto-switch the language here on load — that would race
// against React hydration and cause SSR/CSR text mismatches in the Header.
// The language is restored from storage by <LangBootstrap /> mounted in __root,
// inside a useEffect that runs strictly AFTER the first hydration pass.
if (typeof window !== "undefined") {
  try {
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

export const I18N_STORAGE_KEY = STORAGE_KEY;

export default i18n;
