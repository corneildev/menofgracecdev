import { createFileRoute, Link } from "@tanstack/react-router";
import executiveHero from "@/assets/executive-hero.jpg";
import atelier from "@/assets/executive-atelier.jpg";
import craft from "@/assets/craft.jpg";
import { products, formatPrice, type Product } from "@/data/products";

export const Route = createFileRoute("/executive")({
  head: () => ({
    meta: [
      { title: "Executive Collection — MEN OF GRACE" },
      {
        name: "description",
        content:
          "The Executive Collection — bespoke suits for CEOs, executives, and decision-makers. Charcoal, navy, pinstripe, and mid-grey worsted wool. Private fittings worldwide.",
      },
      { property: "og:title", content: "Executive Collection — MEN OF GRACE" },
      {
        property: "og:description",
        content: "The boardroom sartoria — l'uniforme de ceux qui décident.",
      },
      { property: "og:image", content: executiveHero },
      { property: "twitter:image", content: executiveHero },
    ],
  }),
  component: ExecutivePage,
});

const ESSENTIALS: ReadonlyArray<readonly [string, string, string]> = [
  ["I", "The Charcoal", "Your daily armour."],
  ["II", "The Navy", "The international standard."],
  ["III", "The Pinstripe", "Heritage, restated."],
  ["IV", "The Black", "For the long evenings."],
  ["V", "The Mid-Grey", "Quiet authority."],
] as const;

const CITIES = [
  "Cotonou",
  "Lagos",
  "Abidjan",
  "Dakar",
  "Accra",
  "Dubai",
  "Paris",
] as const;

function ExecutivePage() {
  const executiveProducts = products.filter((p) => p.category === "Executive");

  return (
    <div className="bg-ink text-bone">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={executiveHero}
          alt="Executive in a charcoal three-piece suit before a city skyline"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-8 fade-in-slow">
            — Executive Collection —
          </div>
          <h1 className="display text-bone text-[14vw] md:text-[7rem] leading-[0.9] mb-6 fade-up">
            The Boardroom
            <br />
            <span className="italic font-light">Sartoria.</span>
          </h1>
          <div className="hairline w-16 my-8 fade-in-slow" />
          <p
            className="font-serif italic text-bone/85 text-xl md:text-2xl mb-12 fade-up"
            style={{ animationDelay: "200ms" }}
          >
            L'uniforme de ceux qui décident.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <Link to="/collection" className="luxury-btn luxury-btn-solid">
              Discover the Collection
            </Link>
            <Link to="/bespoke" className="luxury-btn">
              Book a Private Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-10">— Manifesto —</div>
          <h2 className="display text-3xl md:text-6xl leading-[1.1] text-bone mb-12">
            For the men who shape decisions,
            <br />
            <span className="italic text-bone/70">not headlines.</span>
          </h2>
          <div className="hairline w-16 mx-auto mb-12" />
          <p className="font-serif text-lg md:text-xl text-bone/75 leading-relaxed max-w-2xl mx-auto">
            The Executive Collection is composed for the man who arrives early,
            who listens before he speaks, who carries the weight of the room
            without ever requesting it. Cloth, cut, and construction — nothing
            else.
          </p>
        </div>
      </section>

      {/* THE WORKING WARDROBE */}
      <section className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5">
            <div className="img-zoom aspect-[4/5]">
              <img
                src={atelier}
                alt="Navy worsted wool on the atelier table"
                loading="lazy"
                className="h-full w-full object-cover"
                width={1280}
                height={1600}
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="eyebrow text-bone/60 mb-6">
              — The Working Wardrobe —
            </div>
            <h2 className="display text-4xl md:text-6xl mb-12 leading-[1.05]">
              The Five
              <br />
              <span className="italic">Essentials.</span>
            </h2>

            <ol className="space-y-8">
              {ESSENTIALS.map(([num, title, body]) => (
                <li
                  key={num}
                  className="grid grid-cols-[3rem_1fr] gap-6 items-baseline border-b border-hairline pb-6"
                >
                  <span className="font-serif italic text-bone/50 text-2xl">
                    {num}
                  </span>
                  <div>
                    <div className="font-serif text-xl mb-1">{title}</div>
                    <div className="text-bone/60 font-light text-sm">
                      {body}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* COLLECTION GRID */}
      <section className="px-6 md:px-12 py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <div className="eyebrow text-bone/60 mb-4">— The Collection —</div>
              <h2 className="display text-4xl md:text-6xl">Executive Pieces</h2>
            </div>
            <Link
              to="/collection"
              className="eyebrow text-bone hover:text-bone/60 border-b border-hairline pb-1"
            >
              Discover All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {executiveProducts.map((p: Product) => {
              const price = formatPrice(p);
              return (
                <Link key={p.id} to="/collection" className="group block">
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{p.category}</div>
                  <div className="font-serif text-xl mb-3">{p.name}</div>
                  <div className="text-bone/70 text-sm font-light flex gap-3 flex-wrap">
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

      {/* THE EXECUTIVE FITTING */}
      <section className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-8">
            — Private Atelier Service —
          </div>
          <h2 className="display text-4xl md:text-6xl mb-10 leading-[1.05]">
            We come <span className="italic">to you.</span>
          </h2>
          <p className="font-serif text-lg md:text-xl text-bone/75 leading-relaxed max-w-2xl mx-auto mb-16">
            Fittings at your office, your hotel, or your residence. Our master
            tailor travels with the cloth library — the consultation is held
            where you do your work.
          </p>

          <div className="hairline w-16 mx-auto mb-12" />

          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-16">
            {CITIES.map((city, i) => (
              <li
                key={city}
                className={`eyebrow text-bone/80 ${
                  i < CITIES.length - 1
                    ? "pr-10 border-r border-hairline"
                    : ""
                }`}
              >
                {city}
              </li>
            ))}
          </ul>

          <Link to="/bespoke" className="luxury-btn luxury-btn-solid">
            Schedule a Private Visit
          </Link>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-12">— Voices —</div>
          <blockquote className="font-serif text-3xl md:text-5xl leading-[1.2] italic text-bone mb-12">
            “I have worn many houses.
            <br className="hidden md:block" />
            Only one is mine.”
          </blockquote>
          <div className="eyebrow text-bone/60">
            Managing Partner · Lagos
          </div>
        </div>
      </section>

      {/* CRAFT IMAGE BAND */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden border-t border-hairline">
        <img
          src={craft}
          alt="The art of tailoring"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
      </section>

      {/* CTA FINALE */}
      <section className="border-t border-hairline py-24 px-6 md:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— By Appointment —</div>
        <p className="font-serif text-2xl md:text-3xl italic text-bone/85 mb-10 max-w-2xl mx-auto">
          A suit composed for the work ahead.
        </p>
        <Link to="/bespoke" className="luxury-btn luxury-btn-solid">
          Reserve Your Appointment
        </Link>
      </section>
    </div>
  );
}
