import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
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
import { ProductReviews } from "@/components/ProductReviews";
import {
  LiveActivityToast,
  ViewersCounter,
  OfferCountdown,
  PromoBadge,
  StockUrgency,
} from "@/components/ProductPromo";
import { Icon } from "@/components/Icon";
import { trackProductEvent } from "@/lib/analytics";
import { useCountry } from "@/hooks/useCountry";
import { QuickOrderForm } from "@/components/QuickOrderForm";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/collection_/$productId")({
  loader: async ({ params }) => {
    const product = await getProductBySlug(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Men of Grace` : "Collection — Men of Grace";
    const desc = p?.short_description ?? p?.description ?? "Costumes sur-mesure, mariage et executive — Men of Grace.";
    const img = p?.primaryImage;
    const url = `https://menofgrace.store/collection/${params.productId}`;
    const meta = [
      { title },
      { name: "description", content: desc },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "product" },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Men of Grace" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      ...(img ? [
        { property: "og:image", content: img },
        { property: "og:image:alt", content: p?.name ?? "" },
        { name: "twitter:image", content: img },
      ] : []),
      ...(p ? [
        { property: "product:price:amount", content: String(p.price_eur ?? p.price_usd ?? 0) },
        { property: "product:price:currency", content: p.price_eur ? "EUR" : "USD" },
        { property: "product:availability", content: (p.stock ?? 0) > 0 ? "in stock" : "out of stock" },
      ] : []),
    ];
    const links = [{ rel: "canonical", href: url }];
    const scripts = p ? [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: p.name,
          description: desc,
          image: img ? [img] : undefined,
          sku: p.slug,
          brand: { "@type": "Brand", name: "Men of Grace" },
          category: p.category,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "EUR",
            price: p.price_eur ?? Math.round((p.price_usd ?? 0) * 0.92),
            availability: (p.stock ?? 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://menofgrace.store",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Collection",
              item: "https://menofgrace.store/collection",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: p.name,
              item: url,
            },
          ],
        }),
      },
    ] : undefined;
    return { meta, links, scripts };
  },
  notFoundComponent: () => (
    <div className="pt-40 pb-32 px-6 text-center bg-background min-h-screen">
      <div className="eyebrow mb-6">404</div>
      <h1 className="display text-5xl mb-6">Pièce introuvable</h1>
      <Link to="/collection" className="luxury-btn">Retour à la collection</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="pt-40 pb-32 px-6 text-center bg-background min-h-screen">
      <div className="eyebrow mb-6">Erreur</div>
      <p className="text-foreground/60 mb-8">{error.message}</p>
      <Link to="/collection" className="luxury-btn">Retour à la collection</Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  return <ProductView product={product} />;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

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
  const { currency } = useCountry();
  const saved = ready && has(product.id);

  const { sizes, colors, hasVariants } = useMemo(() => deriveOptions(product), [product]);

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [fit, setFit] = useState<string>(product.fits[0] ?? "");
  const [lapel, setLapel] = useState<string>(product.lapels[0] ?? "");
  const [lining, setLining] = useState<string>(product.linings[0] ?? "");
  const [monogram, setMonogram] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);

  useEffect(() => {
    setSize(null);
    setColor(colors[0] ?? null);
    setFit(product.fits[0] ?? "");
    setLapel(product.lapels[0] ?? "");
    setLining(product.linings[0] ?? "");
    setMonogram("");
    setSizeError(null);
  }, [product.id]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return findVariant(product.variants, size, color);
  }, [hasVariants, product.variants, size, color]);

  const isSizeSoldOut = (s: string): boolean => {
    if (hasVariants) {
      const candidates = product.variants.filter((v) => v.size === s && (color ? v.color === color : true));
      if (candidates.length === 0) return true;
      return candidates.every((v) => !v.is_available || v.stock <= 0);
    }
    return product.sold_out_sizes?.includes(s) ?? false;
  };

  const actuallySoldOut = sizes.length > 0 && sizes.every((s) => isSizeSoldOut(s));

  useEffect(() => {
    if (!size) return;
    if (!isSizeSoldOut(size)) return;
    const nextAvailable = sizes.find((s) => !isSizeSoldOut(s)) ?? null;
    setSize(nextAvailable);
    if (nextAvailable) {
      setSizeError(`Taille ${size} épuisée — taille ${nextAvailable} sélectionnée.`);
    }
  }, [color]);

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

  const { isCODCountry, loading: geoLoading } = useCountry();
  const [successData, setSuccessData] = useState<{ orderId: string; orderNumber: string } | null>(null);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (sizes.length > 0 && !size) {
      setSizeError("Veuillez sélectionner une taille.");
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    handleAddToCart();
    navigate({ to: "/checkout" });
  };

  return (
    <div className="bg-background pt-32 sm:pt-40 pb-24 sm:pb-32 overflow-x-hidden">
      <LiveActivityToast productName={product.name} />

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mb-6 sm:mb-8">
        <nav aria-label="Fil d'Ariane" className="eyebrow text-foreground/55 flex items-center gap-3 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <Icon name="chevron-right" className="text-foreground/30" />
          <Link to="/collection" className="hover:text-foreground transition-colors">Collection</Link>
          <Icon name="chevron-right" className="text-foreground/30" />
          <span className="text-foreground/80 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 sm:gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ProductMediaGallery
            images={product.images}
            videos={product.videos}
            alt={product.name}
            filterVariantId={filterVariantId}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
              <span className="eyebrow text-foreground/50 tracking-[0.2em]">{CATEGORY_LABELS[product.category]}</span>
              <ViewersCounter productSlug={product.slug} />
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="display text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.1]">{product.name}</motion.h1>
            
            <motion.div variants={itemVariants} className="flex items-baseline gap-4 mb-8">
              <span className="font-serif text-2xl sm:text-3xl text-foreground/90">
                {currency === "EUR" ? formatPriceEur(effectivePrice.eur) : currency === "USD" ? formatPriceUsd(effectivePrice.usd) : formatPriceFcfa(effectivePrice.fcfa)}
              </span>
              <PromoBadge />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
              <OfferCountdown />
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-sm prose-invert mb-10 text-foreground/70 font-light leading-relaxed max-w-none">
              <p>{product.short_description}</p>
            </motion.div>
          </motion.div>

          <Section label="Couleur">
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <Chip key={c} active={color === c} onClick={() => setColor(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Section>

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
                        {soldOut && <span className="ml-2 text-[9px] tracking-[0.18em] opacity-70">Épuisé</span>}
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
                      className="eyebrow text-[10px] text-foreground/70 underline underline-offset-[6px] decoration-hairline hover:text-foreground hover:decoration-current transition-colors inline-flex items-center gap-2"
                    >
                      <Icon name="ruler" /> Trouver ma taille
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-hairline text-foreground max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-foreground">Trouver ma taille</DialogTitle>
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
                  <p className="text-xs text-foreground/60 mt-3 tracking-wider font-light">
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
                <p role="alert" className="text-xs text-red-500 dark:text-red-400 mt-3 tracking-wider anim-shake">{sizeError}</p>
              )}
            </Section>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={isCODCountry ? handleAddToCart : handleBuyNow}
              disabled={actuallySoldOut}
              className="luxury-btn luxury-btn-solid w-full disabled:opacity-40 disabled:cursor-not-allowed group inline-flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform"
            >
              <Icon name={isCODCountry ? "cart" : "bolt"} />
              {actuallySoldOut ? "Édition épuisée" : isCODCountry ? "Ajouter à ma sélection" : "Acheter maintenant"}
            </button>

            {isCODCountry && !actuallySoldOut && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <QuickOrderForm 
                  productId={product.id}
                  productName={product.name}
                  productImage={product.primaryImage}
                  priceFcfa={effectivePrice.fcfa}
                  priceUsd={effectivePrice.usd}
                  selectedSize={size}
                  selectedFit={fit}
                  selectedLapel={lapel}
                  selectedLining={lining}
                  selectedMonogram={monogram}
                  onSuccess={(id, num) => setSuccessData({ orderId: id, orderNumber: num })}
                />
              </motion.div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className="luxury-btn flex items-center justify-center gap-2"
              >
                <Icon name={saved ? "heart" : "heart-o"} className={saved ? "text-red-500" : ""} />
                {saved ? "Sauvegardé" : "Wishlist"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && (navigator as any).share) {
                    (navigator as any).share({ title: product.name, url: window.location.href }).catch(() => {});
                  }
                }}
                className="luxury-btn flex items-center justify-center gap-2"
              >
                <Icon name="share" />
                Partager
              </button>
            </div>
          </div>

          <motion.ul 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-hairline pt-10"
          >
            {[
              ["globe", "Livraison internationale", "DHL Express sous 5 jours."],
              ["check", "Authenticité garantie", "Tissus italiens & confection main."],
              ["shield", "Paiement sécurisé", "Transactions 100% cryptées."],
              ["whatsapp", "Conseil privé", "Disponibilité 7j/7 sur WhatsApp."],
            ].map(([icon, title, body], i) => (
              <li key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary text-foreground/40 shrink-0">
                  <Icon name={icon as any} />
                </div>
                <div>
                  <div className="font-serif text-sm mb-1">{title}</div>
                  <div className="text-[11px] text-foreground/50 font-light tracking-wide">{body}</div>
                </div>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <OrderSuccessModal 
        isOpen={!!successData} 
        orderNumber={successData?.orderNumber ?? ""} 
        onClose={() => setSuccessData(null)} 
      />

      <section className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-24 sm:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-transparent border-b border-hairline w-full justify-start rounded-none h-auto p-0 mb-12">
              <TabsTrigger value="details" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 mr-10 eyebrow text-[10px] tracking-[0.3em]">DÉTAILS & COUPE</TabsTrigger>
              <TabsTrigger value="composition" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 mr-10 eyebrow text-[10px] tracking-[0.3em]">COMPOSITION</TabsTrigger>
              <TabsTrigger value="shipping" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 eyebrow text-[10px] tracking-[0.3em]">LIVRAISON & RETOURS</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="details">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20"
                >
                  <div>
                    <h3 className="font-serif text-2xl mb-6">Le mot du tailleur</h3>
                    <div className="text-foreground/70 font-light leading-relaxed space-y-4">
                      {(product.description || "").split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h4 className="eyebrow text-[10px] mb-4 tracking-[0.2em] text-foreground/40">CARACTÉRISTIQUES</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-light">
                          <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
                          Coupe semi-entoilée traditionnelle
                        </li>
                        <li className="flex items-center gap-3 text-sm font-light">
                          <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
                          Épaules structurées
                        </li>
                        <li className="flex items-center gap-3 text-sm font-light">
                          <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
                          Boutonnières fonctionnelles
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </section>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1100px] mx-auto mt-20 sm:mt-32">
        <ProductReviews productSlug={product.slug} productName={product.name} />
      </div>

      {relatedProducts.length > 0 && (
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-32 border-t border-hairline pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <div className="eyebrow text-foreground/40 mb-3 tracking-[0.3em] uppercase">— Compléter la tenue —</div>
                <h2 className="display text-4xl sm:text-5xl">Vous aimerez aussi</h2>
              </div>
              <Link to="/collection" className="eyebrow hover:text-foreground/60 transition-colors border-b border-foreground/20 pb-1 tracking-[0.2em] text-[10px]">
                VOIR TOUT →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
              {relatedProducts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Link
                    to="/collection/$productId"
                    params={{ productId: p.slug }}
                    className="group block"
                  >
                    <div className="aspect-[3/4] bg-secondary mb-6 overflow-hidden relative">
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="eyebrow text-foreground/40 mb-2 text-[9px] tracking-[0.2em] uppercase">{CATEGORY_LABELS[p.category]}</div>
                    <div className="font-serif text-xl mb-2 group-hover:text-foreground/70 transition-colors leading-tight">{p.name}</div>
                    <div className="text-foreground/60 text-sm font-light">{currency === "EUR" ? formatPriceEur(p.price_eur) : currency === "USD" ? formatPriceUsd(p.price_usd) : formatPriceFcfa(p.price_fcfa)}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-hairline px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-foreground/50 text-[10px] uppercase tracking-[0.2em] truncate">{product.name}</div>
          <div className="text-foreground text-sm font-light truncate">{formatPriceFcfa(effectivePrice.fcfa)}</div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={actuallySoldOut}
          className="luxury-btn luxury-btn-solid !px-5 !py-3 !text-[10px] disabled:opacity-40 inline-flex items-center gap-2"
        >
          <Icon name="cart" />
          {actuallySoldOut ? "Épuisé" : isCODCountry ? "Commander" : "Acheter"}
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="eyebrow text-foreground/40 mb-4 tracking-[0.2em] text-[10px] uppercase">— {label} —</div>
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
      className={`px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-all duration-300 ${
        disabled
          ? "border-hairline text-foreground/20 cursor-not-allowed"
          : active
            ? "border-foreground bg-foreground text-background"
            : "border-hairline text-foreground/60 hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

