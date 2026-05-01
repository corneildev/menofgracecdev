import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MEN OF GRACE" },
      { name: "description", content: "Finalisez votre commande sur-mesure." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = Database["public"]["Enums"]["payment_method"];

const STEPS = [
  { id: 1, label: "Coordonnées" },
  { id: 2, label: "Livraison" },
  { id: 3, label: "Paiement" },
  { id: 4, label: "Récapitulatif" },
] as const;

const COUNTRIES = [
  "Côte d'Ivoire",
  "Bénin",
  "Sénégal",
  "Togo",
  "Burkina Faso",
  "Mali",
  "Ghana",
  "Nigeria",
  "France",
  "Belgique",
  "Suisse",
  "Royaume-Uni",
  "États-Unis",
  "Canada",
  "Émirats Arabes Unis",
  "Autre",
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "bank_transfer", label: "Virement bancaire", hint: "IBAN communiqué après commande." },
  { value: "mtn_momo", label: "MTN Mobile Money", hint: "Confirmation par notre concierge." },
  { value: "moov_money", label: "Moov Money", hint: "Confirmation par notre concierge." },
  { value: "orange_money", label: "Orange Money", hint: "Confirmation par notre concierge." },
  { value: "wave", label: "Wave", hint: "Transfert vers notre compte marchand." },
  { value: "cash_on_delivery", label: "Paiement à la livraison", hint: "Disponible Abidjan & CEDEAO." },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalFcfa, totalUsd, ready, count, clear } = useCart();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Côte d'Ivoire",
    notes: "",
    payment: "bank_transfer" as PaymentMethod,
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const deliveryFcfa = useMemo(() => 0, []);
  const finalTotal = totalFcfa + deliveryFcfa;

  const canStep1 =
    form.fullName.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.phone.trim().length >= 5;
  const canStep2 =
    form.address.trim().length >= 4 &&
    form.city.trim().length >= 2 &&
    form.country.trim().length >= 2;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  async function placeOrder() {
    setError(null);
    setSubmitting(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: null,
          guest_email: form.email.trim(),
          customer_full_name: form.fullName.trim(),
          customer_email: form.email.trim(),
          customer_phone: form.phone.trim(),
          shipping_address: form.address.trim(),
          shipping_city: form.city.trim(),
          shipping_country: form.country.trim(),
          notes: form.notes.trim() || null,
          payment_method: form.payment,
          payment_status: "pending",
          status: "pending_payment",
          subtotal_fcfa: totalFcfa,
          subtotal_usd: totalUsd,
          delivery_fcfa: deliveryFcfa,
          total_fcfa: finalTotal,
          total_usd: totalUsd,
        })
        .select("id, order_number")
        .single();

      if (orderErr || !order) throw orderErr ?? new Error("Order creation failed");

      const orderItems = items.map((it) => ({
        order_id: order.id,
        product_id: it.productId,
        product_name: it.name,
        product_image: it.image,
        quantity: it.quantity,
        unit_price_fcfa: it.fcfa,
        unit_price_usd: it.usd,
        size: it.size,
        fit: it.fit,
        lapel: it.lapel,
        lining: it.lining,
        monogram: it.monogram ?? null,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clear();
      navigate({ to: "/order/confirmation/$orderId", params: { orderId: order.id } });
    } catch (e) {
      console.error(e);
      setError("Impossible d'enregistrer la commande. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <div className="pt-40 pb-32 px-6 bg-ink min-h-screen" />;
  }

  if (count === 0) {
    return (
      <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
        <div className="max-w-xl mx-auto text-center border border-hairline p-12">
          <div className="eyebrow text-bone/60 mb-6">— Checkout —</div>
          <h1 className="display text-4xl mb-6">Votre panier est vide</h1>
          <p className="text-bone/60 font-light mb-8">
            Ajoutez d'abord une pièce à votre sélection.
          </p>
          <Link to="/collection" className="luxury-btn">Découvrir la Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="eyebrow text-bone/60 mb-6">— Finalisation —</div>
          <h1 className="display text-5xl md:text-6xl">Checkout</h1>
        </div>

        {/* Stepper */}
        <ol className="flex items-center justify-center gap-4 md:gap-10 mb-16 flex-wrap">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 flex items-center justify-center border text-xs ${
                    active
                      ? "border-bone text-bone"
                      : done
                      ? "border-bone/40 text-bone/40"
                      : "border-hairline text-bone/40"
                  }`}
                >
                  {s.id}
                </span>
                <span
                  className={`eyebrow text-[10px] ${active ? "text-bone" : "text-bone/40"}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <span className="hidden md:block w-10 h-px bg-hairline" />}
              </li>
            );
          })}
        </ol>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div className="border border-hairline p-8 md:p-12">
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl mb-8">Coordonnées</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Nom complet"
                    value={form.fullName}
                    onChange={(v) => update("fullName", v)}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    required
                  />
                  <Field
                    label="Téléphone (avec indicatif)"
                    placeholder="+225 ..."
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    required
                    className="md:col-span-2"
                  />
                </div>
                <p className="eyebrow text-bone/40 mt-8 text-[10px]">
                  Commande en mode invité — aucun compte requis.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl mb-8">Adresse de livraison</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Adresse"
                    value={form.address}
                    onChange={(v) => update("address", v)}
                    required
                    className="md:col-span-2"
                  />
                  <Field label="Ville" value={form.city} onChange={(v) => update("city", v)} required />
                  <SelectField
                    label="Pays"
                    value={form.country}
                    onChange={(v) => update("country", v)}
                    options={COUNTRIES}
                  />
                  <Field
                    label="Notes pour notre concierge (optionnel)"
                    value={form.notes}
                    onChange={(v) => update("notes", v)}
                    textarea
                    className="md:col-span-2"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif text-2xl mb-2">Mode de paiement</h2>
                <p className="text-bone/50 text-sm font-light mb-8">
                  Vous recevrez les instructions par email après validation. La confection démarre dès réception du paiement.
                </p>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className={`flex items-start gap-4 border p-5 cursor-pointer transition-colors ${
                        form.payment === o.value ? "border-bone" : "border-hairline hover:border-bone/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={o.value}
                        checked={form.payment === o.value}
                        onChange={() => update("payment", o.value)}
                        className="mt-1 accent-bone"
                      />
                      <span>
                        <span className="block font-serif text-lg text-bone">{o.label}</span>
                        <span className="block text-bone/50 text-xs mt-1 font-light">{o.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif text-2xl mb-8">Récapitulatif</h2>
                <Recap title="Coordonnées">
                  <div>{form.fullName}</div>
                  <div className="text-bone/60">{form.email}</div>
                  <div className="text-bone/60">{form.phone}</div>
                </Recap>
                <Recap title="Livraison">
                  <div>{form.address}</div>
                  <div className="text-bone/60">
                    {form.city}, {form.country}
                  </div>
                  {form.notes && <div className="text-bone/60 italic mt-2">"{form.notes}"</div>}
                </Recap>
                <Recap title="Paiement">
                  <div>{PAYMENT_OPTIONS.find((p) => p.value === form.payment)?.label}</div>
                </Recap>

                {error && (
                  <div className="border border-destructive/60 text-destructive p-4 text-sm mb-6">
                    {error}
                  </div>
                )}

                <p className="eyebrow text-bone/40 text-[10px] mb-2">
                  En validant, vous acceptez les conditions de la maison. La confection démarre dès réception du paiement.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-8 border-t border-hairline">
              {step > 1 ? (
                <button onClick={back} className="eyebrow text-bone/60 hover:text-bone">
                  ← Retour
                </button>
              ) : (
                <Link to="/cart" className="eyebrow text-bone/60 hover:text-bone">
                  ← Panier
                </Link>
              )}
              {step < 4 ? (
                <button
                  onClick={next}
                  disabled={(step === 1 && !canStep1) || (step === 2 && !canStep2)}
                  className="luxury-btn luxury-btn-solid disabled:opacity-40 disabled:pointer-events-none"
                >
                  Continuer
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="luxury-btn luxury-btn-solid disabled:opacity-40"
                >
                  {submitting ? "Validation…" : "Valider la commande"}
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-32 self-start border border-hairline p-8 h-fit">
            <div className="eyebrow text-bone/60 mb-6">— Votre Commande —</div>
            <ul className="space-y-5 mb-6 max-h-[380px] overflow-auto pr-2">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4">
                  <div className="w-16 aspect-[4/5] bg-secondary shrink-0 overflow-hidden">
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-bone text-sm leading-tight">{it.name}</div>
                    <div className="eyebrow text-bone/40 text-[9px] mt-1">
                      ×{it.quantity}
                      {it.size ? ` · ${it.size}` : ""}
                    </div>
                    <div className="text-bone/70 text-xs mt-1">
                      {formatFcfa(it.fcfa * it.quantity)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-hairline pt-4 text-sm">
              <Row label="Sous-total" value={formatFcfa(totalFcfa)} />
              <Row label="Livraison" value="Offerte" muted />
            </div>
            <div className="flex justify-between items-baseline border-t border-hairline pt-4 mt-4">
              <span className="eyebrow">Total</span>
              <div className="text-right">
                <div className="text-bone text-xl font-light">{formatFcfa(finalTotal)}</div>
                <div className="text-bone/50 text-xs">{formatUsd(totalUsd)}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  textarea,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow text-bone/60 text-[10px] block mb-2">
        {label}
        {required && <span className="text-bone/40"> *</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="eyebrow text-bone/60 text-[10px] block mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Recap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6 border-b border-hairline last:border-b-0 last:mb-0 last:pb-0">
      <div className="eyebrow text-bone/60 text-[10px] mb-3">— {title} —</div>
      <div className="text-bone text-sm font-light leading-relaxed">{children}</div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between font-light ${muted ? "text-bone/50" : "text-bone/80"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
