import { createFileRoute, Link } from "@tanstack/react-router";
import { products, formatPrice } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistButton } from "@/components/WishlistButton";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Saved Pieces — MEN OF GRACE" },
      { name: "description", content: "Your saved suits and tailored pieces from the MEN OF GRACE collection." },
      { property: "og:title", content: "Saved Pieces — MEN OF GRACE" },
      { property: "og:description", content: "Your private selection from the MEN OF GRACE collection." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { ids, ready, clear, count } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <div className="eyebrow text-bone/60 mb-6">— Your Selection —</div>
          <h1 className="display text-5xl md:text-7xl mb-6">Saved Pieces</h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            A private list of pieces you wish to revisit. Saved on this device.
          </p>
        </div>

        {!ready ? null : count === 0 ? (
          <div className="text-center border-y border-hairline py-24">
            <p className="text-bone/60 font-light mb-8">You haven't saved any pieces yet.</p>
            <Link to="/collection" className="luxury-btn">Browse the Collection</Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 border-b border-hairline pb-5">
              <span className="eyebrow text-bone/60">{count} {count === 1 ? "piece" : "pieces"}</span>
              <button onClick={clear} className="eyebrow text-bone/60 hover:text-bone transition-colors">
                Clear all
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
              {saved.map((p) => {
                const price = formatPrice(p);
                return (
                  <article key={p.id} className="group">
                    <div className="relative img-zoom aspect-[4/5] bg-secondary mb-6">
                      <WishlistButton productId={p.id} />
                      <Link to="/collection/$productId" params={{ productId: p.id }} className="block h-full w-full">
                        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      </Link>
                    </div>
                    <div className="eyebrow text-bone/50 mb-2">{p.category}</div>
                    <h2 className="font-serif text-2xl mb-3">
                      <Link to="/collection/$productId" params={{ productId: p.id }} className="hover:text-bone/70 transition-colors">
                        {p.name}
                      </Link>
                    </h2>
                    <div className="flex items-center justify-between border-t border-hairline pt-4">
                      <div className="text-bone/80 text-sm font-light flex flex-col">
                        <span>{price.fcfa}</span>
                        <span className="text-bone/50 text-xs">{price.usd} · {price.eur}</span>
                      </div>
                      <Link to="/collection/$productId" params={{ productId: p.id }} className="eyebrow text-bone hover:text-bone/60">
                        Discover
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
