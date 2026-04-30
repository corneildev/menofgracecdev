import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-suit.jpg";
import { products, formatPrice } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Tailored Menswear" },
      { name: "description", content: "Tailored menswear, ready to ship. Italian sizing, finished by hand. Shipped within 5 business days with free local alterations." },
      { property: "og:title", content: "MEN OF GRACE — Tailored Menswear" },
      { property: "og:description", content: "For men who command presence without speaking." },
      { property: "og:image", content: hero },
      { property: "twitter:image", content: hero },
    ],
  }),
  component: Index,
});

function Index() {
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
            {products.map((p) => {
              const price = formatPrice(p);
              return (
                <Link
                  key={p.id}
                  to="/collection"
                  className="group block w-full"
                >
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-5 sm:mb-6 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{p.category}</div>
                  <div className="font-serif text-xl sm:text-2xl mb-3">{p.name}</div>
                  <div className="text-bone/70 text-sm font-light flex flex-wrap gap-x-4 gap-y-1">
                    <span>{price.fcfa}</span>
                    <span className="text-bone/40">·</span>
                    <span>{price.usd}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
