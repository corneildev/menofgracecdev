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
    <div className="bg-ink text-bone">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={hero}
          alt="Man in a black tailored suit"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-8 fade-in-slow">Maison de Couture</div>
          <h1 className="display text-bone text-[15vw] md:text-[7rem] leading-[0.9] mb-6 fade-up">
            MEN <span className="italic font-light">of</span> GRACE
          </h1>
          <div className="hairline w-16 my-8 fade-in-slow" />
          <p className="font-serif italic text-bone/85 text-xl md:text-2xl mb-12 fade-up" style={{ animationDelay: "200ms" }}>
            Tailored menswear, ready to ship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 fade-up" style={{ animationDelay: "400ms" }}>
            <Link to="/collection" className="luxury-btn luxury-btn-solid">Shop the Collection</Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 eyebrow text-bone/50 fade-in-slow">
          Scroll
        </div>
      </section>

      {/* POSITIONING */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-10">— Manifesto —</div>
          <h2 className="display text-3xl md:text-6xl leading-[1.1] text-bone">
            For men who command presence
            <br />
            <span className="italic text-bone/70">without speaking.</span>
          </h2>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <div className="eyebrow text-bone/60 mb-4">The Collection</div>
              <h2 className="display text-4xl md:text-6xl">Spring Sartoria</h2>
            </div>
            <Link to="/collection" className="eyebrow text-bone hover:text-bone/60 border-b border-hairline pb-1">
              Discover All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {products.map((p) => {
              const price = formatPrice(p);
              return (
                <Link
                  key={p.id}
                  to="/collection"
                  className="group block"
                >
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{p.category}</div>
                  <div className="font-serif text-2xl mb-3">{p.name}</div>
                  <div className="text-bone/70 text-sm font-light flex gap-4">
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
      <section className="py-32 px-6 md:px-12 border-y border-hairline">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-16 text-center">
          {[
            ["Curated Cloth", "Loro Piana, Vitale Barberis Canonico, Drago, Scabal — chosen mill by mill."],
            ["Italian Sizing", "Cut from IT 46 to IT 56. A guided Size Finder if you are between sizes."],
            ["Shipped in 5 Days", "Dispatched within five business days. Free local alterations."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="hairline w-12 mx-auto mb-8" />
              <div className="font-serif text-2xl mb-4">{title}</div>
              <p className="text-bone/60 font-light text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— The Collection —</div>
        <p className="font-serif text-2xl md:text-3xl italic text-bone/85 mb-10 max-w-2xl mx-auto">
          Each piece, ready to be worn.
        </p>
        <Link to="/collection" className="luxury-btn luxury-btn-solid">Shop the Collection</Link>
      </section>
    </div>
  );
}
