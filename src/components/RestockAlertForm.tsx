import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z
  .object({
    email: z.string().trim().email("Adresse email invalide.").max(255).optional().or(z.literal("")),
    whatsapp: z
      .string()
      .trim()
      .regex(/^[+\d\s().-]{5,30}$/, "Numéro WhatsApp invalide.")
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => (d.email && d.email.length > 0) || (d.whatsapp && d.whatsapp.length > 0), {
    message: "Renseignez un email ou un numéro WhatsApp.",
    path: ["email"],
  });

type Props = {
  productSlug: string;
  productName: string;
  size?: string | null;
};

export function RestockAlertForm({ productSlug, productName, size }: Props) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ email, whatsapp });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Entrée invalide.");
      return;
    }

    setStatus("loading");
    const { error: insertError } = await supabase.from("restock_alerts").insert({
      product_slug: productSlug,
      product_name: productName,
      size: size ?? null,
      email: parsed.data.email ? parsed.data.email : null,
      whatsapp: parsed.data.whatsapp ? parsed.data.whatsapp : null,
    });

    if (insertError) {
      setStatus("error");
      setError("Impossible d'enregistrer votre demande. Réessayez.");
      return;
    }
    setStatus("success");
    setEmail("");
    setWhatsapp("");
  };

  if (status === "success") {
    return (
      <div className="mt-4 border border-hairline p-4">
        <p className="text-xs text-bone/80 tracking-wider font-light">
          Merci — nous vous préviendrons dès le retour en stock.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border border-hairline p-4 space-y-3">
      <div className="eyebrow text-bone/60 text-[10px]">— Alerte retour en stock —</div>
      <p className="text-xs text-bone/60 font-light leading-relaxed">
        Laissez votre email ou WhatsApp pour être prévenu en priorité.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        maxLength={255}
        className="w-full bg-transparent border-b border-hairline py-2 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-bone transition-colors"
      />
      <input
        type="tel"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="WhatsApp (+221…)"
        autoComplete="tel"
        maxLength={30}
        className="w-full bg-transparent border-b border-hairline py-2 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-bone transition-colors"
      />
      {error && <p role="alert" className="text-xs text-red-400/90">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="luxury-btn w-full text-[11px] py-3 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Me prévenir"}
      </button>
    </form>
  );
}
