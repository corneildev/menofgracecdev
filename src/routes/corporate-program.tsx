import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import executiveHero from "@/assets/executive-hero.jpg";
import atelier from "@/assets/executive-atelier.jpg";
import craft from "@/assets/craft.jpg";

const WHATSAPP_NUMBER = "22500000000";

export const Route = createFileRoute("/corporate-program")({
  head: () => ({
    meta: [
      { title: "Corporate Program — MEN OF GRACE" },
      {
        name: "description",
        content:
          "The MEN OF GRACE Corporate Program — bespoke tailoring for executive teams, leadership boards, and institutional staff. On-site fittings, dedicated atelier liaison, volume programmes from 10 to 200+ pieces.",
      },
      { property: "og:title", content: "Corporate Program — MEN OF GRACE" },
      {
        property: "og:description",
        content:
          "Equip a leadership team in the same hand of cloth. Private fittings on site.",
      },
      { property: "og:image", content: executiveHero },
      { property: "twitter:image", content: executiveHero },
    ],
  }),
  component: CorporateProgramPage,
});

/* ───────────────────────── Tier data ───────────────────────── */

type Tier = {
  num: string;
  name: string;
  range: string;
  body: string;
  features: readonly string[];
};

const TIERS: readonly Tier[] = [
  {
    num: "I",
    name: "Atelier",
    range: "10 — 24 pieces",
    body: "For executive committees and small leadership teams.",
    features: [
      "On-site measurement at your office",
      "Two cloth options, three lining options",
      "Single fitting round",
      "Delivery in 8 weeks",
    ],
  },
  {
    num: "II",
    name: "Maison",
    range: "25 — 99 pieces",
    body: "For directorates, partner cohorts, and executive staff.",
    features: [
      "Dedicated atelier liaison",
      "Four cloth options, full lining library",
      "Two fitting rounds per piece",
      "Monogram included",
      "Delivery in 10 weeks",
    ],
  },
  {
    num: "III",
    name: "Institutional",
    range: "100+ pieces",
    body: "For institutions, banks, and group-wide programmes.",
    features: [
      "Travelling tailor for multi-site fittings",
      "Custom cloth selection from European mills",
      "Unlimited fitting rounds",
      "Replenishment programme over 24 months",
      "Quarterly atelier review",
    ],
  },
] as const;

const PROCESS: readonly { num: string; title: string; body: string }[] = [
  {
    num: "I",
    title: "Brief",
    body: "A confidential conversation. Headcount, hierarchy, intent, calendar.",
  },
  {
    num: "II",
    title: "Cloth selection",
    body: "Curated mill propositions. Approval by your leadership.",
  },
  {
    num: "III",
    title: "On-site fitting",
    body: "Our master tailor travels to your offices. Discreet, by appointment.",
  },
  {
    num: "IV",
    title: "Delivery",
    body: "Hand-delivered, individually labelled, and presented in maison garments bags.",
  },
] as const;

/* ───────────────────────── Form schema ───────────────────────── */

const COUNTRIES = [
  "Côte d'Ivoire",
  "Bénin",
  "Sénégal",
  "Nigeria",
  "Ghana",
  "France",
  "United Arab Emirates",
  "Other",
] as const;

const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name is required." })
    .max(120, { message: "Name must be under 120 characters." }),
  company: z
    .string()
    .trim()
    .min(2, { message: "Company is required." })
    .max(160, { message: "Company must be under 160 characters." }),
  role: z
    .string()
    .trim()
    .min(2, { message: "Role is required." })
    .max(120, { message: "Role must be under 120 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "A valid email is required." })
    .max(255),
  phone: z
    .string()
    .trim()
    .min(5, { message: "Phone is required." })
    .max(40, { message: "Phone must be under 40 characters." }),
  country: z.enum(COUNTRIES),
  city: z
    .string()
    .trim()
    .min(2, { message: "City is required." })
    .max(80),
  pieces: z
    .number()
    .int()
    .min(10, { message: "Programmes start from 10 pieces." })
    .max(2000, { message: "For programmes above 2000 pieces, contact us directly." }),
  timeline: z.enum(["6-8 weeks", "2-3 months", "3-6 months", "Open"]),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be under 1000 characters." })
    .optional()
    .or(z.literal("")),
});

