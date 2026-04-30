import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import hero from "@/assets/hero-suit.jpg";
import wedding from "@/assets/wedding.jpg";
import craft from "@/assets/craft.jpg";
import executiveHero from "@/assets/executive-hero.jpg";
import { products, formatPrice } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Bespoke Excellence" },
      { name: "description", content: "Luxury bespoke menswear: tailored suits, wedding sartoria and executive collections." },
      { property: "og:title", content: "MEN OF GRACE — Bespoke Excellence" },
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
          alt="Man in a black bespoke suit"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-8 fade-in-slow">Maison de Couture · Fondée en MMXX</div>
          <h1 className="display text-bone text-[15vw] md:text-[7rem] leading-[0.9] mb-6 fade-up">
            MEN <span className="italic font-light">of</span> GRACE
          </h1>
          <div className="hairline w-16 my-8 fade-in-slow" />
          <p className="font-serif italic text-bone/85 text-xl md:text-2xl mb-12 fade-up" style={{ animationDelay: "200ms" }}>
            L'Excellence sur Mesure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 fade-up" style={{ animationDelay: "400ms" }}>
            <Link to="/collection" className="luxury-btn luxury-btn-solid">Découvrir la Collection</Link>
            <Link to="/bespoke" className="luxury-btn">Réserver un Essayage</Link>
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

      {/* THREE PILLARS — symmetric triptych */}
      <section className="bg-ink">
        {/* I — EXECUTIVE */}
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden border-t border-hairline">
          <img
            src={executiveHero}
            alt="Executive in a charcoal three-piece suit before a city skyline"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-6 md:px-12">
            <div className="max-w-xl">
              <div className="eyebrow text-bone/70 mb-6">— I · Executive —</div>
              <h2 className="display text-5xl md:text-7xl mb-8 leading-[1]">
                The Boardroom<br /><span className="italic">Sartoria.</span>
              </h2>
              <p className="text-bone/80 font-light text-lg mb-10 leading-relaxed">
                Charcoal, navy, pinstripe — the working wardrobe of men who shape decisions.
              </p>
              <Link to="/executive" className="luxury-btn luxury-btn-solid">Discover Executive</Link>
            </div>
          </div>
        </div>

        {/* II — BESPOKE */}
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden border-t border-hairline">
          <img
            src={craft}
            alt="The art of tailoring at the atelier"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/85 via-ink/40 to-transparent" />
          <div className="relative z-10 h-full flex items-center justify-end px-6 md:px-12">
            <div className="max-w-xl text-right">
              <div className="eyebrow text-bone/70 mb-6">— II · Bespoke —</div>
              <h2 className="display text-5xl md:text-7xl mb-8 leading-[1]">
                A Suit<br /><span className="italic">Around You.</span>
              </h2>
              <p className="text-bone/80 font-light text-lg mb-10 leading-relaxed">
                Twenty-eight measurements. Sixty hours of work. A piece that lasts a lifetime.
              </p>
              <Link to="/bespoke" className="luxury-btn luxury-btn-solid">Begin Your Bespoke</Link>
            </div>
          </div>
        </div>

        {/* III — WEDDING */}
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden border-t border-hairline">
          <img
            src={wedding}
            alt="Groom in a tuxedo"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-6 md:px-12">
            <div className="max-w-xl">
              <div className="eyebrow text-bone/70 mb-6">— III · Wedding —</div>
              <h2 className="display text-5xl md:text-7xl mb-8 leading-[1]">
                Wedding<br /><span className="italic">Excellence.</span>
              </h2>
              <p className="text-bone/80 font-light text-lg mb-10 leading-relaxed">
                From the proposal to the altar — a complete composition for the groom and his witnesses.
              </p>
              <Link to="/wedding" className="luxury-btn luxury-btn-solid">Book Your Wedding Suit</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-32 px-6 md:px-12 border-b border-hairline">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-16 text-center">
          {[
            ["Premium Fabrics", "Loro Piana, Vitale Barberis, Scabal — sourced from European mills established before 1850."],
            ["Handcrafted Precision", "Every buttonhole, every lapel — sewn by a single master tailor."],
            ["International Standard", "Delivered to over forty countries. Atelier appointments worldwide."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="hairline w-12 mx-auto mb-8" />
              <div className="font-serif text-2xl mb-4">{title}</div>
              <p className="text-bone/60 font-light text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-12">— Voices —</div>
          <blockquote className="font-serif text-3xl md:text-5xl leading-[1.2] italic text-bone mb-12">
            “The first time I wore it, the room shifted. <br className="hidden md:block" />
            I have not worn another house since.”
          </blockquote>
          <div className="eyebrow text-bone/60">Olivier K. · CEO, Abidjan</div>

          <div className="hairline w-24 mx-auto my-20" />

          <div className="grid md:grid-cols-2 gap-12 text-left">
            {[
              ["“They understand that elegance is restraint.”", "Marc D. · Paris"],
              ["“My wedding suit will be remembered for decades.”", "Tariq S. · Dubai"],
            ].map(([quote, author]) => (
              <div key={author}>
                <p className="font-serif italic text-xl text-bone/90 mb-4 leading-relaxed">{quote}</p>
                <div className="eyebrow text-bone/50">{author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBTLE URGENCY / CTA */}
      <section className="border-t border-hairline py-24 px-6 md:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— By Appointment —</div>
        <p className="font-serif text-2xl md:text-3xl italic text-bone/85 mb-10 max-w-2xl mx-auto">
          Limited fittings available this season.
        </p>
        <Link to="/bespoke" className="luxury-btn luxury-btn-solid">Reserve Your Appointment</Link>
      </section>
    </div>
  );
}
