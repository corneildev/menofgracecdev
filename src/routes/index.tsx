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
import { motion, useScroll, useTransform } from "framer-motion";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Men of Grace — Maison de tailleur d'exception & Costumes sur-mesure" },
      {
        name: "description",
        content:
          "Découvrez l'art sartorial de Men of Grace. Costumes sur-mesure, tuxedos de mariage et tenues executive façonnés à la main. Livraison à Abidjan, Cotonou, Paris et Dubaï.",
      },
      { name: "keywords", content: "costume sur mesure, tailleur abidjan, costume mariage, sartorial, luxe homme, men of grace" },
      { property: "og:title", content: "Men of Grace — Maison de tailleur d'exception" },
      {
        property: "og:description",
        content: "L'excellence du sur-mesure pour les hommes qui imposent leur présence. Livraison internationale sous 5 jours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://menofgrace.store" },
      { property: "og:image", content: hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Men of Grace — Maison de tailleur" },
      { name: "twitter:description", content: "L'excellence du sur-mesure sartorial." },
      { name: "twitter:image", content: hero },
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
        <div className="relative min-h-[100svh] w-full flex items-center">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src={hero}
            alt="Homme en costume sur-mesure Men of Grace"
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1920}
            height={1080}
          />
          {/* Lecture overlay : sombre en bas pour lisibilité, sans assombrir tout */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0" />

          {/* Big serif title sur l'image */}
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-32 pb-16 sm:pb-24">
            <div className="max-w-[1600px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="eyebrow text-white/80 mb-6 tracking-[0.4em]"
              >
                — Maison de tailleur · MMXX —
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="display text-white text-[15vw] sm:text-[11vw] md:text-[8.5rem] lg:text-[12rem] leading-[0.85] tracking-tighter mb-10"
              >
                L'Élégance
                <br />
                <span className="italic font-light opacity-80">sur-mesure.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="font-light text-white/80 text-base sm:text-lg max-w-md leading-relaxed mb-10"
              >
                La précision du tailleur élève chaque présence.
                Composé par la maison, façonné à la main dans nos ateliers d'excellence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/collection"
                  className="luxury-btn luxury-btn-solid !bg-white !text-black !px-12 !py-5"
                >
                  Acheter maintenant
                </Link>
                <Link
                  to="/size-finder"
                  className="luxury-btn !border-white/40 !text-white !px-12 !py-5 hover:!bg-white hover:!text-black"
                >
                  Trouver ma taille
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
            <span className="eyebrow text-[9px] text-white/40 tracking-[0.3em] uppercase">Découvrir</span>
          </motion.div>
        </div>
      </section>

      {/* TICKER — bandeau villes */}
      <section className="bg-foreground text-background py-7">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-3 text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.4em] font-light">
          <span>Abidjan · Cocody</span>
          <span>Paris · 8ᵉ</span>
          <span>Cotonou · Parakou</span>
          <span>Dubaï · DIFC</span>
        </div>
      </section>

      {/* PIÈCES PHARES */}
      {featured.length > 0 && (
        <section className="px-5 md:px-10 lg:px-12 pt-24 sm:pt-32 pb-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="eyebrow text-foreground/50 mb-3 tracking-[0.3em] uppercase">— Tendances —</div>
                <h2 className="display text-4xl sm:text-5xl md:text-6xl">Pièces phares</h2>
              </motion.div>
              <Link to="/collection" className="eyebrow hover:text-foreground/60 transition-colors border-b border-foreground/20 pb-1 tracking-[0.2em] text-[10px]">
                TOUTE LA COLLECTION →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
              {featured.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                >
                  <Link
                    to="/collection/$productId"
                    params={{ productId: p.slug }}
                    className="group block w-full"
                  >
                    <div className="aspect-[3/4] bg-secondary mb-6 overflow-hidden relative">
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                    <div className="eyebrow text-foreground/40 mb-2 text-[9px] tracking-[0.2em] uppercase">{CATEGORY_LABELS[p.category]}</div>
                    <div className="font-serif text-xl sm:text-2xl mb-2 leading-tight group-hover:text-foreground/70 transition-colors">{p.name}</div>
                    <div className="text-foreground/60 text-sm font-light tracking-wide">{formatPrice(p)}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TROIS PILIERS */}
      <section className="px-5 md:px-10 lg:px-12 pb-24 sm:pb-32 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 sm:mb-20"
          >
            <div className="eyebrow text-foreground/40 mb-3 tracking-[0.4em] uppercase">— Le Triptyque —</div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl">Trois maisons, une signature</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <PillarCard
              eyebrow="I · Executive"
              title="Executive Sartoria"
              body="La coupe pensée pour les conseils et les grandes scènes du business."
              image={executiveImg}
              cta="Découvrir"
              href="/collection"
              delay={0.1}
            />
            <PillarCard
              eyebrow="II · Sur-mesure"
              title="Le Sur-mesure"
              body="Un vêtement composé en trois essayages, autour d'un seul homme."
              image={atelierImg}
              cta="Prendre rendez-vous"
              href="/size-finder"
              elevated
              delay={0.2}
            />
            <PillarCard
              eyebrow="III · Mariage"
              title="Le Mariage"
              body="Les habits d'un jour qui ne se rejoue pas, avec la gravité qu'il mérite."
              image={weddingImg}
              cta="Composer mon habit"
              href="/collection"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 sm:py-48 px-6 md:px-12 bg-foreground text-background relative overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="0.1" fill="none" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="eyebrow text-background/40 mb-12 tracking-[0.5em] uppercase">— Manifeste —</div>
            <h2 className="display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1] mb-8">
              Pour les hommes qui
              <br />
              imposent leur présence
              <br />
              <span className="italic font-light text-background/60">sans dire un mot.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-[1px] bg-background/20 mx-auto mt-16"
          />
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
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  cta: string;
  href: "/collection" | "/size-finder";
  elevated?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={elevated ? "md:-mt-12" : ""}
    >
      <Link
        to={href}
        className="group relative aspect-[3/4] overflow-hidden bg-secondary block shadow-2xl"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-700" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 lg:p-12 text-white">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-4">{eyebrow}</div>
          <h3 className="font-serif text-3xl sm:text-4xl mb-4 leading-tight">{title}</h3>
          <p className="text-white/60 text-sm font-light leading-relaxed mb-8 max-w-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
            {body}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white border-b border-white/20 pb-1 inline-block group-hover:border-white transition-colors">
              {cta}
            </span>
            <Icon name="chevron-right" className="text-[8px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
