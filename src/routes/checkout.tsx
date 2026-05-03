import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { useMemo, useRef, useState } from "react";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
=======
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart, formatFcfa, formatUsd } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage } from "@/lib/errorMessage";
import { trackProductEvent } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/metaPixel";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

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

<<<<<<< HEAD
const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "bank_transfer", label: "Virement bancaire", hint: "IBAN communiqué après commande." },
  { value: "mtn_momo", label: "MTN Mobile Money", hint: "Confirmation par notre concierge." },
  { value: "moov_money", label: "Moov Money", hint: "Confirmation par notre concierge." },
  { value: "orange_money", label: "Orange Money", hint: "Confirmation par notre concierge." },
  { value: "wave", label: "Wave", hint: "Transfert vers notre compte marchand." },
  { value: "cash_on_delivery", label: "Paiement à la livraison", hint: "Disponible Abidjan & CEDEAO." },
];
=======
const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] =
  [
    {
      value: "bank_transfer",
      label: "Virement bancaire",
      hint: "IBAN communiqué après commande.",
    },
    {
      value: "mtn_momo",
      label: "MTN Mobile Money",
      hint: "Confirmation par notre concierge.",
    },
    {
      value: "moov_money",
      label: "Moov Money",
      hint: "Confirmation par notre concierge.",
    },
    {
      value: "orange_money",
      label: "Orange Money",
      hint: "Confirmation par notre concierge.",
    },
    {
      value: "wave",
      label: "Wave",
      hint: "Transfert vers notre compte marchand.",
    },
    {
      value: "cash_on_delivery",
      label: "Paiement à la livraison",
      hint: "Disponible Abidjan & CEDEAO.",
    },
  ];
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalFcfa, totalUsd, ready, count, clear } = useCart();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const lastSubmitRef = useRef<number>(0);
=======
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<
        "fullName" | "email" | "phone" | "address" | "city" | "country",
        string
      >
    >
  >({});
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const lastSubmitRef = useRef<number>(0);
  const hasPlacedOrderRef = useRef(false);
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

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

<<<<<<< HEAD
=======
  const updateAndClearError = <K extends keyof typeof form>(
    k: K,
    v: (typeof form)[K],
  ) => {
    update(k, v);
    if (k in fieldErrors)
      setFieldErrors((prev) => ({ ...prev, [k]: undefined }));
    if (error) setError(null);
  };

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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

<<<<<<< HEAD
  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

