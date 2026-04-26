import { createFileRoute, Link } from "@tanstack/react-router";
import wedding from "@/assets/wedding.jpg";
import ivory from "@/assets/suit-ivory.jpg";

export const Route = createFileRoute("/wedding")({
  head: () => ({
    meta: [
      { title: "Wedding — MEN OF GRACE" },
      { name: "description", content: "Bespoke wedding suits and tuxedos for the groom and his witnesses." },
      { property: "og:title", content: "Wedding Excellence — MEN OF GRACE" },
      { property: "og:description", content: "A complete sartorial composition for the most defining day." },
      { property: "og:image", content: wedding },
      { property: "twitter:image", content: wedding },
    ],
  }),
  component: Wedding,
});

function Wedding() {
  const packages = [
    {
      name: "L'Essentiel",
      price: "1 790 000 FCFA",
      usd: "$2 990",
      includes: ["Bespoke groom suit", "Two fittings", "Hand-finished interior", "Three accessories"],
    },
    {
      name: "Le Cérémonial",
      price: "2 490 000 FCFA",
      usd: "$4 150",
      includes: ["Bespoke tuxedo", "Three fittings", "Silk lining of choice", "Witness coordination (2 men)"],
    },
    {
      name: "L'Héritage",
      price: "3 900 000 FCFA",
      usd: "$6 500",
      includes: ["Two bespoke pieces", "Unlimited fittings", "Loro Piana fabric", "Full party (up to 6 men)", "Travel atelier visit"],
    },
  ];

  return (
    <div className="bg-ink">
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <img src={wedding} alt="Wedding" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-6 fade-in-slow">— Maison Mariage —</div>
          <h1 className="display text-bone text-6xl md:text-9xl leading-[0.9] mb-6 fade-up">
            Wedding<br /><span className="italic">Excellence</span>
          </h1>
        </div>
      </section>

      <section className="py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif italic text-2xl md:text-3xl text-bone/85 leading-relaxed">
            “A wedding suit is not a costume. It is the silhouette by which your union will be remembered.”
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-10">
          {packages.map((p, i) => (
            <div key={p.name} className={`border border-hairline p-10 md:p-12 ${i === 1 ? "bg-secondary" : ""}`}>
              <div className="eyebrow text-bone/50 mb-6">Package {String.fromCharCode(73 + i)}</div>
              <h3 className="font-serif text-3xl mb-2">{p.name}</h3>
              <div className="text-bone/70 font-light text-sm mb-1">From {p.price}</div>
              <div className="eyebrow text-bone/40 mb-10">{p.usd}</div>
              <div className="hairline mb-8" />
              <ul className="space-y-4 mb-12">
                {p.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-bone/80 font-light text-sm">
                    <span className="text-bone/40">—</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/bespoke" className="luxury-btn w-full">Book Consultation</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="img-zoom aspect-[4/5]">
            <img src={ivory} alt="Ivory groom" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="eyebrow text-bone/60 mb-6">— The Day —</div>
            <h2 className="display text-4xl md:text-6xl mb-8 leading-[1.05]">
              Composed for<br /><span className="italic">one moment.</span>
            </h2>
            <p className="text-bone/70 font-light leading-relaxed mb-10">
              Our wedding atelier reserves only twelve grooms per season. Each receives a dedicated master tailor from first sketch to final fitting.
            </p>
            <Link to="/bespoke" className="luxury-btn luxury-btn-solid">Reserve Your Date</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
