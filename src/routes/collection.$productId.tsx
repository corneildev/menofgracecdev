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
  type ProductVariantRow,
} from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SizeFinder } from "@/components/SizeFinder";
import { RestockAlertForm } from "@/components/RestockAlertForm";
import { ProductMediaGallery } from "@/components/ProductMediaGallery";
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
    const desc = p?.short_description ?? p?.description ?? "Tailored menswear, ready to ship.";
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

// Helper: derive available sizes/colors either from variants (preferred) or legacy arrays.
function deriveOptions(p: ProductWithImages) {
  if (p.variants && p.variants.length > 0) {
    const sizes = Array.from(new Set(p.variants.map((v) => v.size).filter((s): s is string => !!s)));
    const colors = Array.from(new Set(p.variants.map((v) => v.color).filter((s): s is string => !!s)));
    return { sizes, colors, hasVariants: true };
  }
  return { sizes: p.sizes, colors: p.colors, hasVariants: false };
}

function findVariant(variants: ProductVariantRow[], size: string | null, color: string | null) {
  return variants.find((v) => (v.size ?? null) === size && (v.color ?? null) === color) ?? null;
}

function ProductView({ product }: { product: ProductWithImages }) {
  const { has, toggle, ready } = useWishlist();
  const { add: addToCart } = useCart();
  const saved = ready && has(product.id);

  const { sizes, colors, hasVariants } = useMemo(() => deriveOptions(product), [product]);

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [fit, setFit] = useState<string>(product.fits[0] ?? "");
  const [lapel, setLapel] = useState<string>(product.lapels[0] ?? "");
  const [lining, setLining] = useState<string>(product.linings[0] ?? "");
  const [monogram, setMonogram] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Reset selections on product change.
  useEffect(() => {
    setSize(null);
    setColor(colors[0] ?? null);
    setFit(product.fits[0] ?? "");
    setLapel(product.lapels[0] ?? "");
    setLining(product.linings[0] ?? "");
    setMonogram("");
    setSizeError(null);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Currently selected variant (when variants exist).
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return findVariant(product.variants, size, color);
  }, [hasVariants, product.variants, size, color]);

  // Variant-aware sold-out logic.
  const isSizeSoldOut = (s: string): boolean => {
    if (hasVariants) {
      const candidates = product.variants.filter((v) => v.size === s && (color ? v.color === color : true));
      if (candidates.length === 0) return true;
      return candidates.every((v) => !v.is_available || v.stock <= 0);
    }
    return product.sold_out_sizes?.includes(s) ?? false;
  };

  const actuallySoldOut = sizes.length > 0 && sizes.every((s) => isSizeSoldOut(s));

  // Auto-switch if the currently selected size becomes sold out.
  useEffect(() => {
    if (!size) return;
    if (!isSizeSoldOut(size)) return;
    const nextAvailable = sizes.find((s) => !isSizeSoldOut(s)) ?? null;
    setSize(nextAvailable);
    if (nextAvailable) {
      setSizeError(`Taille ${size} épuisée — taille ${nextAvailable} sélectionnée.`);
    }
  }, [color]); // eslint-disable-line react-hooks/exhaustive-deps

  // Variant-image filtering: prefer exact size+color match, fallback to color-only.
  const filterVariantId = useMemo(() => {
    if (!hasVariants) return null;
    if (size && color) {
      const exact = product.variants.find((x) => x.size === size && x.color === color);
      if (exact) return exact.id;
    }
    if (color) {
      const v = product.variants.find((x) => x.color === color);
      if (v) return v.id;
    }
    if (size) {
      const v = product.variants.find((x) => x.size === size);
      if (v) return v.id;
    }
    return null;
  }, [hasVariants, size, color, product.variants]);

  // Effective price (variant override > product)
  const effectivePrice = useMemo(() => {
    if (selectedVariant?.price_fcfa) {
      return {
        fcfa: selectedVariant.price_fcfa,
        usd: selectedVariant.price_usd ?? product.price_usd,
        eur: selectedVariant.price_eur ?? product.price_eur,
      };
    }
    return { fcfa: product.price_fcfa, usd: product.price_usd, eur: product.price_eur };
  }, [selectedVariant, product]);

  // Related products
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        const aSame = a.category === product.category ? 0 : 1;
        const bSame = b.category === product.category ? 0 : 1;
        if (aSame !== bSame) return aSame - bSame;
        return Math.abs(a.price_fcfa - product.price_fcfa) - Math.abs(b.price_fcfa - product.price_fcfa);
      })
      .slice(0, 4);
  }, [allProducts, product.id, product.category, product.price_fcfa]);

  const handleAddToCart = () => {
    if (sizes.length > 0 && !size) {
      setSizeError("Veuillez sélectionner une taille.");
      if (typeof document !== "undefined") {
        document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (size && isSizeSoldOut(size)) {
      setSizeError(`La taille ${size} est épuisée.`);
      return;
    }
    setSizeError(null);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.primaryImage,
      fcfa: effectivePrice.fcfa,
      usd: effectivePrice.usd,
      size,
      availableSizes: sizes,
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
        <ProductMediaGallery
          images={product.images}
          videos={product.videos}
          alt={product.name}
          filterVariantId={filterVariantId}
        />

        {/* Buy panel */}
        <div className="lg:sticky lg:top-32 self-start">
          <div className="eyebrow text-bone/60 mb-4">{CATEGORY_LABELS[product.category]}</div>
          <h1 className="display text-3xl sm:text-4xl md:text-5xl mb-6 break-words">{product.name}</h1>
          {product.short_description && (
            <p className="text-bone/70 font-light leading-relaxed mb-6">{product.short_description}</p>
          )}

          <div className="border-y border-hairline py-6 mb-10">
            <div className="text-bone text-lg font-light">{formatPriceFcfa(effectivePrice.fcfa)}</div>
            <div className="text-bone/50 text-sm font-light mt-1">
              {formatPriceUsd(effectivePrice.usd)} · {formatPriceEur(effectivePrice.eur)}
            </div>
            {selectedVariant && (
              <div className="eyebrow text-bone/40 text-[10px] mt-3">
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} en stock` : "Rupture"}
                {selectedVariant.sku ? ` · SKU ${selectedVariant.sku}` : ""}
              </div>
            )}
          </div>

          {/* Color */}
          {colors.length > 0 && (
            <Section label="Couleur">
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <Chip key={c} active={color === c} onClick={() => setColor(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Size */}
          {sizes.length > 0 && (
            <div id="size-picker" className="scroll-mt-24">
              <Section label="Taille">
                <TooltipProvider delayDuration={150}>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const soldOut = isSizeSoldOut(s);
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
                          availableSizes={sizes.filter((s) => !isSizeSoldOut(s))}
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
            <Section label="Coupe">
              <div className="flex flex-wrap gap-2">
                {product.fits.map((f) => (
                  <Chip key={f} active={fit === f} onClick={() => setFit(f)}>{f}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Lapel */}
          {product.lapels.length > 0 && (
            <Section label="Revers">
              <div className="flex flex-wrap gap-2">
                {product.lapels.map((l) => (
                  <Chip key={l} active={lapel === l} onClick={() => setLapel(l)}>{l}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Lining */}
          {product.linings.length > 0 && (
            <Section label="Doublure">
              <div className="flex flex-wrap gap-2">
                {product.linings.map((l) => (
                  <Chip key={l} active={lining === l} onClick={() => setLining(l)}>{l}</Chip>
                ))}
              </div>
            </Section>
          )}

          {/* Monogram */}
          {product.monogram && (
            <Section label="Monogramme (optionnel)">
              <input
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.slice(0, 4).toUpperCase())}
                placeholder="3 initiales"
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
              {saved ? "Sauvegardé" : "Ajouter à la Wishlist"}
            </button>
          </div>

          <p className="eyebrow text-bone/40 mt-8 leading-relaxed">
            Expédié sous 5 jours ouvrés · Retouches locales offertes
          </p>
        </div>
      </div>

      {/* Tabs: Description / Tissu / Construction / Livraison */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1100px] mx-auto mt-20 sm:mt-32">
        <Tabs defaultValue="description">
          <TabsList className="bg-transparent border-b border-hairline w-full justify-start gap-6 rounded-none h-auto p-0">
            <TabsTrigger value="description" className="data-[state=active]:bg-transparent data-[state=active]:text-bone data-[state=active]:border-b data-[state=active]:border-bone rounded-none px-0 pb-3 eyebrow text-bone/50">
              Description
            </TabsTrigger>
            {(product.fabric_composition || product.fabric_weight || product.fabric_mill || product.fabric_notes) && (
              <TabsTrigger value="fabric" className="data-[state=active]:bg-transparent data-[state=active]:text-bone data-[state=active]:border-b data-[state=active]:border-bone rounded-none px-0 pb-3 eyebrow text-bone/50">
                Tissu
              </TabsTrigger>
            )}
            {product.details.length > 0 && (
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:text-bone data-[state=active]:border-b data-[state=active]:border-bone rounded-none px-0 pb-3 eyebrow text-bone/50">
                Construction
              </TabsTrigger>
            )}
            <TabsTrigger value="shipping" className="data-[state=active]:bg-transparent data-[state=active]:text-bone data-[state=active]:border-b data-[state=active]:border-bone rounded-none px-0 pb-3 eyebrow text-bone/50">
              Livraison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-10">
            {product.description && (
              <p className="text-bone/70 font-light leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
            {product.story && (
              <div className="mt-10 pt-10 border-t border-hairline">
                <div className="eyebrow text-bone/60 mb-4">— Histoire —</div>
                <p className="text-bone/70 font-light leading-relaxed whitespace-pre-line italic">{product.story}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fabric" className="pt-10">
            <dl className="space-y-5 max-w-2xl">
              {product.fabric_composition && <Row k="Composition" v={product.fabric_composition} />}
              {product.fabric_weight && <Row k="Poids" v={product.fabric_weight} />}
              {product.fabric_mill && <Row k="Manufacture" v={product.fabric_mill} />}
            </dl>
            {product.fabric_notes && (
              <p className="text-bone/60 font-light leading-relaxed mt-8">{product.fabric_notes}</p>
            )}
          </TabsContent>

          <TabsContent value="details" className="pt-10">
            <ul className="space-y-4 max-w-2xl">
              {product.details.map((d) => (
                <li key={d} className="flex gap-4 text-bone/70 font-light leading-relaxed border-b border-hairline pb-4">
                  <span className="eyebrow text-bone/40 mt-1">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="shipping" className="pt-10">
            <div className="space-y-4 text-bone/70 font-light leading-relaxed max-w-2xl">
              <p>Expédition sous 5 jours ouvrés depuis Abidjan.</p>
              <p>Retouches locales gratuites pour assurer un tombé parfait.</p>
              <p>Retours acceptés sous 14 jours, sauf pour les pièces personnalisées (monogramme, bespoke).</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-20 sm:mt-32">
          <div className="border-t border-hairline pt-12 mb-10">
            <div className="eyebrow text-bone/60 mb-4">— Vous aimerez aussi —</div>
            <h2 className="display text-2xl sm:text-3xl md:text-4xl">Pièces de la collection</h2>
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
