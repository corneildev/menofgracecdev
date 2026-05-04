import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin_/orders")({
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

function csvEscape(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function AdminOrdersPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionBusy, setActionBusy] = useState(false);

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

  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));
  const selectedCount = selected.size;

  function toggleAll() {
    if (allFilteredSelected) {
      const next = new Set(selected);
      filtered.forEach((o) => next.delete(o.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filtered.forEach((o) => next.add(o.id));
      setSelected(next);
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function bulkUpdate(patch: Partial<Pick<OrderRow, "status" | "payment_status">>, label: string, opts?: { confirm?: string }) {
    if (selectedCount === 0) {
      toast.error("Sélectionnez au moins une commande");
      return;
    }
    if (opts?.confirm && !confirm(opts.confirm)) return;
    setActionBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("orders")
      .update(patch as never)
      .in("id", ids);
    setActionBusy(false);
    if (error) {
      toast.error(`Échec: ${error.message}`);
      return;
    }
    toast.success(`${ids.length} commande(s) — ${label}`);
    setSelected(new Set());
    void load();
  }

  function exportCsv() {
    const rows = selectedCount > 0 ? filtered.filter((o) => selected.has(o.id)) : filtered;
    if (rows.length === 0) {
      toast.error("Rien à exporter");
      return;
    }
    const headers = ["order_number", "created_at", "customer", "email", "phone", "city", "country", "status", "payment_status", "payment_method", "total_fcfa"];
    const csv = [
      headers.join(","),
      ...rows.map((o) => [
        o.order_number,
        new Date(o.created_at).toISOString(),
        o.customer_full_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_city,
        o.shipping_country,
        STATUS_LABELS[o.status] ?? o.status,
        PAYMENT_LABELS[o.payment_status] ?? o.payment_status,
        o.payment_method ?? "",
        o.total_fcfa,
      ].map(csvEscape).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Filtré" value={`${totals.count}`} />
          <Stat label="Payées" value={`${totals.paidCount}`} />
          <Stat label="Revenu (filtré)" value={fmtFcfa(totals.revenue)} />
          <Stat label="Sélectionnées" value={`${selectedCount}`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 mb-6">
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
          <button
            onClick={exportCsv}
            className="eyebrow text-[10px] border border-hairline px-4 py-3 text-bone/80 hover:text-bone hover:border-bone/40"
          >
            Exporter CSV
          </button>
        </div>

        {/* Bulk action bar */}
        <div className={`border ${selectedCount > 0 ? "border-bone/40 bg-bone/[0.04]" : "border-hairline"} p-4 mb-6 transition-colors`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[10px] text-bone/60 mr-2">
              Actions en lot {selectedCount > 0 && `(${selectedCount})`}
            </span>
            <BulkBtn disabled={actionBusy || !selectedCount} onClick={() => bulkUpdate({ payment_status: "paid", status: "preparing" }, "confirmées (payées + en préparation)")}>
              ✓ Confirmer
            </BulkBtn>
            <BulkBtn disabled={actionBusy || !selectedCount} onClick={() => bulkUpdate({ payment_status: "paid" }, "marquées payées")}>
              💳 Marquer payées
            </BulkBtn>
            <BulkBtn disabled={actionBusy || !selectedCount} onClick={() => bulkUpdate({ status: "preparing" }, "en préparation")}>
              📦 En préparation
            </BulkBtn>
            <BulkBtn disabled={actionBusy || !selectedCount} onClick={() => bulkUpdate({ status: "shipped" }, "expédiées")}>
              🚚 Expédier
            </BulkBtn>
            <BulkBtn disabled={actionBusy || !selectedCount} onClick={() => bulkUpdate({ status: "delivered" }, "livrées")}>
              ✅ Livrer
            </BulkBtn>
            <BulkBtn
              tone="danger"
              disabled={actionBusy || !selectedCount}
              onClick={() => bulkUpdate({ status: "cancelled" }, "annulées", { confirm: `Annuler ${selectedCount} commande(s) ?` })}
            >
              ✕ Annuler
            </BulkBtn>
            <BulkBtn
              tone="danger"
              disabled={actionBusy || !selectedCount}
              onClick={() => bulkUpdate({ status: "refunded", payment_status: "refunded" }, "remboursées", { confirm: `Marquer ${selectedCount} commande(s) comme remboursées ?` })}
            >
              ↩ Rembourser
            </BulkBtn>
            {selectedCount > 0 && (
              <button onClick={() => setSelected(new Set())} className="eyebrow text-[10px] text-bone/50 hover:text-bone ml-auto">
                Désélectionner
              </button>
            )}
          </div>
        </div>

        {busy ? (
          <div className="text-bone/60 py-12 text-center font-light">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="border border-hairline p-12 text-center text-bone/60 font-light">Aucune commande.</div>
        ) : (
          <div className="border border-hairline overflow-x-auto">
            <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto] gap-6 px-5 py-3 items-center bg-bone/[0.02] border-b border-hairline eyebrow text-[10px] text-bone/50">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleAll}
                className="accent-bone cursor-pointer"
                aria-label="Tout sélectionner"
              />
              <span>N°</span>
              <span>Client</span>
              <span>Paiement</span>
              <span>Statut</span>
              <span>Total</span>
              <span></span>
            </div>
            <div className="divide-y divide-hairline">
              {filtered.map((o) => {
                const isSel = selected.has(o.id);
                return (
                  <div
                    key={o.id}
                    className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto] gap-6 px-5 py-4 items-center transition-colors ${isSel ? "bg-bone/[0.05]" : "hover:bg-bone/[0.03]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleOne(o.id)}
                      className="accent-bone cursor-pointer"
                      aria-label={`Sélectionner ${o.order_number}`}
                    />
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
                    <div className="text-bone/80 text-sm font-light whitespace-nowrap">{fmtFcfa(o.total_fcfa)}</div>
                    <Link
                      to="/admin/orders/$id"
                      params={{ id: o.id }}
                      className="eyebrow text-[10px] text-bone/70 hover:text-bone border border-hairline px-3 py-1.5"
                    >
                      Détails →
                    </Link>
                  </div>
                );
              })}
            </div>
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

function BulkBtn({
  children,
  onClick,
  disabled,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  const base = "eyebrow text-[10px] px-3 py-2 border transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
  const cls = tone === "danger"
    ? "border-red-500/40 text-red-300/90 hover:bg-red-500/10"
    : "border-hairline text-bone/80 hover:text-bone hover:border-bone/40";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}
