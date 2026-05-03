import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Politique cookies — MEN OF GRACE" },
      {
        name: "description",
        content: "Politique cookies et publicite MEN OF GRACE.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 bg-ink min-h-screen">
      <article className="max-w-4xl mx-auto">
        <h1 className="display text-4xl md:text-6xl mb-8">Politique cookies</h1>
        <div className="space-y-6 text-bone/75 font-light leading-relaxed">
          <p>
            Nous utilisons des cookies necessaires au fonctionnement du site,
            ainsi que des cookies de mesure et publicitaires si vous y
            consentez.
          </p>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Cookies necessaires
            </h2>
            <p>
              Utilises pour le panier, la session et la securite. Ils ne peuvent
              pas etre desactives.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Cookies marketing (Meta)
            </h2>
            <p>
              Avec votre consentement, nous utilisons Meta Pixel pour mesurer
              les conversions: PageView, ViewContent, AddToCart,
              InitiateCheckout, Purchase.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-bone mb-3">
              Gestion du consentement
            </h2>
            <p>
              Vous pouvez accepter ou refuser via la banniere cookies. Le choix
              est memorise sur votre appareil.
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
