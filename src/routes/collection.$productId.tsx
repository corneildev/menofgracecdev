import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProductBySlug,
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  formatPriceEur,
  CATEGORY_LABELS,
  type ProductWithImages,
} from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SizeFinder } from "@/components/SizeFinder";
import { RestockAlertForm } from "@/components/RestockAlertForm";
import { trackProductEvent } from "@/lib/analytics";

export const Route = createFileRoute("/collection/$productId")({
  loader: async ({ params }) => {
    const product = await getProductBySlug(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — MEN OF GRACE` : "Collection — MEN OF GRACE";
    const desc = p?.description ?? "Tailored menswear, ready to ship.";
    const img = p?.primaryImage;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="pt-40 pb-32 px-6 text-center bg-ink min-h-screen">
      <div className="eyebrow mb-6">404</div>
      <h1 className="display text-5xl mb-6">Piece not found</h1>
      <Link to="/collection" className="luxury-btn">Back to Collection</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="pt-40 pb-32 px-6 text-center bg-ink min-h-screen">
      <div className="eyebrow mb-6">Error</div>
      <p className="text-bone/60 mb-8">{error.message}</p>
      <Link to="/collection" className="luxury-btn">Back to Collection</Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  return <ProductView product={product} />;
}

function ProductView({ product }: { product: ProductWithImages }) {
  const { has, toggle, ready } = useWishlist();
  const { add: addToCart } = useCart();
  const saved = ready && has(product.id);
  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [size, setSize] = useState<string | null>(null);
  const [fit, setFit] = useState<string>(product.fits[0] ?? "");
  const [lapel, setLapel] = useState<string>(product.lapels[0] ?? "");
  const [lining, setLining] = useState<string>(product.linings[0] ?? "");
  const [monogram, setMonogram] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Reset selections when navigating to a new product.
  useEffect(() => {
    setActiveImage(product.primaryImage);
    setSize(null);
    setFit(product.fits[0] ?? "");
    setLapel(product.lapels[0] ?? "");
    setLining(product.linings[0] ?? "");
    setMonogram("");
    setSizeError(null);
  }, [product.id, product.primaryImage, product.fits, product.lapels, product.linings]);

  const actuallySoldOut =
    product.sizes.length > 0 &&
    product.sizes.every((s) => product.sold_out_sizes?.includes(s));

  // Auto-switch if the currently selected size becomes sold out.
  useEffect(() => {
    if (!size) return;
    if (!product.sold_out_sizes?.includes(size)) return;
    const nextAvailable = product.sizes.find((s) => !product.sold_out_sizes?.includes(s)) ?? null;
    setSize(nextAvailable);
    if (nextAvailable) {
      setSizeError(`Taille ${size} épuisée — taille ${nextAvailable} sélectionnée.`);
    }
  }, [product.sold_out_sizes, product.sizes, size]);

  // Related products from Supabase (shared cache key with collection page).
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id)
      .filter((p) => {
        if (!p.sizes || p.sizes.length === 0) return true;
        return p.sizes.some((s) => !p.sold_out_sizes?.includes(s));
      })
      .sort((a, b) => {
        const aSame = a.category === product.category ? 0 : 1;
        const bSame = b.category === product.category ? 0 : 1;
        if (aSame !== bSame) return aSame - bSame;
        return Math.abs(a.price_fcfa - product.price_fcfa) - Math.abs(b.price_fcfa - product.price_fcfa);
      })
      .slice(0, 4);
  }, [allProducts, product.id, product.category, product.price_fcfa]);

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !size) {
      setSizeError("Veuillez sélectionner une taille.");
      // Scroll size selector into view so user sees the prompt
      if (typeof document !== "undefined") {
        document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (size && product.sold_out_sizes?.includes(size)) {
      setSizeError(`La taille ${size} est épuisée. Veuillez en choisir une autre.`);
      return;
    }
    setSizeError(null);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.primaryImage,
      fcfa: product.price_fcfa,
      usd: product.price_usd,
      size,
      availableSizes: product.sizes,
      fit,
      lapel,
      lining,
      monogram: monogram || undefined,
    });
  };

  return (
    <div className="bg-ink pt-32 sm:pt-40 pb-20 sm:pb-32 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mb-8 sm:mb-10">
        <div className="eyebrow text-bone/50 flex items-center gap-3 flex-wrap">
          <Link to="/collection" className="hover:text-bone">Collection</Link>
          <span>/</span>
          <span className="text-bone/80 truncate">{product.name}</span>
        </div>
      </div>

      {/* Gallery + Buy panel */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 sm:gap-12 lg:gap-20">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4 fade-in-slow">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {product.gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveImage(src)}
                  className={`aspect-[4/5] bg-secondary overflow-hidden border transition-colors ${
                    activeImage === src ? "border-bone" : "border-transparent hover:border-hairline"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:sticky lg:top-32 self-start">
          <div className="eyebrow text-bone/60 mb-4">{CATEGORY_LABELS[product.category]}</div>
          <h1 className="display text-3xl sm:text-4xl md:text-5xl mb-6 break-words">{product.name}</h1>
          {product.story && (
            <p className="text-bone/70 font-light leading-relaxed mb-8">{product.story}</p>
          )}

          <div className="border-y border-hairline py-6 mb-10">
            <div className="text-bone text-lg font-light">{formatPriceFcfa(product.price_fcfa)}</div>
            <div className="text-bone/50 text-sm font-light mt-1">
              {formatPriceUsd(product.price_usd)} · {formatPriceEur(product.price_eur)}
            </div>
          </div>

          {/* Size */}
          {product.sizes.length > 0 && (
            <div id="size-picker" className="scroll-mt-24">
              <Section label="Size">
                <TooltipProvider delayDuration={150}>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const soldOut = product.sold_out_sizes?.includes(s) ?? false;
                      const chip = (
                        <Chip
                          key={s}
                          active={size === s}
                          disabled={soldOut}
                          onClick={() => { if (soldOut) return; setSize(s); setSizeError(null); }}
                        >
                          <span className={soldOut ? "line-through" : ""}>{s}</span>
                          {soldOut && <span className="ml-2 text-[9px] tracking-[0.18em] opacity-70">Sold out</span>}
                        </Chip>
                      );
                      if (!soldOut) return chip;
                      return (
                        <Tooltip key={s}>
                          <TooltipTrigger asChild>
                            <span
                              className="inline-flex"
                              tabIndex={0}
                              aria-label={`Taille ${s} indisponible`}
                              onMouseEnter={() =>
                                trackProductEvent({
                                  type: "sold_out_tooltip_shown",
                                  productSlug: product.slug,
                                  productName: product.name,
                                  size: s,
                                })
                              }
                            >
                              {chip}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px] text-center">
                            <p className="text-xs leading-relaxed">
                              La taille <span className="font-medium">{s}</span> est actuellement indisponible.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="eyebrow text-[10px] text-bone/70 underline underline-offset-[6px] decoration-hairline hover:text-bone hover:decoration-bone transition-colors"
                      >
                        Find my size →
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-ink border-hairline text-bone max-w-xl">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl text-bone">Size Finder</DialogTitle>
                      </DialogHeader>
                      <div className="pt-2">
                        <SizeFinder
                          availableSizes={product.sizes.filter((s) => !product.sold_out_sizes?.includes(s))}
                          onPick={(s) => {
                            setSize(s);
                            setSizeError(null);
                          }}
                          variant="compact"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {actuallySoldOut && (
                  <>
                    <p className="text-xs text-bone/60 mt-3 tracking-wider font-light">
                      Toutes les tailles sont actuellement épuisées. Soyez prévenu dès que la pièce revient.
                    </p>
                    <RestockAlertForm
                      productSlug={product.slug}
                      productName={product.name}
                      size={size}
                      expectedRestockDate={new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000)}
                    />
                  </>
                )}
                {sizeError && (
                  <p role="alert" className="text-xs text-red-400/90 mt-3 tracking-wider">{sizeError}</p>
                )}
              </Section>
            </div>
          )}

          {/* Fit */}
          {product.fits.length > 0 && (
            <Section label="Fit">
              <div className="flex flex-wrap gap-2">
                {product.fits.map((f) => (
                  <Chip key={f} active={fit === f} onClick={() => setFit(f)}>{f}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Lapel */}
          {product.lapels.length > 0 && (
            <Section label="Lapel">
              <div className="flex flex-wrap gap-2">
                {product.lapels.map((l) => (
                  <Chip key={l} active={lapel === l} onClick={() => setLapel(l)}>{l}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Lining */}
          {product.linings.length > 0 && (
            <Section label="Lining">
              <div className="flex flex-wrap gap-2">
                {product.linings.map((l) => (
                  <Chip key={l} active={lining === l} onClick={() => setLining(l)}>{l}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Monogram */}
          {product.monogram && (
            <Section label="Monogram (optional)">
              <input
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.slice(0, 4).toUpperCase())}
                placeholder="3 initials"
                maxLength={4}
                className="w-full bg-transparent border-b border-hairline py-3 text-bone tracking-[0.3em] focus:outline-none focus:border-bone transition-colors"
              />
            </Section>
          )}

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={actuallySoldOut}
              aria-disabled={actuallySoldOut}
              className="luxury-btn luxury-btn-solid w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actuallySoldOut ? "Édition épuisée" : "Ajouter au Panier"}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={saved}
              className="luxury-btn w-full flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
                <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3.1c0 5.6-7.5 10.2-7.5 10.2Z" />
              </svg>
              {saved ? "Saved" : "Save to Wishlist"}
            </button>
          </div>

          <p className="eyebrow text-bone/40 mt-8 leading-relaxed">
            Shipped within 5 business days · Free local alterations
          </p>
        </div>
      </div>

      {/* Fabric & Details */}
      {(product.fabric_composition || product.fabric_weight || product.fabric_mill || product.fabric_notes || product.details.length > 0) && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-20 sm:mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {(product.fabric_composition || product.fabric_weight || product.fabric_mill || product.fabric_notes) && (
            <div>
              <div className="eyebrow text-bone/60 mb-6">— The Cloth —</div>
              <h2 className="display text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8">Fabric</h2>
              <dl className="space-y-5">
                {product.fabric_composition && <Row k="Composition" v={product.fabric_composition} />}
                {product.fabric_weight && <Row k="Weight" v={product.fabric_weight} />}
                {product.fabric_mill && <Row k="Mill" v={product.fabric_mill} />}
              </dl>
              {product.fabric_notes && (
                <p className="text-bone/60 font-light leading-relaxed mt-8">{product.fabric_notes}</p>
              )}
            </div>
          )}
          {product.details.length > 0 && (
            <div>
              <div className="eyebrow text-bone/60 mb-6">— Construction —</div>
              <h2 className="display text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8">Hand-finished details</h2>
              <ul className="space-y-4">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-4 text-bone/70 font-light leading-relaxed border-b border-hairline pb-4">
                    <span className="eyebrow text-bone/40 mt-1">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-20 sm:mt-32">
          <div className="border-t border-hairline pt-12 mb-10">
            <div className="eyebrow text-bone/60 mb-4">— You may also like —</div>
            <h2 className="display text-2xl sm:text-3xl md:text-4xl">Pieces from the collection</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to="/collection/$productId"
                params={{ productId: p.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4">
                  <img
                    src={p.primaryImage}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="eyebrow text-bone/50 text-[10px] mb-2">{CATEGORY_LABELS[p.category]}</div>
                <h3 className="font-serif text-bone text-lg mb-1 group-hover:text-bone/80 transition-colors">
                  {p.name}
                </h3>
                <div className="text-bone/60 font-light text-sm">{formatPriceFcfa(p.price_fcfa)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="eyebrow text-bone/60 mb-3">{label}</div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border transition-colors ${
        disabled
          ? "border-hairline text-bone/30 cursor-not-allowed"
          : active
            ? "border-bone bg-bone text-ink"
            : "border-hairline text-bone/70 hover:border-bone hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-hairline pb-3">
      <dt className="eyebrow text-bone/50 text-[10px]">{k}</dt>
      <dd className="text-bone/80 text-sm font-light text-right">{v}</dd>
    </div>
  );
}