=======
  const validateStep1 = () => {
    const nextErrors: Partial<Record<"fullName" | "email" | "phone", string>> =
      {};
    if (form.fullName.trim().length < 2)
      nextErrors.fullName = "Nom complet requis.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Adresse email invalide.";
    if (form.phone.trim().length < 5)
      nextErrors.phone = "Numéro de téléphone invalide.";
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    focusFirstFieldError(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors: Partial<Record<"address" | "city" | "country", string>> =
      {};
    if (form.address.trim().length < 4)
      nextErrors.address = "Adresse trop courte.";
    if (form.city.trim().length < 2) nextErrors.city = "Ville invalide.";
    if (form.country.trim().length < 2) nextErrors.country = "Pays invalide.";
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    focusFirstFieldError(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCartItems = () => {
    const missingSize = items.find(
      (it) => (it.availableSizes?.length ?? 0) > 0 && !it.size,
    );
    if (missingSize) {
      setError(
        `Sélectionnez une taille pour "${missingSize.name}" avant validation.`,
      );
      return false;
    }
    const soldOutSelection = items.find(
      (it) => it.size && it.soldOutSizes?.includes(it.size),
    );
    if (soldOutSelection) {
      setError(
        `La taille sélectionnée pour "${soldOutSelection.name}" n'est plus disponible.`,
      );
      return false;
    }
    return true;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  useEffect(() => {
    trackProductEvent({
      type: "checkout_step_view",
      metadata: { step, item_count: count, total_fcfa: finalTotal },
    });
  }, [step, count, finalTotal]);

  useEffect(() => {
    if (count <= 0) return;
    trackMetaEvent("InitiateCheckout", {
      currency: "XOF",
      value: finalTotal,
      num_items: count,
      content_type: "product",
      content_ids: items.map((it) => it.productId),
    });
  }, [count, finalTotal, items]);

  useEffect(() => {
    return () => {
      if (!hasPlacedOrderRef.current && count > 0) {
        trackProductEvent({
          type: "checkout_abandoned",
          metadata: { step, item_count: count, total_fcfa: finalTotal },
        });
      }
    };
  }, [count, finalTotal, step]);

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  async function placeOrder() {
    // Debounce double-clicks
    const now = Date.now();
    if (submitting || now - lastSubmitRef.current < 1000) return;
    lastSubmitRef.current = now;

    setError(null);
    setSubmitting(true);
    try {
<<<<<<< HEAD
=======
      trackProductEvent({
        type: "checkout_place_order_attempt",
        metadata: {
          item_count: count,
          total_fcfa: finalTotal,
          payment_method: form.payment,
        },
      });
      if (!validateCartItems()) return;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
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
=======
      const result = data as {
        id: string;
        order_number: string;
        access_token?: string | null;
      } | null;
      if (!result?.id) throw new Error("Commande introuvable");

      hasPlacedOrderRef.current = true;
      trackProductEvent({
        type: "checkout_place_order_success",
        metadata: {
          order_id: result.id,
          item_count: count,
          total_fcfa: finalTotal,
        },
      });
      clear();
      navigate({
        to: "/order/confirmation/$orderId",
        params: { orderId: result.id },
        search: result.access_token
          ? { token: result.access_token }
          : undefined,
      });
    } catch (e: unknown) {
      trackProductEvent({
        type: "checkout_place_order_failed",
        metadata: {
          message: getErrorMessage(e, "unknown"),
          item_count: count,
          total_fcfa: finalTotal,
        },
      });
      setError(
        getErrorMessage(
          e,
          "Impossible d'enregistrer la commande. Merci de réessayer.",
        ),
      );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
          <Link to="/collection" className="luxury-btn">Découvrir la Collection</Link>
=======
          <Link to="/collection" className="luxury-btn">
            Découvrir la Collection
          </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1200px] mx-auto">
<<<<<<< HEAD
=======
        <div className="lg:hidden sticky top-20 z-20 mb-6 border border-hairline bg-ink/95 backdrop-blur px-4 py-3 flex items-center justify-between">
          <div>
            <div className="eyebrow text-bone/50 text-[9px]">
              Étape {step}/4
            </div>
            <div className="text-bone text-sm">
              {count} pièce{count > 1 ? "s" : ""} · {formatFcfa(finalTotal)}
            </div>
          </div>
          <button
            type="button"
            onClick={step < 4 ? next : placeOrder}
            disabled={
              submitting ||
              (step === 1 && !canStep1) ||
              (step === 2 && !canStep2)
            }
            className="luxury-btn luxury-btn-solid px-4 py-2 text-[10px] disabled:opacity-40"
          >
            {step < 4 ? "Continuer" : submitting ? "Validation…" : "Valider"}
          </button>
        </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                      ? "border-bone/40 text-bone/40"
                      : "border-hairline text-bone/40"
=======
                        ? "border-bone/40 text-bone/40"
                        : "border-hairline text-bone/40"
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  }`}
                >
                  {s.id}
                </span>
                <span
                  className={`eyebrow text-[10px] ${active ? "text-bone" : "text-bone/40"}`}
                >
                  {s.label}
                </span>
<<<<<<< HEAD
                {i < STEPS.length - 1 && <span className="hidden md:block w-10 h-px bg-hairline" />}
=======
                {i < STEPS.length - 1 && (
                  <span className="hidden md:block w-10 h-px bg-hairline" />
                )}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
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
=======
                    inputId="checkout-fullName"
                    label="Nom complet"
                    value={form.fullName}
                    onChange={(v) => updateAndClearError("fullName", v)}
                    required
                    error={fieldErrors.fullName}
                    autoComplete="name"
                  />
                  <Field
                    inputId="checkout-email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => updateAndClearError("email", v)}
                    required
                    error={fieldErrors.email}
                    autoComplete="email"
                  />
                  <Field
                    inputId="checkout-phone"
                    label="Téléphone (avec indicatif)"
                    placeholder="+225 ..."
                    value={form.phone}
                    onChange={(v) => updateAndClearError("phone", v)}
                    required
                    className="md:col-span-2"
                    error={fieldErrors.phone}
                    autoComplete="tel"
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  />
                </div>
                <p className="eyebrow text-bone/40 mt-8 text-[10px]">
                  Commande en mode invité — aucun compte requis.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
<<<<<<< HEAD
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
=======
                <h2 className="font-serif text-2xl mb-8">
                  Adresse de livraison
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    inputId="checkout-address"
                    label="Adresse"
                    value={form.address}
                    onChange={(v) => updateAndClearError("address", v)}
                    required
                    className="md:col-span-2"
                    error={fieldErrors.address}
                    autoComplete="street-address"
                  />
                  <Field
                    inputId="checkout-city"
                    label="Ville"
                    value={form.city}
                    onChange={(v) => updateAndClearError("city", v)}
                    required
                    error={fieldErrors.city}
                    autoComplete="address-level2"
                  />
                  <SelectField
                    inputId="checkout-country"
                    label="Pays"
                    value={form.country}
                    onChange={(v) => updateAndClearError("country", v)}
                    options={COUNTRIES}
                    error={fieldErrors.country}
                    autoComplete="country-name"
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  />
                  <Field
                    label="Notes pour notre concierge (optionnel)"
                    value={form.notes}
<<<<<<< HEAD
                    onChange={(v) => update("notes", v)}
=======
                    onChange={(v) => updateAndClearError("notes", v)}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                  Vous recevrez les instructions par email après validation. La confection démarre dès réception du paiement.
=======
                  Vous recevrez les instructions par email après validation. La
                  confection démarre dès réception du paiement.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                </p>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className={`flex items-start gap-4 border p-5 cursor-pointer transition-colors ${
<<<<<<< HEAD
                        form.payment === o.value ? "border-bone" : "border-hairline hover:border-bone/40"
=======
                        form.payment === o.value
                          ? "border-bone"
                          : "border-hairline hover:border-bone/40"
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                        <span className="block font-serif text-lg text-bone">{o.label}</span>
                        <span className="block text-bone/50 text-xs mt-1 font-light">{o.hint}</span>
=======
                        <span className="block font-serif text-lg text-bone">
                          {o.label}
                        </span>
                        <span className="block text-bone/50 text-xs mt-1 font-light">
                          {o.hint}
                        </span>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                  {form.notes && <div className="text-bone/60 italic mt-2">"{form.notes}"</div>}
                </Recap>
                <Recap title="Paiement">
                  <div>{PAYMENT_OPTIONS.find((p) => p.value === form.payment)?.label}</div>
=======
                  {form.notes && (
                    <div className="text-bone/60 italic mt-2">
                      "{form.notes}"
                    </div>
                  )}
                </Recap>
                <Recap title="Paiement">
                  <div>
                    {
                      PAYMENT_OPTIONS.find((p) => p.value === form.payment)
                        ?.label
                    }
                  </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                </Recap>

                {error && (
                  <div className="border border-destructive/60 text-destructive p-4 text-sm mb-6">
                    {error}
                  </div>
                )}

                <p className="eyebrow text-bone/40 text-[10px] mb-2">
<<<<<<< HEAD
                  En validant, vous acceptez les conditions de la maison. La confection démarre dès réception du paiement.
=======
                  En validant, vous acceptez les conditions de la maison. La
                  confection démarre dès réception du paiement.
                </p>
                <p className="text-bone/50 text-xs font-light">
                  <Link to="/terms" className="underline hover:text-bone">
                    CGV
                  </Link>
                  {" · "}
                  <Link to="/privacy" className="underline hover:text-bone">
                    Confidentialité
                  </Link>
                  {" · "}
                  <Link
                    to="/shipping-returns"
                    className="underline hover:text-bone"
                  >
                    Livraison & retours
                  </Link>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-8 border-t border-hairline">
              {step > 1 ? (
<<<<<<< HEAD
                <button onClick={back} className="eyebrow text-bone/60 hover:text-bone">
                  ← Retour
                </button>
              ) : (
                <Link to="/cart" className="eyebrow text-bone/60 hover:text-bone">
=======
                <button
                  onClick={back}
                  className="eyebrow text-bone/60 hover:text-bone"
                >
                  ← Retour
                </button>
              ) : (
                <Link
                  to="/cart"
                  className="eyebrow text-bone/60 hover:text-bone"
                >
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  ← Panier
                </Link>
              )}
              {step < 4 ? (
                <button
                  onClick={next}
<<<<<<< HEAD
                  disabled={(step === 1 && !canStep1) || (step === 2 && !canStep2)}
=======
                  disabled={
                    (step === 1 && !canStep1) || (step === 2 && !canStep2)
                  }
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-bone text-sm leading-tight">{it.name}</div>
=======
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-bone text-sm leading-tight">
                      {it.name}
                    </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
<<<<<<< HEAD
                <div className="text-bone text-xl font-light">{formatFcfa(finalTotal)}</div>
                <div className="text-bone/50 text-xs">{formatUsd(totalUsd)}</div>
=======
                <div className="text-bone text-xl font-light">
                  {formatFcfa(finalTotal)}
                </div>
                <div className="text-bone/50 text-xs">
                  {formatUsd(totalUsd)}
                </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function Field({
=======
function focusFirstFieldError(
  errors: Partial<
    Record<
      "fullName" | "email" | "phone" | "address" | "city" | "country",
      string
    >
  >,
) {
  if (typeof document === "undefined") return;
  const order: Array<keyof typeof errors> = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "country",
  ];
  const first = order.find((k) => errors[k]);
  if (!first) return;
  const el = document.getElementById(`checkout-${first}`);
  if (el instanceof HTMLElement) {
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function Field({
  inputId,
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  textarea,
  className = "",
<<<<<<< HEAD
}: {
=======
  error,
  autoComplete,
}: {
  inputId?: string;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
<<<<<<< HEAD
=======
  error?: string;
  autoComplete?: string;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow text-bone/60 text-[10px] block mb-2">
        {label}
        {required && <span className="text-bone/40"> *</span>}
      </span>
      {textarea ? (
        <textarea
<<<<<<< HEAD
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
        />
      ) : (
        <input
=======
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          autoComplete={autoComplete}
          className={`w-full bg-ink border outline-none text-bone p-3 text-sm font-light ${
            error
              ? "border-red-400/70 focus:border-red-300"
              : "border-hairline focus:border-bone"
          }`}
        />
      ) : (
        <input
          id={inputId}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
<<<<<<< HEAD
          className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
        />
      )}
=======
          autoComplete={autoComplete}
          className={`w-full bg-ink border outline-none text-bone p-3 text-sm font-light ${
            error
              ? "border-red-400/70 focus:border-red-300"
              : "border-hairline focus:border-bone"
          }`}
        />
      )}
      {error && (
        <span className="text-red-300 text-xs mt-2 block">{error}</span>
      )}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    </label>
  );
}

function SelectField({
<<<<<<< HEAD
=======
  inputId,
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  label,
  value,
  onChange,
  options,
<<<<<<< HEAD
}: {
=======
  error,
  autoComplete,
}: {
  inputId?: string;
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
<<<<<<< HEAD
}) {
  return (
    <label className="block">
      <span className="eyebrow text-bone/60 text-[10px] block mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink border border-hairline focus:border-bone outline-none text-bone p-3 text-sm font-light"
=======
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-bone/60 text-[10px] block mb-2">
        {label}
      </span>
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full bg-ink border outline-none text-bone p-3 text-sm font-light ${
          error
            ? "border-red-400/70 focus:border-red-300"
            : "border-hairline focus:border-bone"
        }`}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
<<<<<<< HEAD
=======
      {error && (
        <span className="text-red-300 text-xs mt-2 block">{error}</span>
      )}
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    </label>
  );
}

<<<<<<< HEAD
function Recap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6 border-b border-hairline last:border-b-0 last:mb-0 last:pb-0">
      <div className="eyebrow text-bone/60 text-[10px] mb-3">— {title} —</div>
      <div className="text-bone text-sm font-light leading-relaxed">{children}</div>
=======
function Recap({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-hairline last:border-b-0 last:mb-0 last:pb-0">
      <div className="eyebrow text-bone/60 text-[10px] mb-3">— {title} —</div>
      <div className="text-bone text-sm font-light leading-relaxed">
        {children}
      </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
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
