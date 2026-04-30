import { createFileRoute, Link } from "@tanstack/react-router";
import businessHero from "@/assets/business-hero.jpg";
import wardrobe from "@/assets/business-wardrobe.jpg";
import craft from "@/assets/craft.jpg";
import { products, formatPrice, type Product } from "@/data/products";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Suits — MEN OF GRACE" },
      {
        name: "description",
        content:
          "The Business Suits collection — refined daily tailoring for the working week. Navy, grey, travel blazers and flannel trousers. Half-canvas construction, Italian worsted wools.",
      },
      { property: "og:title", content: "Business Suits — MEN OF GRACE" },
      {
        property: "og:description",
        content: "The working wardrobe — built for the five days a man earns his life.",
      },
      { property: "og:image", content: businessHero },
      { property: "twitter:image", content: businessHero },
    ],
  }),
  component: BusinessPage,
});

const PRINCIPLES: ReadonlyArray<readonly [string, string, string]> = [
  ["I", "Half-Canvas", "Structure where it counts, ease everywhere else."],
  ["II", "Italian Worsted", "From mills established before 1850."],
  ["III", "Travel-Ready", "High-twist cloths that resist the long flight."],
  ["IV", "Repeatable Fit", "One pattern, refined across every season."],
] as const;

const ROUTINE: ReadonlyArray<readonly [string, string]> = [
  ["Monday", "Navy two-piece, white shirt, navy grenadine."],
  ["Tuesday", "Ash grey, blue shirt, knit tie."],
  ["Wednesday", "Travel blazer, stone flannel, brown loafer."],
  ["Thursday", "Navy two-piece, pale blue shirt, no tie."],
  ["Friday", "Ash grey, oxford shirt, brown belt."],
] as const;

function BusinessPage() {
  const businessProducts = products.filter((p) => p.category === "Business");

  return (
    <div className="bg-ink text-bone">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={businessHero}
          alt="Businessman walking through a marble corporate lobby"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-ink" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-8 fade-in-slow">
            — Business Suits —
          </div>
          <h1 className="display text-bone text-[14vw] md:text-[7rem] leading-[0.9] mb-6 fade-up">
            The Working
            <br />
            <span className="italic font-light">Wardrobe.</span>
          </h1>
          <div className="hairline w-16 my-8 fade-in-slow" />
          <p
            className="font-serif italic text-bone/85 text-xl md:text-2xl mb-12 fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Cinq jours. Cinq costumes. Une seule maison.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <Link to="/collection" className="luxury-btn luxury-btn-solid">
              Shop the Working Wardrobe
            </Link>
            <Link to="/bespoke" className="luxury-btn">
              Book a Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-10">— Manifesto —</div>
          <h2 className="display text-3xl md:text-6xl leading-[1.1] text-bone mb-12">
            The suit you wear most
            <br />
            <span className="italic text-bone/70">is the suit that defines you.</span>
          </h2>
          <div className="hairline w-16 mx-auto mb-12" />
          <p className="font-serif text-lg md:text-xl text-bone/75 leading-relaxed max-w-2xl mx-auto">
            Business Suits are composed for the five days a man actually earns
            his life. Lighter cloths, repeatable fits, half-canvas construction —
            the working tailoring of a maison that takes Monday as seriously as
            Saturday.
          </p>
        </div>
      </section>

      {/* PRINCIPLES + IMAGE */}
      <section className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7 md:order-2">
            <div className="img-zoom aspect-[4/5]">
              <img
                src={wardrobe}
                alt="Stacked grey and navy worsted wool with a tailor's tape"
                loading="lazy"
                className="h-full w-full object-cover"
                width={1280}
                height={1600}
              />
            </div>
          </div>
          <div className="md:col-span-5 md:order-1">
            <div className="eyebrow text-bone/60 mb-6">— Construction —</div>
            <h2 className="display text-4xl md:text-6xl mb-12 leading-[1.05]">
              Four
              <br />
              <span className="italic">Principles.</span>
            </h2>
            <ol className="space-y-8">
              {PRINCIPLES.map(([num, title, body]) => (
                <li
                  key={num}
                  className="grid grid-cols-[3rem_1fr] gap-6 items-baseline border-b border-hairline pb-6"
                >
                  <span className="font-serif italic text-bone/50 text-2xl">
                    {num}
                  </span>
                  <div>
                    <div className="font-serif text-xl mb-1">{title}</div>
                    <div className="text-bone/60 font-light text-sm">{body}</div>
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
              <h2 className="display text-4xl md:text-6xl">Business Pieces</h2>
            </div>
            <Link
              to="/collection"
              className="eyebrow text-bone hover:text-bone/60 border-b border-hairline pb-1"
            >
              Discover All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {businessProducts.map((p: Product) => {
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

      {/* THE WEEK */}
      <section className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="eyebrow text-bone/60 mb-8">— The Week, Composed —</div>
            <h2 className="display text-4xl md:text-6xl leading-[1.05]">
              Five days,
              <br />
              <span className="italic">five compositions.</span>
            </h2>
          </div>

          <ul>
            {ROUTINE.map(([day, look]) => (
              <li
                key={day}
                className="grid grid-cols-[8rem_1fr] md:grid-cols-[10rem_1fr] gap-6 items-baseline border-b border-hairline py-6"
              >
                <span className="eyebrow text-bone/60">{day}</span>
                <span className="font-serif text-lg md:text-xl text-bone/90">
                  {look}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-12">— Voices —</div>
          <blockquote className="font-serif text-3xl md:text-5xl leading-[1.2] italic text-bone mb-12">
            “I stopped buying suits.
            <br className="hidden md:block" />
            I now order the same one, twice a year.”
          </blockquote>
          <div className="eyebrow text-bone/60">
            Director · Abidjan
          </div>
        </div>
      </section>

      {/* CRAFT BAND */}
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
          The working wardrobe — measured, drafted, repeated.
        </p>
        <Link to="/bespoke" className="luxury-btn luxury-btn-solid">
          Begin Your Wardrobe
        </Link>
      </section>
    </div>
  );
}
