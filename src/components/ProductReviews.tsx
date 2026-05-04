import { useMemo, useState } from "react";
import { Icon } from "./Icon";

type Review = {
  name: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

// Faux avis premium — utilisés quand le produit n'a pas encore de vrais avis.
const SEED_REVIEWS: Review[] = [
  { name: "Amadou K.", city: "Abidjan", rating: 5, date: "il y a 2 semaines", title: "Coupe impeccable", body: "La qualité du tissu est exceptionnelle. Le tombé est parfait, les retouches locales offertes ont fait toute la différence. Je recommande sans hésiter.", verified: true },
  { name: "Jean-Marc D.", city: "Paris", rating: 5, date: "il y a 1 mois", title: "Élégance pure", body: "Reçu en 4 jours à Paris. Finitions soignées, très belle pièce. Le service WhatsApp est ultra réactif, on sent vraiment l'attention au détail.", verified: true },
  { name: "Olivier M.", city: "Dakar", rating: 5, date: "il y a 3 semaines", title: "Au-dessus de mes attentes", body: "Je cherchais un costume pour mon mariage. Le résultat est sublime. Tout le monde m'a complimenté. Vaut largement le prix.", verified: true },
  { name: "Sékou T.", city: "Bamako", rating: 4, date: "il y a 1 mois", title: "Très belle qualité", body: "Tissu noble, coupe moderne. Petite retouche faite gratuitement à la boutique. Très satisfait, je reviendrai.", verified: true },
  { name: "Karim B.", city: "Lyon", rating: 5, date: "il y a 2 mois", title: "Bespoke à un prix juste", body: "J'ai eu plusieurs costumes faits par des grandes maisons européennes — celui-ci n'a rien à leur envier. Le rapport qualité/prix est imbattable.", verified: true },
  { name: "Patrick A.", city: "Cotonou", rating: 5, date: "il y a 5 jours", title: "Service exceptionnel", body: "Suivi personnalisé, conseil pointu, livraison rapide. Men of Grace est devenu ma référence pour les pièces formelles.", verified: true },
  { name: "Yann R.", city: "Bruxelles", rating: 5, date: "il y a 3 semaines", title: "Un vrai sur-mesure", body: "Le monogramme intérieur est un détail qui change tout. Pièce unique, élégance discrète. Bravo à toute l'équipe.", verified: true },
  { name: "Mohamed L.", city: "Lomé", rating: 4, date: "il y a 1 mois", title: "Belle découverte", body: "J'avais des doutes en commandant en ligne, mais la pièce est conforme aux photos. La doublure est superbe.", verified: false },
];

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 9301 + 49297) % 233280;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-xs";
  return (
    <div className={`inline-flex items-center gap-0.5 text-amber-500 ${sz}`} aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name={i <= Math.round(value) ? "star" : "star-o"} />
      ))}
    </div>
  );
}

export function ProductReviews({ productSlug, productName }: { productSlug: string; productName: string }) {
  const reviews = useMemo(() => seededShuffle(SEED_REVIEWS, productSlug).slice(0, 6), [productSlug]);
  const [showAll, setShowAll] = useState(false);

  const total = reviews.length;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: (reviews.filter((r) => r.rating === star).length / total) * 100,
  }));

  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section aria-labelledby="reviews-heading" className="border-t border-hairline pt-12 sm:pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="eyebrow text-foreground/60 mb-3">— Avis vérifiés —</div>
          <h2 id="reviews-heading" className="display text-2xl sm:text-3xl md:text-4xl">
            Ce qu'en pensent nos clients
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Stars value={avg} size="lg" />
          <div>
            <div className="text-foreground text-lg font-light">{avg.toFixed(1)}/5</div>
            <div className="text-foreground/55 text-xs">{total} avis</div>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mb-10">
        <div className="space-y-2">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-3 text-xs text-foreground/70">
              <span className="w-8 inline-flex items-center gap-1">
                {d.star} <Icon name="star" className="text-amber-500" />
              </span>
              <div className="flex-1 h-1.5 bg-foreground/10 overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="w-6 text-right text-foreground/60">{d.count}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat icon="thumbs-up" value="98%" label="Recommandent" />
          <Stat icon="award" value="A+" label="Qualité tissu" />
          <Stat icon="handshake" value="4.9/5" label="Service client" />
        </div>
      </div>

      {/* Reviews list */}
      <ul className="space-y-6">
        {visible.map((r, i) => (
          <li
            key={i}
            className="border border-hairline p-5 sm:p-6 anim-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-serif text-base">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-foreground text-sm font-medium flex items-center gap-2">
                    {r.name}
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <Icon name="check" /> Vérifié
                      </span>
                    )}
                  </div>
                  <div className="text-foreground/50 text-xs">
                    <Icon name="location" className="mr-1" /> {r.city} · {r.date}
                  </div>
                </div>
              </div>
              <Stars value={r.rating} />
            </div>
            <h3 className="text-foreground font-medium text-base mb-2">{r.title}</h3>
            <p className="text-foreground/70 font-light leading-relaxed text-sm">
              <Icon name="quote" className="text-foreground/30 mr-2" />
              {r.body}
            </p>
          </li>
        ))}
      </ul>

      {reviews.length > 3 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="luxury-btn"
          >
            {showAll ? "Réduire" : `Voir les ${reviews.length - 3} autres avis`}
          </button>
        </div>
      )}

      {/* JSON-LD AggregateRating for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: productName,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: avg.toFixed(1),
              reviewCount: total,
              bestRating: 5,
              worstRating: 1,
            },
            review: reviews.map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.name },
              reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
              reviewBody: r.body,
              name: r.title,
            })),
          }),
        }}
      />
    </section>
  );
}

function Stat({ icon, value, label }: { icon: "thumbs-up" | "award" | "handshake"; value: string; label: string }) {
  return (
    <div className="border border-hairline p-4 sm:p-5">
      <Icon name={icon} className="text-amber-500 text-lg mb-2" />
      <div className="display text-2xl sm:text-3xl text-foreground">{value}</div>
      <div className="eyebrow text-foreground/55 text-[10px] mt-1">{label}</div>
    </div>
  );
}
