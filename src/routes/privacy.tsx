import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialite — MEN OF GRACE" },
      {
        name: "description",
        content: "Politique de confidentialite MEN OF GRACE.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 bg-ink min-h-screen">
      <article className="max-w-4xl mx-auto">
        <h1 className="display text-4xl md:text-6xl mb-8">
          Politique de confidentialite
        </h1>
        <div className="space-y-6 text-bone/75 font-light leading-relaxed">
          <p>
            Cette politique explique quelles donnees nous collectons, pourquoi
            nous les traitons, et comment vous pouvez exercer vos droits.
          </p>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Responsable du traitement
            </h2>
            <p>
              MEN OF GRACE — Coordonnees legales completes a publier
              prochainement.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Donnees collectees
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Donnees de contact (nom, email, telephone, WhatsApp)</li>
              <li>
                Donnees de commande (produits, tailles, options, montants,
                statut)
              </li>
              <li>Donnees de livraison (adresse, ville, pays, instructions)</li>
              <li>Donnees techniques et de navigation</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">Finalites</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traitement et suivi des commandes</li>
              <li>Securite, prevention de fraude, amelioration du service</li>
              <li>Mesure marketing sous reserve de consentement</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">Vos droits</h2>
            <p>
              Vous pouvez demander l'acces, la rectification, l'effacement, la
              limitation, l'opposition et la portabilite de vos donnees selon la
              loi applicable.
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
