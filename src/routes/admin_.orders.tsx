import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Commandes — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrdersPage,
});

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_city: string;
  shipping_country: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total_fcfa: number;
  total_usd: number;
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "En attente paiement",
  paid: "Payée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

function fmtFcfa(n: number) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

function AdminOrdersPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin]);

  async function load() {
    setBusy(true);
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, created_at, customer_full_name, customer_email, customer_phone, shipping_city, shipping_country, status, payment_status, payment_method, total_fcfa, total_usd")
      .order("created_at", { ascending: false })
      .limit(500);
    setOrders((data ?? []) as OrderRow[]);
    setBusy(false);
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && o.payment_status !== paymentFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${o.order_number} ${o.customer_full_name} ${o.customer_email} ${o.customer_phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const totals = useMemo(() => {
    const paid = filtered.filter((o) => o.payment_status === "paid");
    return {
      count: filtered.length,
      paidCount: paid.length,
      revenue: paid.reduce((s, o) => s + (o.total_fcfa ?? 0), 0),
    };
  }, [filtered]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-hairline pb-8 mb-12">
          <div>
            <div className="eyebrow text-bone/60 mb-3">— Atelier Console —</div>
            <h1 className="display text-4xl md:text-5xl">Commandes</h1>
          </div>
          <Link to="/admin" className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-4 py-2">
            ← Retour au tableau de bord
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <Stat label="Filtré" value={`${totals.count}`} />
          <Stat label="Payées" value={`${totals.paidCount}`} />
          <Stat label="Revenu (filtré)" value={fmtFcfa(totals.revenue)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (n°, client, email, tel)"
            className="bg-transparent border border-hairline px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:outline-none focus:border-bone/40"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-ink border border-hairline px-4 py-3 text-sm text-bone">
            <option value="all">Tous statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="bg-ink border border-hairline px-4 py-3 text-sm text-bone">
            <option value="all">Tous paiements</option>
            {Object.entries(PAYMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {busy ? (
          <div className="text-bone/60 py-12 text-center font-light">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="border border-hairline p-12 text-center text-bone/60 font-light">Aucune commande.</div>
        ) : (
          <div className="border border-hairline divide-y divide-hairline overflow-x-auto">
            {filtered.map((o) => (
              <Link
                key={o.id}
                to="/admin/orders/$id"
                params={{ id: o.id }}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-6 px-5 py-4 items-center hover:bg-bone/[0.03] transition-colors"
              >
                <div>
                  <div className="font-serif text-bone">{o.order_number}</div>
                  <div className="text-bone/40 text-[10px] eyebrow mt-1">
                    {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div>
                  <div className="text-bone text-sm">{o.customer_full_name}</div>
                  <div className="text-bone/50 text-xs">{o.customer_email} · {o.shipping_city}, {o.shipping_country}</div>
                </div>
                <Badge tone={o.payment_status === "paid" ? "ok" : o.payment_status === "failed" ? "bad" : "neutral"}>
                  {PAYMENT_LABELS[o.payment_status] ?? o.payment_status}
                </Badge>
                <Badge tone={o.status === "delivered" ? "ok" : o.status === "cancelled" ? "bad" : "neutral"}>
                  {STATUS_LABELS[o.status] ?? o.status}
                </Badge>
                <div className="text-bone/80 text-sm font-light">{fmtFcfa(o.total_fcfa)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-hairline p-5">
      <div className="eyebrow text-bone/60 text-[10px] mb-2">{label}</div>
      <div className="font-serif text-bone text-xl md:text-2xl">{value}</div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "ok" | "bad" | "neutral" }) {
  const cls =
    tone === "ok" ? "border-emerald-500/40 text-emerald-300/90" :
    tone === "bad" ? "border-red-500/40 text-red-300/90" :
    "border-hairline text-bone/60";
  return <span className={`eyebrow text-[10px] border px-2 py-1 ${cls}`}>{children}</span>;
}
