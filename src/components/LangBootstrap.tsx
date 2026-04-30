import { useEffect } from "react";
import i18n, { I18N_STORAGE_KEY, SUPPORTED_LANGS } from "@/i18n";

/**
 * Restores the user's stored language preference AFTER React has finished
 * hydrating. Running this in a useEffect (not at module load) guarantees the
 * client's first render matches the SSR HTML — preventing hydration mismatch.
 */
export function LangBootstrap() {
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
      if (
        stored &&
        (SUPPORTED_LANGS as readonly string[]).includes(stored) &&
        stored !== i18n.language
      ) {
        void i18n.changeLanguage(stored);
      }
    } catch {
      // ignore
    }
  }, []);
  return null;
}
