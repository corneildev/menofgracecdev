import { createFileRoute, Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero-suit.jpg";
import {
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  CATEGORY_LABELS,
} from "@/lib/products";
=======
import hero from "@/assets/hero-suit.jpg";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Tailored Menswear" },
<<<<<<< HEAD
      { name: "description", content: "Tailored menswear, ready to ship. Italian sizing, finished by hand. Shipped within 5 business days with free local alterations." },
      { property: "og:title", content: "MEN OF GRACE — Tailored Menswear" },
      { property: "og:description", content: "For men who command presence without speaking." },
=======
      {
        name: "description",
        content:
          "Maison de couture pour hommes. Choisissez votre univers : Executive, Cérémonie ou Sur-mesure.",
      },
      { property: "og:title", content: "MEN OF GRACE — Tailored Menswear" },
      {
        property: "og:description",
        content: "For men who command presence without speaking.",
      },
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      { property: "og:image", content: hero },
      { property: "twitter:image", content: hero },
    ],
  }),
  component: Index,
});

function Index() {
<<<<<<< HEAD
  const { data: products = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });

  const featured = products.slice(0, 6);

  return (
    <div className="bg-ink text-bone overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col">
        <img
          src={hero}
          alt="Man in a black tailored suit"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 sm:py-32">
          <div className="eyebrow text-bone/70 mb-6 sm:mb-8 fade-in-slow">Maison de Couture</div>
          <h1 className="display text-bone text-[14vw] sm:text-[10vw] md:text-[6rem] lg:text-[7rem] leading-[0.9] mb-4 sm:mb-6 fade-up max-w-full">
            MEN <span className="italic font-light">of</span> GRACE
          </h1>
          <div className="hairline w-12 sm:w-16 my-6 sm:my-8 fade-in-slow" />
          <p className="font-serif italic text-bone/85 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 fade-up max-w-md mx-auto" style={{ animationDelay: "200ms" }}>
            Tailored menswear, ready to ship.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 fade-up w-full sm:w-auto items-stretch sm:items-center" style={{ animationDelay: "400ms" }}>
            <Link to="/collection" className="luxury-btn luxury-btn-solid w-full sm:w-auto">Shop the Collection</Link>
          </div>
        </div>

        <div className="relative z-10 pb-6 sm:pb-8 text-center eyebrow text-bone/50 fade-in-slow">
          Scroll
        </div>
      </section>

      {/* POSITIONING */}
      <section className="py-20 sm:py-28 md:py-40 lg:py-48 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-8 sm:mb-10">— Manifesto —</div>
          <h2 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-bone">
            For men who command presence
            <br />
            <span className="italic text-bone/70">without speaking.</span>
          </h2>
        </div>
      </section>

      {/* COLLECTION */}
      {featured.length > 0 && (
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 pb-20 sm:pb-28 md:pb-32">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-4 sm:gap-6">
              <div>
                <div className="eyebrow text-bone/60 mb-3 sm:mb-4">The Collection</div>
                <h2 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Spring Sartoria</h2>
              </div>
              <Link to="/collection" className="eyebrow text-bone hover:text-bone/60 border-b border-hairline pb-1">
                Discover All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to="/collection/$productId"
                  params={{ productId: p.slug }}
                  className="group block w-full"
                >
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-5 sm:mb-6 overflow-hidden">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{CATEGORY_LABELS[p.category]}</div>
                  <div className="font-serif text-xl sm:text-2xl mb-3">{p.name}</div>
                  <div className="text-bone/70 text-sm font-light flex flex-wrap gap-x-4 gap-y-1">
                    <span>{formatPriceFcfa(p.price_fcfa)}</span>
                    <span className="text-bone/40">·</span>
                    <span>{formatPriceUsd(p.price_usd)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 border-y border-hairline">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
          {[
            ["Curated Cloth", "Loro Piana, Vitale Barberis Canonico, Drago, Scabal — chosen mill by mill."],
            ["Italian Sizing", "Cut from IT 46 to IT 56. A guided Size Finder if you are between sizes."],
            ["Shipped in 5 Days", "Dispatched within five business days. Free local alterations."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="hairline w-12 mx-auto mb-6 sm:mb-8" />
              <div className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4">{title}</div>
              <p className="text-bone/60 font-light text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— The Collection —</div>
        <p className="font-serif text-xl sm:text-2xl md:text-3xl italic text-bone/85 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Each piece, ready to be worn.
        </p>
        <Link to="/collection" className="luxury-btn luxury-btn-solid">Shop the Collection</Link>
      </section>
    </div>
  );
}
=======
  return (
    <div className="fixed inset-0 z-[60] bg-ink text-bone md:h-[100dvh] md:overflow-hidden overflow-y-auto">
      <div className="h-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col">
        <section className="min-h-[84px] md:h-[12vh] flex items-center justify-center">
          <div className="font-serif tracking-[0.5em] text-xl text-bone fade-in">
            MEN OF GRACE
          </div>
        </section>

        <section className="min-h-[72px] md:h-[8vh] flex items-center justify-center">
          <div
            className="text-center fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <h1 className="font-serif italic text-2xl md:text-3xl text-bone/80">
              Choisissez un univers
            </h1>
            <div className="hairline w-12 mx-auto mt-6" />
          </div>
        </section>

        <section className="py-4 md:py-6 md:h-[70vh]">
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <UniverseCard
              to="/collection"
              search={{ category: "business_suits" }}
              ariaLabel="Découvrir les costumes Executive"
              imageSrc={hero}
              eyebrow="— Le Quotidien —"
              title="EXECUTIVE"
              subtitle="Costumes business & executive"
              delay="400ms"
            />
            <UniverseCard
              to="/collection"
              search={{ category: "wedding_suits" }}
              ariaLabel="Découvrir l'univers Cérémonie"
              imageSrc="/seed/suit-ivory.jpg"
              eyebrow="— Le Grand Jour —"
              title="CÉRÉMONIE"
              subtitle="Mariage & soirée"
              delay="500ms"
            />
            <UniverseCard
              to="/collection"
              search={{ category: "bespoke" }}
              ariaLabel="Découvrir l'univers Sur-mesure"
              imageSrc="/seed/craft.jpg"
              eyebrow="— L'Expérience —"
              title="SUR-MESURE"
              subtitle="Bespoke sur rendez-vous"
              delay="600ms"
            />
          </div>
        </section>

        <section className="min-h-[72px] md:h-[10vh] flex items-center justify-center pb-4 md:pb-0">
          <p
            className="font-serif italic text-bone/50 text-sm text-center fade-in"
            style={{ animationDelay: "700ms" }}
          >
            Pour les hommes qui imposent leur présence sans dire un mot.
          </p>
        </section>
      </div>
    </div>
  );
}

function UniverseCard({
  to,
  search,
  ariaLabel,
  imageSrc,
  eyebrow,
  title,
  subtitle,
  delay,
}: {
  to: "/collection";
  search: { category: "business_suits" | "wedding_suits" | "bespoke" };
  ariaLabel: string;
  imageSrc: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  delay: string;
}) {
  return (
    <Link
      to={to}
      search={search}
      aria-label={ariaLabel}
      className="group relative overflow-hidden border border-hairline/40 hover:border-bone/40 transition-colors aspect-[16/10] md:aspect-[3/4] fade-up"
      style={{ animationDelay: delay }}
    >
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
        <div className="eyebrow text-bone/70 mb-4 text-[10px]">{eyebrow}</div>
        <h2 className="font-serif text-3xl md:text-4xl tracking-[0.3em] text-bone mb-3">
          {title}
        </h2>
        <div className="h-px w-0 bg-hairline group-hover:w-16 transition-all duration-500 mb-3" />
        <p className="font-serif italic text-bone/60 text-sm">{subtitle}</p>
      </div>
    </Link>
  );
}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
