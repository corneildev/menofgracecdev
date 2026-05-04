import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { LangSwitch } from "@/components/LangSwitch";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PromoBar } from "@/components/PromoBar";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useWishlist();
  const { count: cartCount, open: openCart } = useCart();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav = [
    { to: "/collection" as const, label: t("nav.collection") },
    { to: "/wishlist" as const, label: t("nav.wishlist") },
    { to: "/account" as const, label: "Compte" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <PromoBar />
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-hairline py-3"
            : "bg-background/70 backdrop-blur-sm py-5"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 flex items-center justify-between gap-6">
          {/* Left: menu burger (mobile + desktop) + nav links desktop */}
          <div className="flex items-center gap-8">
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex flex-col gap-[5px] w-6 lg:hidden"
            >
              <span className="h-px w-full bg-foreground" />
              <span className="h-px w-4 bg-foreground" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.28em] uppercase text-foreground/85 font-light">
              <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/collection" className="hover:text-foreground transition-colors">Collection</Link>
              <Link to="/collection" className="hover:text-foreground transition-colors">Mariage</Link>
              <Link to="/size-finder" className="hover:text-foreground transition-colors">Sur-mesure</Link>
            </nav>
          </div>

          {/* Center: logo */}
          <Link
            to="/"
            className="font-serif text-foreground text-2xl md:text-[1.7rem] tracking-tight italic absolute left-1/2 -translate-x-1/2"
          >
            Men of Grace
          </Link>

          {/* Right: utilities */}
          <div className="flex items-center gap-4 sm:gap-5 text-[11px] tracking-[0.28em] uppercase text-foreground/85">
            <div className="hidden sm:block"><CurrencySwitch /></div>
            <div className="hidden sm:block"><LangSwitch /></div>
            <ThemeToggle />
            <Link to="/account" className="hover:text-foreground transition-colors hidden sm:flex" aria-label="Compte">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
              </svg>
            </Link>
            <Link to="/wishlist" className="hover:text-foreground transition-colors flex items-center gap-1.5" aria-label={t("nav.wishlist")}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3.1c0 5.6-7.5 10.2-7.5 10.2Z" />
              </svg>
              {count > 0 && <span>({count})</span>}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
              aria-label={t("common.cart")}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && <span>({cartCount})</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Side drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-full max-w-md bg-background border-r border-hairline px-10 py-10 transition-transform duration-700 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-20">
            <span className="eyebrow">{t("common.menu")}</span>
            <button onClick={() => setOpen(false)} className="text-foreground text-2xl font-light">×</button>
          </div>
          <ul className="flex flex-col gap-7">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl text-foreground hover:text-foreground/60 transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between eyebrow text-foreground/60">
            <CurrencySwitch />
            <LangSwitch onChange={() => setOpen(false)} />
          </div>
        </aside>
      </div>
    </header>
  );
}
