import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProduct, products, formatPrice, type Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RestockAlertForm } from "@/components/RestockAlertForm";
import { trackProductEvent } from "@/lib/analytics";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/collection/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — MEN OF GRACE` : "Collection — MEN OF GRACE";
    const desc = p?.description ?? "Bespoke tailoring composed in our atelier.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.image ? [{ property: "og:image", content: p.image }, { name: "twitter:image", content: p.image }] : []),
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

function ProductView({ product }: { product: Product }) {
  const price = formatPrice(product);
  const { has, toggle, ready } = useWishlist();
  const { add: addToCart } = useCart();
  const saved = ready && has(product.id);
  const [activeImage, setActiveImage] = useState(product.gallery[0] ?? product.image);
  const [size, setSize] = useState<string | null>(null);
  const [fit, setFit] = useState(product.fits[0]);
  const [lapel, setLapel] = useState(product.lapels[0]);
  const [lining, setLining] = useState(product.linings[0]);
  const [monogram, setMonogram] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [carouselCurrency, setCarouselCurrency] = useState<"fcfa" | "usd" | "eur">("fcfa");

  const allSoldOut =
    product.sizes.length > 0 &&
    product.sizes.every((s) => product.soldOutSizes?.includes(s));

  const similarInStock = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .filter((p) => {
        if (!p.sizes || p.sizes.length === 0) return true;
        return p.sizes.some((s) => !p.soldOutSizes?.includes(s));
      })
      .slice(0, 8);
  }, [product.id, product.category]);

  // Auto-switch if the currently selected size becomes sold out.
  useEffect(() => {
    if (!size) return;
    if (!product.soldOutSizes?.includes(size)) return;
    const nextAvailable = product.sizes.find((s) => !product.soldOutSizes?.includes(s)) ?? null;
    setSize(nextAvailable);
    if (nextAvailable) {
      setSizeError(`Taille ${size} épuisée — taille ${nextAvailable} sélectionnée.`);
    }
  }, [product.soldOutSizes, product.sizes, size]);

  const handleAddToCart = () => {
    if (!size) {
      setSizeError("Veuillez sélectionner une taille.");
      return;
    }
    if (product.soldOutSizes?.includes(size)) {
      setSizeError(`La taille ${size} est épuisée. Veuillez en choisir une autre.`);
      return;
    }
    setSizeError(null);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      fcfa: product.fcfa,
      usd: product.usd,
      size,
      availableSizes: product.sizes,
      fit,
      lapel,
      lining,
      monogram: monogram || undefined,
    });
  };

  const waMessage = encodeURIComponent(
    `Hello MEN OF GRACE — I'd like to enquire about the ${product.name}.\n` +
      `Fit: ${fit} · Lapel: ${lapel} · Lining: ${lining}` +
      (size ? ` · Size: ${size}` : "") +
      (monogram ? ` · Monogram: ${monogram}` : ""),
  );
  const waHref = `https://wa.me/?text=${waMessage}`;

  return (
    <div className="bg-ink pt-32 pb-32">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-10">
        <div className="eyebrow text-bone/50 flex items-center gap-3">
          <Link to="/collection" className="hover:text-bone">Collection</Link>
          <span>/</span>
          <span className="text-bone/80">{product.name}</span>
        </div>
      </div>

      {/* Gallery + Buy panel */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4 fade-in-slow">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.gallery.map((src, i) => (
              <button
                key={i}
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
        </div>

        {/* Buy panel */}
        <div className="lg:sticky lg:top-32 self-start">
          <div className="eyebrow text-bone/60 mb-4">{product.category}</div>
          <h1 className="display text-4xl md:text-5xl mb-6">{product.name}</h1>
          <p className="text-bone/70 font-light leading-relaxed mb-8">{product.story}</p>

          <div className="border-y border-hairline py-6 mb-10">
            <div className="text-bone text-lg font-light">{price.fcfa}</div>
            <div className="text-bone/50 text-sm font-light mt-1">{price.usd} · {price.eur}</div>
          </div>

          {/* Size */}
          <div id="size-picker" className="scroll-mt-24">
          <Section label="Size">
            <TooltipProvider delayDuration={150}>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const soldOut = product.soldOutSizes?.includes(s) ?? false;
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
                        {/* span wrapper so the disabled button still triggers hover/focus */}
                        <span
                          className="inline-flex"
                          tabIndex={0}
                          aria-label={`Taille ${s} indisponible`}
                          onMouseEnter={() =>
                            trackProductEvent({
                              type: "sold_out_tooltip_shown",
                              productSlug: product.id,
                              productName: product.name,
                              size: s,
                            })
                          }
                          onFocus={() =>
                            trackProductEvent({
                              type: "sold_out_tooltip_shown",
                              productSlug: product.id,
                              productName: product.name,
                              size: s,
                            })
                          }
                        >
                          {chip}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-center">
                        <p className="text-xs leading-relaxed mb-2">
                          La taille <span className="font-medium">{s}</span> est actuellement indisponible.
                        </p>
                        <Link
                          to="/bespoke"
                          onClick={() =>
                            trackProductEvent({
                              type: "sold_out_booking_click",
                              productSlug: product.id,
                              productName: product.name,
                              size: s,
                              metadata: { source: "size_tooltip" },
                            })
                          }
                          className="eyebrow text-[10px] underline underline-offset-4 hover:opacity-80"
                        >
                          Réserver un essayage →
                        </Link>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
            {allSoldOut && (
              <>
                {(() => {
                  const soldOutMsg = encodeURIComponent(
                    `Hello MEN OF GRACE — la pièce "${product.name}"` +
                      (size ? ` en taille ${size}` : "") +
                      ` est épuisée. J'aimerais réserver un essayage pour une création sur mesure.`,
                  );
                  const soldOutWaHref = `https://wa.me/?text=${soldOutMsg}`;
                  return (
                    <p className="text-xs text-bone/60 mt-3 tracking-wider font-light">
                      Toutes les tailles sont actuellement épuisées —{" "}
                      <a
                        href={soldOutWaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackProductEvent({
                            type: "all_sold_out_booking_click",
                            productSlug: product.id,
                            productName: product.name,
                            size,
                            metadata: { source: "all_sold_out_notice", channel: "whatsapp" },
                          })
                        }
                        className="underline underline-offset-4 hover:text-bone"
                      >
                        réservez un essayage via WhatsApp
                      </a>{" "}
                      pour une pièce sur mesure.
                    </p>
                  );
                })()}
                <RestockAlertForm
                  productSlug={product.id}
                  productName={product.name}
                  size={size}
                />
              </>
            )}
            {sizeError && (
              <p role="alert" className="text-xs text-red-400/90 mt-3 tracking-wider">{sizeError}</p>
            )}
          </Section>
          </div>

          {/* Fit */}
          <Section label="Fit">
            <div className="flex flex-wrap gap-2">
              {product.fits.map((f) => (
                <Chip key={f} active={fit === f} onClick={() => setFit(f)}>{f}</Chip>
              ))}
            </div>
          </Section>

          {/* Lapel */}
          <Section label="Lapel">
            <div className="flex flex-wrap gap-2">
              {product.lapels.map((l) => (
                <Chip key={l} active={lapel === l} onClick={() => setLapel(l)}>{l}</Chip>
              ))}
            </div>
          </Section>

          {/* Lining */}
          <Section label="Lining">
            <div className="flex flex-wrap gap-2">
              {product.linings.map((l) => (
                <Chip key={l} active={lining === l} onClick={() => setLining(l)}>{l}</Chip>
              ))}
            </div>
          </Section>

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
              disabled={allSoldOut}
              aria-disabled={allSoldOut}
              className="luxury-btn luxury-btn-solid w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allSoldOut ? "Édition épuisée" : "Ajouter au Panier"}
            </button>
            {allSoldOut && (
              <p className="eyebrow text-[10px] text-bone/60 text-center leading-relaxed tracking-[0.25em] mt-1">
                Pièce confectionnée en série limitée — réservez un essayage privé pour une création sur mesure à votre image.
              </p>
            )}
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="luxury-btn w-full">
              Reserve via WhatsApp
            </a>
            <Link to="/bespoke" className="luxury-btn w-full">Book a Fitting</Link>
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
            Limited atelier slots · 6–8 week delivery · Worldwide shipping
          </p>
        </div>
      </div>

      {/* Fabric & Details */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto mt-32 grid md:grid-cols-2 gap-16">
        <div>
          <div className="eyebrow text-bone/60 mb-6">— The Cloth —</div>
          <h2 className="display text-3xl md:text-4xl mb-8">Fabric</h2>
          <dl className="space-y-5">
            <Row k="Composition" v={product.fabric.composition} />
            <Row k="Weight" v={product.fabric.weight} />
            <Row k="Mill" v={product.fabric.mill} />
          </dl>
          <p className="text-bone/60 font-light leading-relaxed mt-8">{product.fabric.notes}</p>
        </div>
        <div>
          <div className="eyebrow text-bone/60 mb-6">— Construction —</div>
          <h2 className="display text-3xl md:text-4xl mb-8">Hand-finished details</h2>
          <ul className="space-y-4">
            {product.details.map((d) => (
              <li key={d} className="flex gap-4 text-bone/70 font-light leading-relaxed border-b border-hairline pb-4">
                <span className="eyebrow text-bone/40 mt-1">·</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Similar in-stock products — shown when this piece is fully sold out */}
      {allSoldOut && similarInStock.length > 0 && (
        <div ref={carouselRef} className="px-6 md:px-12 max-w-[1600px] mx-auto mt-32">
          <div className="border-t border-hairline pt-12 mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-bone/60 mb-4">— Disponibles maintenant —</div>
              <h2 className="display text-3xl md:text-4xl">Pièces similaires en stock</h2>
              <p className="text-bone/60 font-light mt-3 max-w-xl">
                Sélection de la même catégorie, prête à être expédiée.
              </p>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Devise">
              {(["fcfa", "usd", "eur"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCarouselCurrency(c)}
                  aria-pressed={carouselCurrency === c}
                  className={`px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border transition-colors ${
                    carouselCurrency === c
                      ? "border-bone bg-bone text-ink"
                      : "border-hairline text-bone/60 hover:border-bone hover:text-bone"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Preload the first thumbnail to speed up LCP on mobile */}
          {similarInStock[0]?.image && (
            <link rel="preload" as="image" href={similarInStock[0].image} fetchPriority="high" />
          )}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-4">
              {similarInStock.map((p, idx) => {
                const pPrice = formatPrice(p);
                const eager = idx < 2; // first two visible on mobile (basis-2/3)
                return (
                  <CarouselItem key={p.id} className="pl-4 basis-2/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="group block">
                      <Link
                        to="/collection/$productId"
                        params={{ productId: p.id }}
                        className="block"
                      >
                        <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading={eager ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={idx === 0 ? "high" : eager ? "auto" : "low"}
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 66vw"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="eyebrow text-bone/50 text-[10px] mb-2">{p.category}</div>
                        <h3 className="font-serif text-bone text-lg mb-1 group-hover:text-bone/80 transition-colors">
                          {p.name}
                        </h3>
                        <div className="text-bone/60 font-light text-sm mb-3">{pPrice[carouselCurrency]}</div>
                      </Link>
                      <Link
                        to="/collection/$productId"
                        params={{ productId: p.id }}
                        hash="size-picker"
                        onClick={() =>
                          trackProductEvent({
                            type: "similar_select_size_click",
                            productSlug: p.id,
                            productName: p.name,
                            metadata: { source: "similar_carousel", from: product.id },
                          })
                        }
                        className="inline-block eyebrow text-[10px] text-bone/80 border-b border-hairline hover:border-bone hover:text-bone transition-colors pb-1"
                      >
                        Choisir une taille →
                      </Link>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-ink border-hairline text-bone hover:bg-ink hover:text-bone" />
            <CarouselNext className="hidden md:flex -right-4 bg-ink border-hairline text-bone hover:bg-ink hover:text-bone" />
          </Carousel>
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
    <div className="flex justify-between gap-6 border-b border-hairline pb-3">
      <dt className="eyebrow text-bone/50">{k}</dt>
      <dd className="text-bone/80 font-light text-sm text-right">{v}</dd>
    </div>
  );
}
