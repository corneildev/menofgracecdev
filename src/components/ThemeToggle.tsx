import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The pre-hydration ScriptOnce in __root may already have applied .light
    // based on localStorage. Sync our state to that authoritative truth.
    setIsLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextLight = !isLight;
    setIsLight(nextLight);
    if (nextLight) {
      document.documentElement.classList.add("light");
      try { localStorage.setItem("mog:theme", "light"); } catch { /* ignore */ }
    } else {
      document.documentElement.classList.remove("light");
      try { localStorage.setItem("mog:theme", "dark"); } catch { /* ignore */ }
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Passer en mode sombre" : "Passer en mode clair"}
      className="hover:opacity-70 transition-opacity flex items-center justify-center"
      suppressHydrationWarning
    >
      {/* Render the same icon during SSR/first paint to avoid hydration mismatch */}
      {mounted && isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
