import { Link } from "@tanstack/react-router";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQuantity, setSize, totalFcfa, totalUsd, count } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={close} />
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-ink border-l border-hairline flex flex-col transition-transform duration-700 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-8 py-7 border-b border-hairline">
          <span className="eyebrow">Votre Panier {count > 0 ? `· ${count}` : ""}</span>
          <button onClick={close} aria-label="Close" className="text-bone text-2xl font-light">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="text-center text-bone/60 font-light py-20">
              <p className="mb-8">Votre panier est vide.</p>
              <Link to="/collection" onClick={close} className="luxury-btn inline-block">
                Découvrir la Collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-8">
              {items.map((it) => (
                <li key={it.id} className="flex gap-5 border-b border-hairline pb-8">
                  <div className="w-20 h-24 bg-secondary shrink-0 overflow-hidden">
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-bone mb-1 truncate">{it.name}</h3>
                    <div className="eyebrow text-bone/50 mb-2 text-[10px]">
                      {it.fit} · {it.lapel}
                    </div>
                    {it.availableSizes && it.availableSizes.length > 0 ? (
                      <select
                        value={it.size ?? ""}
                        onChange={(e) => setSize(it.id, e.target.value)}
                        className="bg-ink border border-hairline text-bone text-[11px] px-2 py-1 mb-2 focus:outline-none focus:border-bone"
                        aria-label="Taille"
                      >
                        {!it.size && <option value="" disabled>Taille…</option>}
                        {it.availableSizes.map((s) => (
                          <option key={s} value={s}>Taille {s}</option>
                        ))}
                      </select>
                    ) : it.size ? (
                      <div className="eyebrow text-bone/50 mb-2 text-[10px]">Taille {it.size}</div>
                    ) : null}
                    <div className="text-bone/80 text-sm font-light mb-3">{formatFcfa(it.fcfa * it.quantity)}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-hairline">
                        <button
                          onClick={() => setQuantity(it.id, it.quantity - 1)}
                          className="px-3 py-1 text-bone/70 hover:text-bone"
                          aria-label="Decrease"
                        >−</button>
                        <span className="px-3 text-sm">{it.quantity}</span>
                        <button
                          onClick={() => setQuantity(it.id, it.quantity + 1)}
                          className="px-3 py-1 text-bone/70 hover:text-bone"
                          aria-label="Increase"
                        >+</button>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="eyebrow text-bone/50 hover:text-bone text-[10px]"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-hairline">
            <div className="flex justify-between items-baseline mb-1">
              <span className="eyebrow text-bone/60">Total</span>
              <span className="text-bone text-lg font-light">{formatFcfa(totalFcfa)}</span>
            </div>
            <div className="flex justify-end text-bone/50 text-xs mb-6">{formatUsd(totalUsd)}</div>
            <Link to="/checkout" onClick={close} className="luxury-btn luxury-btn-solid w-full block text-center mb-3">
              Passer commande
            </Link>
            <Link to="/cart" onClick={close} className="luxury-btn w-full block text-center">
              Voir le Panier
            </Link>
            <p className="eyebrow text-bone/40 mt-4 text-center text-[10px]">
              Expédition sous 5 jours ouvrés · Livraison mondiale
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
