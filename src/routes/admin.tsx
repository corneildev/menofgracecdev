import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
<<<<<<< HEAD
import { listAllProducts, formatPriceFcfa, type ProductWithImages } from "@/lib/products";
=======
import {
  listAllProducts,
  formatPriceFcfa,
  type ProductWithImages,
} from "@/lib/products";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
=======
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutStats, setCheckoutStats] = useState<CheckoutStats | null>(
    null,
  );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
<<<<<<< HEAD
    void listAllProducts().then(setProducts).catch(() => setProducts([]));
    supabase.from("orders").select("id", { count: "exact", head: true }).then(({ count }) => setOrderCount(count ?? 0));
=======
    (async () => {
      setLoadError(null);
      const [{ count, error: countErr }] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }),
      ]);
      try {
        const nextProducts = await listAllProducts();
        setProducts(nextProducts);
      } catch {
        setProducts([]);
        setLoadError("Impossible de charger les produits.");
      }
      if (countErr) {
        setOrderCount(0);
        setLoadError(
          (prev) => prev ?? "Impossible de charger les statistiques.",
        );
      } else {
        setOrderCount(count ?? 0);
      }
      try {
        const since = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        const { data: events, error: evErr } = await supabase
          .from("product_events")
          .select("event_type, created_at")
          .in("event_type", [
            "checkout_step_view",
            "checkout_place_order_attempt",
            "checkout_place_order_success",
            "checkout_place_order_failed",
            "checkout_abandoned",
          ])
          .gte("created_at", since);
        if (evErr) throw evErr;
        setCheckoutStats(buildCheckoutStats(events ?? []));
      } catch {
        setCheckoutStats(null);
        setLoadError(
          (prev) => prev ?? "Impossible de charger le funnel checkout.",
        );
      }
    })();
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
          <Stat label="Stock total" value={products.reduce((s, p) => s + (p.stock ?? 0), 0)} />
        </div>

=======
          <Stat
            label="Stock total"
            value={products.reduce((s, p) => s + (p.stock ?? 0), 0)}
          />
        </div>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="display text-2xl">Conversion checkout</h2>
            <span className="eyebrow text-bone/50 text-[10px]">
              7 derniers jours
            </span>
          </div>
          {!checkoutStats ? (
            <div className="border border-hairline p-8 text-bone/60 text-sm font-light">
              Données checkout indisponibles pour le moment.
            </div>
          ) : (
            <div className="border border-hairline p-6 md:p-8 space-y-8">
              <div className="grid md:grid-cols-5 gap-4">
                <MiniStat label="Vues checkout" value={checkoutStats.views} />
                <MiniStat label="Tentatives" value={checkoutStats.attempts} />
                <MiniStat label="Succès" value={checkoutStats.successes} />
                <MiniStat label="Échecs" value={checkoutStats.failures} />
                <MiniStat label="Abandons" value={checkoutStats.abandons} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <MiniStat
                  label="Tx tentative / vue"
                  value={`${checkoutStats.attemptRate}%`}
                />
                <MiniStat
                  label="Tx succès / tentative"
                  value={`${checkoutStats.successRate}%`}
                />
                <MiniStat
                  label="Tx abandon / vue"
                  value={`${checkoutStats.abandonRate}%`}
                />
              </div>
            </div>
          )}
        </section>
        {loadError && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-300 p-4 mb-8 text-sm">
            {loadError}
          </div>
        )}

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        <section>
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="display text-2xl">Catalogue</h2>
            <div className="flex gap-3 items-center">
<<<<<<< HEAD
              <Link to="/admin/restock-alerts" className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-4 py-2">
                Alertes de réassort
              </Link>
              <Link to="/admin/products/new" className="luxury-btn luxury-btn-solid">+ Nouveau produit</Link>