type FormState = {
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  country: (typeof COUNTRIES)[number];
  city: string;
  pieces: string;
  timeline: "6-8 weeks" | "2-3 months" | "3-6 months" | "Open";
  notes: string;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  company: "",
  role: "",
  email: "",
  phone: "",
  country: "Côte d'Ivoire",
  city: "",
  pieces: "",
  timeline: "2-3 months",
  notes: "",
};

/* ───────────────────────── Estimate logic ───────────────────────── */

function tierFor(pieces: number): Tier {
  if (pieces >= 100) return TIERS[2];
  if (pieces >= 25) return TIERS[1];
  return TIERS[0];
}

function estimatePerPieceFcfa(pieces: number): number {
  // Indicative range, in FCFA. The luxury house never quotes a fixed price online.
  if (pieces >= 100) return 850_000;
  if (pieces >= 25) return 920_000;
  return 980_000;
}

function formatFcfa(n: number): string {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

/* ───────────────────────── Component ───────────────────────── */

function CorporateProgramPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const piecesNum = Number.parseInt(form.pieces, 10);
  const validPieces = Number.isFinite(piecesNum) && piecesNum >= 10;

  const estimate = useMemo(() => {
    if (!validPieces) return null;
    const perPiece = estimatePerPieceFcfa(piecesNum);
    return {
      tier: tierFor(piecesNum),
      perPiece,
      total: perPiece * piecesNum,
    };
  }, [piecesNum, validPieces]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const buildWhatsappMessage = (): string => {
    const lines = [
      "MEN OF GRACE — Corporate Program enquiry",
      "",
      `Name: ${form.fullName}`,
      `Company: ${form.company}`,
      `Role: ${form.role}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Location: ${form.city}, ${form.country}`,
      `Pieces: ${form.pieces}`,
      `Timeline: ${form.timeline}`,
    ];
    if (estimate) {
      lines.push(
        `Indicative tier: ${estimate.tier.name} (${estimate.tier.range})`,
        `Indicative budget: ${formatFcfa(estimate.total)}`,
      );
    }
    if (form.notes && form.notes.trim().length > 0) {
      lines.push("", "Notes:", form.notes.trim());
    }
    return lines.join("\n");
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = formSchema.safeParse({
      ...form,
      pieces: Number.parseInt(form.pieces, 10),
      notes: form.notes,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const principalsRange =
      piecesNum >= 100 ? "100+" : piecesNum >= 25 ? "25-99" : "10-24";

    const { error } = await supabase.from("corporate_inquiries").insert({
      full_name: form.fullName.trim(),
      company: form.company.trim(),
      role: form.role.trim() || null,
      email: form.email.trim(),
      country: `${form.city.trim() ? form.city.trim() + ", " : ""}${form.country}`,
      principals_range: principalsRange,
      timeline: form.timeline,
      context: form.notes.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("corporate_inquiries insert failed", error);
      toast.error("Submission could not be recorded. Please try again.");
      return;
    }

    toast.success("Request received. Our atelier will respond within 48 hours.");

    // Optional WhatsApp handoff so the lead reaches the atelier instantly
    const text = encodeURIComponent(buildWhatsappMessage());
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );

    setForm(INITIAL_FORM);
  };

  return (
    <div className="bg-ink text-bone">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={executiveHero}
          alt="Executive in a charcoal three-piece suit before a city skyline"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/35 to-ink" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="eyebrow text-bone/70 mb-8 fade-in-slow">
            — Corporate Program —
          </div>
          <h1 className="display text-bone text-[14vw] md:text-[7rem] leading-[0.9] mb-6 fade-up">
            One House.
            <br />
            <span className="italic font-light">One Hand.</span>
          </h1>
          <div className="hairline w-16 my-8 fade-in-slow" />
          <p
            className="font-serif italic text-bone/85 text-xl md:text-2xl mb-12 fade-up max-w-2xl"
            style={{ animationDelay: "200ms" }}
          >
            Habiller une direction, un comité, une institution — dans la même main de tissu.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <a href="#enquiry" className="luxury-btn luxury-btn-solid">
              Begin an Enquiry
            </a>
            <Link to="/executive" className="luxury-btn">
              The Executive Collection
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow text-bone/60 mb-10">— Manifesto —</div>
          <h2 className="display text-3xl md:text-6xl leading-[1.1] text-bone mb-12">
            A leadership team
            <br />
            <span className="italic text-bone/70">should arrive as one.</span>
          </h2>
          <div className="hairline w-16 mx-auto mb-12" />
          <p className="font-serif text-lg md:text-xl text-bone/75 leading-relaxed max-w-2xl mx-auto">
            The Corporate Program equips executive teams, partner cohorts, and
            institutional boards in a single hand of cloth — measured at your
            premises, drafted in our atelier, delivered as a coherent ensemble.
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20">
            <div className="eyebrow text-bone/60 mb-8">— Three Programmes —</div>
            <h2 className="display text-4xl md:text-6xl leading-[1.05]">
              Atelier · Maison
              <br />
              <span className="italic">Institutional.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
            {TIERS.map((tier) => (
              <div key={tier.num} className="bg-ink p-10 md:p-12 flex flex-col">
                <div className="eyebrow text-bone/50 mb-6">— {tier.num} —</div>
                <div className="font-serif text-3xl md:text-4xl mb-3">{tier.name}</div>
                <div className="eyebrow text-bone/70 mb-8">{tier.range}</div>
                <p className="text-bone/70 font-light text-sm leading-relaxed mb-10">
                  {tier.body}
                </p>
                <ul className="space-y-4 mt-auto">
                  {tier.features.map((f) => (
                    <li key={f} className="grid grid-cols-[1rem_1fr] gap-3 items-baseline">
                      <span className="hairline w-3 mt-2" />
                      <span className="text-bone/80 font-light text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5">
            <div className="img-zoom aspect-[4/5]">
              <img
                src={atelier}
                alt="Hands of a master tailor pinning a navy lapel"
                loading="lazy"
                className="h-full w-full object-cover"
                width={1280}
                height={1600}
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="eyebrow text-bone/60 mb-6">— The Process —</div>
            <h2 className="display text-4xl md:text-6xl mb-12 leading-[1.05]">
              Four
              <br />
              <span className="italic">Movements.</span>
            </h2>
            <ol className="space-y-8">
              {PROCESS.map((step) => (
                <li
                  key={step.num}
                  className="grid grid-cols-[3rem_1fr] gap-6 items-baseline border-b border-hairline pb-6"
                >
                  <span className="font-serif italic text-bone/50 text-2xl">{step.num}</span>
                  <div>
                    <div className="font-serif text-xl mb-1">{step.title}</div>
                    <div className="text-bone/60 font-light text-sm leading-relaxed">
                      {step.body}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section
        id="enquiry"
        className="bg-ink border-y border-hairline py-32 md:py-48 px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="eyebrow text-bone/60 mb-8">— Begin an Enquiry —</div>
            <h2 className="display text-4xl md:text-6xl leading-[1.05]">
              Compose your
              <br />
              <span className="italic">programme.</span>
            </h2>
            <p className="font-serif italic text-bone/70 text-lg mt-8 max-w-xl mx-auto">
              Confidential. Reviewed by the maison within two business days.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <Field label="Full name" error={errors.fullName}>
              <input
                type="text"
                required
                maxLength={120}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="form-line"
                autoComplete="name"
              />
            </Field>

            <Field label="Role" error={errors.role}>
              <input
                type="text"
                required
                maxLength={120}
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="form-line"
                autoComplete="organization-title"
              />
            </Field>

            <Field label="Company / Institution" error={errors.company} className="md:col-span-2">
              <input
                type="text"
                required
                maxLength={160}
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="form-line"
                autoComplete="organization"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="form-line"
                autoComplete="email"
              />
            </Field>

            <Field label="Phone / WhatsApp" error={errors.phone}>
              <input
                type="tel"
                required
                maxLength={40}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="form-line"
                autoComplete="tel"
              />
            </Field>

            <Field label="Country" error={errors.country}>
              <select
                value={form.country}
                onChange={(e) => update("country", e.target.value as FormState["country"])}
                className="form-line"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-ink">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City" error={errors.city}>
              <input
                type="text"
                required
                maxLength={80}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="form-line"
                autoComplete="address-level2"
              />
            </Field>

            <Field label="Number of pieces" error={errors.pieces}>
              <input
                type="number"
                required
                min={10}
                max={2000}
                step={1}
                value={form.pieces}
                onChange={(e) => update("pieces", e.target.value)}
                className="form-line"
                placeholder="e.g. 24"
              />
            </Field>

            <Field label="Timeline" error={errors.timeline}>
              <select
                value={form.timeline}
                onChange={(e) => update("timeline", e.target.value as FormState["timeline"])}
                className="form-line"
              >
                <option value="6-8 weeks" className="bg-ink">6–8 weeks</option>
                <option value="2-3 months" className="bg-ink">2–3 months</option>
                <option value="3-6 months" className="bg-ink">3–6 months</option>
                <option value="Open" className="bg-ink">Open</option>
              </select>
            </Field>

            <Field label="Notes" error={errors.notes} className="md:col-span-2">
              <textarea
                rows={4}
                maxLength={1000}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="form-line resize-none"
                placeholder="Anything we should know — hierarchy, dress code, calendar."
              />
            </Field>

            {/* Estimate */}
            <div className="md:col-span-2 border-t border-hairline pt-10 mt-2">
              <div className="eyebrow text-bone/60 mb-6">— Indicative Estimate —</div>
              {estimate ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <Stat label="Programme" value={estimate.tier.name} sub={estimate.tier.range} />
                  <Stat
                    label="Per piece"
                    value={formatFcfa(estimate.perPiece)}
                    sub="From, indicative"
                  />
                  <Stat
                    label="Total"
                    value={formatFcfa(estimate.total)}
                    sub={`${piecesNum} pieces`}
                  />
                </div>
              ) : (
                <p className="font-serif italic text-bone/60">
                  Enter a quantity from 10 pieces to see an indicative composition.
                </p>
              )}
              <p className="text-bone/50 text-xs leading-relaxed mt-8 max-w-2xl">
                Estimates are indicative only and depend on cloth selection,
                construction, and finishing. The maison issues a confidential
                proposal after the brief.
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6">
              <button type="submit" className="luxury-btn luxury-btn-solid">
                Send via WhatsApp
              </button>
              <a
                href={`mailto:atelier@menofgrace.example?subject=${encodeURIComponent(
                  "Corporate Program enquiry",
                )}`}
                className="luxury-btn"
              >
                Or write to the Atelier
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* CRAFT BAND */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden border-t border-hairline">
        <img
          src={craft}
          alt="The art of tailoring"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
      </section>

      {/* CTA FINALE */}
      <section className="border-t border-hairline py-24 px-6 md:px-12 text-center">
        <div className="eyebrow text-bone/60 mb-6">— By Appointment —</div>
        <p className="font-serif text-2xl md:text-3xl italic text-bone/85 mb-10 max-w-2xl mx-auto">
          The maison travels to equip the men who lead.
        </p>
        <a href="#enquiry" className="luxury-btn luxury-btn-solid">
          Begin an Enquiry
        </a>
      </section>
    </div>
  );
}

/* ───────────────────────── Sub-components ───────────────────────── */

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="eyebrow text-bone/60 block mb-3">{label}</span>
      {children}
      {error ? (
        <span className="text-bone/80 text-xs font-light mt-2 block italic">{error}</span>
      ) : null}
    </label>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border-l border-hairline pl-6">
      <div className="eyebrow text-bone/50 mb-2">{label}</div>
      <div className="font-serif text-2xl md:text-3xl mb-1">{value}</div>
      <div className="text-bone/50 text-xs font-light">{sub}</div>
    </div>
  );
}
