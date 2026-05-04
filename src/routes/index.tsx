import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-suit.jpg";
import executiveImg from "@/assets/executive-hero.jpg";
import weddingImg from "@/assets/wedding.jpg";
import atelierImg from "@/assets/executive-atelier.jpg";
import {
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  formatPriceEur,
  CATEGORY_LABELS,
} from "@/lib/products";
import { getStoredCurrency } from "@/components/CurrencySwitch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Men of Grace — Maison de tailleur" },
      {
        name: "description",
        content:
          "Costumes prêt-à-porter, sur-mesure, mariage et executive. Façonnés à la main par nos ateliers partenaires de Biella et Foshan. Livraison sous 5 jours, retouches offertes.",
      },
      { property: "og:title", content: "Men of Grace — Maison de tailleur" },
      {
        property: "og:description",
        content: "Pour les hommes qui imposent leur présence — sans dire un mot.",
      },
      { property: "og:image", content: hero },
      { property: "twitter:image", content: hero },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: listPublishedProducts,
  });

  const featured = products.slice(0, 8);
  const [currency, setCurrency] = useState<"FCFA" | "EUR" | "USD">("FCFA");

  useEffect(() => {
    setCurrency(getStoredCurrency());
  }, []);

  const formatPrice = (p: typeof featured[number]) => {
    if (currency === "EUR") return formatPriceEur(p.price_eur);
    if (currency === "USD") return formatPriceUsd(p.price_usd);
    return formatPriceFcfa(p.price_fcfa);
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* HERO — Lifestyle éditorial */}
      <section className="relative w-full overflow-hidden">
        <div className="relative min-h-[100svh] w-full">
          <img
            src={hero}
            alt="Homme en costume sur-mesure Men of Grace"
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1920}
            height={1080}
          />
          {/* Lecture overlay : sombre en bas pour lisibilité, sans assombrir tout */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />

          {/* Big serif title sur l'image, façon Mrbuerly */}
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-16 sm:pb-24 lg:pb-28">
            <div className="max-w-[1600px] mx-auto">
              <div className="eyebrow text-white/80 mb-6 fade-in-slow">— Maison de tailleur · MMXX —</div>
              <h1 className="display text-white text-[15vw] sm:text-[11vw] md:text-[8.5rem] lg:text-[10rem] leading-[0.9] tracking-tight mb-8 fade-up">
                Élégance
                <br />
                <span className="italic font-light">sur-mesure.</span>
              </h1>
              <p className="font-light text-white/85 text-base sm:text-lg max-w-md leading-relaxed mb-8 fade-up" style={{ animationDelay: "150ms" }}>
                La précision du tailleur élève chaque présence.
                Composé par la maison, façonné à la main à Biella et Foshan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 fade-up" style={{ animationDelay: "300ms" }}>
                <Link
                  to="/collection"
                  className="inline-flex items-center justify-center px-9 py-4 bg-white text-black text-[11px] tracking-[0.32em] uppercase font-light hover:bg-white/90 transition-colors"
                >
                  Acheter maintenant
                </Link>
                <Link
                  to="/size-finder"
                  className="inline-flex items-center justify-center px-9 py-4 border border-white/80 text-white text-[11px] tracking-[0.32em] uppercase font-light hover:bg-white hover:text-black transition-colors"
                >
                  Trouver ma taille
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER — bandeau villes */}
      <section className="bg-foreground text-background py-7">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-3 text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.4em] font-light">
          <span>Abidjan · Cocody</span>
          <span>Paris · 8ᵉ</span>
          <span>Lagos · Ikoyi</span>
          <span>Dubaï · DIFC</span>
        </div>
      </section>

      {/* PIÈCES PHARES — remontées (façon Mrbuerly Weekly Trends) */}
      {featured.length > 0 && (
        <section className="px-5 md:px-10 lg:px-12 pt-20 sm:pt-28 pb-20">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-10 sm:mb-14 flex-wrap gap-4">
              <div>
                <div className="eyebrow text-foreground/60 mb-3">— Tendances de la semaine —</div>
                <h2 className="display text-3xl sm:text-4xl md:text-5xl">Pièces phares</h2>
              </div>
              <Link to="/collection" className="eyebrow hover:opacity-60 border-b border-foreground/30 pb-1">
                Voir la collection →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to="/collection/$productId"
                  params={{ productId: p.slug }}
                  className="group block w-full"
                >
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-4 overflow-hidden">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-foreground/55 mb-1.5 text-[10px]">{CATEGORY_LABELS[p.category]}</div>
                  <div className="font-serif text-lg sm:text-xl mb-1.5 leading-tight">{p.name}</div>
                  <div className="text-foreground/75 text-sm font-light">{formatPrice(p)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TROIS PILIERS */}
      <section className="px-5 md:px-10 lg:px-12 pb-20 sm:pb-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="eyebrow text-foreground/60 mb-3">— Le Triptyque —</div>
            <h2 className="display text-3xl sm:text-4xl md:text-5xl">Trois maisons, une signature</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <PillarCard
              eyebrow="I · Executive"
              title="Executive Sartoria"
              body="La coupe pensée pour les conseils et les grandes scènes du business."
              image={executiveImg}
              cta="Découvrir"
              href="/collection"
            />
            <PillarCard
              eyebrow="II · Sur-mesure"
              title="Le Sur-mesure"
              body="Un vêtement composé en trois essayages, autour d'un seul homme."
              image={atelierImg}
              cta="Prendre rendez-vous"
              href="/size-finder"
              elevated
            />
            <PillarCard
              eyebrow="III · Mariage"
              title="Le Mariage"
              body="Les habits d'un jour qui ne se rejoue pas, avec la gravité qu'il mérite."
              image={weddingImg}
              cta="Composer mon habit"
              href="/collection"
            />
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 sm:py-32 px-6 md:px-12 border-y border-hairline">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-8">— Manifeste —</div>
          <h2 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
            Pour les hommes qui imposent leur présence
            <br />
            <span className="italic text-foreground/70">sans dire un mot.</span>
          </h2>
        </div>
      </section>

      {/* GARANTIES */}
      <section className="py-20 sm:py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-14 text-center">
          {[
            ["Étoffes choisies", "Loro Piana, Vitale Barberis Canonico, Drago, Scabal."],
            ["Tailles italiennes", "Du IT 46 au IT 56. Size Finder guidé."],
            ["Expédition 5 jours", "Envoi sous 5 jours. Retouches locales offertes."],
            ["Paiement sécurisé", "Wave, Orange Money, virement bancaire."],
            ["Retours 14 jours", "Échange ou remboursement intégral."],
            ["Conseil privé", "Une équipe dédiée sur WhatsApp."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="hairline w-10 mx-auto mb-5 bg-foreground/30" />
              <div className="font-serif text-lg sm:text-xl mb-2">{title}</div>
              <p className="text-foreground/60 font-light text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="py-24 sm:py-32 px-6 md:px-12 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-8">— Ils nous font confiance —</div>
          <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl leading-snug text-foreground/90 mb-10">
            « Le costume n'est pas un vêtement, c'est une décision stratégique.
            Men of Grace l'a compris mieux que personne. »
          </blockquote>
          <div className="hairline w-10 mx-auto mb-5 bg-foreground/30" />
          <p className="eyebrow text-foreground/70">Marcus C. — Directeur Général, Lagos</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 sm:py-32 px-6 md:px-12 text-center border-t border-hairline">
        <div className="relative max-w-3xl mx-auto">
          <div className="eyebrow text-foreground/60 mb-6">— Réservez votre essayage —</div>
          <h3 className="display text-4xl sm:text-5xl md:text-6xl mb-8 leading-[1.05]">
            Composez la pièce
            <br />
            <span className="italic">qui vous ressemble.</span>
          </h3>
          <p className="text-foreground/60 max-w-xl mx-auto mb-10 font-light">
            Places limitées chaque mois pour les essayages sur-mesure.
            Composez votre pièce en ligne ou réservez un rendez-vous privé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link to="/collection" className="luxury-btn luxury-btn-solid">
              Acheter maintenant
            </Link>
            <Link to="/size-finder" className="luxury-btn">
              Réserver un essayage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PillarCard({
  eyebrow,
  title,
  body,
  image,
  cta,
  href,
  elevated = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  cta: string;
  href: "/collection" | "/size-finder";
  elevated?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`group relative aspect-[4/5] overflow-hidden bg-secondary block ${elevated ? "md:-mt-12 md:mb-12" : ""}`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9 lg:p-11 text-white">
        <div className="text-[10px] tracking-[0.32em] uppercase text-white/70 mb-3">{eyebrow}</div>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-3">{title}</h3>
        <p className="text-white/80 text-sm font-light leading-relaxed mb-5 max-w-xs">
          {body}
        </p>
        <span className="text-[10px] tracking-[0.32em] uppercase text-white border-b border-white/40 pb-1 inline-block group-hover:border-white transition-colors">
          {cta} →
        </span>
      </div>
    </Link>
  );
}
