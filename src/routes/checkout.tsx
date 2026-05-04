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
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const lastSubmitRef = useRef<number>(0);

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

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    min_cart_fcfa: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoBusy, setPromoBusy] = useState(false);

  const discountFcfa = useMemo(() => {
    if (!promoApplied) return 0;
    if (totalFcfa < promoApplied.min_cart_fcfa) return 0;
    if (promoApplied.discount_type === "percent") {
      return Math.floor((totalFcfa * promoApplied.discount_value) / 100);
    }
    return Math.min(promoApplied.discount_value, totalFcfa);
  }, [promoApplied, totalFcfa]);

  async function applyPromo() {
    setPromoError(null);
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("code, discount_type, discount_value, min_cart_fcfa, starts_at, ends_at, max_uses, uses_count, is_active")
        .ilike("code", code)
        .maybeSingle();
      if (error || !data || !data.is_active) {
        setPromoError("Code invalide");
        setPromoApplied(null);
        return;
      }
      const now = Date.now();
      if (data.starts_at && now < new Date(data.starts_at).getTime()) {
        setPromoError("Code non encore actif"); setPromoApplied(null); return;
      }
      if (data.ends_at && now > new Date(data.ends_at).getTime()) {
        setPromoError("Code expiré"); setPromoApplied(null); return;
      }
      if (data.max_uses != null && data.uses_count >= data.max_uses) {
        setPromoError("Code épuisé"); setPromoApplied(null); return;
      }
      if (totalFcfa < data.min_cart_fcfa) {
        setPromoError(`Panier minimum ${data.min_cart_fcfa.toLocaleString("fr-FR")} FCFA`);
        setPromoApplied(null);
        return;
      }
      setPromoApplied({
        code: data.code,
        discount_type: data.discount_type as "percent" | "fixed",
        discount_value: data.discount_value,
        min_cart_fcfa: data.min_cart_fcfa,
      });
    } finally {
      setPromoBusy(false);
    }
  }

  const deliveryFcfa = useMemo(() => 0, []);
  const finalTotal = Math.max(totalFcfa - discountFcfa + deliveryFcfa, 0);

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
    // Debounce double-clicks
    const now = Date.now();
    if (submitting || now - lastSubmitRef.current < 1000) return;
    lastSubmitRef.current = now;

    setError(null);
    setSubmitting(true);
    try {
      const p_items = items.map((it) => ({
        product_id: it.productId,
        quantity: it.quantity,
        size: it.size ?? null,
        fit: it.fit ?? null,
        lapel: it.lapel ?? null,
        lining: it.lining ?? null,
        monogram: it.monogram ?? null,
        product_image: it.image ?? null,
      }));

      const p_customer = {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        notes: form.notes.trim(),
      };

      const { data, error: rpcErr } = await supabase.rpc("place_order", {
        p_items,
        p_customer,
        p_payment: form.payment,
        p_idempotency_key: idempotencyKeyRef.current,
      });

      if (rpcErr) throw rpcErr;
      const result = data as { id: string; order_number: string } | null;
      if (!result?.id) throw new Error("Commande introuvable");

      clear();
      navigate({ to: "/order/confirmation/$orderId", params: { orderId: result.id } });
    } catch (e: unknown) {
      console.error(e);
      const msg =
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Impossible d'enregistrer la commande. Merci de réessayer.";
      setError(msg);
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
