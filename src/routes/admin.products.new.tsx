import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "Nouveau produit — MEN OF GRACE" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen text-center">
      <div className="eyebrow text-bone/60 mb-4">— Bientôt —</div>
      <h1 className="display text-4xl mb-6">Nouveau produit</h1>
      <p className="text-bone/60 font-light max-w-md mx-auto mb-10">
        Le formulaire de création complet (upload images, options, prix multi-devises) arrive dans la prochaine itération.
      </p>
      <Link to="/admin" className="luxury-btn">← Retour</Link>
    </div>
  ),
});
