import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Panier — MEN OF GRACE" },
<<<<<<< HEAD
      { name: "description", content: "Votre sélection de pièces tailored MEN OF GRACE." },
=======
      {
        name: "description",
        content: "Votre sélection de pièces tailored MEN OF GRACE.",
      },
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
<<<<<<< HEAD
  const { items, ready, remove, setQuantity, setSize, clear, totalFcfa, totalUsd, count } = useCart();
=======
  const {
    items,
    ready,
    remove,
    setQuantity,
    setSize,
    clear,
    totalFcfa,
    totalUsd,
    count,
  } = useCart();
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

  return (
    <div className="pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-ink min-h-screen overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <div className="eyebrow text-bone/60 mb-6">— Votre Panier —</div>
<<<<<<< HEAD
          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">Panier</h1>
=======
          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Panier
          </h1>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            Vos pièces sélectionnées.
          </p>
        </div>

        {!ready ? null : count === 0 ? (
          <div className="text-center border-y border-hairline py-24">
<<<<<<< HEAD
            <p className="text-bone/60 font-light mb-8">Votre panier est vide.</p>
            <Link to="/collection" className="luxury-btn">Découvrir la Collection</Link>
=======
            <p className="text-bone/60 font-light mb-8">
              Votre panier est vide.
            </p>
            <Link to="/collection" className="luxury-btn">
              Découvrir la Collection
            </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16">
            <div>
              <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-hairline pb-5 gap-4">
<<<<<<< HEAD
                <span className="eyebrow text-bone/60">{count} {count === 1 ? "pièce" : "pièces"}</span>
                <button onClick={clear} className="eyebrow text-bone/60 hover:text-bone transition-colors">
=======
                <span className="eyebrow text-bone/60">
                  {count} {count === 1 ? "pièce" : "pièces"}
                </span>
                <button
                  onClick={clear}
                  className="eyebrow text-bone/60 hover:text-bone transition-colors"
                >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  Tout vider
                </button>
              </div>

              <ul className="space-y-8 sm:space-y-10">
                {items.map((it) => (
<<<<<<< HEAD
                  <li key={it.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-hairline pb-8 sm:pb-10">
                    <Link
                      to="/collection/$productId"
                      params={{ productId: it.productId }}
                      className="w-full sm:w-32 md:w-40 aspect-[4/5] bg-secondary shrink-0 overflow-hidden max-w-[160px]"
                    >
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-xl sm:text-2xl text-bone mb-2">
                        <Link to="/collection/$productId" params={{ productId: it.productId }} className="hover:text-bone/70">
=======
                  <li
                    key={it.id}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-hairline pb-8 sm:pb-10"
                  >
                    <Link
                      to="/collection/$productId"
                      params={{ productId: it.productSlug ?? it.productId }}
                      className="w-full sm:w-32 md:w-40 aspect-[4/5] bg-secondary shrink-0 overflow-hidden max-w-[160px]"
                    >
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-xl sm:text-2xl text-bone mb-2">
                        <Link
                          to="/collection/$productId"
                          params={{ productId: it.productSlug ?? it.productId }}
                          className="hover:text-bone/70"
                        >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                          {it.name}
                        </Link>
                      </h2>
                      <div className="eyebrow text-bone/50 mb-4 text-[10px]">
                        {it.fit} · {it.lapel} · {it.lining}
                        {it.monogram ? ` · ${it.monogram}` : ""}
                      </div>
                      <div className="mb-4 flex items-center gap-3">
<<<<<<< HEAD
                        <label className="eyebrow text-bone/60 text-[10px]" htmlFor={`size-${it.id}`}>Taille</label>
=======
                        <label
                          className="eyebrow text-bone/60 text-[10px]"
                          htmlFor={`size-${it.id}`}
                        >
                          Taille
                        </label>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                        {it.availableSizes && it.availableSizes.length > 0 ? (
                          <select
                            id={`size-${it.id}`}
                            value={it.size ?? ""}
                            onChange={(e) => setSize(it.id, e.target.value)}
                            className="bg-ink border border-hairline text-bone text-xs px-3 py-1.5 focus:outline-none focus:border-bone"
                          >
<<<<<<< HEAD
                            {!it.size && <option value="" disabled>Choisir…</option>}
                            {it.availableSizes.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-bone/70 text-xs">{it.size ?? "—"}</span>
=======
                            {!it.size && (
                              <option value="" disabled>
                                Choisir…
                              </option>
                            )}
                            {it.availableSizes.map((s) => (
                              <option
                                key={s}
                                value={s}
                                disabled={it.soldOutSizes?.includes(s)}
                              >
                                {it.soldOutSizes?.includes(s)
                                  ? `${s} (épuisée)`
                                  : s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-bone/70 text-xs">
                            {it.size ?? "—"}
                          </span>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                        )}
                      </div>
                      <div className="text-bone/80 text-sm font-light mb-5">
                        {formatFcfa(it.fcfa * it.quantity)}
<<<<<<< HEAD
                        <span className="text-bone/40 ml-3">{formatUsd(it.usd * it.quantity)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-hairline">
                          <button onClick={() => setQuantity(it.id, it.quantity - 1)} className="px-4 py-2 text-bone/70 hover:text-bone" aria-label="Decrease">−</button>
                          <span className="px-4 text-sm">{it.quantity}</span>
                          <button onClick={() => setQuantity(it.id, it.quantity + 1)} className="px-4 py-2 text-bone/70 hover:text-bone" aria-label="Increase">+</button>
                        </div>
                        <button onClick={() => remove(it.id)} className="eyebrow text-bone/50 hover:text-bone text-[10px]">
=======
                        <span className="text-bone/40 ml-3">
                          {formatUsd(it.usd * it.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-hairline">
                          <button
                            onClick={() => setQuantity(it.id, it.quantity - 1)}
                            className="px-4 py-2 text-bone/70 hover:text-bone"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="px-4 text-sm">{it.quantity}</span>
                          <button
                            onClick={() => setQuantity(it.id, it.quantity + 1)}
                            className="px-4 py-2 text-bone/70 hover:text-bone"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="eyebrow text-bone/50 hover:text-bone text-[10px]"
                        >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-32 self-start border border-hairline p-6 sm:p-8">
              <div className="eyebrow text-bone/60 mb-6">— Récapitulatif —</div>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-bone/70 font-light text-sm">
                  <span>Sous-total</span>
                  <span>{formatFcfa(totalFcfa)}</span>
                </div>
                <div className="flex justify-between text-bone/50 font-light text-xs">
                  <span>Équivalent</span>
                  <span>{formatUsd(totalUsd)}</span>
                </div>
                <div className="flex justify-between text-bone/50 font-light text-sm border-t border-hairline pt-3">
                  <span>Livraison</span>
                  <span>Offerte</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline border-t border-hairline pt-5 mb-8">
                <span className="eyebrow">Total</span>
                <div className="text-right">
<<<<<<< HEAD
                  <div className="text-bone text-xl font-light">{formatFcfa(totalFcfa)}</div>
                  <div className="text-bone/50 text-xs">{formatUsd(totalUsd)}</div>
                </div>
              </div>
              <Link to="/checkout" className="luxury-btn luxury-btn-solid w-full block text-center mb-3">
                Procéder au Paiement
              </Link>
              <Link to="/collection" className="luxury-btn w-full block text-center">
=======
                  <div className="text-bone text-xl font-light">
                    {formatFcfa(totalFcfa)}
                  </div>
                  <div className="text-bone/50 text-xs">
                    {formatUsd(totalUsd)}
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="luxury-btn luxury-btn-solid w-full block text-center mb-3"
              >
                Procéder au Paiement
              </Link>
              <Link
                to="/collection"
                className="luxury-btn w-full block text-center"
              >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                Continuer mes achats
              </Link>
              <p className="eyebrow text-bone/40 mt-6 leading-relaxed text-[10px]">
                Shipped within 5 business days · Free local alterations
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
