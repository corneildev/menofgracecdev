import { createFileRoute } from "@tanstack/react-router";
import { SizeFinder } from "@/components/SizeFinder";

export const Route = createFileRoute("/size-finder")({
  head: () => ({
    meta: [
      { title: "Size Finder — MEN OF GRACE" },
<<<<<<< HEAD
      { name: "description", content: "A guided size recommendation for the MEN OF GRACE ready-to-wear collection. Three questions, one Italian size." },
      { property: "og:title", content: "Size Finder — MEN OF GRACE" },
      { property: "og:description", content: "Three questions. A guide, not a guarantee." },
=======
      {
        name: "description",
        content:
          "A guided size recommendation for the MEN OF GRACE ready-to-wear collection. Three questions, one Italian size.",
      },
      { property: "og:title", content: "Size Finder — MEN OF GRACE" },
      {
        property: "og:description",
        content: "Three questions. A guide, not a guarantee.",
      },
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    ],
  }),
  component: SizeFinderPage,
});

function SizeFinderPage() {
  return (
    <div className="bg-ink text-bone min-h-screen">
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-6">— Ready-to-Wear —</div>
          <h1 className="display text-5xl md:text-8xl mb-10 leading-[0.95]">
            Size Finder
          </h1>
          <div className="hairline w-16 mx-auto my-10" />
          <p className="font-serif italic text-xl md:text-2xl text-bone/85 leading-relaxed max-w-2xl mx-auto">
            Three questions. <br className="hidden md:block" />
<<<<<<< HEAD
            <span className="text-bone/70">An honest recommendation, not a measurement.</span>
=======
            <span className="text-bone/70">
              An honest recommendation, not a measurement.
            </span>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-3xl mx-auto space-y-6 text-bone/75 font-light leading-relaxed text-base">
          <p>
<<<<<<< HEAD
            Our ready-to-wear is cut in Italian sizing, from IT 46 to IT 56.
            The Size Finder estimates which of those sizes is most likely to
            sit on your shoulders — based on height, weight and build.
=======
            Our ready-to-wear is cut in Italian sizing, from IT 46 to IT 56. The
            Size Finder estimates which of those sizes is most likely to sit on
            your shoulders — based on height, weight and build.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          </p>
          <p>
            For a piece composed to your exact body, the maison still recommends
            a fitting at the next trunk show, where the cloth is laid out and
            the silhouette is taken in person.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <SizeFinder variant="full" />
      </section>
    </div>
  );
}
