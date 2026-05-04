import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

type OrderLite = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_fcfa: number;
};

type RecentOrder = OrderLite & {
  order_number: string;
  customer_full_name: string;
};

function fmtFcfa(n: number) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [orders, setOrders] = useState<OrderLite[]>([]);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void listAllProducts().then(setProducts).catch(() => setProducts([]));
    void supabase
      .from("orders")
      .select("id, created_at, status, payment_status, total_fcfa")
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data }) => setOrders((data ?? []) as OrderLite[]));
    void supabase
      .from("orders")
      .select("id, created_at, order_number, customer_full_name, status, payment_status, total_fcfa")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setRecent((data ?? []) as RecentOrder[]));
  }, [isAdmin]);

  const kpi = useMemo(() => {
    const now = Date.now();
    const day = 24 * 3600 * 1000;
    const paid = orders.filter((o) => o.payment_status === "paid");
    const sum = (arr: OrderLite[]) => arr.reduce((s, o) => s + (o.total_fcfa ?? 0), 0);
    const last = (n: number) => paid.filter((o) => now - new Date(o.created_at).getTime() <= n * day);
    return {
      total: orders.length,
      paid: paid.length,
      pending: orders.filter((o) => o.status === "pending_payment").length,
      shipping: orders.filter((o) => o.status === "preparing" || o.status === "shipped").length,
      revenueAll: sum(paid),
      revenue7: sum(last(7)),
      revenue30: sum(last(30)),
    };
  }, [orders]);

  const sales14 = useMemo(() => {
    const days: { date: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const rev = orders
        .filter((o) => o.payment_status === "paid")
        .filter((o) => {
          const t = new Date(o.created_at).getTime();
          return t >= d.getTime() && t < next.getTime();
        })
        .reduce((s, o) => s + (o.total_fcfa ?? 0), 0);
      days.push({ date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), revenue: rev });
    }
    return days;
  }, [orders]);

  const lowStock = useMemo(
    () => products.filter((p) => (p.stock ?? 0) <= 3).slice(0, 6),
    [products]
  );

  const maxRev = Math.max(1, ...sales14.map((d) => d.revenue));

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="border-b border-hairline pb-8 mb-12 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow text-bone/60 mb-4">— Atelier Console —</div>
            <h1 className="display text-4xl md:text-5xl">Tableau de bord</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/orders" className="luxury-btn">Commandes</Link>
            <Link to="/admin/restock-alerts" className="luxury-btn">Alertes réassort</Link>
            <Link to="/admin/products/new" className="luxury-btn luxury-btn-solid">+ Nouveau produit</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Revenu (7j)" value={fmtFcfa(kpi.revenue7)} highlight />
          <Stat label="Revenu (30j)" value={fmtFcfa(kpi.revenue30)} />
          <Stat label="Revenu total" value={fmtFcfa(kpi.revenueAll)} />
          <Stat label="Commandes payées" value={kpi.paid} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="Produits" value={products.length} />
          <Stat label="Stock total" value={products.reduce((s, p) => s + (p.stock ?? 0), 0)} />
          <Stat label="En attente paiement" value={kpi.pending} />
          <Stat label="À expédier / expédiée" value={kpi.shipping} />
        </div>

        <section className="border border-hairline p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="display text-2xl">Ventes — 14 jours</h2>
            <div className="eyebrow text-[10px] text-bone/50">FCFA · commandes payées</div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {sales14.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-bone/10 hover:bg-bone/30 transition-colors relative" style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: "2px" }}>
                  {d.revenue > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-bone/60 whitespace-nowrap">
                      {Math.round(d.revenue / 1000)}k
                    </div>
                  )}
                </div>
                <div className="text-[9px] text-bone/40 eyebrow">{d.date}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <section className="border border-hairline">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="display text-xl">Commandes récentes</h2>
              <Link to="/admin/orders" className="eyebrow text-[10px] text-bone/70 hover:text-bone">Tout voir →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="p-8 text-bone/50 text-sm font-light">Aucune commande.</div>
            ) : (
              <div className="divide-y divide-hairline">
                {recent.map((o) => (
                  <Link key={o.id} to="/admin/orders/$id" params={{ id: o.id }} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 items-center hover:bg-bone/[0.03]">
                    <div>
                      <div className="font-serif text-bone text-sm">{o.order_number}</div>
                      <div className="text-bone/50 text-xs">{o.customer_full_name}</div>
                    </div>
                    <div className="text-bone/40 text-[10px] eyebrow">
                      {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </div>
                    <div className="text-bone/80 text-sm font-light">{fmtFcfa(o.total_fcfa)}</div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="border border-hairline">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="display text-xl">Stock faible</h2>
              <span className="eyebrow text-[10px] text-bone/40">≤ 3 unités</span>
            </div>
            {lowStock.length === 0 ? (
              <div className="p-8 text-bone/50 text-sm font-light">Tous les produits ont du stock.</div>
            ) : (
              <div className="divide-y divide-hairline">
                {lowStock.map((p) => (
                  <Link key={p.id} to="/admin/products/$id" params={{ id: p.id }} className="grid grid-cols-[48px_1fr_auto] gap-4 px-5 py-3 items-center hover:bg-bone/[0.03]">
                    <img src={p.primaryImage} alt={p.name} className="w-12 h-14 object-cover bg-secondary" />
                    <div>
                      <div className="font-serif text-bone text-sm">{p.name}</div>
                      <div className="text-bone/50 text-xs">{formatPriceFcfa(p.price_fcfa)}</div>
                    </div>
                    <div className={`eyebrow text-[10px] ${p.stock === 0 ? "text-red-400" : "text-amber-300/80"}`}>
                      Stock {p.stock}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <section>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="display text-2xl">Catalogue ({products.length})</h2>
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
                  <div className="flex gap-4 items-center">
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
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`border p-5 ${highlight ? "border-bone/40 bg-bone/[0.03]" : "border-hairline"}`}>
      <div className="eyebrow text-bone/60 text-[10px] mb-2">{label}</div>
      <div className="font-serif text-bone text-xl md:text-2xl">{value}</div>
    </div>
  );
}