=======
              <Link
                to="/admin/restock-alerts"
                className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-4 py-2"
              >
                Alertes de réassort
              </Link>
              <Link
                to="/admin/products/new"
                className="luxury-btn luxury-btn-solid"
              >
                + Nouveau produit
              </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            </div>
          </div>

          {products.length === 0 ? (
            <div className="border border-hairline p-12 text-center text-bone/60 font-light">
              Aucun produit pour le moment.
            </div>
          ) : (
            <div className="border border-hairline divide-y divide-hairline">
              {products.map((p) => (
<<<<<<< HEAD
                <div key={p.id} className="grid grid-cols-[64px_1fr_auto_auto_auto] gap-6 px-5 py-4 items-center">
                  <div className="w-16 h-20 bg-secondary overflow-hidden">
                    <img src={p.primaryImage} alt={p.name} className="h-full w-full object-cover" />
=======
                <div
                  key={p.id}
                  className="grid grid-cols-[64px_1fr_auto_auto_auto] gap-6 px-5 py-4 items-center"
                >
                  <div className="w-16 h-20 bg-secondary overflow-hidden">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  </div>
                  <div>
                    <div className="font-serif text-lg text-bone">{p.name}</div>
                    <div className="text-bone/50 text-xs">{p.slug}</div>
                  </div>
<<<<<<< HEAD
                  <div className="text-bone/70 text-sm font-light">{formatPriceFcfa(p.price_fcfa)}</div>
                  <div className="eyebrow text-bone/60 text-[10px]">Stock {p.stock}</div>
                  <div className="flex gap-4">
                    {!p.is_published && <span className="eyebrow text-bone/50 text-[10px]">Brouillon</span>}
                    <Link to="/admin/products/$id" params={{ id: p.id }} className="eyebrow text-bone hover:text-bone/70 text-[10px]">
=======
                  <div className="text-bone/70 text-sm font-light">
                    {formatPriceFcfa(p.price_fcfa)}
                  </div>
                  <div className="eyebrow text-bone/60 text-[10px]">
                    Stock {p.stock}
                  </div>
                  <div className="flex gap-4">
                    {!p.is_published && (
                      <span className="eyebrow text-bone/50 text-[10px]">
                        Brouillon
                      </span>
                    )}
                    <Link
                      to="/admin/products/$id"
                      params={{ id: p.id }}
                      className="eyebrow text-bone hover:text-bone/70 text-[10px]"
                    >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
            Création/édition de produits avec upload d'images, gestion des commandes & statuts, checkout client, paiements Stripe et export CSV — implémentés dans les prochaines itérations sur cette base solide.
=======
            Création/édition de produits avec upload d'images, gestion des
            commandes & statuts, checkout client, paiements Stripe et export CSV
            — implémentés dans les prochaines itérations sur cette base solide.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
=======

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-hairline p-4">
      <div className="eyebrow text-bone/50 mb-2 text-[10px]">{label}</div>
      <div className="text-bone text-xl font-light">{value}</div>
    </div>
  );
}

type CheckoutEventRow = {
  event_type: string;
  created_at: string;
};

type CheckoutStats = {
  views: number;
  attempts: number;
  successes: number;
  failures: number;
  abandons: number;
  attemptRate: string;
  successRate: string;
  abandonRate: string;
};

function buildCheckoutStats(rows: CheckoutEventRow[]): CheckoutStats {
  const views = rows.filter(
    (r) => r.event_type === "checkout_step_view",
  ).length;
  const attempts = rows.filter(
    (r) => r.event_type === "checkout_place_order_attempt",
  ).length;
  const successes = rows.filter(
    (r) => r.event_type === "checkout_place_order_success",
  ).length;
  const failures = rows.filter(
    (r) => r.event_type === "checkout_place_order_failed",
  ).length;
  const abandons = rows.filter(
    (r) => r.event_type === "checkout_abandoned",
  ).length;
  const ratio = (num: number, den: number) =>
    den > 0 ? ((num / den) * 100).toFixed(1) : "0.0";

  return {
    views,
    attempts,
    successes,
    failures,
    abandons,
    attemptRate: ratio(attempts, views),
    successRate: ratio(successes, attempts),
    abandonRate: ratio(abandons, views),
  };
}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
