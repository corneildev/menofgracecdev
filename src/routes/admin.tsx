import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listAllProducts, formatPriceFcfa, type ProductWithImages } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — MEN OF GRACE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void listAllProducts().then(setProducts).catch(() => setProducts([]));
    supabase.from("orders").select("id", { count: "exact", head: true }).then(({ count }) => setOrderCount(count ?? 0));
  }, [isAdmin]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="border-b border-hairline pb-8 mb-12">
          <div className="eyebrow text-bone/60 mb-4">— Atelier Console —</div>
          <h1 className="display text-4xl md:text-5xl">Tableau de bord</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Stat label="Produits" value={products.length} />
          <Stat label="Commandes" value={orderCount} />
          <Stat label="Stock total" value={products.reduce((s, p) => s + (p.stock ?? 0), 0)} />
        </div>

        <section>
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="display text-2xl">Catalogue</h2>
            <div className="flex gap-3 items-center">
              <Link to="/admin/restock-alerts" className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-4 py-2">
                Alertes de réassort
              </Link>
              <Link to="/admin/products/new" className="luxury-btn luxury-btn-solid">+ Nouveau produit</Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="border border-hairline p-12 text-center text-bone/60 font-light">
              Aucun produit pour le moment.
            </div>
          ) : (
            <div className="border border-hairline divide-y divide-hairline">
              {products.map((p) => (
                <div key={p.id} className="grid grid-cols-[64px_1fr_auto_auto_auto] gap-6 px-5 py-4 items-center">
                  <div className="w-16 h-20 bg-secondary overflow-hidden">
                    <img src={p.primaryImage} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-serif text-lg text-bone">{p.name}</div>
                    <div className="text-bone/50 text-xs">{p.slug}</div>
                  </div>
                  <div className="text-bone/70 text-sm font-light">{formatPriceFcfa(p.price_fcfa)}</div>
                  <div className="eyebrow text-bone/60 text-[10px]">Stock {p.stock}</div>
                  <div className="flex gap-4">
                    {!p.is_published && <span className="eyebrow text-bone/50 text-[10px]">Brouillon</span>}
                    <Link to="/admin/products/$id" params={{ id: p.id }} className="eyebrow text-bone hover:text-bone/70 text-[10px]">
                      Éditer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <h2 className="display text-2xl mb-4">À venir</h2>
          <p className="text-bone/60 font-light text-sm max-w-xl">
            Création/édition de produits avec upload d'images, gestion des commandes & statuts, checkout client, paiements Stripe et export CSV — implémentés dans les prochaines itérations sur cette base solide.
          </p>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-hairline p-8">
      <div className="eyebrow text-bone/60 mb-3">{label}</div>
      <div className="display text-4xl text-bone">{value}</div>
    </div>
  );
}
