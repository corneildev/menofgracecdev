import { createFileRoute, Link } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Two Houses, One Vision — MEN OF GRACE" },
      { name: "description", content: "MEN OF GRACE works with two partner ateliers — Biella, Italy and Foshan, China — under a single standard of composition, curation and control." },
      { property: "og:title", content: "Two Houses, One Vision — MEN OF GRACE" },
      { property: "og:description", content: "We do not own these ateliers. We chose them." },
      { property: "og:image", content: craft },
      { property: "twitter:image", content: craft },
    ],
  }),
  component: Atelier,
});

function Atelier() {
  return (
    <div className="bg-ink text-bone">
      {/* HERO */}
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-6">— The House —</div>
          <h1 className="display text-5xl md:text-8xl mb-10 leading-[0.95]">
            Two Houses,
            <br />
            <span className="italic font-light">One Vision.</span>
          </h1>
          <div className="hairline w-16 mx-auto my-10" />
          <p className="font-serif italic text-xl md:text-2xl text-bone/85 leading-relaxed">
            We do not own these ateliers. <br className="hidden md:block" />
            <span className="text-bone/70">We chose them.</span>
          </p>
        </div>
      </section>

      {/* COVER IMAGE */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1400px] mx-auto img-zoom aspect-[16/9]">
          <img src={craft} alt="The hand of a tailor at work" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-3xl mx-auto space-y-10 text-bone/80 font-light leading-relaxed text-lg">
          <p>
            MEN OF GRACE is not an atelier. It is a maison of composition.
          </p>
          <p>
            We design the pieces. We curate the cloth. We meet the men who will wear them.
            The hands that cut and stitch belong to two partner houses we have chosen with care —
            one in Biella, Italy; one in Foshan, China.
          </p>
          <p className="font-serif italic text-bone/90 text-xl">
            Honesty is part of the cloth.
          </p>
          <p>
            What carries our name is what we have composed, curated and controlled — not what we have claimed to own.
          </p>
        </div>
      </section>

      {/* TWO HOUSES — Biella */}
      <section className="border-t border-hairline">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2">
          <div className="p-10 md:p-16 md:border-r border-hairline">
            <div className="eyebrow text-bone/50 mb-6">— Atelier I —</div>
            <h2 className="display text-4xl md:text-5xl mb-2">Biella</h2>
            <div className="eyebrow text-bone/60 mb-10">Piedmont · Italy</div>

            <p className="font-serif italic text-bone/90 text-lg mb-8">
              For the bespoke commission and the most exacting made-to-measure.
            </p>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="eyebrow text-bone/50 mb-1">Production</dt>
                <dd className="text-bone/80 font-light">Bespoke premium · Made-to-measure haut de gamme</dd>
              </div>
              <div>
                <dt className="eyebrow text-bone/50 mb-1">House</dt>
                <dd className="text-bone/80 font-light">A multi-generational tailoring house, kept deliberately small.</dd>
              </div>
              <div>
                <dt className="eyebrow text-bone/50 mb-1">Cloth</dt>
                <dd className="text-bone/80 font-light">
                  Loro Piana · Vitale Barberis Canonico · Drago · Scabal — sourced through the mills of Piedmont and Huddersfield.
                </dd>
              </div>
            </dl>
          </div>

          {/* Foshan */}
          <div className="p-10 md:p-16 border-t md:border-t-0 border-hairline">
            <div className="eyebrow text-bone/50 mb-6">— Atelier II —</div>
            <h2 className="display text-4xl md:text-5xl mb-2">Foshan</h2>
            <div className="eyebrow text-bone/60 mb-10">Guangdong · China</div>

            <p className="font-serif italic text-bone/90 text-lg mb-8">
              For made-to-measure and ready-to-wear of quiet precision.
            </p>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="eyebrow text-bone/50 mb-1">Production</dt>
                <dd className="text-bone/80 font-light">Made-to-measure · Ready-to-wear</dd>
              </div>
              <div>
                <dt className="eyebrow text-bone/50 mb-1">Discipline</dt>
                <dd className="text-bone/80 font-light">Pattern-cutting of precision — the geometry beneath every garment.</dd>
              </div>
              <div>
                <dt className="eyebrow text-bone/50 mb-1">Cloth</dt>
                <dd className="text-bone/80 font-light">
                  Curated from the same European mills, with finishing held to a single standard.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* OUR ROLE */}
      <section className="border-t border-hairline py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="eyebrow text-bone/60 mb-6">— The Maison —</div>
          <h2 className="display text-4xl md:text-6xl leading-[1.05]">
            What we do,
            <br />
            <span className="italic font-light">and only that.</span>
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-12">
          {[
            ["Composition", "We design the pieces — line, proportion, intent."],
            ["Curation", "We choose the cloth, mill by mill, season by season."],
            ["Control", "We inspect each garment before it leaves the atelier."],
            ["Relation", "We meet our clients — at trunk shows, at fittings."],
          ].map(([title, body]) => (
            <div key={title} className="text-center md:text-left">
              <div className="hairline w-10 mx-auto md:mx-0 mb-6" />
              <div className="font-serif text-2xl mb-3">{title}</div>
              <p className="text-bone/65 font-light text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="border-t border-hairline py-32 px-6 md:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— By Appointment —</div>
        <p className="font-serif text-2xl md:text-3xl italic text-bone/85 mb-10 max-w-2xl mx-auto">
          Fittings are held in private, during our seasonal trunk shows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bespoke" className="luxury-btn luxury-btn-solid">Speak to the Maison</Link>
        </div>
      </section>
    </div>
  );
}
