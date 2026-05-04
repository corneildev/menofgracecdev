import { createFileRoute, Link, useNavigate, ErrorComponent, useRouter } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  formatPriceEur,
  CATEGORY_LABELS,
  ALL_CATEGORIES,
  ALL_SIZES,
  type ProductCategory,
  type ProductWithImages,
} from "@/lib/products";
import { WishlistButton } from "@/components/WishlistButton";

const CATEGORY_VALUES = ["all", ...ALL_CATEGORIES] as const;
const SIZE_VALUES = ["all", ...ALL_SIZES] as const;
const CURRENCY_VALUES = ["FCFA", "USD", "EUR"] as const;

const searchSchema = z.object({
  category: fallback(z.enum(CATEGORY_VALUES), "all").default("all"),
  size: fallback(z.enum(SIZE_VALUES), "all").default("all"),
  currency: fallback(z.enum(CURRENCY_VALUES), "FCFA").default("FCFA"),
});

export const Route = createFileRoute("/collection")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Collection — Men of Grace" },
      { name: "description", content: "Découvrez la collection Men of Grace : costumes sur-mesure, tuxedos, executive et mariage. Façonnés à la main, livrés sous 5 jours." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Collection — Men of Grace" },
      { property: "og:description", content: "Costumes sur-mesure, tuxedos, executive et mariage." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menofgrace.store/collection" },
    ],
    links: [{ rel: "canonical", href: "https://menofgrace.store/collection" }],
  }),
  component: Collection,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="pt-40 pb-32 px-6 text-center text-bone">
        <p className="mb-4">Unable to load collection: {error.message}</p>
        <button onClick={() => router.invalidate()} className="eyebrow underline">Retry</button>
      </div>
    );
  },
  notFoundComponent: () => <div className="pt-40 text-center text-bone">Not found</div>,
});

function formatPrice(p: ProductWithImages, currency: (typeof CURRENCY_VALUES)[number]) {
  if (currency === "USD") return formatPriceUsd(p.price_usd);
  if (currency === "EUR") return formatPriceEur(p.price_eur);
  return formatPriceFcfa(p.price_fcfa);
}

function Collection() {
  const { category, size, currency } = Route.useSearch();
  const navigate = useNavigate({ from: "/collection" });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (size !== "all" && !(p.sizes ?? []).includes(size)) return false;
    return true;
  });

  const setParam = (key: "category" | "size" | "currency", value: string) => {
    navigate({ search: (prev: Record<string, string>) => ({ ...prev, [key]: value }) });
  };

  return (
    <div className="pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-ink min-h-screen overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="eyebrow text-foreground/60 mb-6">— La Collection —</div>
          <h1 className="display text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-6">Pièces d'atelier</h1>
          <p className="text-foreground/60 font-light max-w-xl mx-auto text-sm sm:text-base">
            Chaque pièce composée dans notre atelier et finie entièrement à la main.
          </p>
        </div>

        {/* Filter bar */}
        <div className="border-y border-hairline py-5 sm:py-6 mb-10 sm:mb-14 grid gap-5 sm:gap-6 md:grid-cols-3">
          <FilterGroup label="Catégorie">
            <FilterChip active={category === "all"} onClick={() => setParam("category", "all")}>Toutes</FilterChip>
            {ALL_CATEGORIES.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setParam("category", c)}>
                {CATEGORY_LABELS[c as ProductCategory]}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Taille">
            <FilterChip active={size === "all"} onClick={() => setParam("size", "all")}>Toutes</FilterChip>
            {ALL_SIZES.map((s) => (
              <FilterChip key={s} active={size === s} onClick={() => setParam("size", s)}>{s}</FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Devise">
            {CURRENCY_VALUES.map((c) => (
              <FilterChip key={c} active={currency === c} onClick={() => setParam("currency", c)}>{c}</FilterChip>
            ))}
          </FilterGroup>
        </div>

        <div className="text-foreground/50 eyebrow mb-8">
          {isLoading ? "Chargement…" : `${filtered.length} pièce${filtered.length === 1 ? "" : "s"}`}
        </div>

        {!isLoading && filtered.length === 0 ? (
          <div className="text-center text-foreground/60 py-32 font-light">
            Aucune pièce ne correspond à ces filtres.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {filtered.map((p) => (
              <article key={p.id} className="group">
                <div className="relative img-zoom aspect-[4/5] bg-secondary mb-6 overflow-hidden">
                  <WishlistButton productId={p.id} />
                  <Link
                    to="/collection/$productId"
                    params={{ productId: p.slug }}
                    className="block h-full w-full"
                  >
                    <img src={p.primaryImage} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                </div>
                <div className="eyebrow text-bone/50 mb-2">{CATEGORY_LABELS[p.category]}</div>
                <h2 className="font-serif text-2xl mb-3">
                  <Link to="/collection/$productId" params={{ productId: p.slug }} className="hover:text-bone/70 transition-colors">
                    {p.name}
                  </Link>
                </h2>
                {p.short_description && (
                  <p className="text-bone/60 font-light text-sm mb-5 leading-relaxed">{p.short_description}</p>
                )}
                <div className="flex items-center justify-between border-t border-hairline pt-4">
                  <div className="text-bone/80 text-sm font-light">{formatPrice(p, currency)}</div>
                  <Link to="/collection/$productId" params={{ productId: p.slug }} className="eyebrow text-bone hover:text-bone/60">
                    Discover
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow text-bone/50 mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase border transition-colors ${
        active
          ? "border-bone bg-bone text-ink"
          : "border-hairline text-bone/70 hover:border-bone/60 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}
