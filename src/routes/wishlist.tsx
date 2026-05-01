import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  formatPriceEur,
  CATEGORY_LABELS,
} from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistButton } from "@/components/WishlistButton";
import { generateWishlistPdf } from "@/lib/wishlistPdf";

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
  const { data: products = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });
  const saved = products.filter((p) => ids.includes(p.id));
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!saved.length || downloading) return;
    setDownloading(true);
    try {
      await generateWishlistPdf(saved);
    } finally {
      setDownloading(false);
    }
  };

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
            <div className="flex flex-wrap gap-4 justify-between items-center mb-10 border-b border-hairline pb-5">
              <span className="eyebrow text-bone/60">{count} {count === 1 ? "piece" : "pieces"}</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={handleDownload}
                  disabled={downloading || saved.length === 0}
                  className="eyebrow text-bone hover:text-bone/70 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  aria-label="Download wishlist as PDF"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" />
                  </svg>
                  {downloading ? "Preparing…" : "Download Folio (PDF)"}
                </button>
                <button onClick={clear} className="eyebrow text-bone/60 hover:text-bone transition-colors">
                  Clear all
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
              {saved.map((p) => (
                <article key={p.id} className="group">
                  <div className="relative img-zoom aspect-[4/5] bg-secondary mb-6">
                    <WishlistButton productId={p.id} />
                    <Link to="/collection/$productId" params={{ productId: p.slug }} className="block h-full w-full">
                      <img src={p.primaryImage} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    </Link>
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{CATEGORY_LABELS[p.category]}</div>
                  <h2 className="font-serif text-2xl mb-3">
                    <Link to="/collection/$productId" params={{ productId: p.slug }} className="hover:text-bone/70 transition-colors">
                      {p.name}
                    </Link>
                  </h2>
                  <div className="flex items-center justify-between border-t border-hairline pt-4">
                    <div className="text-bone/80 text-sm font-light flex flex-col">
                      <span>{formatPriceFcfa(p.price_fcfa)}</span>
                      <span className="text-bone/50 text-xs">
                        {formatPriceUsd(p.price_usd)} · {formatPriceEur(p.price_eur)}
                      </span>
                    </div>
                    <Link to="/collection/$productId" params={{ productId: p.slug }} className="eyebrow text-bone hover:text-bone/60">
                      Discover
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
