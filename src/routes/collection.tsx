import { createFileRoute, Link } from "@tanstack/react-router";
import { products, formatPrice } from "@/data/products";
import { WishlistButton } from "@/components/WishlistButton";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — MEN OF GRACE" },
      { name: "description", content: "Browse the seasonal collection of bespoke suits, tuxedos and executive tailoring." },
      { property: "og:title", content: "Collection — MEN OF GRACE" },
      { property: "og:description", content: "The seasonal collection of bespoke suits and tuxedos." },
    ],
  }),
  component: Collection,
});

function Collection() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-24">
          <div className="eyebrow text-bone/60 mb-6">— Spring · Summer —</div>
          <h1 className="display text-5xl md:text-8xl mb-6">The Collection</h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            Twelve silhouettes. One philosophy. Each piece composed in our atelier and finished entirely by hand.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {products.map((p) => {
            const price = formatPrice(p);
            return (
              <article key={p.id} className="group">
                <div className="relative img-zoom aspect-[4/5] bg-secondary mb-6">
                  <WishlistButton productId={p.id} />
                  <Link
                    to="/collection/$productId"
                    params={{ productId: p.id }}
                    className="block h-full w-full"
                  >
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  </Link>
                </div>
                <div className="eyebrow text-bone/50 mb-2">{p.category}</div>
                <h2 className="font-serif text-2xl mb-3">
                  <Link to="/collection/$productId" params={{ productId: p.id }} className="hover:text-bone/70 transition-colors">
                    {p.name}
                  </Link>
                </h2>
                <p className="text-bone/60 font-light text-sm mb-5 leading-relaxed">{p.description}</p>
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
      </div>
    </div>
  );
}
