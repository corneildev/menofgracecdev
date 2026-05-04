import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf, type InvoiceData } from "@/lib/invoicePdf";

export const Route = createFileRoute("/admin_/orders/$id")({
  head: () => ({
    meta: [
      { title: "Commande — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetailPage,
});

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  user_id: string | null;
  guest_email: string | null;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  notes: string | null;
  admin_notes: string | null;
  payment_method: string | null;
  payment_status: string;
  status: string;
  subtotal_fcfa: number;
  delivery_fcfa: number;
  total_fcfa: number;
  subtotal_usd: number;
  total_usd: number;
};

type Item = {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price_fcfa: number;
  unit_price_usd: number;
  size: string | null;
  fit: string | null;
  lapel: string | null;
  lining: string | null;
  monogram: string | null;
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "pending_payment", label: "En attente paiement" },
  { value: "paid", label: "Payée" },
  { value: "preparing", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "refunded", label: "Remboursée" },
];

const PAYMENT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payé" },
  { value: "failed", label: "Échoué" },
  { value: "refunded", label: "Remboursé" },
];

function fmtFcfa(n: number) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin, id]);

  async function load() {
    setBusy(true);
    const [{ data: o }, { data: it }] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", id),
    ]);
    setOrder((o as Order) ?? null);
    setItems((it as Item[]) ?? []);
    setAdminNotes((o as Order)?.admin_notes ?? "");
    setBusy(false);
  }

  async function updateField(patch: Record<string, unknown>) {
    if (!order) return;
    setSaving(true);
    setMsg(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("orders").update(patch as any).eq("id", order.id);
    if (error) {
      setMsg(`Erreur: ${error.message}`);
    } else {
      setOrder({ ...order, ...patch } as Order);
      setMsg("Sauvegardé");
      setTimeout(() => setMsg(null), 1800);
    }
    setSaving(false);
  }

  function downloadInvoice() {
    if (!order) return;
    const data: InvoiceData = {
      order_number: order.order_number,
      created_at: order.created_at,
      customer_full_name: order.customer_full_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      notes: order.notes,
      subtotal_fcfa: order.subtotal_fcfa,
      delivery_fcfa: order.delivery_fcfa,
      total_fcfa: order.total_fcfa,
      subtotal_usd: order.subtotal_usd,
      total_usd: order.total_usd,
      payment_method: order.payment_method,
      status: order.status,
      items: items.map((i) => ({
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price_fcfa: i.unit_price_fcfa,
        unit_price_usd: i.unit_price_usd,
        size: i.size,
        fit: i.fit,
        lapel: i.lapel,
        lining: i.lining,
        monogram: i.monogram,
      })),
    };
    const pdf = generateInvoicePdf(data);
    pdf.save(`Invoice_${order.order_number}.pdf`);
  }

  if (loading || !user || !isAdmin) return null;
  if (busy) return <div className="pt-40 px-6 text-bone/60">Chargement…</div>;
  if (!order) return <div className="pt-40 px-6 text-bone/60">Commande introuvable.</div>;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <Link to="/admin/orders" className="eyebrow text-[10px] text-bone/70 hover:text-bone">← Toutes les commandes</Link>
          <div className="flex gap-3">
            <button onClick={downloadInvoice} className="luxury-btn">📄 Facture PDF</button>
          </div>
        </div>

        <div className="border-b border-hairline pb-8 mb-10">
          <div className="eyebrow text-bone/60 mb-3">— Commande —</div>
          <h1 className="display text-4xl md:text-5xl">{order.order_number}</h1>
          <div className="text-bone/50 text-sm mt-3">
            {new Date(order.created_at).toLocaleString("fr-FR")} · {fmtFcfa(order.total_fcfa)}
          </div>
        </div>

        {msg && <div className="mb-6 text-emerald-300/80 text-sm">{msg}</div>}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="border border-hairline p-6">
            <div className="eyebrow text-bone/60 text-[10px] mb-4">Statut</div>
            <select
              value={order.status}
              onChange={(e) => updateField({ status: e.target.value })}
              disabled={saving}
              className="w-full bg-ink border border-hairline px-3 py-2 text-bone"
            >
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="border border-hairline p-6">
            <div className="eyebrow text-bone/60 text-[10px] mb-4">Paiement</div>
            <select
              value={order.payment_status}
              onChange={(e) => updateField({ payment_status: e.target.value })}
              disabled={saving}
              className="w-full bg-ink border border-hairline px-3 py-2 text-bone"
            >
              {PAYMENT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {order.payment_method && (
              <div className="text-bone/50 text-xs mt-3">Méthode : {order.payment_method}</div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card title="Client">
            <Row label="Nom" value={order.customer_full_name} />
            <Row label="Email" value={order.customer_email} />
            <Row label="Téléphone" value={order.customer_phone} />
            <Row label="Type" value={order.user_id ? "Compte client" : "Invité"} />
          </Card>
          <Card title="Livraison">
            <Row label="Adresse" value={order.shipping_address} />
            <Row label="Ville" value={order.shipping_city} />
            <Row label="Pays" value={order.shipping_country} />
            {order.notes && <Row label="Note client" value={order.notes} />}
          </Card>
        </div>

        <div className="border border-hairline mb-10">
          <div className="eyebrow text-bone/60 text-[10px] p-4 border-b border-hairline">Articles ({items.length})</div>
          <div className="divide-y divide-hairline">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-[64px_1fr_auto_auto] gap-4 p-4 items-center">
                {it.product_image ? (
                  <img src={it.product_image} alt={it.product_name} className="w-16 h-20 object-cover bg-secondary" />
                ) : <div className="w-16 h-20 bg-secondary" />}
                <div>
                  <div className="font-serif text-bone">{it.product_name}</div>
                  <div className="text-bone/50 text-xs mt-1">
                    {[it.size && `Taille ${it.size}`, it.fit, it.lapel, it.lining, it.monogram && `Monogramme: ${it.monogram}`].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="text-bone/70 text-sm">× {it.quantity}</div>
                <div className="text-bone text-sm font-light">{fmtFcfa(it.unit_price_fcfa * it.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-hairline p-4 grid gap-2 text-sm">
            <Row label="Sous-total" value={fmtFcfa(order.subtotal_fcfa)} />
            <Row label="Livraison" value={fmtFcfa(order.delivery_fcfa)} />
            <Row label="Total" value={fmtFcfa(order.total_fcfa)} bold />
          </div>
        </div>

        <div className="border border-hairline p-6">
          <div className="eyebrow text-bone/60 text-[10px] mb-3">Notes internes</div>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Notes visibles uniquement par l'équipe…"
            rows={4}
            className="w-full bg-transparent border border-hairline p-3 text-bone text-sm focus:outline-none focus:border-bone/40"
          />
          <button
            onClick={() => updateField({ admin_notes: adminNotes })}
            disabled={saving}
            className="mt-4 luxury-btn luxury-btn-solid"
          >
            Enregistrer les notes
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-hairline p-6">
      <div className="eyebrow text-bone/60 text-[10px] mb-4">{title}</div>
      <div className="grid gap-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-bone/50">{label}</span>
      <span className={`text-right ${bold ? "text-bone font-serif text-base" : "text-bone/90"}`}>{value}</span>
    </div>
  );
}
