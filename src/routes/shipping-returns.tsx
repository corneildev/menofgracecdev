import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Livraison et retours — MEN OF GRACE" },
      {
        name: "description",
        content: "Politique de livraison, retours et echanges MEN OF GRACE.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 bg-ink min-h-screen">
      <article className="max-w-4xl mx-auto">
        <h1 className="display text-4xl md:text-6xl mb-8">
          Livraison, retours et echanges
        </h1>
        <div className="space-y-6 text-bone/75 font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Zones desservies
            </h2>
            <p>
              Cote d'Ivoire, CEDEAO et international selon faisabilite
              logistique.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">Delais</h2>
            <p>
              Les delais de preparation et de livraison sont indicatifs et
              peuvent varier selon destination, volume et contraintes
              douanieres.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Retours et echanges
            </h2>
            <p>
              Les retours sont acceptes sur articles non portes et non alteres,
              sous reserve des conditions publiees et de la nature du produit
              (personnalisation possible).
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Remboursement
            </h2>
            <p>
              Le remboursement intervient apres validation du retour, selon le
              mode de paiement initial.
            </p>
          </section>
          <p className="text-bone/50 text-sm">
            Version detaillee: consulter <code>LEGAL_PAGES_FR.md</code> avant
            publication finale.
          </p>
        </div>
      </article>
    </div>
  );
}
