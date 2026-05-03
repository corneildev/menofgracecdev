import { createFileRoute, Link, useParams } from "@tanstack/react-router";
<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatFcfa, formatUsd } from "@/context/CartContext";
import { downloadInvoicePdf, type InvoiceData } from "@/lib/invoicePdf";

export const Route = createFileRoute("/order/confirmation/$orderId")({
=======
import { useEffect, useMemo, useRef, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatFcfa, formatUsd } from "@/context/CartContext";
import { downloadInvoicePdf, type InvoiceData } from "@/lib/invoicePdf";
import { getErrorMessage } from "@/lib/errorMessage";
import { trackMetaEvent } from "@/lib/metaPixel";

export const Route = createFileRoute("/order/confirmation/$orderId")({
  validateSearch: zodValidator(
    z.object({
      token: fallback(
        z.string().trim().min(1).max(255).optional(),
        undefined,
      ).optional(),
    }),
  ),
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  head: () => ({
    meta: [
      { title: "Confirmation — MEN OF GRACE" },
      { name: "description", content: "Votre commande est confirmée." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

type OrderRow = {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  notes: string | null;
  subtotal_fcfa: number;
  subtotal_usd: number;
  delivery_fcfa: number;
  total_fcfa: number;
  total_usd: number;
  status: string;
  payment_method: string | null;
  created_at: string;
};

type OrderItemRow = {
  product_name: string;
  quantity: number;
  unit_price_fcfa: number;
  unit_price_usd: number;
  size: string | null;
  fit: string | null;
  lapel: string | null;
  lining: string | null;
  monogram: string | null;
  product_image: string | null;
};

function ConfirmationPage() {
  const { orderId } = useParams({ from: "/order/confirmation/$orderId" });
<<<<<<< HEAD
=======
  const { token } = Route.useSearch();
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
=======
  const purchaseTrackedRef = useRef(false);
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
<<<<<<< HEAD
=======
        if (token) {
          const { data: guestData, error: guestErr } = await supabase.rpc(
            "get_guest_order_confirmation",
            {
              p_order_id: orderId,
              p_access_token: token,
            },
          );
          if (guestErr) throw guestErr;
          const payload = guestData as {
            order: OrderRow;
            items: OrderItemRow[];
          } | null;
          if (!payload?.order) {
            if (!cancelled)
              setError("Lien de confirmation invalide ou expiré.");
            return;
          }
          if (!cancelled) {
            setOrder(payload.order);
            setItems(payload.items ?? []);
          }
          return;
        }

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        const { data: o, error: oErr } = await supabase
          .from("orders")
          .select(
            "id, order_number, customer_full_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_country, notes, subtotal_fcfa, subtotal_usd, delivery_fcfa, total_fcfa, total_usd, status, payment_method, created_at",
          )
          .eq("id", orderId)
          .maybeSingle();
        if (oErr) throw oErr;
        if (!o) {
          if (!cancelled) setError("Commande introuvable ou expirée.");
          return;
        }

        const { data: its, error: iErr } = await supabase
          .from("order_items")
          .select(
            "product_name, quantity, unit_price_fcfa, unit_price_usd, size, fit, lapel, lining, monogram, product_image",
          )
          .eq("order_id", orderId);
        if (iErr) throw iErr;

        if (!cancelled) {
          setOrder(o as OrderRow);
          setItems((its ?? []) as OrderItemRow[]);
        }
      } catch (e) {
<<<<<<< HEAD
        console.error(e);
        if (!cancelled) setError("Impossible de charger la commande.");
=======
        if (!cancelled)
          setError(getErrorMessage(e, "Impossible de charger la commande."));
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
<<<<<<< HEAD
  }, [orderId]);
=======
  }, [orderId, token]);
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

  const invoiceData: InvoiceData | null = useMemo(() => {
    if (!order) return null;
    return {
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
      items,
    };
  }, [order, items]);

<<<<<<< HEAD
=======
  useEffect(() => {
    if (!order || purchaseTrackedRef.current) return;
    trackMetaEvent("Purchase", {
      currency: "XOF",
      value: order.total_fcfa,
      content_type: "product",
      content_ids: items.map((it) => it.product_name),
      num_items: items.reduce((sum, it) => sum + it.quantity, 0),
      order_id: order.id,
    });
    purchaseTrackedRef.current = true;
  }, [order, items]);

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  if (loading) {
    return <div className="pt-40 pb-32 px-6 bg-ink min-h-screen" />;
  }

  if (error || !order || !invoiceData) {
    return (
      <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
        <div className="max-w-xl mx-auto text-center border border-hairline p-12">
          <div className="eyebrow text-bone/60 mb-6">— Confirmation —</div>
<<<<<<< HEAD
          <h1 className="display text-3xl mb-6">{error ?? "Commande introuvable"}</h1>
          <Link to="/collection" className="luxury-btn">Retour à la Collection</Link>
=======
          <h1 className="display text-3xl mb-6">
            {error ?? "Commande introuvable"}
          </h1>
          <Link to="/collection" className="luxury-btn">
            Retour à la Collection
          </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <div className="eyebrow text-bone/60 mb-6">— Confirmation —</div>
<<<<<<< HEAD
          <h1 className="display text-5xl md:text-6xl mb-6">Merci, {order.customer_full_name.split(" ")[0]}.</h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            Votre commande <span className="text-bone">{order.order_number}</span> est enregistrée.
            Vous recevrez les instructions de paiement par email à <span className="text-bone">{order.customer_email}</span>.
=======
          <h1 className="display text-5xl md:text-6xl mb-6">
            Merci, {order.customer_full_name.split(" ")[0]}.
          </h1>
          <p className="text-bone/60 font-light max-w-xl mx-auto">
            Votre commande{" "}
            <span className="text-bone">{order.order_number}</span> est
            enregistrée. Vous recevrez les instructions de paiement par email à{" "}
            <span className="text-bone">{order.customer_email}</span>.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div className="border border-hairline p-8 md:p-12">
            <div className="flex items-baseline justify-between mb-8 pb-6 border-b border-hairline">
              <div>
                <div className="eyebrow text-bone/60 mb-2">Commande</div>
                <div className="font-serif text-3xl">{order.order_number}</div>
              </div>
              <div className="text-right">
                <div className="eyebrow text-bone/60 mb-2">Date</div>
                <div className="text-bone/80 font-light text-sm">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <ul className="space-y-6 mb-8">
              {items.map((it, idx) => (
<<<<<<< HEAD
                <li key={idx} className="flex gap-5 pb-6 border-b border-hairline last:border-0">
                  {it.product_image && (
                    <div className="w-20 aspect-[4/5] bg-secondary shrink-0 overflow-hidden">
                      <img src={it.product_image} alt={it.product_name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-lg text-bone">{it.product_name}</div>
=======
                <li
                  key={idx}
                  className="flex gap-5 pb-6 border-b border-hairline last:border-0"
                >
                  {it.product_image && (
                    <div className="w-20 aspect-[4/5] bg-secondary shrink-0 overflow-hidden">
                      <img
                        src={it.product_image}
                        alt={it.product_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-lg text-bone">
                      {it.product_name}
                    </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                    <div className="eyebrow text-bone/40 text-[10px] mt-1">
                      ×{it.quantity}
                      {it.size ? ` · ${it.size}` : ""}
                      {it.fit ? ` · ${it.fit}` : ""}
                      {it.lapel ? ` · ${it.lapel}` : ""}
                    </div>
                  </div>
                  <div className="text-bone/80 text-sm font-light text-right">
                    {formatFcfa(it.unit_price_fcfa * it.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm">
              <Row label="Sous-total" value={formatFcfa(order.subtotal_fcfa)} />
<<<<<<< HEAD
              <Row label="Livraison" value={order.delivery_fcfa > 0 ? formatFcfa(order.delivery_fcfa) : "Offerte"} muted />
=======
              <Row
                label="Livraison"
                value={
                  order.delivery_fcfa > 0
                    ? formatFcfa(order.delivery_fcfa)
                    : "Offerte"
                }
                muted
              />
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            </div>
            <div className="flex justify-between items-baseline border-t border-hairline pt-4 mt-4">
              <span className="eyebrow">Total</span>
              <div className="text-right">
<<<<<<< HEAD
                <div className="text-bone text-xl font-light">{formatFcfa(order.total_fcfa)}</div>
                <div className="text-bone/50 text-xs">{formatUsd(order.total_usd)}</div>
=======
                <div className="text-bone text-xl font-light">
                  {formatFcfa(order.total_fcfa)}
                </div>
                <div className="text-bone/50 text-xs">
                  {formatUsd(order.total_usd)}
                </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 self-start space-y-4">
            <div className="border border-hairline p-8">
              <div className="eyebrow text-bone/60 mb-6">— Votre Facture —</div>
              <p className="text-bone/60 font-light text-sm mb-6 leading-relaxed">
<<<<<<< HEAD
                Téléchargez votre facture en PDF, composée dans la main de la maison.
=======
                Téléchargez votre facture en PDF, composée dans la main de la
                maison.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              </p>
              <button
                onClick={() => downloadInvoicePdf(invoiceData)}
                className="luxury-btn luxury-btn-solid w-full"
              >
                Télécharger la facture (PDF)
              </button>
            </div>

            <div className="border border-hairline p-8">
<<<<<<< HEAD
              <div className="eyebrow text-bone/60 mb-4">— Prochaines étapes —</div>
=======
              <div className="eyebrow text-bone/60 mb-4">
                — Prochaines étapes —
              </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              <ol className="space-y-4 text-bone/70 font-light text-sm">
                <li className="flex gap-3">
                  <span className="font-serif text-bone">I.</span>
                  <span>Instructions de paiement envoyées par email.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-bone">II.</span>
<<<<<<< HEAD
                  <span>Confection 6–8 semaines dès réception du règlement.</span>
=======
                  <span>
                    Confection 6–8 semaines dès réception du règlement.
                  </span>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-bone">III.</span>
                  <span>Livraison mondiale assurée.</span>
                </li>
              </ol>
            </div>

<<<<<<< HEAD
            <Link to="/collection" className="luxury-btn w-full block text-center">
=======
            <Link
              to="/collection"
              className="luxury-btn w-full block text-center"
            >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between font-light ${muted ? "text-bone/50" : "text-bone/80"}`}>
=======
function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex justify-between font-light ${muted ? "text-bone/50" : "text-bone/80"}`}
    >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
