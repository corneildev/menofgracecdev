import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { LangSwitch } from "@/components/LangSwitch";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PromoBar } from "@/components/PromoBar";
import { Icon } from "@/components/Icon";
import { motion, AnimatePresence } from "framer-motion";

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

  const drawerNav = [
    { to: "/" as const, label: "Accueil" },
    { to: "/collection" as const, label: "Collection" },
    { to: "/size-finder" as const, label: "Sur-mesure" },
    { to: "/track-order" as const, label: "Suivi de commande" },
    { to: "/wishlist" as const, label: t("nav.wishlist") },
    { to: "/account" as const, label: "Compte" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <PromoBar />
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-background/92 backdrop-blur-md border-b border-hairline py-3"
            : "bg-background/70 backdrop-blur-sm py-4 md:py-5"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-10 grid grid-cols-3 items-center gap-3">
          {/* LEFT: burger (always) + desktop nav */}
          <div className="flex items-center gap-6 min-w-0">
            <button
              aria-label="Ouvrir le menu"
              onClick={() => setOpen(true)}
              className="flex items-center justify-center w-7 h-7 lg:hidden hover:opacity-70 transition-opacity"
            >
              <Icon name="bars" className="text-base" />
            </button>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] tracking-[0.26em] uppercase text-foreground/85 font-light">
              <Link to="/" className="hover:text-foreground transition-colors">{"Accueil"}</Link>
              <Link to="/collection" className="hover:text-foreground transition-colors">{"Collection"}</Link>
              <Link to="/collection" className="hover:text-foreground transition-colors">{"Mariage"}</Link>
              <Link to="/size-finder" className="hover:text-foreground transition-colors">{"Sur-mesure"}</Link>
            </nav>
          </div>

          {/* CENTER: logo */}
          <div className="flex items-center justify-center min-w-0">
            <Link
              to="/"
              className="font-serif text-foreground text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] tracking-tight italic truncate"
            >
              {"Men of Grace"}
            </Link>
          </div>

          {/* RIGHT: utilities */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-5 text-[11px] tracking-[0.26em] uppercase text-foreground/85">
            <div className="hidden md:block"><CurrencySwitch /></div>
            <div className="hidden md:block"><LangSwitch /></div>
            <ThemeToggle />
            <Link
              to="/account"
              className="hover:text-foreground transition-colors hidden sm:flex items-center justify-center w-7 h-7"
              aria-label="Compte"
            >
              <Icon name="user" className="text-[15px]" />
            </Link>
            <Link
              to="/wishlist"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
              aria-label={t("nav.wishlist")}
            >
              <Icon name="heart-o" className="text-[15px]" />
              {count > 0 && <span className="text-[10px]">({count})</span>}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
              aria-label={t("common.cart")}
            >
              <Icon name="cart" className="text-[15px]" />
              {cartCount > 0 && <span className="text-[10px]">({cartCount})</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Side drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 h-full w-full max-w-md bg-background border-r border-hairline px-7 sm:px-10 py-8 sm:py-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12 sm:mb-16">
                <span className="eyebrow tracking-[0.4em]">{t("common.menu")}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="text-foreground hover:opacity-70 transition-opacity w-7 h-7 flex items-center justify-center"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-6 sm:gap-8">
                  {drawerNav.map((n, i) => (
                    <motion.li
                      key={n.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        to={n.to}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4"
                      >
                        <span className="font-serif text-3xl sm:text-5xl text-foreground group-hover:italic transition-all">
                          {n.label}
                        </span>
                        <div className="h-[1px] flex-1 bg-hairline scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto pt-10">
                <div className="grid grid-cols-2 gap-8 mb-10 eyebrow text-[10px] text-foreground/50">
                  <div>
                    <div className="mb-4 text-foreground/30">— Social —</div>
                    <div className="flex flex-col gap-2">
                      <a href="https://instagram.com" className="hover:text-foreground">Instagram</a>
                      <a href="#" className="hover:text-foreground">Facebook</a>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4 text-foreground/30">— Contact —</div>
                    <div className="flex flex-col gap-2">
                      <a href="mailto:hello@menofgrace.com" className="hover:text-foreground">Email</a>
                      <a href="#" className="hover:text-foreground">WhatsApp</a>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-hairline flex items-center justify-between gap-4 eyebrow text-foreground/70">
                  <CurrencySwitch />
                  <LangSwitch onChange={() => setOpen(false)} />
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
