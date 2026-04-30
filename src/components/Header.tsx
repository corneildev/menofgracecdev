import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { LangSwitch } from "@/components/LangSwitch";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useWishlist();
  const { count: cartCount, open: openCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { to: "/collection", label: t("nav.collection") },
    { to: "/business", label: t("nav.business") },
    { to: "/executive", label: t("nav.executive") },
    { to: "/corporate-program", label: t("nav.corporate") },
    { to: "/bespoke", label: t("nav.bespoke") },
    { to: "/wedding", label: t("nav.wedding") },
    { to: "/lookbook", label: t("nav.lookbook") },
    { to: "/atelier", label: t("nav.atelier") },
    { to: "/wishlist", label: t("nav.wishlist") },
  ] as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-ink/85 backdrop-blur-md py-4" : "bg-transparent py-7"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 flex items-center justify-between">
        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="hidden md:flex flex-col gap-[5px] w-6 group"
        >
          <span className="h-px w-full bg-bone" />
          <span className="h-px w-4 bg-bone" />
        </button>

        <nav className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2 opacity-0 pointer-events-none">
          {/* spacer for symmetry */}
        </nav>

        <Link
          to="/"
          className="font-serif text-bone text-xl md:text-2xl tracking-[0.35em] mx-auto md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          MEN OF GRACE
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.28em] uppercase text-bone/85">
          <Link to="/bespoke" className="hover:text-bone transition-colors">Book Fitting</Link>
          <Link to="/collection" className="hover:text-bone transition-colors">Shop</Link>
          <Link to="/wishlist" className="hover:text-bone transition-colors flex items-center gap-2" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3.1c0 5.6-7.5 10.2-7.5 10.2Z" />
            </svg>
            <span>Saved{count > 0 ? ` (${count})` : ""}</span>
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="hover:text-bone transition-colors flex items-center gap-2"
            aria-label="Open cart"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            <span>Panier{cartCount > 0 ? ` (${cartCount})` : ""}</span>
          </button>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col gap-[5px] w-6"
        >
          <span className="h-px w-full bg-bone" />
          <span className="h-px w-4 bg-bone" />
        </button>
      </div>

      {/* Side drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-full max-w-md bg-ink border-r border-hairline px-10 py-10 transition-transform duration-700 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-20">
            <span className="eyebrow">Menu</span>
            <button onClick={() => setOpen(false)} className="text-bone text-2xl font-light">×</button>
          </div>
          <ul className="flex flex-col gap-7">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl text-bone hover:text-bone/60 transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-10 left-10 right-10 eyebrow text-bone/60">
            Paris · Lagos · Abidjan · Dubai
          </div>
        </aside>
      </div>
    </header>
  );
}
