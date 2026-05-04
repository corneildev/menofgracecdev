import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
      className="hover:opacity-70 transition-opacity flex items-center justify-center w-7 h-7"
      suppressHydrationWarning
    >
      {mounted && isLight
        ? <Icon name="moon" className="text-[14px]" />
        : <Icon name="sun" className="text-[14px]" />}
    </button>
  );
}

