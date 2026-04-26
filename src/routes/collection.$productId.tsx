import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, formatPrice, type Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

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
  const [sizeError, setSizeError] = useState(false);

  const handleAddToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      fcfa: product.fcfa,
      usd: product.usd,
      size,
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
          <Section label="Size">
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <Chip key={s} active={size === s} onClick={() => { setSize(s); setSizeError(false); }}>{s}</Chip>
              ))}
            </div>
            {sizeError && (
              <p className="text-xs text-bone/80 mt-3 tracking-wider">Veuillez sélectionner une taille.</p>
            )}
          </Section>

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
              className="luxury-btn luxury-btn-solid w-full"
            >
              Ajouter au Panier
            </button>
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

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border transition-colors ${
        active
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
