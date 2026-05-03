import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions Generales de Vente — MEN OF GRACE" },
      { name: "description", content: "CGV MEN OF GRACE." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 bg-ink min-h-screen">
      <article className="max-w-4xl mx-auto">
        <h1 className="display text-4xl md:text-6xl mb-8">
          Conditions Generales de Vente
        </h1>
        <div className="space-y-6 text-bone/75 font-light leading-relaxed">
          <p>
            Les presentes CGV regissent les ventes de produits MEN OF GRACE
            effectuees sur ce site.
          </p>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Commande et paiement
            </h2>
            <p>
              La commande est validee apres confirmation des informations client
              et du mode de paiement. MEN OF GRACE peut annuler une commande en
              cas de fraude suspectee, indisponibilite ou erreur manifeste.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">Prix</h2>
            <p>
              Les prix sont affiches en FCFA (avec equivalences devise selon
              disponibilite) et peuvent etre modifies sans effet retroactif sur
              les commandes deja validees.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Livraison, retours, remboursements
            </h2>
            <p>
              Les modalites detaillees sont disponibles dans la page livraison
              et retours.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Droit applicable
            </h2>
            <p>
              Le droit applicable et la juridiction competente seront precises
              dans la version legale finale.
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
