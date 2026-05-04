import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin_/promo-codes")({
  head: () => ({
    meta: [
      { title: "Codes promo — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PromoCodesPage,
});

type Promo = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_cart_fcfa: number;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  description: string | null;
  created_at: string;
};

function PromoCodesPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState<Promo[]>([]);
  const [busy, setBusy] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const empty = {
    code: "",
    discount_type: "percent" as "percent" | "fixed",
    discount_value: 10,
    min_cart_fcfa: 0,
    starts_at: "",
    ends_at: "",
    max_uses: "",
    description: "",
    is_active: true,
  };
  const [draft, setDraft] = useState(empty);

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
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data ?? []) as Promo[]);
    setBusy(false);
  }

  async function create() {
    setMsg(null);
    if (!draft.code.trim() || draft.discount_value <= 0) {
      setMsg("Code et valeur requis");
      return;
    }
    const payload = {
      code: draft.code.trim().toUpperCase(),
      discount_type: draft.discount_type,
      discount_value: draft.discount_value,
      min_cart_fcfa: draft.min_cart_fcfa || 0,
      starts_at: draft.starts_at ? new Date(draft.starts_at).toISOString() : null,
      ends_at: draft.ends_at ? new Date(draft.ends_at).toISOString() : null,
      max_uses: draft.max_uses ? Number(draft.max_uses) : null,
      description: draft.description.trim() || null,
      is_active: draft.is_active,
    };
    const { error } = await supabase.from("promo_codes").insert(payload);
    if (error) { setMsg(`Erreur: ${error.message}`); return; }
    setDraft(empty);
    setShowForm(false);
    await load();
  }

  async function toggleActive(p: Promo) {
    await supabase.from("promo_codes").update({ is_active: !p.is_active }).eq("id", p.id);
    await load();
  }

  async function remove(p: Promo) {
    if (!confirm(`Supprimer le code ${p.code} ?`)) return;
    await supabase.from("promo_codes").delete().eq("id", p.id);
    await load();
  }

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-ink min-h-screen">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-hairline pb-8 mb-12">
          <div>
            <Link to="/admin" className="eyebrow text-[10px] text-bone/70 hover:text-bone">← Tableau de bord</Link>
            <h1 className="display text-4xl md:text-5xl mt-3">Codes promo</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="luxury-btn luxury-btn-solid">
            {showForm ? "Annuler" : "+ Nouveau code"}
          </button>
        </div>

        {msg && <div className="mb-6 text-amber-300/80 text-sm">{msg}</div>}

        {showForm && (
          <div className="border border-hairline p-6 mb-10 grid md:grid-cols-2 gap-4">
            <Field label="Code (ex: WELCOME10)">
              <input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} className={inputCls} />
            </Field>
            <Field label="Type">
              <select value={draft.discount_type} onChange={(e) => setDraft({ ...draft, discount_type: e.target.value as "percent" | "fixed" })} className={inputCls}>
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </select>
            </Field>
            <Field label={draft.discount_type === "percent" ? "Pourcentage" : "Montant FCFA"}>
              <input type="number" min="1" value={draft.discount_value} onChange={(e) => setDraft({ ...draft, discount_value: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Panier minimum (FCFA)">
              <input type="number" min="0" value={draft.min_cart_fcfa} onChange={(e) => setDraft({ ...draft, min_cart_fcfa: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Début (optionnel)">
              <input type="datetime-local" value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Fin (optionnel)">
              <input type="datetime-local" value={draft.ends_at} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Utilisations max (vide = illimité)">
              <input type="number" min="1" value={draft.max_uses} onChange={(e) => setDraft({ ...draft, max_uses: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Description (interne)">
              <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={create} className="luxury-btn luxury-btn-solid">Créer le code</button>
            </div>
          </div>
        )}

        {busy ? (
          <div className="text-bone/60 py-12 text-center font-light">Chargement…</div>
        ) : list.length === 0 ? (
          <div className="border border-hairline p-12 text-center text-bone/60 font-light">
            Aucun code promo. Créez-en un pour offrir des remises au checkout.
          </div>
        ) : (
          <div className="border border-hairline divide-y divide-hairline">
            {list.map((p) => (
              <div key={p.id} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center">
                <div>
                  <div className="font-serif text-bone text-lg">{p.code}</div>
                  <div className="text-bone/50 text-xs">
                    {p.discount_type === "percent" ? `${p.discount_value}%` : `${p.discount_value.toLocaleString("fr-FR")} FCFA`}
                    {p.min_cart_fcfa > 0 && ` · min ${p.min_cart_fcfa.toLocaleString("fr-FR")} FCFA`}
                  </div>
                </div>
                <div className="text-bone/60 text-xs">
                  {p.description && <div>{p.description}</div>}
                  <div>
                    {p.starts_at && `Du ${new Date(p.starts_at).toLocaleDateString("fr-FR")} `}
                    {p.ends_at && `au ${new Date(p.ends_at).toLocaleDateString("fr-FR")}`}
                  </div>
                </div>
                <div className="eyebrow text-[10px] text-bone/60">
                  {p.uses_count}{p.max_uses != null ? `/${p.max_uses}` : ""} utilisations
                </div>
                <button onClick={() => toggleActive(p)} className={`eyebrow text-[10px] border px-3 py-1 ${p.is_active ? "border-emerald-500/40 text-emerald-300/90" : "border-hairline text-bone/50"}`}>
                  {p.is_active ? "Actif" : "Inactif"}
                </button>
                <button onClick={() => remove(p)} className="eyebrow text-[10px] text-red-300/80 hover:text-red-300">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-transparent border border-hairline px-3 py-2 text-sm text-bone focus:outline-none focus:border-bone/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-bone/60 text-[10px] mb-2 block">{label}</span>
      {children}
    </label>
  );
}
