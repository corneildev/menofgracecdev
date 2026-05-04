import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero-suit.jpg";
import executiveImg from "@/assets/executive-hero.jpg";
import weddingImg from "@/assets/wedding.jpg";
import atelierImg from "@/assets/executive-atelier.jpg";
import {
  listPublishedProducts,
  formatPriceFcfa,
  formatPriceUsd,
  CATEGORY_LABELS,
} from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEN OF GRACE — Maison de tailleur" },
      {
        name: "description",
        content:
          "Costumes prêt-à-porter, sur-mesure, mariage et executive. Façonné à la main par nos ateliers partenaires de Biella et Foshan. Livraison sous 5 jours, retouches locales offertes.",
      },
      { property: "og:title", content: "MEN OF GRACE — Maison de tailleur" },
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

  const featured = products.slice(0, 6);

  return (
    <div className="bg-ink text-bone overflow-x-hidden">
      {/* HERO — Monumental */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-end">
        <img
          src={hero}
          alt="Homme en costume sur-mesure"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-transparent" />

        {/* Top eyebrow */}
        <div className="relative z-10 absolute top-28 sm:top-32 left-0 right-0 flex justify-center">
          <div className="eyebrow text-bone/70 fade-in-slow text-center px-4">
            — Maison de tailleur · Fondée MMXX —
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-16 pb-16 sm:pb-24 lg:pb-28 max-w-[1600px] mx-auto w-full">
          <h1
            className="display text-bone text-[14vw] sm:text-[10vw] md:text-[7.5rem] lg:text-[9rem] leading-[0.85] tracking-tight mb-8 sm:mb-12 fade-up max-w-5xl"
          >
            L'architecture
            <br />
            <span className="italic font-light">de la distinction.</span>
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16 fade-up" style={{ animationDelay: "200ms" }}>
            <p className="font-light text-bone/75 text-base sm:text-lg max-w-md leading-relaxed">
              Un vestiaire pensé pour les hommes qui dirigent. Composé par la maison,
              façonné à la main par nos ateliers partenaires de <span className="italic">Biella</span> et <span className="italic">Foshan</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Link to="/collection" className="luxury-btn luxury-btn-solid w-full sm:w-auto whitespace-nowrap">
                Découvrir la collection
              </Link>
              <Link to="/size-finder" className="luxury-btn w-full sm:w-auto whitespace-nowrap">
                Trouver ma taille
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-6 sm:pb-8 text-center eyebrow text-bone/40 fade-in-slow">
          Faire défiler
        </div>
      </section>

      {/* TICKER — Cities, on a contrasted band */}
      <section className="bg-bone text-ink py-10 sm:py-12 border-y border-hairline">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.4em] font-light">
          <span>Abidjan · Cocody</span>
          <span>Paris · 8ᵉ</span>
          <span>Lagos · Ikoyi</span>
          <span>Dubaï · DIFC</span>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 sm:py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-8 sm:mb-10">— Manifeste —</div>
          <h2 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-bone">
            Pour les hommes qui imposent leur présence
            <br />
            <span className="italic text-bone/70">sans dire un mot.</span>
          </h2>
        </div>
      </section>

      {/* TROIS PILIERS */}
      <section className="px-6 md:px-12 pb-24 sm:pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="eyebrow text-bone/60 mb-10 text-center">— Le Triptyque —</div>

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

      {/* COLLECTION FEATURED */}
      {featured.length > 0 && (
        <section className="px-6 md:px-12 pb-24 sm:pb-32 border-t border-hairline pt-24 sm:pt-32">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-4 sm:gap-6">
              <div>
                <div className="eyebrow text-bone/60 mb-3 sm:mb-4">— La Collection —</div>
                <h2 className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Pièces phares</h2>
              </div>
              <Link to="/collection" className="eyebrow text-bone hover:text-bone/60 border-b border-hairline pb-1">
                Voir toute la collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to="/collection/$productId"
                  params={{ productId: p.slug }}
                  className="group block w-full"
                >
                  <div className="img-zoom aspect-[4/5] bg-secondary mb-5 sm:mb-6 overflow-hidden">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="eyebrow text-bone/50 mb-2">{CATEGORY_LABELS[p.category]}</div>
                  <div className="font-serif text-xl sm:text-2xl mb-3">{p.name}</div>
                  <div className="text-bone/70 text-sm font-light flex flex-wrap gap-x-4 gap-y-1">
                    <span>{formatPriceFcfa(p.price_fcfa)}</span>
                    <span className="text-bone/40">·</span>
                    <span>{formatPriceUsd(p.price_usd)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST / GARANTIES */}
      <section className="py-20 sm:py-28 md:py-32 px-6 md:px-12 border-y border-hairline">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
          {[
            ["Étoffes choisies", "Loro Piana, Vitale Barberis Canonico, Drago, Scabal — sélectionnées moulin par moulin."],
            ["Tailles italiennes", "Coupé du IT 46 au IT 56. Un Size Finder guidé si vous hésitez entre deux tailles."],
            ["Expédition 5 jours", "Envoi sous cinq jours ouvrés. Retouches locales offertes."],
            ["Paiement sécurisé", "Wave, Orange Money, virement bancaire. Confirmation immédiate."],
            ["Retours sous 14 jours", "Si la pièce ne vous convient pas, échange ou remboursement intégral."],
            ["Conseil privé", "Une équipe dédiée vous accompagne par WhatsApp, à toute heure."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="hairline w-12 mx-auto mb-6 sm:mb-8" />
              <div className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4">{title}</div>
              <p className="text-bone/60 font-light text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="py-24 sm:py-32 md:py-40 px-6 md:px-12 bg-ink">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-10">— Ils nous font confiance —</div>
          <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl leading-snug text-bone/90 mb-12">
            « Le costume n'est pas un vêtement, c'est une décision stratégique.
            Men of Grace l'a compris mieux que personne. »
          </blockquote>
          <div className="hairline w-12 mx-auto mb-6" />
          <p className="eyebrow text-bone/70">Marcus C. — Directeur Général, Lagos</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-28 sm:py-40 px-6 md:px-12 text-center overflow-hidden border-t border-hairline">
        <div className="relative max-w-3xl mx-auto">
          <div className="eyebrow text-bone/60 mb-8">— Réservez votre essayage —</div>
          <h3 className="display text-4xl sm:text-5xl md:text-6xl mb-10 leading-[1.05]">
            Composez la pièce
            <br />
            <span className="italic">qui vous ressemble.</span>
          </h3>
          <p className="text-bone/60 max-w-xl mx-auto mb-12 font-light">
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent group-hover:from-ink/95 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 lg:p-12 text-bone">
        <div className="eyebrow text-bone/70 mb-4">{eyebrow}</div>
        <h3 className="font-serif text-3xl sm:text-4xl mb-4">{title}</h3>
        <p className="text-bone/75 text-sm font-light leading-relaxed mb-6 max-w-xs">
          {body}
        </p>
        <span className="eyebrow text-bone border-b border-bone/40 pb-1 inline-block group-hover:border-bone transition-colors">
          {cta} →
        </span>
      </div>
    </Link>
  );
}
