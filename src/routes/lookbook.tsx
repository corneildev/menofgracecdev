import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import heroSuit from "@/assets/hero-suit.jpg";
import craft from "@/assets/craft.jpg";
import wedding from "@/assets/wedding.jpg";
import suitOnyx from "@/assets/suit-onyx.jpg";
import suitMidnight from "@/assets/suit-midnight.jpg";
import suitIvory from "@/assets/suit-ivory.jpg";
import executiveAtelier from "@/assets/executive-atelier.jpg";
import executiveHero from "@/assets/executive-hero.jpg";
import businessHero from "@/assets/business-hero.jpg";
import businessWardrobe from "@/assets/business-wardrobe.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "The Quiet Hour — Lookbook · MEN OF GRACE" },
      {
        name: "description",
        content:
          "A meditation on power, restraint, and presence. The Spring MMXXVI campaign by MEN OF GRACE.",
      },
      { property: "og:title", content: "The Quiet Hour — Lookbook" },
      {
        property: "og:description",
        content: "Spring MMXXVI campaign — power, restraint, presence.",
      },
      { property: "og:image", content: heroSuit },
    ],
  }),
  component: LookbookPage,
});

function Caption({ eyebrow, line }: { eyebrow: string; line: string }) {
  return (
    <div className="text-bone">
      <div className="eyebrow text-bone/70 mb-3">— {eyebrow} —</div>
      <p className="font-serif italic text-lg md:text-xl leading-snug max-w-md">
        {line}
      </p>
    </div>
  );
}

function LookbookPage() {
  const { t } = useTranslation();
  return (
    <main className="bg-ink text-bone">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroSuit}
          alt="The Quiet Hour — campaign opening"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/80" />
        <div className="absolute inset-x-0 bottom-0 pb-20 md:pb-32 px-6 md:px-12 text-center">
          <div className="eyebrow text-bone/70 mb-6">
            — Campaign · Spring MMXXVI —
          </div>
          <h1 className="display text-5xl md:text-8xl leading-[0.95] mb-6">
            The Quiet Hour
          </h1>
          <p className="font-serif italic text-bone/85 text-lg md:text-2xl max-w-2xl mx-auto">
            A meditation on power, restraint, and presence.
          </p>
        </div>
      </section>

      {/* I. THE MORNING — Layout A */}
      <section className="relative w-full h-[90vh] overflow-hidden border-t border-hairline">
        <img
          src={executiveAtelier}
          alt="I. The Morning — preparation, the suit on its form"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 via-transparent to-transparent" />
        <div className="absolute bottom-12 right-6 md:bottom-16 md:right-16 max-w-md">
          <Caption
            eyebrow="I. The Morning"
            line="Before the city wakes, the cloth is already chosen."
          />
        </div>
      </section>

      {/* II. THE GLASS — Layout B */}
      <section className="bg-ink py-24 md:py-40 px-6 md:px-12 border-t border-hairline">
        <div className="mx-auto max-w-[1600px] grid grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="col-span-12 md:col-span-7">
            <img
              src={businessHero}
              alt="II. The Glass — silhouette against the city"
              className="w-full h-[70vh] object-cover"
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-9 pb-8 md:pb-16">
            <Caption
              eyebrow="II. The Glass"
              line="A silhouette held against the city, neither moving nor announcing."
            />
          </div>
        </div>
      </section>

      {/* III. THE BOARDROOM — Layout C */}
      <section className="border-t border-hairline">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden md:border-r md:border-hairline">
            <img
              src={executiveHero}
              alt="III. The Boardroom — the long table"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={suitMidnight}
              alt="III. The Boardroom — the considered shoulder"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="px-6 md:px-12 py-12 md:py-16 border-t border-hairline">
          <Caption
            eyebrow="III. The Boardroom"
            line="Decisions made quietly carry the furthest."
          />
        </div>
      </section>

      {/* IV. THE TRAVEL — Layout A */}
      <section className="relative w-full h-[90vh] overflow-hidden border-t border-hairline">
        <img
          src={businessWardrobe}
          alt="IV. The Travel — luggage, hotel, transit"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-ink/60 via-transparent to-transparent" />
        <div className="absolute bottom-12 right-6 md:bottom-16 md:right-16 max-w-md">
          <Caption
            eyebrow="IV. The Travel"
            line="Crossings measured in hours, dressed in cloth that does not crease."
          />
        </div>
      </section>

      {/* V. THE EXCHANGE — Layout D, square + poem */}
      <section className="bg-ink py-24 md:py-40 px-6 md:px-12 border-t border-hairline">
        <div className="mx-auto max-w-3xl">
          <div className="aspect-square overflow-hidden">
            <img
              src={craft}
              alt="V. The Exchange — the shoulder, the hand, the meeting"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-12 md:mt-16 text-center">
            <div className="eyebrow text-bone/70 mb-8">— V. The Exchange —</div>
            <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-bone/90">
              A shoulder, held.<br />
              A hand, offered.<br />
              The cloth says what is not spoken.
            </p>
          </div>
        </div>
      </section>

      {/* VI. THE RETURN — Layout B */}
      <section className="bg-ink py-24 md:py-40 px-6 md:px-12 border-t border-hairline">
        <div className="mx-auto max-w-[1600px] grid grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="col-span-12 md:col-span-7">
            <img
              src={suitOnyx}
              alt="VI. The Return — the jacket on the chair"
              className="w-full h-[70vh] object-cover"
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-9 pb-8 md:pb-16">
            <Caption
              eyebrow="VI. The Return"
              line="The jacket finds the chair. The day is folded into it."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative border-t border-hairline">
        <div className="absolute inset-0">
          <img
            src={suitIvory}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-ink/80" />
        </div>
        <div className="relative px-6 md:px-12 py-32 md:py-48 text-center">
          <div className="eyebrow text-bone/70 mb-8">{t("lookbook.finalEyebrow")}</div>
          <h2 className="display text-4xl md:text-6xl mb-12 leading-[1.05]">
            {t("lookbook.finalTitle")}<br />
            <span className="italic">{t("lookbook.finalTitleItalic")}</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
            <Link to="/executive" className="luxury-btn luxury-btn-solid">
              {t("lookbook.ctaExecutive")}
            </Link>
            <Link to="/bespoke" className="luxury-btn">
              {t("lookbook.ctaBespoke")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
