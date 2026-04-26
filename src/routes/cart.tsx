import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Panier — MEN OF GRACE" },
      { name: "description", content: "Votre sélection de pièces tailored MEN OF GRACE." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, ready, remove, setQuantity, clear, totalFcfa, totalUsd, count } = useCart();

  const waMessage = encodeURIComponent(
    `Bonjour MEN OF GRACE — je souhaite finaliser ma commande:\n\n` +
      items
        .map(
          (i) =>
            `• ${i.name} ×${i.quantity} — ${i.fit}, ${i.lapel}${i.size ? `, taille ${i.size}` : ""}${
              i.monogram ? `, monogramme ${i.monogram}` : ""
            } (${formatFcfa(i.fcfa * i.quantity)})`,
        )
        .join("\n") +
      `\n\nTotal: ${formatFcfa(totalFcfa)} (${formatUsd(totalUsd)})`,
  );
  const waHref = `https://wa.me/?text=${waMessage}`;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <div className="eyebrow text-bone/60 mb-6">— Votre Panier —</div>
          <h1 className="display text-5xl md:text-7xl mb-6">Panier</h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            Vos pièces sélectionnées. Réservation finalisée par notre concierge.
          </p>
        </div>

        {!ready ? null : count === 0 ? (
          <div className="text-center border-y border-hairline py-24">
            <p className="text-bone/60 font-light mb-8">Votre panier est vide.</p>
            <Link to="/collection" className="luxury-btn">Découvrir la Collection</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-16">
            <div>
              <div className="flex justify-between items-center mb-8 border-b border-hairline pb-5">
                <span className="eyebrow text-bone/60">{count} {count === 1 ? "pièce" : "pièces"}</span>
                <button onClick={clear} className="eyebrow text-bone/60 hover:text-bone transition-colors">
                  Tout vider
                </button>
              </div>

              <ul className="space-y-10">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-6 border-b border-hairline pb-10">
                    <Link
                      to="/collection/$productId"
                      params={{ productId: it.productId }}
                      className="w-32 md:w-40 aspect-[4/5] bg-secondary shrink-0 overflow-hidden"
                    >
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-2xl text-bone mb-2">
                        <Link to="/collection/$productId" params={{ productId: it.productId }} className="hover:text-bone/70">
                          {it.name}
                        </Link>
                      </h2>
                      <div className="eyebrow text-bone/50 mb-4 text-[10px]">
                        {it.fit} · {it.lapel} · {it.lining}
                        {it.size ? ` · Taille ${it.size}` : ""}
                        {it.monogram ? ` · ${it.monogram}` : ""}
                      </div>
                      <div className="text-bone/80 text-sm font-light mb-5">
                        {formatFcfa(it.fcfa * it.quantity)}
                        <span className="text-bone/40 ml-3">{formatUsd(it.usd * it.quantity)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-hairline">
                          <button onClick={() => setQuantity(it.id, it.quantity - 1)} className="px-4 py-2 text-bone/70 hover:text-bone" aria-label="Decrease">−</button>
                          <span className="px-4 text-sm">{it.quantity}</span>
                          <button onClick={() => setQuantity(it.id, it.quantity + 1)} className="px-4 py-2 text-bone/70 hover:text-bone" aria-label="Increase">+</button>
                        </div>
                        <button onClick={() => remove(it.id)} className="eyebrow text-bone/50 hover:text-bone text-[10px]">
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-32 self-start border border-hairline p-8">
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
                  <div className="text-bone text-xl font-light">{formatFcfa(totalFcfa)}</div>
                  <div className="text-bone/50 text-xs">{formatUsd(totalUsd)}</div>
                </div>
              </div>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="luxury-btn luxury-btn-solid w-full block text-center mb-3">
                Finaliser via WhatsApp
              </a>
              <Link to="/collection" className="luxury-btn w-full block text-center">
                Continuer mes achats
              </Link>
              <p className="eyebrow text-bone/40 mt-6 leading-relaxed text-[10px]">
                Confection 6–8 semaines · Essayage privé inclus · Livraison mondiale assurée
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
