import { createFileRoute } from "@tanstack/react-router";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Atelier — MEN OF GRACE" },
      { name: "description", content: "Inside the MEN OF GRACE atelier — craftsmanship, fabric and philosophy." },
      { property: "og:title", content: "The Atelier — MEN OF GRACE" },
      { property: "og:description", content: "A house of quiet luxury and obsessive craftsmanship." },
      { property: "og:image", content: craft },
    ],
  }),
  component: Atelier,
});

function Atelier() {
  return (
    <div className="bg-ink">
      <section className="pt-40 pb-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-6">— The House —</div>
          <h1 className="display text-5xl md:text-8xl mb-12">The Atelier</h1>
          <p className="font-serif italic text-xl md:text-2xl text-bone/80 leading-relaxed">
            We do not chase fashion. We compose silhouettes that outlive it.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1400px] mx-auto img-zoom aspect-[16/9]">
          <img src={craft} alt="Craft" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-3xl mx-auto space-y-12 text-bone/80 font-light leading-relaxed text-lg">
          <p>
            MEN OF GRACE is a maison of bespoke menswear founded on a single conviction: the suit a man wears should
            be as quietly powerful as the man inside it.
          </p>
          <p>
            Our master tailors trained in Naples, Savile Row and Paris. They work in a single atelier, with a single
            standard. No outsourcing. No shortcuts. No collections produced for the sake of a season.
          </p>
          <p>
            Each suit takes between sixty and ninety hours of work. Every interior is hand-stitched, every buttonhole
            is hand-cut, every lapel is rolled — never pressed flat.
          </p>
        </div>
      </section>

      <section className="border-t border-hairline py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12 text-center">
          {[
            ["IV", "Ateliers"],
            ["28", "Measurements"],
            ["72h", "Per Garment"],
            ["1850", "Mills Since"],
          ].map(([num, label]) => (
            <div key={label as string}>
              <div className="display text-5xl md:text-6xl mb-4">{num}</div>
              <div className="eyebrow text-bone/60">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
